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
  const [hoveredBtn, setHoveredBtn] = useState<number | null>(0); // Default button 0 active like screenshot

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
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* ===== OVERLAY SOMBRE GAUCHE (ECRAN DE FOND ASSOMBRI) ===== */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
      ></div>

      {/* ===== PANNEAU GLISSANT À DROITE (RIGHT SLIDE-OVER DRAWER) ===== */}
      <nav
        className="relative w-full max-w-lg sm:max-w-md h-full px-6 sm:px-10 py-10 z-10 flex flex-col items-center justify-center overflow-y-auto no-scrollbar shadow-[-12px_0_60px_rgba(0,0,0,0.9)] border-l border-[#C5A059]/30 transform transition-transform duration-500 animate-slide-in-right"
        style={{
          background:
            "radial-gradient(ellipse 85% 55% at 50% 42%, rgba(197,160,89,0.14) 0%, transparent 65%), radial-gradient(ellipse 60% 30% at 80% 85%, rgba(15,56,35,0.3) 0%, transparent 60%), linear-gradient(170deg, #04120a 0%, #082618 45%, #05160d 100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu des services"
      >
        {/* Bouton de Fermeture Original (Cercle Doré en haut à droite) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 rounded-full bg-transparent border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/20 hover:border-[#E9D18F] hover:rotate-90 flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group"
          aria-label="Fermer le menu"
        >
          <span className="font-cinzel text-xl">&times;</span>
        </button>

        {/* Logo Cheval Ailé d'Origine */}
        <div className="flex flex-col items-center mb-8 sm:mb-10">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-4">
            <Image
              src="/images/cheval-aile.png"
              alt="Cheval ailé General Esquire — Chrysalides"
              fill
              priority
              className="object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]"
            />
          </div>
          <p className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#C5A059] drop-shadow-[0_0_18px_rgba(197,160,89,0.5)] font-semibold">
            {lang === "fr" ? "NOS SERVICES" : "OUR SERVICES"}
          </p>
        </div>

        {/* ===== LES 2 BOUTONS CONFORMES EXATEMENT À LA CAPTURE D'ÉCRAN ===== */}
        <div className="w-full max-w-xs space-y-5">
          {/* 1. CONSEIL JURIDIQUE (Plein Fond Doré Champagne quand sélectionné) */}
          <Link
            href="/conseil-juridique"
            onClick={onClose}
            onMouseEnter={() => setHoveredBtn(0)}
            onMouseLeave={() => setHoveredBtn(0)}
            className={`block w-full py-5 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.14em] text-center rounded-[16px] border-[1.5px] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-snug font-semibold ${
              hoveredBtn === 0
                ? "bg-[#E8D49E] border-[#E8D49E] text-[#1c211c] shadow-[0_0_30px_rgba(232,212,158,0.45)]"
                : "bg-[#091a10]/60 border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#E8D49E] hover:text-[#1c211c]"
            }`}
          >
            {lang === "fr" ? (
              <>CONSEIL<br />JURIDIQUE</>
            ) : (
              <>LEGAL<br />ADVISORY</>
            )}
          </Link>

          {/* 2. COCOONING TOURISTIQUE */}
          <Link
            href="/cocooning-touristique"
            onClick={onClose}
            onMouseEnter={() => setHoveredBtn(1)}
            onMouseLeave={() => setHoveredBtn(0)}
            className={`block w-full py-5 px-6 font-cinzel text-base sm:text-lg uppercase tracking-[0.14em] text-center rounded-[16px] border-[1.5px] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-snug font-semibold ${
              hoveredBtn === 1
                ? "bg-[#E8D49E] border-[#E8D49E] text-[#1c211c] shadow-[0_0_30px_rgba(232,212,158,0.45)]"
                : "bg-[#091a10]/60 border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#E8D49E] hover:text-[#1c211c]"
            }`}
          >
            {lang === "fr" ? (
              <>COCOONING<br />TOURISTIQUE</>
            ) : (
              <>TOURIST<br />COCOONING</>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}
