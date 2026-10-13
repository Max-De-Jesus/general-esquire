// Client minimal de l'API FedaPay (https://docs.fedapay.com), sans SDK :
// le SDK officiel fedapay-node dépend d'axios et de `crypto` Node.
// Comportements repris du SDK officiel (src/Requestor.ts, src/Transaction.ts,
// src/Webhook.ts) :
//   * bases d'URL sandbox / live ;
//   * réponses enveloppées sous la clé "v1/transaction" ;
//   * lien de paiement : POST /v1/transactions/{id}/token → { token, url } ;
//   * signature webhook : en-tête "t=<timestamp>,s=<hmac>" où
//     hmac = HMAC-SHA256(secret, `${t}.${corps brut}`), tolérance 300 s.
//
// Secrets (supabase secrets set …) :
//   FEDAPAY_SECRET_KEY      clé secrète sk_sandbox_… ou sk_live_…
//   FEDAPAY_ENV             "sandbox" (défaut) ou "live"
//   FEDAPAY_WEBHOOK_SECRET  clé de signature du webhook (wh_…)
//   SITE_URL                défaut https://generalesquire.com

import { serviceRoleClient } from "./admin.ts";

export const EUR_TO_XOF = 655.957; // parité fixe EUR / franc CFA (BCEAO)
export const WEBHOOK_TOLERANCE_SECONDS = 300;

// Statuts « payé » selon le SDK officiel (Transaction.PAID_STATUS).
const PAID_STATUSES = [
  "approved",
  "transferred",
  "refunded",
  "approved_partially_refunded",
  "transferred_partially_refunded",
];

export function eurToXof(amountEur: number): number {
  return Math.round(amountEur * EUR_TO_XOF);
}

export function siteUrl(): string {
  return (Deno.env.get("SITE_URL") || "https://generalesquire.com").replace(/\/+$/, "");
}

function apiBase(): string {
  // FEDAPAY_API_BASE : réservé aux tests (serveur simulé), comme
  // FedaPay.setApiBase() dans le SDK officiel. Ne pas définir en production.
  const override = Deno.env.get("FEDAPAY_API_BASE");
  if (override) return override.replace(/\/+$/, "");
  const env = (Deno.env.get("FEDAPAY_ENV") || "sandbox").toLowerCase();
  return env === "live" || env === "production"
    ? "https://api.fedapay.com"
    : "https://sandbox-api.fedapay.com";
}

export class FedaPayError extends Error {
  constructor(message: string, public status: number, public body: unknown) {
    super(message);
  }
}

async function request(method: string, path: string, body?: unknown): Promise<any> {
  const key = Deno.env.get("FEDAPAY_SECRET_KEY");
  if (!key) throw new FedaPayError("FEDAPAY_SECRET_KEY absent", 500, null);

  const res = await fetch(`${apiBase()}/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new FedaPayError(`FedaPay ${method} ${path} → HTTP ${res.status}`, res.status, json);
  }
  return json;
}

export interface FedaPayTransaction {
  id: number;
  reference?: string;
  status: string;
  amount: number;
  custom_metadata?: Record<string, unknown> | null;
}

function unwrapTransaction(json: any): FedaPayTransaction {
  const tx = json?.["v1/transaction"] ?? json?.transaction ?? json;
  if (!tx || typeof tx.id === "undefined") {
    throw new FedaPayError("Réponse FedaPay sans transaction", 502, json);
  }
  return tx as FedaPayTransaction;
}

export async function createTransaction(params: Record<string, unknown>): Promise<FedaPayTransaction> {
  return unwrapTransaction(await request("POST", "/transactions", params));
}

export async function retrieveTransaction(id: string | number): Promise<FedaPayTransaction> {
  return unwrapTransaction(await request("GET", `/transactions/${encodeURIComponent(String(id))}`));
}

export async function generatePaymentUrl(id: string | number): Promise<string> {
  const json = await request("POST", `/transactions/${encodeURIComponent(String(id))}/token`, {});
  const url = json?.url ?? json?.["v1/token"]?.url;
  if (typeof url !== "string" || !url.startsWith("https://")) {
    throw new FedaPayError("Réponse FedaPay sans URL de paiement", 502, json);
  }
  return url;
}

// ─── Webhook ─────────────────────────────────────────────────

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Vérifie l'en-tête X-FEDAPAY-SIGNATURE ; renvoie false au moindre doute. */
export async function verifyWebhookSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  tolerance = WEBHOOK_TOLERANCE_SECONDS,
): Promise<boolean> {
  if (!header || !secret) return false;
  let timestamp = -1;
  const signatures: string[] = [];
  for (const item of header.split(",")) {
    const [k, v] = item.split("=");
    if (k?.trim() === "t") timestamp = parseInt(v, 10);
    if (k?.trim() === "s" && v) signatures.push(v.trim());
  }
  if (!Number.isFinite(timestamp) || timestamp < 0 || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestamp) > tolerance) return false;
  const expected = await hmacSha256Hex(secret, `${timestamp}.${rawBody}`);
  return signatures.some((s) => timingSafeEqual(s, expected));
}

// ─── Synchronisation d'un paiement avec FedaPay ──────────────

export function mapStatus(fedapayStatus: string): "Payé" | "Rembourse" | "Annule" | "En attente" {
  if (fedapayStatus.includes("refunded") && !fedapayStatus.includes("partially")) return "Rembourse";
  if (PAID_STATUSES.includes(fedapayStatus)) return "Payé";
  if (["declined", "canceled", "cancelled", "expired"].includes(fedapayStatus)) return "Annule";
  return "En attente";
}

export interface SyncResult {
  paiement: Record<string, any>;
  becamePaid: boolean;
}

/**
 * Relit la transaction chez FedaPay (jamais sur la foi du navigateur ou du
 * corps du webhook) et met à jour la ligne paiements correspondante.
 * Vérifie que le montant facturé correspond à celui enregistré.
 */
export async function syncPaiementFromFedaPay(paiement: Record<string, any>): Promise<SyncResult> {
  if (!paiement.provider_transaction_id) {
    return { paiement, becamePaid: false };
  }
  const tx = await retrieveTransaction(paiement.provider_transaction_id);

  if (Number(tx.amount) !== Number(paiement.charged_amount)) {
    console.error("FedaPay: montant incohérent", {
      paiement: paiement.id,
      attendu: paiement.charged_amount,
      recu: tx.amount,
    });
    throw new FedaPayError("Montant FedaPay incohérent avec le paiement enregistré", 409, null);
  }

  const newStatus = mapStatus(String(tx.status));
  const becamePaid = newStatus === "Payé" && paiement.status !== "Payé";
  if (newStatus === paiement.status && tx.status === paiement.provider_status) {
    return { paiement, becamePaid: false };
  }

  const update: Record<string, unknown> = {
    status: newStatus,
    provider_status: String(tx.status),
    updated_at: new Date().toISOString(),
  };
  if (becamePaid) update.paid_at = new Date().toISOString();

  const supabase = serviceRoleClient();
  let query = supabase.from("paiements").update(update).eq("id", paiement.id);
  // Webhook et vérification au retour peuvent arriver en même temps : seule
  // la requête qui fait réellement passer la ligne à « Payé » le signale.
  if (becamePaid) query = query.neq("status", "Payé");
  const { data, error } = await query.select().maybeSingle();
  if (error) throw error;
  if (!data) {
    const { data: current, error: readError } = await supabase
      .from("paiements")
      .select("*")
      .eq("id", paiement.id)
      .single();
    if (readError) throw readError;
    return { paiement: current, becamePaid: false };
  }
  return { paiement: data, becamePaid };
}

/** Email au cabinet lorsqu'un paiement passe à « Payé ». Ne lève jamais. */
export async function notifyCabinetOfPayment(paiement: Record<string, any>): Promise<void> {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) return;
    const esc = (v: unknown) =>
      String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev",
        to: ["generalesquire@proton.me"],
        subject: `[General Esquire] Paiement FedaPay confirmé — ${paiement.amount} € (${paiement.charged_amount} FCFA)`,
        html: `
          <h2>Paiement FedaPay confirmé</h2>
          <p><strong>Client :</strong> ${esc(paiement.client_name)} (${esc(paiement.client_email)})</p>
          <p><strong>Prestation :</strong> ${esc(paiement.service)}</p>
          <p><strong>Montant :</strong> ${esc(paiement.amount)} € — ${esc(paiement.charged_amount)} FCFA</p>
          <p><strong>Transaction FedaPay :</strong> ${esc(paiement.provider_transaction_id)}</p>
          <p><strong>Référence interne :</strong> ${esc(paiement.id)}</p>
        `,
      }),
    });
  } catch (e) {
    console.warn("notifyCabinetOfPayment:", e);
  }
}
