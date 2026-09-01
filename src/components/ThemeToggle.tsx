"use client";

import React from "react";
import { FrenchFlagIcon, EnglishFlagIcon } from "./Icons";
import { useLanguage } from "@/context/LanguageContext";
import { openReviewModal } from "./ReviewInactivityModal";

export function ReviewButton({
  className = "",
  showFullText = false,
}: {
  className?: string;
  showFullText?: boolean;
}) {
  const { lang, t } = useLanguage();

  return (
    <button
      onClick={() => openReviewModal()}
      type="button"
      aria-label={t("nav_review_full")}
      title={t("nav_review_full")}
      className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-cinzel text-[9px] sm:text-xs font-bold tracking-wide border border-[#C5A059]/60 bg-[#131513]/90 hover:bg-[#C5A059]/25 hover:border-[#E9D18F] text-[#E9D18F] shadow-[0_0_12px_rgba(197,160,89,0.25)] hover:shadow-[0_0_18px_rgba(233,209,143,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md whitespace-nowrap flex-shrink-0 ${className}`}
    >
      {/* Étoile dorée */}
      <svg
        className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E9D18F] fill-current animate-pulse flex-shrink-0"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      <span>
        {showFullText ? t("nav_review_full") : t("nav_review")}
      </span>
    </button>
  );
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      aria-label="Changer de langue / Change Language"
      title={lang === "fr" ? "Switch to English" : "Passer en Français"}
      className="flex items-center gap-1 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-cinzel text-[9px] sm:text-xs tracking-wider border border-[#C5A059]/40 bg-[#131513]/80 hover:bg-[#C5A059]/20 text-[#E9D18F] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md whitespace-nowrap flex-shrink-0"
    >
      {lang === "fr" ? (
        <>
          <EnglishFlagIcon className="w-3 h-2 sm:w-4 sm:h-3" />
          <span className="font-semibold text-[9px] sm:text-[11px]">EN</span>
        </>
      ) : (
        <>
          <FrenchFlagIcon className="w-3 h-2 sm:w-4 sm:h-3" />
          <span className="font-semibold text-[9px] sm:text-[11px]">FR</span>
        </>
      )}
    </button>
  );
}

export function FloatingControls() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2 sm:gap-2.5 pointer-events-auto">
      {/* Bouton Langue (Centré au-dessus) */}
      <button
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        aria-label="Changer de langue / Change language"
        title={lang === "fr" ? "Switch to English" : "Passer en Français"}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#C5A059] bg-[#131513]/95 text-[#E9D18F] shadow-[0_0_15px_rgba(197,160,89,0.35)] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer font-cinzel text-[10px] sm:text-[11px] font-bold"
      >
        {lang === "fr" ? (
          <>
            <EnglishFlagIcon className="w-3.5 h-2.5 sm:w-4 sm:h-3" />
            <span>EN</span>
          </>
        ) : (
          <>
            <FrenchFlagIcon className="w-3.5 h-2.5 sm:w-4 sm:h-3" />
            <span>FR</span>
          </>
        )}
      </button>

      {/* Bouton Donnez votre avis (En dessous) */}
      <ReviewButton className="py-2 sm:py-2.5 px-3 sm:px-4 shadow-[0_0_20px_rgba(197,160,89,0.35)]" />
    </div>
  );
}

export const FloatingThemeToggle = FloatingControls;
export default LanguageToggle;
