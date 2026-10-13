import { jsonHeaders, corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    let paymentId: string | null = null;
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      paymentId = body?.id || null;
    } else {
      const url = new URL(req.url);
      paymentId = url.searchParams.get("id");
    }

    if (!paymentId) {
      return new Response(JSON.stringify({ error: "Identifiant de transaction manquant." }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (paymentId.startsWith("tr_mock_")) {
      return new Response(
        JSON.stringify({
          id: paymentId,
          status: "paid",
          isPaid: true,
          method: "Carte Bancaire (Mollie Sandbox)",
          isMock: true,
        }),
        { headers: jsonHeaders }
      );
    }

    const apiKey =
      Deno.env.get("MOLLIE_API_KEY") ?? "" /* jamais de clé dans le code */;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          id: paymentId,
          status: "paid",
          isPaid: true,
          method: "Carte Bancaire (Mollie Sandbox)",
          isMock: true,
        }),
        { headers: jsonHeaders }
      );
    }

    const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!mollieRes.ok) {
      return new Response(
        JSON.stringify({ error: "Transaction introuvable auprès de Mollie." }),
        { status: mollieRes.status, headers: jsonHeaders }
      );
    }

    const payment = await mollieRes.json();

    return new Response(
      JSON.stringify({
        id: payment.id,
        status: payment.status,
        isPaid: payment.status === "paid",
        amount: payment.amount,
        method: payment.method || "Carte Bancaire",
        metadata: payment.metadata,
      }),
      { headers: jsonHeaders }
    );
  } catch (error: any) {
    console.error("mollie-status error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Erreur interne de statut." }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
