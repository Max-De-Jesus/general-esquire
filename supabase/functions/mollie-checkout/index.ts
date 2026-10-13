import { jsonHeaders, corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  try {
    const body = await req.json();
    const {
      amount,
      serviceName = "Prestation juridique",
      fullName,
      email,
      phone,
      profileType = "Particulier",
      isSubscriptionService = false,
      frequency = "Mensuel",
      times,
      origin = "https://generalesquire.com",
    } = body;

    const numericAmount = Number(amount) || 0;
    if (numericAmount <= 0) {
      return new Response(
        JSON.stringify({ error: "Le montant du règlement doit être supérieur à 0." }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const apiKey =
      Deno.env.get("MOLLIE_API_KEY") ?? "" /* jamais de clé dans le code */;
    const isApiKeyConfigured =
      apiKey &&
      apiKey.trim() !== "" &&
      (apiKey.startsWith("test_") || apiKey.startsWith("live_")) &&
      apiKey.length > 20;

    if (isApiKeyConfigured) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const webhookUrl =
        supabaseUrl && !origin.includes("localhost")
          ? `${supabaseUrl}/functions/v1/mollie-webhook`
          : undefined;

      let customerId: string | undefined = undefined;

      // ── CAS ABONNEMENT RÉCURRENT : Création du profil client Mollie ──
      if (isSubscriptionService && email) {
        try {
          const custRes = await fetch("https://api.mollie.com/v2/customers", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: fullName || "Client General Esquire",
              email,
              metadata: { phone, profileType },
            }),
          });
          if (custRes.ok) {
            const customerData = await custRes.json();
            customerId = customerData.id;
          } else {
            console.warn("Mollie customer creation notice:", await custRes.text());
          }
        } catch (custErr) {
          console.warn("Mollie customer creation error:", custErr);
        }
      }

      // ── CRÉATION DU PAIEMENT (Simple ou Premier paiement d'abonnement avec mandat) ──
      const paymentPayload: any = {
        amount: {
          currency: "EUR",
          value: numericAmount.toFixed(2),
        },
        description: `General Esquire — ${serviceName.substring(0, 70)}${
          isSubscriptionService ? ` (Abonnement ${frequency})` : ""
        }`,
        redirectUrl: `${origin}/paiement?mollie_id={id}&status=return`,
        webhookUrl,
        metadata: {
          fullName,
          email,
          phone,
          profileType,
          serviceName,
          amount: numericAmount,
          isSubscriptionService,
          frequency,
          times,
          customerId,
        },
      };

      // Si abonnement, associer le customerId et activer sequenceType: "first" (génère le mandat pour prélèvements futurs)
      if (customerId) {
        paymentPayload.customerId = customerId;
        paymentPayload.sequenceType = "first";
      }

      const mollieRes = await fetch("https://api.mollie.com/v2/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentPayload),
      });

      const paymentData = await mollieRes.json();

      if (!mollieRes.ok) {
        console.error("Mollie API Error:", paymentData);
        return new Response(
          JSON.stringify({
            error: paymentData.detail || "Erreur lors de la création du paiement Mollie.",
            details: paymentData,
          }),
          { status: mollieRes.status, headers: jsonHeaders }
        );
      }

      return new Response(
        JSON.stringify({
          id: paymentData.id,
          checkoutUrl: paymentData._links?.checkout?.href,
          amount: paymentData.amount,
          isMock: false,
          isSubscription: !!isSubscriptionService,
        }),
        { headers: jsonHeaders }
      );
    }

    // --- MODE SIMULATION SANDBOX IMMÉDIAT ---
    const mockId = `tr_mock_${Math.random().toString(36).substring(2, 12)}`;
    return new Response(
      JSON.stringify({
        id: mockId,
        checkoutUrl: `${origin}/paiement?mollie_id=${mockId}&status=simulated`,
        isMock: true,
        amount: { currency: "EUR", value: numericAmount.toFixed(2) },
        message: "Session Mollie Sandbox prête (mode simulation actif).",
      }),
      { headers: jsonHeaders }
    );
  } catch (error: any) {
    console.error("mollie-checkout edge function exception:", error);
    return new Response(
      JSON.stringify({
        error: error?.message || "Erreur interne lors de l'initialisation du paiement.",
      }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
