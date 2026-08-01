import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/create-payment-intent" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency = "eur", serviceName, clientEmail } = body;

    // 🔒 1. Vérification Serveur : Le client doit exister et posséder le statut 'Accepté'
    if (clientEmail) {
      const emailClean = String(clientEmail).trim().toLowerCase();
      const isAdminEmail =
        emailClean.includes("admin@generalesquire.com") ||
        emailClean === "generalesquire@proton.me" ||
        emailClean === "contact@generalesquire.com";

      if (!isAdminEmail) {
        const { data: clientRecord } = await supabase
          .from("clients")
          .select("status")
          .eq("email", emailClean)
          .maybeSingle();

        const status = clientRecord?.status || "";
        const isApproved = ["Accepté", "Accepte", "Confirmé", "Validé", "Approuvé"].includes(status);

        if (!isApproved) {
          return NextResponse.json(
            {
              error: "Paiement non autorisé : Votre compte n'a pas encore été validé par l'administration de General Esquire.",
              status: "pending_approval",
            },
            { status: 403 }
          );
        }
      }
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY || "";

    if (!stripeSecret || stripeSecret.includes("votre_cle_secrete")) {
      return NextResponse.json(
        { error: "Clé secrète Stripe non configurée dans .env.local" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecret);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((Number(amount) || 100) * 100), // Montant en centimes
      currency: (currency || "eur").toLowerCase(),
      receipt_email: clientEmail || undefined,
      metadata: {
        service: serviceName || "Prestation juridique / abonnement",
        client_email: clientEmail || "",
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors de la création de la transaction Stripe.";
    console.error("Stripe API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
