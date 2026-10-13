// Crée un paiement FedaPay pour le client connecté et renvoie l'URL de la
// page de paiement hébergée par FedaPay (Mobile Money, carte bancaire).
// Décision : docs/adr/0001-paiement-fedapay.md
//
// Sécurité :
//   * client authentifié obligatoire (JWT Supabase vérifié) ; l'email du
//     paiement est celui du JWT, jamais celui envoyé par le navigateur ;
//   * le montant est recalculé côté serveur (_shared/catalogue.ts) ;
//   * la ligne paiements naît « En attente » ; seul fedapay-webhook /
//     fedapay-status la passent à « Payé » après relecture chez FedaPay.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";
import { serviceRoleClient } from "../_shared/admin.ts";
import { calculerMontant, ChoixInvalide } from "../_shared/catalogue.ts";
import { createTransaction, eurToXof, FedaPayError, generatePaymentUrl, siteUrl } from "../_shared/fedapay.ts";

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const clean = (v: unknown, max = 200) => String(v ?? "").replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Méthode non autorisée." });

  // 1. Client authentifié
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: auth, error: authError } = await userClient.auth.getUser();
  const email = auth?.user?.email?.trim().toLowerCase();
  if (authError || !email) return json(401, { error: "Connexion requise pour payer en ligne." });

  // 2. Montant calculé par le serveur
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Requête invalide." });
  }

  let calcul;
  try {
    calcul = calculerMontant(
      {
        serviceId: clean(body.serviceId, 40),
        customPrice: body.customPrice as number | string | null,
        translationPages: body.translationPages as number | string | null,
        isUrgent: body.isUrgent === true,
        cocooningOption: body.cocooningOption === "tranches" ? "tranches" : "unique",
        cocooningSession: body.cocooningSession === "juillet" ? "juillet" : "janvier",
      },
      new Date().getUTCMonth(),
    );
  } catch (e) {
    if (e instanceof ChoixInvalide) return json(400, { error: e.message });
    throw e;
  }

  const amountEur = calcul.amountEur;
  const amountXof = eurToXof(amountEur);
  const fullName = clean(body.fullName, 120) || email.split("@")[0];
  const [firstname, ...rest] = fullName.split(" ");
  const lastname = rest.join(" ") || firstname;

  const supabase = serviceRoleClient();

  // 3. Fiche client (créée par trigger à l'inscription ; filet de sécurité ici)
  let clientId: string | null = null;
  const { data: existing } = await supabase.from("clients").select("id").eq("email", email).maybeSingle();
  if (existing) {
    clientId = existing.id;
  } else {
    const { data: created } = await supabase
      .from("clients")
      .insert({
        full_name: fullName,
        email,
        phone: clean(body.phone, 40) || null,
        profile_type: calcul.prestation.profile === "Chrysalides" || calcul.prestation.profile === "Conseil Juridique"
          ? "Particulier"
          : calcul.prestation.profile,
        requested_service: calcul.libelle,
        status: "Nouveau",
        country: clean(body.country, 80) || null,
      })
      .select("id")
      .maybeSingle();
    clientId = created?.id ?? null;
  }

  // 4. Paiement « En attente »
  const { data: paiement, error: insertError } = await supabase
    .from("paiements")
    .insert({
      client_id: clientId,
      client_name: fullName,
      client_email: email,
      service: calcul.libelle,
      amount: amountEur,
      currency: "EUR",
      status: "En attente",
      payment_method: "FedaPay",
      provider: "fedapay",
      charged_amount: amountXof,
      charged_currency: "XOF",
      notes: clean(body.address, 200) ? `Adresse : ${clean(body.address, 200)}` : null,
    })
    .select()
    .single();
  if (insertError || !paiement) {
    console.error("fedapay-checkout insert:", insertError);
    return json(500, { error: "Impossible d'enregistrer le paiement. Réessayez." });
  }

  // 5. Transaction FedaPay + lien de paiement
  try {
    const tx = await createTransaction({
      description: `${calcul.libelle} — General Esquire`.slice(0, 250),
      amount: amountXof,
      currency: { iso: "XOF" },
      callback_url: `${siteUrl()}/paiement/?fedapay_ref=${paiement.id}`,
      customer: { firstname, lastname, email },
      custom_metadata: { paiement_id: paiement.id },
    });

    const { error: linkError } = await supabase
      .from("paiements")
      .update({ provider_transaction_id: String(tx.id), provider_status: String(tx.status) })
      .eq("id", paiement.id);
    if (linkError) throw linkError;

    const url = await generatePaymentUrl(tx.id);
    return json(200, { url, paiementId: paiement.id, amountEur, amountXof, service: calcul.libelle });
  } catch (e) {
    console.error("fedapay-checkout FedaPay:", e instanceof FedaPayError ? { msg: e.message, body: e.body } : e);
    await supabase
      .from("paiements")
      .update({ status: "Annule", notes: "Création de la transaction FedaPay impossible." })
      .eq("id", paiement.id);
    return json(502, { error: "Le service de paiement FedaPay est momentanément indisponible." });
  }
});
