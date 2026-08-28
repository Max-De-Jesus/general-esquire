"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Durée entre chaque affichage automatique (5 minutes = 300 000 ms)
const MODAL_INTERVAL_MS = 5 * 60 * 1000;

export default function ReviewInactivityModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Déclencher l'ouverture de la modale
  const triggerModal = useCallback((force = false) => {
    // Ne pas afficher sur la page /avis elle-même
    if (typeof window === "undefined") return;
    if (pathname === "/avis" || pathname?.startsWith("/avis/")) return;

    // Si c'est une intention de fermeture (force === true), on l'affiche obligatoirement
    if (!force) {
      const dismissedAt = sessionStorage.getItem("esquire_review_modal_dismissed");
      if (dismissedAt) {
        const timeSinceDismissed = Date.now() - parseInt(dismissedAt, 10);
        // Attendre au moins 5 minutes après fermeture pour le déclenchement automatique
        if (timeSinceDismissed < MODAL_INTERVAL_MS) {
          return;
        }
      }
    }

    setIsOpen(true);
    setIsClosing(false);
  }, [pathname]);

  // Réinitialiser le minuteur pour s'afficher toutes les 5 minutes
  const scheduleNextTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      triggerModal(false);
    }, MODAL_INTERVAL_MS);
  }, [triggerModal]);

  useEffect(() => {
    // Si on est sur la page /avis, désactiver les écouteurs
    if (pathname === "/avis" || pathname?.startsWith("/avis/")) {
      return;
    }

    // 1. Minuteur automatique : affichage toutes les 5 minutes
    scheduleNextTimer();

    // 2. Détection obligatoire de fermeture d'onglet / sortie (Exit-Intent)
    const handleMouseLeave = (e: MouseEvent) => {
      // Si la souris quitte la page vers le haut (zone des onglets / fermeture de fenêtre)
      if (e.clientY <= 25 && !e.relatedTarget) {
        triggerModal(true);
      }
    };

    // 3. Détection de tentative de fermeture ou déchargement de la page
    const handleBeforeUnload = () => {
      triggerModal(true);
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, scheduleNextTimer, triggerModal]);

  const handleClose = () => {
    setIsClosing(true);
    // Enregistrer l'horodatage de fermeture dans sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("esquire_review_modal_dismissed", Date.now().toString());
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      // Reprogrammer automatiquement pour dans 5 minutes
      scheduleNextTimer();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-400 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-labelledby="review-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Arrière-plan flouté sombre */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-400"
        onClick={handleClose}
      />

      {/* Carte de la fenêtre modale */}
      <div
        className={`relative w-full max-w-2xl bg-[#141614] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(197,160,89,0.25)] p-6 sm:p-8 text-center transform transition-all duration-400 z-10 ${
          isClosing ? "scale-95 translate-y-4" : "scale-100 translate-y-0"
        }`}
      >
        {/* Éléments décoratifs et halos dorés */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#1a5e39]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1e221f] border border-[#C5A059]/40 text-[#EDE4CF]/80 hover:text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#C5A059]/20 hover:rotate-90 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md"
          aria-label="Fermer la fenêtre"
        >
          <span className="text-xl font-bold leading-none select-none">&times;</span>
        </button>

        {/* Badge / Icône Étoiles & Avis */}
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1a3d28] via-[#0c2617] to-[#141614] border border-[#C5A059]/60 shadow-[0_0_25px_rgba(197,160,89,0.3)] mb-5">
          <div className="relative flex items-center justify-center">
            <svg
              className="w-9 h-9 sm:w-11 sm:h-11 text-[#E9D18F] drop-shadow-[0_2px_8px_rgba(233,209,143,0.6)]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="absolute -top-1 -right-2 text-[#E9D18F] text-xs font-bold animate-pulse">✦</span>
          </div>
        </div>

        {/* Titre Principal */}
        <h2
          id="review-modal-title"
          className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-[#E9D18F] tracking-wide mb-3 drop-shadow-[0_0_12px_rgba(233,209,143,0.35)]"
        >
          Vous nous quittez déjà ?
        </h2>

        {/* Phrase personnalisée de l'utilisateur */}
        <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-relaxed mb-4 font-normal">
          Merci de nous laisser gracieusement un avis, pour favoriser notre visibilité.
        </p>

        {/* Phrase d'instruction avec lien sur une seule ligne */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#0c2215]/80 border border-[#C5A059]/30 mb-6">
          <p className="text-xs sm:text-sm text-[#C5A059] font-medium tracking-wide uppercase font-cinzel mb-1">
            ✦ Votre contribution est précieuse ✦
          </p>
          <p className="font-cormorant text-base sm:text-lg md:text-xl text-[#EDE4CF]/90 italic whitespace-normal sm:whitespace-nowrap">
            Veuillez cliquer sur le lien ci-dessous pour nous donner votre avis.
          </p>
        </div>

        {/* Actions : Bouton de redirection vers /avis */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/avis"
            onClick={handleClose}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-cinzel text-sm sm:text-base font-bold uppercase tracking-wider text-[#0c2617] bg-gradient-to-r from-[#E9D18F] via-[#C5A059] to-[#E9D18F] hover:from-[#FFF] hover:to-[#E9D18F] shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:shadow-[0_6px_28px_rgba(233,209,143,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <span>Donner mon avis</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-cinzel text-xs sm:text-sm uppercase tracking-wider text-[#EDE4CF]/70 hover:text-[#EDE4CF] bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            Continuer la visite
          </button>
        </div>
      </div>
    </div>
  );
}
