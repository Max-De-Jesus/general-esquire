import { jsonHeaders, corsHeaders } from "../_shared/cors.ts";
import { serviceRoleClient } from "../_shared/admin.ts";

// SÉCURITÉ : cette fonction est publique (verify_jwt = false) et ne vérifie
// aucun paiement auprès d'un prestataire. Elle ne peut donc enregistrer
// qu'une INTENTION de règlement (virement annoncé) : statut toujours
// « En attente », quel que soit le statut envoyé par le navigateur.
// Auparavant elle acceptait `extraStatus: "Payé"` → n'importe qui pouvait
// créer un faux paiement encaissé. Les paiements en ligne passent par
// stripe-checkout / stripe-webhook (statut relu chez Stripe).
const FORCED_STATUS = "En attente";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: jsonHeaders });
  }

  const generatedRef = "PAY-" + Math.floor(100000 + Math.random() * 900000);

  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      profileType,
      serviceName,
      amount,
      method,
      isSubscriptionService,
      frequency,
      country,
      address,
    } = body;

    const supabase = serviceRoleClient();
    let clientUuid: string | null = null;

    // 1. Upsert / récupération du client côté serveur (service_role, contourne RLS en toute sécurité)
    try {
      const { data: existingClients } = await supabase
        .from("clients")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (existingClients && existingClients.length > 0) {
        clientUuid = existingClients[0].id;
      } else {
        const { data: newClient } = await supabase
          .from("clients")
          .insert({
            full_name: fullName || "Client Anonyme",
            email,
            phone: phone || null,
            profile_type: profileType || "Particulier",
            requested_service: serviceName || "Prestation de service",
            status: "Nouveau",
            country: country || null,
          })
          .select()
          .single();

        if (newClient) clientUuid = newClient.id;
      }

      // 2. Enregistrement du paiement
      await supabase.from("paiements").insert({
        client_id: clientUuid,
        client_name: fullName || "Client Anonyme",
        client_email: email,
        service: serviceName + (isSubscriptionService ? ` [Abonnement Récurrent ${frequency || ""}]` : ""),
        amount: Number(amount) || 0,
        currency: "EUR",
        status: FORCED_STATUS,
        payment_method: method || "PayPal",
        paid_at: null,
        notes: `Règlement enregistré via Edge Function. Réf: ${generatedRef}. ${
          isSubscriptionService ? "Abonnement à échéances récurrentes." : ""
        }`,
      });
    } catch (dbErr) {
      console.warn("register-payment DB warning:", dbErr);
      // Continuer pour ne pas bloquer le parcours de paiement côté client
    }

    // 3. Notification email de sauvegarde immédiate au cabinet
    try {
      const emailPayload = {
        _subject: `[General Esquire] Règlement annoncé (À VÉRIFIER) — ${generatedRef} (${amount} €)`,
        _replyto: email,
        _template: "table",
        _captcha: "false",
        "Référence Transaction": generatedRef,
        "Nom Client": fullName || "Non renseigné",
        Email: email || "Non renseigné",
        Téléphone: phone || "Non renseigné",
        Profil: profileType || "Particulier",
        "Prestation / Formule": serviceName || "Prestation de service",
        "Montant Régler": `${amount} € TTC`,
        "Mode de Règlement": method || "En ligne",
        Statut: `${FORCED_STATUS} — encaissement à vérifier sur le relevé bancaire`,
        Type: isSubscriptionService ? `Abonnement récurrent (${frequency})` : "Paiement unique",
        "Adresse / Pays": `${address || ""} ${country || ""}`.trim() || "Non renseigné",
        Date: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }),
      };

      // FormSubmit avec headers web
      fetch("https://formsubmit.co/ajax/generalesquire@proton.me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "https://generalesquire.com",
          Referer: "https://generalesquire.com/",
        },
        body: JSON.stringify(emailPayload),
      }).catch((e) => console.warn("register-payment email notify error:", e));

      // Resend si configuré
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "onboarding@resend.dev";
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: fromEmail,
            to: ["generalesquire@proton.me"],
            subject: `[General Esquire] Règlement annoncé (À VÉRIFIER) — ${generatedRef} (${amount} €)`,
            html: `
              <h2>Règlement annoncé — à vérifier — ${esc(generatedRef)}</h2>
              <p><strong>Montant :</strong> ${esc(amount)} € TTC</p>
              <p><strong>Client :</strong> ${esc(fullName || "Non renseigné")} (${esc(email)})</p>
              <p><strong>Prestation :</strong> ${esc(serviceName)}</p>
              <p><strong>Méthode :</strong> ${esc(method || "Virement")}</p>
            `,
          }),
        }).catch((e) => console.warn("register-payment resend notify error:", e));
      }
    } catch (e) {
      console.warn("register-payment email payload error:", e);
    }

    return new Response(
      JSON.stringify({ success: true, transactionRef: generatedRef, message: "Règlement enregistré avec succès." }),
      { headers: jsonHeaders }
    );
  } catch (error) {
    console.error("register-payment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Enregistrement impossible." }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
