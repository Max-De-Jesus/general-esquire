"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="w-full bg-[#131513] border-t border-[#C5A059]/30 relative z-20 text-[#EDE4CF]">
      <div className="w-full px-6 py-12 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-8 md:gap-0 text-center md:text-left">
        {/* Colonne 1 : Identité */}
        <div className="flex-1 md:pr-10 md:text-left space-y-1">
          <p className="font-cinzel text-base md:text-lg tracking-[0.22em] uppercase text-[#C5A059] font-bold drop-shadow-[0_0_8px_rgba(197,160,89,0.25)]">
            General Esquire
          </p>
          <p className="font-cormorant italic text-sm text-[#EDE4CF]/90">
            {lang === "fr" ? "Exerçant à l'enseigne Chrysalides" : "Operating under the trade name Chrysalides"}
          </p>
          <p className="font-cormorant text-xs sm:text-sm text-[#EDE4CF]/80">
            {lang === "fr" ? "Société par actions simplifiées" : "Simplified joint-stock company"}
          </p>
          <p className="font-cormorant text-xs sm:text-sm text-[#EDE4CF]/80">
            {lang === "fr" ? "Immatriculée au RCS de Paris" : "Registered with the Paris RCS"}
          </p>
          <p className="font-cormorant text-xs sm:text-sm text-[#E9D18F] font-semibold pt-0.5">
            N° SIRET : 10494555500019
          </p>
        </div>

        {/* Séparateur vertical 1 (Desktop) */}
        <div className="hidden md:block w-[1px] bg-[#C5A059]/20 self-stretch my-1" aria-hidden="true" />

        {/* Colonne 2 : Nos Services & Réseaux Sociaux */}
        <div className="flex-1 md:px-10 md:text-center">
          <p className="font-cinzel text-[0.68rem] tracking-[0.24em] uppercase text-[#C5A059] mb-3.5 pb-2 border-b border-[#C5A059]/25 font-semibold">
            {lang === "fr" ? "Nos services" : "Our services"}
          </p>
          <div className="space-y-2 font-cormorant text-sm">
            <p>
              <Link href="/conseil-juridique" className="hover:text-[#E9D18F] transition-colors">
                {lang === "fr" ? "Conseil juridique" : "Legal Advisory"}
              </Link>
            </p>
            <p>
              <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">
                {lang === "fr" ? "Cocooning touristique" : "Touristic Cocooning"}
              </Link>
            </p>
          </div>

          {/* Trait de séparation horizontal */}
          <div className="w-16 h-[1px] bg-[#C5A059]/30 mx-auto my-3" aria-hidden="true" />

          {/* Titre Réseaux Sociaux & Liens TikTok / Instagram avec Logos */}
          <p className="font-cinzel text-[0.65rem] tracking-[0.2em] uppercase text-[#C5A059] mb-2 font-semibold">
            {lang === "fr" ? "Nos réseaux sociaux" : "Our social networks"}
          </p>
          <div className="space-y-2 font-cormorant text-sm flex flex-col items-center">
            <p>
              <a
                href="https://www.tiktok.com/@generalesquire?_r=1&_t=ZN-98wGsVGJd5y"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#EDE4CF]/90 hover:text-[#E9D18F] transition-colors duration-300 group"
                aria-label="TikTok General Esquire"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C5A059] group-hover:text-[#E9D18F] group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                <span>TikTok</span>
              </a>
            </p>
            <p>
              <a
                href="https://www.instagram.com/general.esquire?igsh=dDc1OGQxZDgza2R2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#EDE4CF]/90 hover:text-[#E9D18F] transition-colors duration-300 group"
                aria-label="Instagram General Esquire"
              >
                <svg className="w-3.5 h-3.5 fill-current text-[#C5A059] group-hover:text-[#E9D18F] group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
            </p>
          </div>
        </div>

        {/* Séparateur vertical 2 (Desktop) */}
        <div className="hidden md:block w-[1px] bg-[#C5A059]/20 self-stretch my-1" aria-hidden="true" />

        {/* Colonne 3 : Contact */}
        <div className="flex-1 md:pl-10 md:text-right">
          <p className="font-cinzel text-[0.68rem] tracking-[0.24em] uppercase text-[#C5A059] mb-3.5 pb-2 border-b border-[#C5A059]/25 font-semibold">
            Contact
          </p>
          <div className="space-y-2 font-cormorant text-sm">
            {/* 1. Adresse physique à droite */}
            <p className="text-[#E9D18F] font-semibold text-xs sm:text-sm pb-1 flex items-center justify-center md:justify-end gap-1.5">
              <svg className="w-4 h-4 text-[#C5A059] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>61 rue de Lyon, 75012 PARIS</span>
            </p>
            {/* 2. Téléphone fixe */}
            <p className="flex items-center justify-center md:justify-end gap-1.5">
              <a
                href="tel:+33159581725"
                className="inline-flex items-center text-[#C5A059] hover:text-[#25D366] transition-colors duration-300 group"
                aria-label="Téléphone Fixe"
              >
                <svg className="w-4 h-4 fill-current mr-1.5 group-hover:text-[#25D366] transition-colors" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.2 2.2z" />
                </svg>
                <span className="group-hover:text-[#25D366] transition-colors duration-300">+33 (0)1 59 58 17 25</span>
              </a>
            </p>
            {/* 3. WhatsApp */}
            <p className="flex items-center justify-center md:justify-end gap-1.5">
              <a
                href="https://wa.me/33758264254"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#25D366] hover:text-[#E9D18F] transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current mr-1.5" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="hover:text-[#E9D18F] transition-colors">+33 758 264 254</span>
              </a>
            </p>
            {/* 4. Email officiel */}
            <p>
              <a
                href="mailto:contact@generalesquire.com"
                className="hover:text-[#3B82F6] transition-colors duration-300 font-semibold text-[#EDE4CF]"
              >
                contact@generalesquire.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Baseline Copyright */}
      <div className="border-t border-[#C5A059]/15 text-center py-4 px-6 pb-20 sm:pb-6 overflow-x-auto">
        <p className="font-cinzel text-[0.6rem] sm:text-xs tracking-[0.18em] uppercase text-[#C5A059]/70 leading-relaxed whitespace-nowrap flex items-center justify-center gap-3">
          <span>&copy; 2026 General Esquire — {lang === "fr" ? "Tous droits réservés" : "All rights reserved"}</span>
        </p>
      </div>
    </footer>
  );
}
