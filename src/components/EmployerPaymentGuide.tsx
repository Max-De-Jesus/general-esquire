"use client";

import React, { useState } from "react";

export default function EmployerPaymentGuide({ className = "" }: { className?: string }) {
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
              Merci d’avoir choisi General Esquire
            </h3>
            <p className="font-cinzel text-xs text-[#C5A059] uppercase tracking-widest mt-1">
              Instructions officielles & Guide de paiement sécurisé
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#E9D18F] text-xs font-cinzel hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer flex-shrink-0"
          >
            {isOpen ? "Réduire" : "Lire les instructions"}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-4 animate-fadeIn">
            <p className="font-light">
              Vous êtes sur le point d’effectuer un paiement.<br />
              Il vous faudra d’abord créer un compte, afin de vous connecter à notre espace sécurisé de paiement en ligne.<br />
              Entrez votre adresse électronique et choisissez un mot de passe.<br />
              <strong className="text-[#E9D18F] font-semibold">
                Attention, ce mot de passe ne doit pas être celui de votre messagerie.
              </strong><br />
              Il doit comporter au moins huit caractères, dont une lettre majuscule, une lettre minuscule, un chiffre, et un caractère spécial.
            </p>

            <p className="font-light">
              Une fois votre compte créé, vous aurez accès à la page de paiement en vous connectant.
            </p>

            <p className="font-light">
              Vous devrez alors choisir soit le conseil juridique, soit le cocooning touristique.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/25 space-y-2">
              <h4 className="font-cinzel text-sm text-[#E9D18F] font-bold uppercase tracking-wider">
                1. Conseil Juridique
              </h4>
              <p className="font-light text-sm sm:text-base">
                Si c’est le conseil juridique, vous devrez entrer vos informations personnelles, et sélectionner votre catégorie : professionnel du droit, institution publique, chef d’entreprise ou simple particulier.<br />
                En fonction de votre sélection, vous pourrez souscrire un abonnement annuel ou mensuel, ou faire un paiement ponctuel. Vous pouvez aussi télécharger notre RIB pour nous faire un virement de compte à compte (recommandé pour la facturation de gré à gré).
              </p>
              <p className="font-light text-sm sm:text-base text-[#E9D18F]">
                La somme à payer s’affichera dans le récapitulatif, et vous pourrez payer par carte bancaire ou Paypal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-[#C5A059]/25 space-y-3">
              <h4 className="font-cinzel text-sm text-[#E9D18F] font-bold uppercase tracking-wider">
                2. Cocooning Touristique
              </h4>
              <p className="font-light text-sm sm:text-base">
                Si c’est le cocooning touristique, la somme forfaitaire à payer est de 1 500 €.<br />
                Vous pouvez vous acquitter de cette somme en un paiement unique.<br />
                Sinon, à compter de votre inscription, un jeton vous indiquera votre plan de paiement.<br />
                Celui-ci dépend du nombre de mois qu’il vous reste avant la fin de la période d’inscription.<br />
                Celle-ci va de février à septembre pour le voyage de janvier ; et d’août à mars pour le voyage de juillet.
              </p>
              <p className="font-light text-sm sm:text-base">
                À condition qu’il y ait au minimum 10 voyageurs par session, vous pouvez basculer sur l’un ou l’autre des séjours, dès que vous avez fini d’acquitter l’intégralité de votre contribution avant la fin des inscriptions de chaque session.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F3823]/60 border border-[#C5A059]/40 text-sm sm:text-base italic">
              <h5 className="font-cinzel not-italic text-xs text-[#E9D18F] font-bold uppercase tracking-wider mb-1">
                Assurance Annulation Inclus
              </h5>
              <p>
                Une assurance annulation est souscrite pour votre compte par General Esquire. Celle-ci garantit votre remboursement intégral en cas d’annulation, dans les trois mois précédant la date de départ qui vous aura été communiquée dès votre inscription, et qui se situe, soit en janvier, soit en juillet. Au-delà, une retenue de 15% vous sera appliquée, indépendamment de celles éventuellement encourues auprès de notre compagnie aérienne, si celle-ci a déjà émis votre billet d’avion.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
