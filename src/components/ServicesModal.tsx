"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Positionnement féérique des étoiles scintillantes sur le panneau de menu
const MENU_SPARKLES = [
  { id: 1, top: "8%", left: "10%", delay: "0s", dur: "2.4s", size: "14px" },
  { id: 2, top: "14%", left: "85%", delay: "0.5s", dur: "3.1s", size: "11px" },
  { id: 3, top: "25%", left: "15%", delay: "1.2s", dur: "2.8s", size: "16px" },
  { id: 4, top: "33%", left: "82%", delay: "0.8s", dur: "2.5s", size: "12px" },
  { id: 5, top: "50%", left: "8%", delay: "1.8s", dur: "3.4s", size: "13px" },
  { id: 6, top: "62%", left: "88%", delay: "0.3s", dur: "2.2s", size: "15px" },
  { id: 7, top: "75%", left: "12%", delay: "1.5s", dur: "2.9s", size: "11px" },
  { id: 8, top: "86%", left: "82%", delay: "0.9s", dur: "3.2s", size: "14px" },
  { id: 9, top: "44%", left: "90%", delay: "2.1s", dur: "2.7s", size: "12px" },
  { id: 10, top: "92%", left: "22%", delay: "1.0s", dur: "3.0s", size: "15px" },
];

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const { lang } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden";
    } else if (mounted && !isClosing) {
      document.body.style.overflow = "unset";
      setMounted(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setMounted(false);
      document.body.style.overflow = "unset";
      onClose();
    }, 650);
  };

  if (!isOpen && !mounted) return null;

  return (
    <>
      {/* ===== OVERLAY SOMBRE GAUCHE (menu-overlay vs/1) ===== */}
      <div
        className={`fixed inset-0 z-[90] bg-[#080a09]/75 backdrop-blur-sm transition-opacity duration-500 ${
          isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* ===== PANNEAU DE MENU (menu-panel vs/1 CHORÉGRAPHIE OBLIGATOIRE) ===== */}
      <nav
        className={`menu-panel-vs1 relative overflow-hidden ${
          isClosing ? "is-closing" : isOpen ? "is-open" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu des services"
      >
        {/* Étoiles scintillantes féériques sur le panneau de menu */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {MENU_SPARKLES.map((s) => (
            <span
              key={s.id}
              className="sparkle-star"
              style={{
                top: s.top,
                left: s.left,
                fontSize: s.size,
                animationDelay: s.delay,
                animationDuration: s.dur,
              }}
              aria-hidden="true"
            >
              ✦
            </span>
          ))}
        </div>

        {/* Bouton fermer (Croix dorée tournante sans texte) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/20 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer z-20 shadow-[0_0_15px_rgba(197,160,89,0.2)]"
          aria-label={lang === "fr" ? "Fermer le menu" : "Close menu"}
        >
          <span className="font-cinzel text-2xl sm:text-3xl leading-none font-bold select-none">&times;</span>
        </button>

        {/* Logo Cheval Ailé (menu-panel__logo avec revealUp) */}
        <div className="menu-panel__logo flex flex-col items-center mb-2 sm:mb-4 relative z-20">
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 mb-1 sm:mb-2 transition-transform duration-500 hover:scale-105">
            <Image
              src="/images/cheval-aile.png"
              alt="Cheval ailé General Esquire"
              fill
              priority
              className="object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] drop-shadow-[0_0_25px_rgba(233,209,143,0.35)]"
            />
          </div>
        </div>

        {/* Titre (menu-panel__titre : MENU) */}
        <p className="menu-panel__titre font-cinzel text-base sm:text-xl uppercase tracking-[0.35em] text-[#E9D18F] drop-shadow-[0_0_15px_rgba(233,209,143,0.55)] text-center font-bold mb-4 sm:mb-6 relative z-20">
          MENU
        </p>

        {/* Liste des rubriques (menu-liste vs/1 avec revealUp sur chaque li) */}
        <ul className="menu-liste w-full max-w-[280px] sm:max-w-xs space-y-2.5 sm:space-y-3.5 list-none m-0 p-0 text-center relative z-20">
          <li>
            <Link
              href="/conseil-juridique"
              onClick={handleClose}
              className="block w-full py-2.5 sm:py-3.5 px-4 sm:px-6 font-cinzel text-xs sm:text-sm md:text-base uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#E9D18F] bg-[#0c3822]/80 border-[1.5px] border-[#E9D18F]/60 rounded-[12px] sm:rounded-[14px] shadow-[0_0_14px_rgba(233,209,143,0.18),inset_0_1px_0_rgba(233,209,143,0.25),0_4px_18px_rgba(0,0,0,0.4)] drop-shadow-[0_0_12px_rgba(197,160,89,0.4)] hover:bg-[#1a5e39] hover:border-[#E9D18F] hover:text-white hover:shadow-[0_0_24px_rgba(233,209,143,0.45)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
            >
              {lang === "fr" ? (
                <>Conseil<br />juridique</>
              ) : (
                <>Legal<br />advisory</>
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/cocooning-touristique"
              onClick={handleClose}
              className="block w-full py-2.5 sm:py-3.5 px-4 sm:px-6 font-cinzel text-xs sm:text-sm md:text-base uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#E9D18F] bg-[#0c3822]/80 border-[1.5px] border-[#E9D18F]/60 rounded-[12px] sm:rounded-[14px] shadow-[0_0_14px_rgba(233,209,143,0.18),inset_0_1px_0_rgba(233,209,143,0.25),0_4px_18px_rgba(0,0,0,0.4)] drop-shadow-[0_0_12px_rgba(197,160,89,0.4)] hover:bg-[#1a5e39] hover:border-[#E9D18F] hover:text-white hover:shadow-[0_0_24px_rgba(233,209,143,0.45)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
            >
              {lang === "fr" ? (
                <>Cocooning<br />touristique</>
              ) : (
                <>Touristic<br />cocooning</>
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/actualites"
              onClick={handleClose}
              className="block w-full py-2.5 sm:py-3.5 px-4 sm:px-6 font-cinzel text-xs sm:text-sm md:text-base uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#E9D18F] bg-[#0c3822]/80 border-[1.5px] border-[#E9D18F]/60 rounded-[12px] sm:rounded-[14px] shadow-[0_0_14px_rgba(233,209,143,0.18),inset_0_1px_0_rgba(233,209,143,0.25),0_4px_18px_rgba(0,0,0,0.4)] drop-shadow-[0_0_12px_rgba(197,160,89,0.4)] hover:bg-[#1a5e39] hover:border-[#E9D18F] hover:text-white hover:shadow-[0_0_24px_rgba(233,209,143,0.45)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
            >
              {lang === "fr" ? (
                <>Actualités &<br />annonces</>
              ) : (
                <>News &<br />announcements</>
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/paiement"
              onClick={handleClose}
              className="block w-full py-2.5 sm:py-3.5 px-4 sm:px-6 font-cinzel text-xs sm:text-sm md:text-base uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#E9D18F] bg-[#0c3822]/80 border-[1.5px] border-[#E9D18F]/60 rounded-[12px] sm:rounded-[14px] shadow-[0_0_14px_rgba(233,209,143,0.18),inset_0_1px_0_rgba(233,209,143,0.25),0_4px_18px_rgba(0,0,0,0.4)] drop-shadow-[0_0_12px_rgba(197,160,89,0.4)] hover:bg-[#1a5e39] hover:border-[#E9D18F] hover:text-white hover:shadow-[0_0_24px_rgba(233,209,143,0.45)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
            >
              {lang === "fr" ? (
                <>Paiement<br />en ligne</>
              ) : (
                <>Online<br />payment</>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
