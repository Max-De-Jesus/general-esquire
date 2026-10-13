// Client minimal de l'API Stripe (https://docs.stripe.com/api), sans SDK.
// Paiement par Stripe Checkout (page de paiement hébergée par Stripe).
// Décision : docs/adr/0004-paiement-stripe.md
//
// Secrets (supabase secrets set …) :
//   STRIPE_SECRET_KEY      clé secrète sk_test_… puis sk_live_…
//                          (ou clé restreinte rk_… : Checkout Sessions en écriture)
//   STRIPE_WEBHOOK_SECRET  secret de signature du point de terminaison webhook (whsec_…)
//   SITE_URL               défaut https://generalesquire.com

import { serviceRoleClient } from "./admin.ts";

export const WEBHOOK_TOLERANCE_SECONDS = 300; // valeur par défaut des SDK Stripe

export function siteUrl(): string {
  return (Deno.env.get("SITE_URL") || "https://generalesquire.com").replace(/\/+$/, "");
}

function apiBase(): string {
  // STRIPE_API_BASE : réservé aux tests (serveur simulé). Ne pas définir en production.
  return (Deno.env.get("STRIPE_API_BASE") || "https://api.stripe.com").replace(/\/+$/, "");
}

export function eurToCents(amountEur: number): number {
  return Math.round(amountEur * 100);
}

export class StripeError extends Error {
  constructor(message: string, public status: number, public body: unknown) {
    super(message);
  }
}

/** Encodage application/x-www-form-urlencoded à la manière de Stripe (a[b][0][c]=…). */
export function toForm(params: Record<string, unknown>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item !== null && typeof item === "object") out.push(...toForm(item as Record<string, unknown>, `${key}[${i}]`));
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof v === "object") {
      out.push(...toForm(v as Record<string, unknown>, key));
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return out;
}

async function request(method: "GET" | "POST", path: string, params?: Record<string, unknown>, idempotencyKey?: string) {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) throw new StripeError("STRIPE_SECRET_KEY absent", 500, null);
  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const res = await fetch(`${apiBase()}/v1${path}`, {
    method,
    headers,
    body: method === "POST" && params ? toForm(params).join("&") : undefined,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    // Ne jamais journaliser la requête (elle contient des données client) : seulement l'erreur Stripe.
    throw new StripeError(`Stripe ${method} ${path} → HTTP ${res.status}`, res.status, json?.error ?? json);
  }
  return json;
}

export interface CheckoutSession {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  currency: string | null;
  payment_intent?: string | null;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(params: Record<string, unknown>, idempotencyKey: string): Promise<CheckoutSession> {
  return await request("POST", "/checkout/sessions", params, idempotencyKey) as CheckoutSession;
}

export async function retrieveCheckoutSession(id: string): Promise<CheckoutSession> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) throw new StripeError("Identifiant de session Stripe invalide", 400, null);
  return await request("GET", `/checkout/sessions/${id}`) as CheckoutSession;
}

// ─── Webhook ─────────────────────────────────────────────────
// En-tête Stripe-Signature : « t=<timestamp>,v1=<hmac>[,v1=…][,v0=…] »
// hmac = HMAC-SHA256(whsec, `${t}.${corps brut}`) en hexadécimal.

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Vérifie l'en-tête Stripe-Signature ; renvoie false au moindre doute. */
export async function verifyStripeSignature(
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
    const i = item.indexOf("=");
    if (i < 0) continue;
    const k = item.slice(0, i).trim();
    const v = item.slice(i + 1).trim();
    if (k === "t") timestamp = /^\d+$/.test(v) ? parseInt(v, 10) : -1;
    if (k === "v1" && v) signatures.push(v);
  }
  if (timestamp < 0 || signatures.length === 0) return false;
  if (Math.abs(nowSeconds - timestamp) > tolerance) return false;
  const expected = await hmacSha256Hex(secret, `${timestamp}.${rawBody}`);
  return signatures.some((s) => timingSafeEqual(s, expected));
}

// ─── Synchronisation d'un paiement avec Stripe ───────────────

export type StatutInterne = "Payé" | "Annule" | "En attente";

export function mapSessionStatus(
  session: Pick<CheckoutSession, "status" | "payment_status">,
  asyncPaymentFailed = false,
): StatutInterne {
  if (session.payment_status === "paid") return "Payé";
  if (session.status === "expired") return "Annule";
  // Paiement différé refusé : connu uniquement par l'événement signé
  // checkout.session.async_payment_failed (la session reste complete/unpaid).
  if (asyncPaymentFailed && session.status === "complete") return "Annule";
  // open, ou complete + unpaid (moyen de paiement différé, ex. virement SEPA)
  return "En attente";
}

export interface SyncResult {
  paiement: Record<string, any>;
  becamePaid: boolean;
}

/**
 * Relit la session chez Stripe (jamais sur la foi du navigateur ou du corps
 * du webhook) et met à jour la ligne paiements. Vérifie montant et devise.
 */
export async function syncPaiementFromStripe(
  paiement: Record<string, any>,
  options: { asyncPaymentFailed?: boolean } = {},
): Promise<SyncResult> {
  if (!paiement.provider_transaction_id) return { paiement, becamePaid: false };
  const session = await retrieveCheckoutSession(paiement.provider_transaction_id);

  if (session.metadata?.paiement_id && session.metadata.paiement_id !== paiement.id) {
    throw new StripeError("Session Stripe rattachée à un autre paiement", 409, null);
  }
  if (Number(session.amount_total) !== Number(paiement.charged_amount) || (session.currency ?? "").toLowerCase() !== "eur") {
    console.error("Stripe: montant ou devise incohérents", {
      paiement: paiement.id,
      attendu: paiement.charged_amount,
      recu: session.amount_total,
      devise: session.currency,
    });
    throw new StripeError("Montant Stripe incohérent avec le paiement enregistré", 409, null);
  }

  const newStatus = mapSessionStatus(session, options.asyncPaymentFailed === true);
  const providerStatus = `${session.status}/${session.payment_status}`;
  const becamePaid = newStatus === "Payé" && paiement.status !== "Payé";
  if (newStatus === paiement.status && providerStatus === paiement.provider_status) {
    return { paiement, becamePaid: false };
  }
  // Un paiement déjà encaissé ne redescend jamais (remboursements : gérés à part).
  if (paiement.status === "Payé" && newStatus !== "Payé") {
    return { paiement, becamePaid: false };
  }

  const update: Record<string, unknown> = {
    status: newStatus,
    provider_status: providerStatus,
    updated_at: new Date().toISOString(),
  };
  if (becamePaid) update.paid_at = new Date().toISOString();

  const supabase = serviceRoleClient();
  let query = supabase.from("paiements").update(update).eq("id", paiement.id);
  // Webhook et retour client peuvent arriver en même temps : seule la requête
  // qui fait réellement passer la ligne à « Payé » le signale.
  if (becamePaid) query = query.neq("status", "Payé");
  const { data, error } = await query.select().maybeSingle();
  if (error) throw error;
  if (!data) {
    const { data: current, error: readError } = await supabase.from("paiements").select("*").eq("id", paiement.id).single();
    if (readError) throw readError;
    return { paiement: current, becamePaid: false };
  }
  return { paiement: data, becamePaid };
}

/** Email au cabinet lorsqu'un paiement passe à « Payé ». Ne lève jamais. */
export async function notifyCabinetOfStripePayment(paiement: Record<string, any>): Promise<void> {
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
        subject: `[General Esquire] Paiement Stripe confirmé — ${paiement.amount} €`,
        html: `
          <h2>Paiement Stripe confirmé</h2>
          <p><strong>Client :</strong> ${esc(paiement.client_name)} (${esc(paiement.client_email)})</p>
          <p><strong>Prestation :</strong> ${esc(paiement.service)}</p>
          <p><strong>Montant :</strong> ${esc(paiement.amount)} €</p>
          <p><strong>Session Stripe :</strong> ${esc(paiement.provider_transaction_id)}</p>
          <p><strong>Référence interne :</strong> ${esc(paiement.id)}</p>
        `,
      }),
    });
  } catch (e) {
    console.warn("notifyCabinetOfStripePayment:", e);
  }
}
