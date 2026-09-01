"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function EmployerPaymentGuide({ className = "" }: { className?: string }) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`w-full bg-[#0d0e0d] border-2 border-[#C5A059]/60 rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden ${className}`}>
      {/* Halo lumineux d'arrière-plan */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 space-y-4 font-cormorant text-base sm:text-lg text-[#EDE4CF] leading-relaxed">
        {/* En-tête officiel */}
        <div className="flex items-start justify-between border-b border-[#C5A059]/30 pb-4">
          <div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#E9D18F] tracking-wide uppercase">
              {lang === "fr" ? "Merci d’avoir choisi General Esquire" : "Thank You for Choosing General Esquire"}
            </h3>
            <p className="font-cinzel text-xs text-[#C5A059] uppercase tracking-widest mt-1">
              {lang === "fr"
                ? "Instructions officielles & Guide de paiement sécurisé"
                : "Official Instructions & Secure Payment Guide"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#E9D18F] text-xs font-cinzel hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer flex-shrink-0"
          >
            {isOpen ? (lang === "fr" ? "Réduire" : "Collapse") : (lang === "fr" ? "Lire les instructions" : "Read instructions")}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-4 animate-fadeIn">
            <p className="font-light">
              {lang === "fr" ? (
                <>
                  Vous êtes sur le point d’effectuer un paiement.<br />
                  Il vous faudra d’abord créer un compte, afin de vous connecter à notre espace sécurisé de paiement en ligne.<br />
                  Entrez votre adresse électronique et choisissez un mot de passe.<br />
                  <strong className="text-[#E9D18F] font-semibold">
                    Attention, ce mot de passe ne doit pas être celui de votre messagerie.
                  </strong><br />
                  Il doit comporter au moins huit caractères, dont une lettre majuscule, une lettre minuscule, un chiffre, et un caractère spécial.
                </>
              ) : (
                <>
                  You are about to initiate a payment.<br />
                  You must first create an account to access our secure online payment area.<br />
                  Enter your email address and choose a strong password.<br />
                  <strong className="text-[#E9D18F] font-semibold">
                    Important: this password must not be your email password.
                  </strong><br />
                  It must contain at least eight characters, including an uppercase letter, a lowercase letter, a number, and a special character.
                </>
              )}
            </p>

            <p className="font-light">
              {lang === "fr"
                ? "Une fois votre compte créé, vous aurez accès à la page de paiement en vous connectant."
                : "Once your account is created, log in to access the payment form."}
            </p>

            <p className="font-light">
              {lang === "fr"
                ? "Vous devrez alors choisir soit le conseil juridique, soit le cocooning touristique."
                : "You will then choose between Legal Advisory and Touristic Cocooning."}
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/25 space-y-2">
              <h4 className="font-cinzel text-sm text-[#E9D18F] font-bold uppercase tracking-wider">
                {lang === "fr" ? "1. Conseil Juridique" : "1. Legal Advisory"}
              </h4>
              <p className="font-light text-sm sm:text-base">
                {lang === "fr" ? (
                  <>
                    Si c’est le conseil juridique, vous devrez entrer vos informations personnelles, et sélectionner votre catégorie : professionnel du droit, institution publique, chef d’entreprise ou simple particulier.<br />
                    En fonction de votre sélection, vous pourrez souscrire un abonnement annuel ou mensuel, ou faire un paiement ponctuel. Vous pouvez aussi télécharger notre RIB pour nous faire un virement de compte à compte (recommandé pour la facturation de gré à gré).
                  </>
                ) : (
                  <>
                    For legal advisory, enter your details and select your client category: legal professional, public institution, business executive, or private individual.<br />
                    Based on your profile, you can set up an annual or monthly subscription, or make an ad-hoc per-matter payment. You can also download our official banking details (RIB/IBAN) for direct wire transfers.
                  </>
                )}
              </p>
              <p className="font-light text-sm sm:text-base text-[#E9D18F]">
                {lang === "fr"
                  ? "La somme à payer s’affichera dans le récapitulatif, et vous pourrez payer par carte bancaire sécurisée (CB, Visa, Mastercard, Apple Pay) ou par virement bancaire (avec RIB officiel à télécharger)."
                  : "The total amount due is calculated in the summary, payable via secure card (CB, Visa, Mastercard, Apple Pay) or bank wire transfer (with downloadable official RIB/IBAN)."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/25 space-y-3">
              <h4 className="font-cinzel text-sm text-[#E9D18F] font-bold uppercase tracking-wider">
                {lang === "fr" ? "2. Cocooning Touristique" : "2. Touristic Cocooning"}
              </h4>
              <p className="font-light text-sm sm:text-base">
                {lang === "fr" ? (
                  <>
                    Si c’est le cocooning touristique, la somme forfaitaire à payer est de 1 500 €.<br />
                    Vous pouvez vous acquitter de cette somme en un paiement unique.<br />
                    Sinon, à compter de votre inscription, un jeton vous indiquera votre plan de paiement.<br />
                    Celui-ci dépend du nombre de mois qu’il vous reste avant la fin de la période d’inscription.<br />
                    Celle-ci va de février à septembre pour le voyage de janvier ; et d’août à mars pour le voyage de juillet.
                  </>
                ) : (
                  <>
                    For touristic cocooning, the fixed retreat package is €1,500.<br />
                    You may settle this fee in a single lump sum payment.<br />
                    Alternatively, upon registration, a personalized token indicates your installment plan.<br />
                    The schedule depends on the remaining months before registration closes.<br />
                    Registration runs February to September for January departures, and August to March for July departures.
                  </>
                )}
              </p>
              <p className="font-light text-sm sm:text-base">
                {lang === "fr"
                  ? "À condition qu’il y ait au minimum 10 voyageurs par session, vous pouvez basculer sur l’un ou l’autre des séjours, dès que vous avez fini d’acquitter l’intégralité de votre contribution avant la fin des inscriptions de chaque session."
                  : "Subject to a minimum of 10 travelers per cohort, you can transfer between sessions once your full contribution is completed before the registration deadline."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F3823]/60 border border-[#C5A059]/40 text-sm sm:text-base italic">
              <h5 className="font-cinzel not-italic text-xs text-[#E9D18F] font-bold uppercase tracking-wider mb-1">
                {lang === "fr" ? "Assurance Annulation Incluse" : "Cancellation Insurance Included"}
              </h5>
              <p>
                {lang === "fr"
                  ? "Une assurance annulation est souscrite pour votre compte par General Esquire. Celle-ci garantit votre remboursement intégral en cas d’annulation, dans les trois mois précédant la date de départ qui vous aura été communiquée dès votre inscription, et qui se situe, soit en janvier, soit en juillet. Au-delà, une retenue de 15% vous sera appliquée, indépendamment de celles éventuellement encourues auprès de notre compagnie aérienne, si celle-ci a déjà émis votre billet d’avion."
                  : "Cancellation insurance is covered by General Esquire on your behalf, guaranteeing a full refund up to 3 months prior to your scheduled departure (January or July). After this period, a 15% retention applies, plus any non-refundable airline fees if your flight ticket has already been issued."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
