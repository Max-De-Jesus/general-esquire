"use client";

import React from "react";
import { FrenchFlagIcon, EnglishFlagIcon } from "./Icons";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      aria-label="Changer de langue / Change Language"
      title={lang === "fr" ? "Switch to English" : "Passer en Francais"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-cinzel text-xs tracking-widest border border-[#C5A059]/40 bg-[#131513]/80 hover:bg-[#C5A059]/20 text-[#E9D18F] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
    >
      {lang === "fr" ? (
        <>
          <FrenchFlagIcon className="w-4 h-3" />
          <span className="font-semibold text-[11px]">FR</span>
        </>
      ) : (
        <>
          <EnglishFlagIcon className="w-4 h-3" />
          <span className="font-semibold text-[11px]">EN</span>
        </>
      )}
    </button>
  );
}

export function FloatingControls() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        aria-label="Changer de langue"
        title={lang === "fr" ? "Switch to English" : "Passer en Francais"}
        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-[#C5A059] bg-[#131513]/90 text-[#E9D18F] shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer font-cinzel text-xs font-bold"
      >
        {lang === "fr" ? (
          <>
            <FrenchFlagIcon className="w-4 h-3" />
            <span>FR</span>
          </>
        ) : (
          <>
            <EnglishFlagIcon className="w-4 h-3" />
            <span>EN</span>
          </>
        )}
      </button>
    </div>
  );
}

export const FloatingThemeToggle = FloatingControls;
export default LanguageToggle;
