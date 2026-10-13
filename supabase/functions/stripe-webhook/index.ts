// Webhook Stripe (événements checkout.session.*).
// À déclarer dans le tableau de bord Stripe > Développeurs > Webhooks :
//   URL : https://<project-ref>.supabase.co/functions/v1/stripe-webhook
//   Événements : checkout.session.completed,
//                checkout.session.async_payment_succeeded,
//                checkout.session.async_payment_failed,
//                checkout.session.expired
// verify_jwt = false (Stripe n'envoie pas de JWT Supabase) : l'authenticité
// est prouvée par la signature Stripe-Signature (STRIPE_WEBHOOK_SECRET).
//
// Le corps ne sert qu'à connaître l'id de session : statut et montant sont
// relus chez Stripe avant toute écriture.

import { jsonHeaders } from "../_shared/cors.ts";
import { serviceRoleClient } from "../_shared/admin.ts";
import { notifyCabinetOfStripePayment, syncPaiementFromStripe, verifyStripeSignature } from "../_shared/stripe.ts";

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "Méthode non autorisée." });

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
  if (!secret) {
    console.error("stripe-webhook: STRIPE_WEBHOOK_SECRET absent — événement refusé.");
    return json(500, { error: "Webhook non configuré." });
  }

  const rawBody = await req.text();
  const valid = await verifyStripeSignature(rawBody, req.headers.get("stripe-signature"), secret);
  if (!valid) return json(400, { error: "Signature invalide." });

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "Corps invalide." });
  }

  const type = String(event?.type ?? "");
  const sessionId = event?.data?.object?.id;
  if (!EVENTS.has(type) || typeof sessionId !== "string") return json(200, { ignored: true });

  const supabase = serviceRoleClient();
  const { data: paiement, error } = await supabase
    .from("paiements")
    .select("*")
    .eq("provider", "stripe")
    .eq("provider_transaction_id", sessionId)
    .maybeSingle();
  if (error) {
    console.error("stripe-webhook lecture:", error);
    return json(500, { error: "Erreur base de données." }); // Stripe réessaiera
  }
  if (!paiement) return json(200, { ignored: true, reason: "session inconnue" });

  try {
    const { paiement: updated, becamePaid } = await syncPaiementFromStripe(paiement, {
      asyncPaymentFailed: type === "checkout.session.async_payment_failed",
    });
    if (becamePaid) await notifyCabinetOfStripePayment(updated);
    return json(200, { ok: true, status: updated.status });
  } catch (e) {
    console.error("stripe-webhook sync:", e);
    return json(500, { error: "Synchronisation impossible." }); // Stripe réessaiera
  }
});
