import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/create-payment-intent" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency = "eur", serviceName, clientEmail } = body;

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
