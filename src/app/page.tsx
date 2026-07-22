"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ServicesModal from "@/components/ServicesModal";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { lang } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const tx = {
    welcome_title:
      lang === "fr" ? "Bienvenue chez General Esquire" : "Welcome to General Esquire",
    lead:
      lang === "fr"
        ? "La société General Esquire est née de la volonté de son président, avocat de formation en France et au Canada, de concilier au sein d'une seule et même structure professionnelle, deux qualités fondamentales qui lui sont propres :"
        : "General Esquire was born from the vision of its president, trained as a lawyer in France and Canada, to unite two fundamental qualities within a single professional firm:",
    bullet1:
      lang === "fr"
        ? "d'une part, sa compétence aiguisée par plusieurs années d'expérience, de juriste rigoureux totalement dévoué à la défense des intérêts de ses clients ;"
        : "on the one hand, a sharp competence forged through years of experience as a rigorous legal expert dedicated to defending clients' best interests;",
    bullet2:
      lang === "fr"
        ? "d'autre part, sa bienveillance d'avocat humaniste au service de leur bien-être temporaire, à raison de la rudesse émotionnelle consubstantielle au combat judiciaire."
        : "on the other hand, the compassionate care of a humanist lawyer devoted to their emotional well-being through the hardships of legal battles.",
    chrysalides_text:
      lang === "fr"
        ? "Notre société, par actions simplifiées, exerce également à l'enseigne « Chrysalides », ce qui n'est pas sans évoquer l'étape essentielle du cheminement de la nymphe de lépidoptère, qui devrait transformer en un flamboyant papillon, la chenille du moment qu'elle est, empêtrée dans les difficultés de son existence."
        : "Our simplified joint-stock company also operates under the trade name “Chrysalides”, evoking the essential metamorphosis of a caterpillar transforming into a radiant butterfly freed from life's struggles.",
    esquire_text:
      lang === "fr"
        ? "Titre porté par les avocats dans certaines juridictions de Common Law, en Grande-Bretagne et aux États-Unis d'Amérique, le « Esquire » ou écuyer, ici « General » car il traite tous types de problèmes juridiques, offre l'image du serviteur aliéné corps et âme au triomphe de la cause de son souverain, celui ou celle dont il reçoit mandat."
        : "A title borne by attorneys in Common Law jurisdictions, “Esquire” (squire), combined here with “General” as it addresses all legal matters, embodies a servant devoted body and soul to the triumph of their sovereign's cause.",
    signature_welcome:
      lang === "fr"
        ? "Nous sommes donc heureux de vous accueillir sur ce site, et c'est peu de dire que :"
        : "We are delighted to welcome you to our website, and it is no exaggeration to say:",
    signature_hands:
      lang === "fr" ? "« Vous êtes entre de bonnes mains »." : "“You are in good hands.”",
    click_blason:
      lang === "fr"
        ? "Cliquez sur le blason pour découvrir les rubriques →"
        : "Click the crest to explore all sections →",
  };

  return (
    <div className="min-h-screen bg-[#1A1C1A] text-[#EDE4CF] flex flex-col justify-between overflow-x-hidden">
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (WITH KEN BURNS ANIMATION) ───────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/Embrassades001.png"
            alt="Trois femmes s'embrassant chaleureusement lors d'une rencontre"
            fill
            priority
            className="object-cover object-[center_32%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH) ────────────────────── */}
      <div className="w-full bg-[#0d0e0d] border-y border-[#C5A059]/30 py-3 overflow-hidden shadow-inner z-20">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 font-cinzel text-xs sm:text-sm text-[#C5A059] tracking-[0.26em] uppercase px-6"
            >
              <span className="drop-shadow-[0_0_12px_rgba(197,160,89,0.35)]">
                General Esquire
              </span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Excellence</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Compétence</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Chrysalides</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Bienveillance</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Résilience</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. MAIN ACCUEIL (MESSAGE DE BIENVENUE SUR FOND FILIGRANE) ─── */}
      <main className="relative isolation-auto py-10 sm:py-16 px-4 sm:px-8 flex-grow">
        {/* Background image overlay (Fond guerrier / filigrane) */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-30">
          <Image
            src="/images/background.jpeg"
            alt="Fond Filigrane"
            fill
            className="object-cover object-[50%_35%] filter saturate-90 brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1A]/60 via-[#0F3823]/30 to-[#131513]/95"></div>
        </div>

        <div className="max-w-[760px] mx-auto text-left">
          {/* Main Title */}
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold uppercase tracking-wide text-[#E9D18F] text-center mb-3 drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]">
            {tx.welcome_title.split("General Esquire")[0]}
            <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059]">
              General Esquire
            </span>
          </h1>

          {/* Golden Line Divider */}
          <div className="w-[60px] h-[1px] bg-[#C5A059] mx-auto mb-8 opacity-75"></div>

          {/* Bienvenue Text Content */}
          <div className="space-y-6 font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.95] font-light">
            <p className="font-semibold text-xl sm:text-2xl text-white">
              {tx.lead}
            </p>

            <div className="space-y-4 my-6">
              <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]/95">
                {tx.bullet1}
              </p>
              <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]/95">
                {tx.bullet2}
              </p>
            </div>

            <p className="text-[#EDE4CF]/90">
              {tx.chrysalides_text}
            </p>

            <p className="text-[#EDE4CF]/90">
              {tx.esquire_text}
            </p>

            {/* Signature */}
            <div className="pt-6 text-center space-y-2">
              <p className="italic text-xl sm:text-2xl text-[#EDE4CF]">
                {tx.signature_welcome}
              </p>
              <p className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold tracking-wider">
                {tx.signature_hands}
              </p>
            </div>
          </div>

          {/* ─── 4. BLASON LOGO ZONE (SEUL BOUTON DE MENU) ───────────── */}
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="group flex flex-col items-center cursor-pointer focus:outline-none"
              aria-label="Ouvrir le menu des services"
            >
              <div className="relative p-3 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src="/images/logo.png"
                  alt="Blason General Esquire — Chrysalides"
                  width={240}
                  height={240}
                  className="w-44 h-44 sm:w-60 sm:h-60 object-contain animate-pulse-glow"
                />
              </div>

              <span className="block mt-4 font-cinzel text-xs tracking-[0.2em] uppercase text-[#C5A059] group-hover:text-[#E9D18F] transition-colors">
                {tx.click_blason}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* ─── 5. SLIDE-OVER SERVICES MENU ─────────────────────────────────── */}
      <ServicesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ─── 6. FOOTER ──────────────────────────────────────────────────── */}
      <footer className="border-t border-[#C5A059]/25 bg-[#131513] py-10 px-6 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left font-cormorant text-base text-[#cabfa6]">
          {/* Identity */}
          <div className="space-y-1">
            <h3 className="font-cinzel text-lg text-[#C5A059] font-bold tracking-wider">
              GENERAL ESQUIRE
            </h3>
            <p className="italic text-[#E9D18F]">Exerçant à l'enseigne Chrysalides</p>
            <p>Société par actions simplifiées</p>
            <p>Immatriculée au RCS de Paris</p>
          </div>

          {/* Services */}
          <div className="space-y-1">
            <h4 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest font-semibold mb-2">
              {lang === "fr" ? "Nos services" : "Our Services"}
            </h4>
            <p>
              <Link href="/conseil-juridique" className="hover:text-[#E9D18F] transition-colors">
                Conseil juridique
              </Link>
            </p>
            <p>
              <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">
                Cocooning touristique
              </Link>
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-1">
            <h4 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest font-semibold mb-2">
              Contact
            </h4>
            <p>
              <a
                href="https://www.generalesquire.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E9D18F] transition-colors"
              >
                www.generalesquire.com
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
            <p className="flex items-center justify-center md:justify-start gap-2 pt-1">
              <a
                href="https://wa.me/33758264254"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E9D18F] transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>+33 758 264 254</span>
              </a>
            </p>
          </div>
        </div>

        <div className="text-center font-cinzel text-xs text-[#C5A059]/60 mt-8 pt-4 border-t border-[#C5A059]/10">
          <p>© 2026 General Esquire — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
