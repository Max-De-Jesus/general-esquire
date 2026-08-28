"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

// Lien officiel Google Avis de General Esquire
const GOOGLE_REVIEW_URL = "https://g.page/r/Cb6OOUdT3CohEAE/review";

// Durée d'inactivité avant affichage (5 minutes = 300 000 ms)
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

export default function ReviewInactivityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Déclencher l'ouverture de la modale
  const triggerModal = useCallback((force = false) => {
    if (typeof window === "undefined") return;

    if (!force) {
      const dismissedAt = sessionStorage.getItem("esquire_review_modal_dismissed");
      if (dismissedAt) {
        const timeSinceDismissed = Date.now() - parseInt(dismissedAt, 10);
        // Attendre au moins 5 minutes après fermeture pour un réaffichage automatique par timer
        if (timeSinceDismissed < INACTIVITY_TIMEOUT_MS) {
          return;
        }
      }
    }

    setIsOpen(true);
    setIsClosing(false);
  }, []);

  // Réinitialiser le timer d'inactivité (5 minutes sans interaction)
  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      triggerModal(false);
    }, INACTIVITY_TIMEOUT_MS);
  }, [triggerModal]);

  useEffect(() => {
    // 1. Détection d'inactivité (5 minutes)
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "pointermove",
    ];

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Lancer le timer initial
    resetInactivityTimer();

    // 2. Détection ciblée quand le curseur monte vers la croix de fermeture de l'onglet (Zone haut du navigateur)
    const handleTopTabIntent = (e: MouseEvent) => {
      // Détecte quand la souris s'approche ou quitte vers le haut (zone des onglets / croix 'x' du navigateur)
      if (e.clientY <= 5 || (!e.relatedTarget && e.clientY <= 15)) {
        triggerModal(true);
      }
    };

    // 3. Détection de fermeture d'onglet du navigateur
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      triggerModal(true);
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    document.documentElement.addEventListener("mouseleave", handleTopTabIntent);
    window.addEventListener("mouseout", handleTopTabIntent);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      document.documentElement.removeEventListener("mouseleave", handleTopTabIntent);
      window.removeEventListener("mouseout", handleTopTabIntent);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [resetInactivityTimer, triggerModal]);

  const handleClose = () => {
    setIsClosing(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("esquire_review_modal_dismissed", Date.now().toString());
    }
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      resetInactivityTimer();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 transition-all duration-400 ${
        isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-labelledby="review-modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Arrière-plan flouté sombre */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-400"
        onClick={handleClose}
      />

      {/* Carte de la fenêtre modale */}
      <div
        className={`relative w-full max-w-xl bg-[#141614] border-2 border-[#C5A059]/75 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(197,160,89,0.3)] p-5 sm:p-7 text-center transform transition-all duration-400 z-10 ${
          isClosing ? "scale-95 translate-y-4" : "scale-100 translate-y-0"
        }`}
      >
        {/* Éléments décoratifs et halos dorés */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#1a5e39]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Bouton de fermeture de la modale */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1e221f] border border-[#C5A059]/40 text-[#EDE4CF]/80 hover:text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#C5A059]/20 hover:rotate-90 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md"
          aria-label="Fermer la fenêtre"
        >
          <span className="text-xl font-bold leading-none select-none">&times;</span>
        </button>

        {/* Badge Google Avis & Étoiles */}
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a3d28]/70 border border-[#C5A059]/50 shadow-[0_0_20px_rgba(197,160,89,0.25)] mb-3">
          <svg className="w-5 h-5 text-[#E9D18F]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-cinzel text-[#E9D18F]">
            Avis Google Officiel
          </span>
          <span className="text-[#E9D18F] text-xs font-bold animate-pulse">✦</span>
        </div>

        {/* Titre Principal */}
        <h2
          id="review-modal-title"
          className="font-cinzel text-xl sm:text-2xl font-bold text-[#E9D18F] tracking-wide mb-2 drop-shadow-[0_0_12px_rgba(233,209,143,0.35)]"
        >
          Vous nous quittez déjà ?
        </h2>

        {/* Phrase de l'utilisateur */}
        <p className="font-cormorant text-base sm:text-lg text-[#EDE4CF] leading-relaxed mb-4 font-normal">
          Merci de nous laisser gracieusement un avis, pour favoriser notre visibilité.
        </p>

        {/* SECTION QR CODE & LIEN DIRECT (Cliquable vers nouvel onglet) */}
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className="group flex flex-col sm:flex-row items-center justify-center gap-4 bg-[#0c2215]/80 hover:bg-[#0c2215] border border-[#C5A059]/35 hover:border-[#E9D18F] rounded-2xl p-4 mb-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] text-left"
          title="Cliquez pour ouvrir Google Avis dans un nouvel onglet"
        >
          {/* Cadre du QR Code */}
          <div className="bg-white p-2.5 rounded-xl border-2 border-[#E9D18F] shadow-[0_0_20px_rgba(233,209,143,0.3)] group-hover:scale-105 transition-transform duration-300 shrink-0">
            <Image
              src="/images/qr-code-google-avis.svg"
              alt="Scanner le QR Code pour laisser un avis Google"
              width={120}
              height={120}
              className="w-28 h-28 object-contain"
              priority
            />
          </div>

          {/* Explications & Appel à l'action */}
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <p className="font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider text-[#E9D18F] group-hover:text-white transition-colors">
              Scanner ou Cliquer pour ouvrir
            </p>
            <p className="font-cormorant text-sm sm:text-base text-[#EDE4CF]/90 italic leading-snug">
              Pointez l'appareil photo de votre smartphone ou cliquez directement sur cette zone pour ouvrir la page d'avis dans un nouvel onglet.
            </p>
            <p className="text-[11px] text-[#C5A059] font-medium tracking-wide">
              ✦ Rapide, simple et sans inscription requise ✦
            </p>
          </div>
        </a>

        {/* Consigne sur une seule ligne */}
        <p className="font-cormorant text-sm sm:text-base text-[#EDE4CF]/80 italic mb-4 whitespace-normal sm:whitespace-nowrap">
          Veuillez cliquer sur le lien ci-dessous ou scanner le code pour nous donner votre avis.
        </p>

        {/* Actions : Bouton direct vers le lien Google Review dans un nouvel onglet */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-cinzel text-sm font-bold uppercase tracking-wider text-[#0c2617] bg-gradient-to-r from-[#E9D18F] via-[#C5A059] to-[#E9D18F] hover:from-[#FFF] hover:to-[#E9D18F] shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:shadow-[0_6px_28px_rgba(233,209,143,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <span>Donner mon avis sur Google</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl font-cinzel text-xs uppercase tracking-wider text-[#EDE4CF]/70 hover:text-[#EDE4CF] bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
          >
            Continuer la visite
          </button>
        </div>
      </div>
    </div>
  );
}
