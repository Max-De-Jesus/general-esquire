import { corsHeaders } from "../_shared/cors.ts";
import { serviceRoleClient } from "../_shared/admin.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    let paymentId: string | null = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      paymentId = (formData.get("id") as string) || null;
    } else {
      const body = await req.json().catch(() => ({}));
      paymentId = body?.id || body?.data?.id || body?.resource?.id || null;
    }

    if (!paymentId) {
      return new Response("Missing payment ID", { status: 200 });
    }

    const apiKey =
      Deno.env.get("MOLLIE_API_KEY") ?? "" /* jamais de clé dans le code */;
    if (!apiKey) {
      return new Response("Mollie API key not configured", { status: 200 });
    }

    // Récupérer le statut du paiement directement depuis Mollie
    const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!mollieRes.ok) {
      console.warn("Mollie payment fetch warning:", await mollieRes.text());
      return new Response("OK", { status: 200 });
    }

    const payment = await mollieRes.json();
    console.log(
      `[Mollie Webhook] Transaction ${payment.id} — Statut: ${payment.status}, Montant: ${payment.amount?.value} ${payment.amount?.currency}`
    );

    if (payment.status === "paid") {
      const metadata: any = payment.metadata || {};
      const supabase = serviceRoleClient();

      try {
        await supabase
          .from("paiements")
          .update({
            status: "Payé",
            paid_at: new Date().toISOString(),
            notes: `Règlement confirmé via Mollie. Réf: ${payment.id}. Mode: ${
              payment.method || "Carte Bancaire / Apple Pay"
            }${metadata.isSubscriptionService ? ` (Abonnement récurrent ${metadata.frequency || "Mensuel"} activé)` : ""}`,
          })
          .ilike("notes", `%${payment.id}%`);
      } catch (dbError) {
        console.warn("[Mollie Webhook] DB update warning:", dbError);
      }

      // ── CRÉATION DE L'ABONNEMENT RÉCURRENT AUTOMATIQUE SI DEMANDÉ ──
      if (
        metadata.isSubscriptionService &&
        payment.customerId &&
        payment.sequenceType === "first"
      ) {
        try {
          let interval = "1 month";
          if (metadata.frequency === "Annuel") interval = "12 months";
          else if (metadata.frequency === "Trimestriel") interval = "3 months";

          const subPayload: any = {
            amount: payment.amount,
            interval,
            description: `General Esquire — ${metadata.serviceName || "Abonnement"} (${metadata.frequency || "Mensuel"})`,
            webhookUrl: `${Deno.env.get("SUPABASE_URL") || "https://szyirafviiswvaooubzs.supabase.co"}/functions/v1/mollie-webhook`,
            metadata: {
              ...metadata,
              initialPaymentId: payment.id,
            },
          };

          // Si c'est un paiement en plusieurs fois (ex: tranches Cocooning Touristique)
          if (metadata.times && Number(metadata.times) > 1) {
            subPayload.times = Number(metadata.times) - 1;
          }

          const subRes = await fetch(
            `https://api.mollie.com/v2/customers/${payment.customerId}/subscriptions`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(subPayload),
            }
          );

          if (subRes.ok) {
            const subData = await subRes.json();
            console.log(
              `[Mollie Subscriptions] Abonnement récurrent créé avec succès : ${subData.id} pour le client ${payment.customerId}`
            );
          } else {
            console.warn(
              "[Mollie Subscriptions] Notice lors de la création d'abonnement :",
              await subRes.text()
            );
          }
        } catch (subErr) {
          console.warn("[Mollie Subscriptions] Exception création abonnement :", subErr);
        }
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("[Mollie Webhook] Exception:", error);
    return new Response("OK", { status: 200 });
  }
});
