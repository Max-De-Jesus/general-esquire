"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FloatingWhatsAppButton() {
  const { lang } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = "33758264254";
  const defaultMessage =
    lang === "fr"
      ? "Bonjour General Esquire, je souhaite échanger avec le service client au sujet de vos services."
      : "Hello General Esquire, I would like to chat with customer service regarding your services.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip / Bulle d'information élégante */}
      <div
        className={`hidden sm:flex items-center gap-2.5 mr-3 px-3.5 py-2 rounded-2xl bg-[#131513]/95 border border-[#25D366]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 transform ${
          isHovered ? "opacity-100 translate-x-0" : "opacity-90 translate-x-1"
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
        </span>
        <div className="flex flex-col text-left">
          <span className="font-cinzel text-[11px] font-bold text-white tracking-wider flex items-center gap-1.5">
            {lang === "fr" ? "Service Client" : "Customer Support"}
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#25D366]/20 text-[#25D366] font-mono font-bold">
              WhatsApp
            </span>
          </span>
          <span className="font-cormorant text-xs text-[#cabfa6] leading-tight">
            {lang === "fr" ? "Discutez en direct avec nous" : "Chat live with our team"}
          </span>
        </div>
      </div>

      {/* Bouton Rond WhatsApp animé : SAUTE & CLIGNOTE */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={lang === "fr" ? "Discuter sur WhatsApp avec le service client" : "Chat on WhatsApp with customer service"}
        className="relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white border-2 border-[#E9D18F] shadow-[0_0_25px_rgba(37,211,102,0.6)] animate-whatsapp-bounce hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer"
      >
        {/* Anneau d'onde pulsante */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 animate-whatsapp-ring pointer-events-none" />

        {/* Badge "En ligne" clignotant sur le bouton */}
        <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#131513] shadow-md flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        </span>

        {/* Logo WhatsApp SVG officiel */}
        <svg
          className="w-8 h-8 sm:w-9 sm:h-9 fill-current text-white drop-shadow-md transform group-hover:rotate-12 transition-transform duration-300"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
