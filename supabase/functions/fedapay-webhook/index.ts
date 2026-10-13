// Webhook FedaPay (événements transaction.*).
// À déclarer dans le tableau de bord FedaPay > Webhooks avec l'URL
//   https://<project-ref>.supabase.co/functions/v1/fedapay-webhook
// verify_jwt = false (FedaPay n'envoie pas de JWT Supabase) : l'authenticité
// est prouvée par la signature HMAC (FEDAPAY_WEBHOOK_SECRET).
//
// Le corps du webhook ne sert qu'à connaître l'id de transaction : le statut
// et le montant sont relus chez FedaPay avant toute écriture.

import { jsonHeaders } from "../_shared/cors.ts";
import { serviceRoleClient } from "../_shared/admin.ts";
import { notifyCabinetOfPayment, syncPaiementFromFedaPay, verifyWebhookSignature } from "../_shared/fedapay.ts";

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: jsonHeaders });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Méthode non autorisée." });

  const secret = Deno.env.get("FEDAPAY_WEBHOOK_SECRET") ?? "";
  if (!secret) {
    console.error("fedapay-webhook: FEDAPAY_WEBHOOK_SECRET absent — événement refusé.");
    return json(500, { error: "Webhook non configuré." });
  }

  const rawBody = await req.text();
  const valid = await verifyWebhookSignature(rawBody, req.headers.get("x-fedapay-signature"), secret);
  if (!valid) return json(400, { error: "Signature invalide." });

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "Corps invalide." });
  }

  const name = String(event?.name ?? "");
  const transactionId = event?.entity?.id;
  if (!name.startsWith("transaction.") || transactionId === undefined || transactionId === null) {
    return json(200, { ignored: true });
  }

  const supabase = serviceRoleClient();
  const { data: paiement, error } = await supabase
    .from("paiements")
    .select("*")
    .eq("provider", "fedapay")
    .eq("provider_transaction_id", String(transactionId))
    .maybeSingle();
  if (error) {
    console.error("fedapay-webhook lecture:", error);
    return json(500, { error: "Erreur base de données." }); // FedaPay réessaiera
  }
  if (!paiement) return json(200, { ignored: true, reason: "transaction inconnue" });

  try {
    const { paiement: updated, becamePaid } = await syncPaiementFromFedaPay(paiement);
    if (becamePaid) await notifyCabinetOfPayment(updated);
    return json(200, { ok: true, status: updated.status });
  } catch (e) {
    console.error("fedapay-webhook sync:", e);
    return json(500, { error: "Synchronisation impossible." }); // FedaPay réessaiera
  }
});
