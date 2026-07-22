"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* ===== OVERLAY SOMBRE GAUCHE (menu-overlay) ===== */}
      <div
        className="fixed inset-0 z-[90] bg-[#080a09]/75 backdrop-blur-sm transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
      />

      {/* ===== PANNEAU DE MENU (menu-panel vs/1/css/style.css) ===== */}
      <nav
        className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg z-[100] flex flex-col justify-center items-center px-6 sm:px-12 py-10 overflow-y-auto no-scrollbar shadow-[-12px_0_60px_rgba(0,0,0,0.85)] border-l border-[#C5A059]/20 transform transition-transform duration-500 animate-slide-in-right"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 42%, rgba(197,160,89,.16) 0%, transparent 65%), radial-gradient(ellipse 60% 30% at 80% 85%, rgba(15,56,35,.22) 0%, transparent 60%), linear-gradient(170deg, #05060a 0%, #0a0b09 45%, #060808 100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu des services"
      >
        {/* Bouton fermer (menu-panel__close) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-transparent border border-[#C5A059]/45 text-[#C5A059] hover:bg-[#C5A059]/12 hover:shadow-[0_0_14px_rgba(197,160,89,0.35)] hover:rotate-90 flex items-center justify-center transition-all duration-300 cursor-pointer"
          aria-label="Fermer le menu"
        >
          <span className="font-cinzel text-2xl leading-none">&times;</span>
        </button>

        {/* Logo Cheval Ailé (menu-panel__logo) */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-3">
            <Image
              src="/images/cheval-aile.png"
              alt="Cheval ailé General Esquire"
              fill
              priority
              className="object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* Titre (menu-panel__titre) */}
          <p className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#C5A059] drop-shadow-[0_0_18px_rgba(197,160,89,0.45)] text-center font-semibold">
            {lang === "fr" ? "NOS SERVICES" : "OUR SERVICES"}
          </p>
        </div>

        {/* Liste des rubriques (menu-liste vs/1) */}
        <ul className="w-full max-w-xs space-y-4 list-none m-0 p-0 text-center">
          <li>
            <Link
              href="/conseil-juridique"
              onClick={onClose}
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
              onClick={onClose}
              className="block w-full py-4 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.12em] text-[#E9D18F] bg-[#C5A059]/[0.05] border-[1.5px] border-[#C5A059]/50 rounded-[14px] shadow-[0_0_0_3px_rgba(197,160,89,0.07),inset_0_1px_0_rgba(233,209,143,0.12),0_4px_18px_rgba(0,0,0,0.45)] drop-shadow-[0_0_14px_rgba(197,160,89,0.5)] hover:bg-[#0F3823] hover:border-[#0F3823] hover:text-[#E9D18F] hover:shadow-[0_0_0_3px_rgba(15,56,35,0.35),0_0_22px_rgba(15,56,35,0.5),0_6px_24px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-350 leading-snug"
            >
              {lang === "fr" ? (
                <>Cocooning<br />touristique</>
              ) : (
                <>Touristic<br />cocooning</>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
