"use client";

/**
 * Paiement en ligne via Stripe Checkout (carte bancaire, Apple Pay, Google Pay…).
 * Décision : docs/adr/0004-paiement-stripe.md
 *
 * Le navigateur n'envoie que les CHOIX du client ; le montant est recalculé
 * par l'Edge Function stripe-checkout, qui renvoie l'URL de la page de
 * paiement hébergée par Stripe. Le retour se fait sur
 * /paiement/?stripe_ref=<id> où le statut est relu côté serveur.
 */

import React, { useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface StripeChoix {
  serviceId: string;
  customPrice?: string;
  translationPages?: number;
  isUrgent?: boolean;
  cocooningOption?: "unique" | "tranches";
  cocooningSession?: "janvier" | "juillet";
}

interface StripeCheckoutProps {
  choix: StripeChoix;
  estimatedAmountEur: number;
  fullName: string;
  phone?: string;
  country?: string;
  address?: string;
  isSubscriptionService?: boolean;
  lang?: "fr" | "en";
}

const isStripeCheckoutUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "checkout.stripe.com";
  } catch {
    return false;
  }
};

export default function StripeCheckout({
  choix,
  estimatedAmountEur,
  fullName,
  phone,
  country,
  address,
  isSubscriptionService = false,
  lang = "fr",
}: StripeCheckoutProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fr = lang === "fr";

  const handlePay = async () => {
    setIsRedirecting(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: { ...choix, fullName, phone, country, address, lang },
      });

      if (error) {
        let message = fr
          ? "Le paiement n'a pas pu être initié. Réessayez dans quelques instants."
          : "Payment could not be started. Please try again shortly.";
        if (error instanceof FunctionsHttpError) {
          const body = await error.context.json().catch(() => null);
          if (body?.error) message = body.error;
        }
        throw new Error(message);
      }

      if (!data?.url || !isStripeCheckoutUrl(data.url)) {
        throw new Error(fr ? "Réponse inattendue du service de paiement." : "Unexpected payment service response.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setIsRedirecting(false);
    }
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      <div className="bg-gradient-to-r from-[#171a17] via-[#1f241f] to-[#121412] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/60 border border-[#C5A059]/40 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.3)] text-xl">
              💳
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] uppercase tracking-wider">
                  Stripe
                </span>
                <span className="text-[9px] font-cinzel font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  3D Secure • {fr ? "Paiement sécurisé" : "Secure payment"}
                </span>
              </div>
              <p className="font-cormorant text-xs sm:text-sm text-[#cabfa6]">
                {fr
                  ? "Carte bancaire, Apple Pay, Google Pay — page de paiement sécurisée Stripe"
                  : "Bank card, Apple Pay, Google Pay — secure Stripe payment page"}
              </p>
            </div>
          </div>

          <div className="text-right self-end sm:self-center">
            <span className="font-cinzel text-xs text-[#C5A059] block uppercase tracking-widest">
              {fr ? "Montant" : "Amount"}
            </span>
            <span className="font-cinzel text-lg font-bold text-[#E9D18F] whitespace-nowrap">
              {estimatedAmountEur.toLocaleString(fr ? "fr-FR" : "en-GB")}&nbsp;€
            </span>
          </div>
        </div>

        <p className="font-cormorant text-xs text-[#EDE4CF]/80 italic">
          {fr
            ? "Vous serez redirigé vers la page de paiement sécurisée de Stripe, puis ramené sur ce site. Vos données bancaires ne transitent jamais par General Esquire."
            : "You will be redirected to Stripe's secure payment page and then back to this site. Your card details never pass through General Esquire."}
          {isSubscriptionService &&
            (fr
              ? " Pour les formules récurrentes, ce paiement règle l'échéance en cours ; les suivantes vous seront demandées à chaque terme."
              : " For recurring plans, this payment covers the current installment; the next ones will be requested at each term.")}
        </p>
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={isRedirecting}
        className="w-full py-4 rounded-xl font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all cursor-pointer uppercase disabled:opacity-50 disabled:cursor-wait"
      >
        {isRedirecting
          ? fr ? "Redirection vers Stripe…" : "Redirecting to Stripe…"
          : fr ? "Payer par carte (Stripe)" : "Pay by card (Stripe)"}
      </button>

      {errorMessage && (
        <p role="alert" className="text-red-400 font-cormorant text-sm text-center">{errorMessage}</p>
      )}
    </div>
  );
}
