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
        {/* Background image overlay (Fond guerrier / filigrane clair et bien visible) */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-55">
          <Image
            src="/images/background.jpeg"
            alt="Fond Filigrane Guerrier"
            fill
            className="object-cover object-[50%_35%] filter saturate-105 brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1A]/50 via-transparent to-[#131513]/90"></div>
        </div>

        <div className="max-w-[760px] mx-auto text-left">
          {/* Main Title */}
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold uppercase tracking-wide text-[#E9D18F] text-center mb-3 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {tx.welcome_title.split("General Esquire")[0]}
            <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059]">
              General Esquire
            </span>
          </h1>

          {/* Golden Line Divider */}
          <div className="w-[80px] h-[1px] bg-[#C5A059] mx-auto mb-8 opacity-80"></div>

          {/* Lead intro paragraph */}
          <p className="font-cormorant font-semibold text-xl sm:text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-[1.8] mb-6">
            {tx.lead}
          </p>

          {/* ─── FENÊTRE DE DÉFILEMENT VERTICAL EN BOUCLE (VS/1 STYLE) ─── */}
          <div className="texte-defilant-container shadow-2xl">
            <div className="texte-defilant-piste space-y-6 font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.95]">
              <div className="space-y-4 my-2">
                <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]">
                  {tx.bullet1}
                </p>
                <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]">
                  {tx.bullet2}
                </p>
              </div>

              <p className="text-[#EDE4CF]">
                {tx.chrysalides_text}
              </p>

              <p className="text-[#EDE4CF]">
                {tx.esquire_text}
              </p>

              {/* Répétition pour défilement fluide sans interruption */}
              <div className="pt-8 border-t border-[#C5A059]/30 space-y-4">
                <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]">
                  {tx.bullet1}
                </p>
                <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]">
                  {tx.bullet2}
                </p>
                <p className="text-[#EDE4CF]">
                  {tx.chrysalides_text}
                </p>
                <p className="text-[#EDE4CF]">
                  {tx.esquire_text}
                </p>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="pt-6 text-center space-y-2">
            <p className="font-cormorant italic text-xl sm:text-2xl text-[#EDE4CF] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {tx.signature_welcome}
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {tx.signature_hands}
            </p>
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
          <div className="space-y-3">
            <h3 className="font-cinzel text-lg text-[#E9D18F] uppercase tracking-wider font-bold">
              General Esquire
            </h3>
            <p className="text-sm leading-relaxed opacity-90">
              {lang === "fr"
                ? "Société par Actions Simplifiée à l'enseigne « Chrysalides ». Rigueur juridique et accompagnement d'exception."
                : "Simplified Joint-Stock Company under the trade name “Chrysalides”. Legal rigor and exceptional guidance."}
            </p>
          </div>

          {/* Direct Navigation */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-md text-[#E9D18F] uppercase tracking-wider font-semibold">
              {lang === "fr" ? "Navigation" : "Navigation"}
            </h4>
            <div className="flex flex-col space-y-1.5 text-sm">
              <Link href="/conseil-juridique" className="hover:text-[#E9D18F] transition-colors">
                {lang === "fr" ? "Conseil Juridique" : "Legal Consulting"}
              </Link>
              <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">
                {lang === "fr" ? "Cocooning Touristique" : "Touristic Cocooning"}
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="hover:text-[#E9D18F] text-left transition-colors font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mt-2"
              >
                {lang === "fr" ? "★ Tous nos services" : "★ All services"}
              </button>
            </div>
          </div>

          {/* Legal mentions */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-md text-[#E9D18F] uppercase tracking-wider font-semibold">
              {lang === "fr" ? "Engagements" : "Commitments"}
            </h4>
            <p className="text-xs leading-relaxed opacity-85">
              {lang === "fr"
                ? "© General Esquire — Tous droits réservés. Vos données sont protégées par le secret professionnel et le RGPD."
                : "© General Esquire — All rights reserved. Data protected by professional secrecy and GDPR."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
