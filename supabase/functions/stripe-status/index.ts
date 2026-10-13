// Statut d'un paiement Stripe au retour du client sur /paiement/?stripe_ref=…
// L'URL de retour ne prouve rien : la session est relue chez Stripe
// (le webhook peut arriver après le retour du client).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";
import { isAdminEmail, serviceRoleClient } from "../_shared/admin.ts";
import { notifyCabinetOfStripePayment, syncPaiementFromStripe } from "../_shared/stripe.ts";

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: jsonHeaders });
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Méthode non autorisée." });

  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: auth } = await userClient.auth.getUser();
  const email = auth?.user?.email?.trim().toLowerCase();
  if (!email) return json(401, { error: "Connexion requise." });

  const body = await req.json().catch(() => ({}));
  const paiementId = String(body?.paiementId ?? "");
  if (!UUID_RE.test(paiementId)) return json(400, { error: "Référence de paiement invalide." });

  const supabase = serviceRoleClient();
  const { data: paiement } = await supabase
    .from("paiements")
    .select("*")
    .eq("id", paiementId)
    .eq("provider", "stripe")
    .maybeSingle();

  // Même réponse « introuvable » si le paiement appartient à un autre client.
  if (!paiement || (paiement.client_email?.toLowerCase() !== email && !isAdminEmail(email))) {
    return json(404, { error: "Paiement introuvable." });
  }

  let current = paiement;
  try {
    const { paiement: updated, becamePaid } = await syncPaiementFromStripe(paiement);
    current = updated;
    if (becamePaid) await notifyCabinetOfStripePayment(updated);
  } catch (e) {
    console.warn("stripe-status sync:", e);
  }

  return json(200, {
    status: current.status,
    service: current.service,
    amountEur: Number(current.amount),
    reference: current.id,
  });
});
