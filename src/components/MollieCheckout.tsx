"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

interface MollieCheckoutProps {
  amount: number; // in Euros
  serviceName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  profileType?: string;
  isSubscriptionService?: boolean;
  frequency?: string;
  times?: number;
  lang?: "fr" | "en";
  onPaymentSuccess?: (details: {
    reference: string;
    pspReference?: string;
    method?: string;
  }) => void;
  onPaymentError?: (errorMessage: string) => void;
}

export default function MollieCheckoutComponent({
  amount,
  serviceName,
  clientName,
  clientEmail,
  clientPhone,
  profileType = "Particulier",
  isSubscriptionService = false,
  frequency,
  times,
  lang = "fr",
  onPaymentSuccess,
  onPaymentError,
}: MollieCheckoutProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartPayment = async () => {
    try {
      setIsRedirecting(true);
      setErrorMessage(null);

      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://generalesquire.com";

      const { data, error } = await supabase.functions.invoke("mollie-checkout", {
        body: {
          amount,
          serviceName,
          fullName: clientName,
          email: clientEmail,
          phone: clientPhone,
          profileType,
          isSubscriptionService,
          frequency,
          times,
          origin,
        },
      });

      if (data && data.checkoutUrl && !data.isMock) {
        // Ouverture du guichet sécurisé dans un NOUVEL ONGLET
        const popup = window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
        if (!popup || popup.closed || typeof popup.closed === "undefined") {
          // Fallback si le navigateur bloque l'ouverture automatique
          window.location.href = data.checkoutUrl;
        } else {
          setIsRedirecting(false);
        }
        return;
      }

      if (error || !data || !data.checkoutUrl) {
        throw new Error(
          data?.error || error?.message || "Impossible d'initialiser le paiement sécurisé Mollie."
        );
      }

      // Si mode simulation explicite
      if (data.isMock && onPaymentSuccess) {
        setTimeout(() => {
          setIsRedirecting(false);
          onPaymentSuccess({
            reference: data.id,
            pspReference: `MOLLIE-${data.id}`,
            method: "Mollie (Carte Bancaire / Apple Pay Sandbox)",
          });
        }, 1500);
        return;
      }

      // Redirection fallback
      window.open(data.checkoutUrl, "_blank", "noopener,noreferrer");
      setIsRedirecting(false);
    } catch (err: any) {
      console.error("Mollie payment launch error:", err);
      const msg =
        err?.message ||
        (lang === "fr"
          ? "Une erreur est survenue lors de l'initialisation du paiement."
          : "An error occurred while initiating the payment.");
      setErrorMessage(msg);
      if (onPaymentError) onPaymentError(msg);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* Branding Mollie & Cartes Header */}
      <div className="bg-gradient-to-r from-[#171a17] via-[#1f241f] to-[#121412] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-black/60 border border-[#C5A059]/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.3)]">
              {/* Mollie Logo SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E9D18F]">
                <path d="M12 25 L40 75 L60 25 L88 75" stroke="#E9D18F" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] uppercase tracking-wider">
                  Mollie Checkout
                </span>
                <span className="text-[9px] font-cinzel font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  3D Secure 2.0 • DSP2
                </span>
              </div>
              <p className="font-cormorant text-xs sm:text-sm text-[#cabfa6]">
                {lang === "fr"
                  ? "Plateforme d'encaissement européenne agréée — Cartes Bancaires, Apple Pay, Google Pay, Virement SEPA"
                  : "Certified European payment gateway — CB, Visa, Mastercard, Apple Pay, Google Pay, SEPA"}
              </p>
            </div>
          </div>

          <div className="text-right self-end sm:self-center">
            <span className="font-cinzel text-xs text-[#C5A059] block uppercase tracking-widest">
              {lang === "fr" ? "Montant à régler" : "Amount to pay"}
            </span>
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-[#E9D18F]">
              {amount.toLocaleString("fr-FR")}&nbsp;€
            </span>
          </div>
        </div>

        {/* Moyens de paiement acceptés */}
        <div className="pt-3 border-t border-[#C5A059]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-cinzel text-[10px] text-[#cabfa6] uppercase tracking-wider">
            {lang === "fr" ? "Moyens acceptés :" : "Accepted methods:"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-black/50 border border-[#C5A059]/30 text-white font-mono px-2.5 py-1 rounded-lg text-[10px] font-bold">
              💳 CB / VISA
            </span>
            <span className="bg-black/50 border border-[#C5A059]/30 text-white font-mono px-2.5 py-1 rounded-lg text-[10px] font-bold">
              💳 MASTERCARD
            </span>
            <span className="bg-black/50 border border-[#C5A059]/30 text-white font-mono px-2.5 py-1 rounded-lg text-[10px] font-bold">
              🍎 APPLE PAY
            </span>
            <span className="bg-black/50 border border-[#C5A059]/30 text-white font-mono px-2.5 py-1 rounded-lg text-[10px] font-bold">
              🌐 GOOGLE PAY
            </span>
            <span className="bg-black/50 border border-[#C5A059]/30 text-white font-mono px-2.5 py-1 rounded-lg text-[10px] font-bold">
              🏛️ SEPA
            </span>
          </div>
        </div>
      </div>

      {/* Message d'erreur s'il y a lieu */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-cormorant text-sm">
          {errorMessage}
        </div>
      )}

      {/* Encadré d'engagement & Bouton de redirection */}
      <div className="bg-[#131513] border border-[#C5A059]/30 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="space-y-3 font-cormorant text-sm text-[#EDE4CF]">
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 text-lg leading-none">✓</span>
            <p>
              {lang === "fr"
                ? "En cliquant sur le bouton ci-dessous, vous serez redirigé vers l'interface de paiement sécurisée et chiffrée par Mollie B.V."
                : "By clicking below, you will be redirected to the secure 256-bit encrypted checkout hosted by Mollie B.V."}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-emerald-400 text-lg leading-none">✓</span>
            <p>
              {lang === "fr"
                ? "Vos coordonnées bancaires ne transitent jamais sur nos serveurs et bénéficient de la protection anti-fraude 3D Secure 2.0."
                : "Your banking details never touch our servers and are protected by 3D Secure 2.0 fraud prevention."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartPayment}
          disabled={isRedirecting}
          className="w-full py-4.5 rounded-xl font-cinzel text-xs sm:text-sm font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:shadow-[0_0_30px_rgba(233,209,143,0.5)] transition-all cursor-pointer uppercase flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isRedirecting ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>
                {lang === "fr"
                  ? "Ouverture du Guichet Sécurisé..."
                  : "Opening Secure Checkout..."}
              </span>
            </>
          ) : (
            <>
              <span className="text-base">🔒</span>
              <span>
                {lang === "fr"
                  ? `Régler ${amount.toLocaleString("fr-FR")} € par Carte Bancaire / Apple Pay`
                  : `Pay €${amount.toLocaleString("en-US")} by Card / Apple Pay`}
              </span>
              <span className="text-base">→</span>
            </>
          )}
        </button>

        <p className="font-cormorant text-xs text-[#cabfa6]/70 text-center italic">
          {lang === "fr"
            ? "Paiement 100% sécurisé et conforme aux normes bancaires européennes ACPR & DNB."
            : "100% secure payment compliant with European ACPR & DNB banking standards."}
        </p>
      </div>
    </div>
  );
}
