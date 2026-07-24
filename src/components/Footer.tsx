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
        </div>

        {/* Séparateur vertical 1 (Desktop) */}
        <div className="hidden md:block w-[1px] bg-[#C5A059]/20 self-stretch my-1" aria-hidden="true" />

        {/* Colonne 2 : Nos Services */}
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
            <p>
              <Link href="/actualites" className="hover:text-[#E9D18F] transition-colors">
                {lang === "fr" ? "Actualités & événements" : "News & Events"}
              </Link>
            </p>
            <p>
              <Link href="/paiement" className="hover:text-[#E9D18F] transition-colors">
                {lang === "fr" ? "Règlement en ligne" : "Online Payment"}
              </Link>
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
          <div className="space-y-1.5 font-cormorant text-sm">
            <p className="flex items-center justify-center md:justify-end gap-1.5">
              <a
                href="tel:+33159581725"
                className="inline-flex items-center text-[#C5A059] hover:text-[#E9D18F] transition-colors"
                aria-label="Téléphone Fixe"
              >
                <svg className="w-4 h-4 fill-current mr-1.5" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.2 2.2z" />
                </svg>
                <span className="hover:text-[#E9D18F] transition-colors">+33 159 581 725</span>
              </a>
            </p>
            <p>
              <a
                href="mailto:contact@generalesquire.com"
                className="hover:text-[#E9D18F] transition-colors"
              >
                contact@generalesquire.com
              </a>
            </p>
            <p className="flex items-center justify-center md:justify-end gap-2 pt-1">
              <a
                href="https://wa.me/33758264254"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#C5A059] hover:text-[#E9D18F] transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current mr-1.5" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="tel:+33758264254" className="hover:text-[#E9D18F] transition-colors">
                +33 758 264 254 (WhatsApp)
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Baseline Copyright */}
      <div className="border-t border-[#C5A059]/15 text-center py-4 px-6 pb-20 sm:pb-6">
        <p className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-[#C5A059]/70 leading-relaxed">
          &copy; 2026 General Esquire — {lang === "fr" ? "Tous droits réservés" : "All rights reserved"}
        </p>
      </div>
    </footer>
  );
}
