"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
        className={`menu-panel-vs1 ${
          isClosing ? "is-closing" : isOpen ? "is-open" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu des services"
      >
        {/* Bouton fermer (menu-panel__close) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-transparent border border-[#C5A059]/45 text-[#C5A059] hover:bg-[#C5A059]/12 hover:shadow-[0_0_14px_rgba(197,160,89,0.35)] hover:rotate-90 flex items-center justify-center transition-all duration-300 cursor-pointer z-20"
          aria-label="Fermer le menu"
        >
          <span className="font-cinzel text-2xl leading-none">&times;</span>
        </button>

        {/* Logo Cheval Ailé (menu-panel__logo avec revealUp) */}
        <div className="menu-panel__logo flex flex-col items-center mb-6 sm:mb-8">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-3">
            <Image
              src="/images/cheval-aile.png"
              alt="Cheval ailé General Esquire"
              fill
              priority
              className="object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
            />
          </div>
        </div>

        {/* Titre (menu-panel__titre : MENU) */}
        <p className="menu-panel__titre font-cinzel text-lg sm:text-2xl uppercase tracking-[0.35em] text-[#E9D18F] drop-shadow-[0_0_15px_rgba(233,209,143,0.55)] text-center font-bold mb-8">
          MENU
        </p>

        {/* Liste des rubriques (menu-liste vs/1 avec revealUp sur chaque li) */}
        <ul className="menu-liste w-full max-w-xs space-y-4 list-none m-0 p-0 text-center">
          <li>
            <Link
              href="/conseil-juridique"
              onClick={handleClose}
              className="block w-full py-4 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.12em] text-[#E9D18F] bg-[#C5A059]/[0.05] border-[1.5px] border-[#C5A059]/50 rounded-[14px] shadow-[0_0_0_3px_rgba(197,160,89,0.07),inset_0_1px_0_rgba(233,209,143,0.12),0_4px_18px_rgba(0,0,0,0.45)] drop-shadow-[0_0_14px_rgba(197,160,89,0.5)] hover:bg-[#0F3823] hover:border-[#0F3823] hover:text-[#E9D18F] hover:shadow-[0_0_0_3px_rgba(15,56,35,0.35),0_0_22px_rgba(15,56,35,0.5),0_6px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
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
              className="block w-full py-4 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.12em] text-[#E9D18F] bg-[#C5A059]/[0.05] border-[1.5px] border-[#C5A059]/50 rounded-[14px] shadow-[0_0_0_3px_rgba(197,160,89,0.07),inset_0_1px_0_rgba(233,209,143,0.12),0_4px_18px_rgba(0,0,0,0.45)] drop-shadow-[0_0_14px_rgba(197,160,89,0.5)] hover:bg-[#0F3823] hover:border-[#0F3823] hover:text-[#E9D18F] hover:shadow-[0_0_0_3px_rgba(15,56,35,0.35),0_0_22px_rgba(15,56,35,0.5),0_6px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
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
              className="block w-full py-4 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.12em] text-[#E9D18F] bg-[#C5A059]/[0.05] border-[1.5px] border-[#C5A059]/50 rounded-[14px] shadow-[0_0_0_3px_rgba(197,160,89,0.07),inset_0_1px_0_rgba(233,209,143,0.12),0_4px_18px_rgba(0,0,0,0.45)] drop-shadow-[0_0_14px_rgba(197,160,89,0.5)] hover:bg-[#0F3823] hover:border-[#0F3823] hover:text-[#E9D18F] hover:shadow-[0_0_0_3px_rgba(15,56,35,0.35),0_0_22px_rgba(15,56,35,0.5),0_6px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
            >
              {lang === "fr" ? (
                <>Actualités &<br />événements</>
              ) : (
                <>News &<br />events</>
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/paiement"
              onClick={handleClose}
              className="block w-full py-4 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.12em] text-[#E9D18F] bg-[#C5A059]/[0.05] border-[1.5px] border-[#C5A059]/50 rounded-[14px] shadow-[0_0_0_3px_rgba(197,160,89,0.07),inset_0_1px_0_rgba(233,209,143,0.12),0_4px_18px_rgba(0,0,0,0.45)] drop-shadow-[0_0_14px_rgba(197,160,89,0.5)] hover:bg-[#0F3823] hover:border-[#0F3823] hover:text-[#E9D18F] hover:shadow-[0_0_0_3px_rgba(15,56,35,0.35),0_0_22px_rgba(15,56,35,0.5),0_6px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
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
