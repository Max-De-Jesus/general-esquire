"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CourtIcon, DocumentTextIcon, ScaleIcon, SearchIcon } from "@/components/Icons";
import { useLanguage } from "@/context/LanguageContext";

// ─── Spinning Globe ───────────────────────────────────────────────────────────
function RotatingGlobe() {
  return (
    <div className="flex flex-col items-center gap-6 mb-6">
      {/* Globe wrapper */}
      <div
        className="relative rounded-full overflow-hidden shadow-[0_0_60px_rgba(197,160,89,0.35),inset_0_0_40px_rgba(0,0,0,0.5)]"
        style={{
          width: 260,
          height: 260,
          border: "3px solid rgba(197,160,89,0.5)",
        }}
      >
        {/* The scrolling world map image — simulates globe rotation */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: "200%",
            backgroundImage: "url('/images/Drapeaux-du-monde.jpg')",
            backgroundSize: "50% 100%",
            backgroundRepeat: "repeat-x",
            animation: "globeSpin 14s linear infinite",
          }}
        />
        {/* Sphere shading overlay */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12) 0%, transparent 55%), radial-gradient(circle at 75% 70%, rgba(0,0,0,0.5) 0%, transparent 60%)",
          }}
        />
        {/* Edge vignette */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.65)",
          }}
        />
      </div>

      {/* Axis stand */}
      <div className="w-0.5 h-6 bg-gradient-to-b from-[#C5A059] to-transparent" />
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

      {/* Keyframes injected */}
      <style>{`
        @keyframes globeSpin {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Scenario Card ────────────────────────────────────────────────────────────
function ScenarioCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="p-6 rounded-2xl bg-[#0F3823]/50 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823]/80 transition-all duration-300 shadow-lg flex gap-4 items-start group">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <p className="font-cormorant text-base sm:text-lg text-[#EDE4CF] leading-snug font-semibold group-hover:text-white transition-colors">
        {text}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InstitutionsPubliquesPage() {
  const { lang } = useLanguage();

  const tx = {
    breadcrumb_home: lang === "fr" ? "Accueil" : "Home",
    breadcrumb_legal: lang === "fr" ? "Conseil Juridique" : "Legal Advisory",
    breadcrumb_page: lang === "fr" ? "Institutions Publiques" : "Public Institutions",
    hero_tag: lang === "fr" ? "Espace Conseil Juridique" : "Legal Advisory Desk",
    hero_title: lang === "fr" ? "Vous êtes une Institution Publique" : "You Are a Public Institution",
    hero_btn: lang === "fr" ? "Découvrir notre méthode & nos tarifs →" : "Discover Our Method & Rates →",
    intro_p1: lang === "fr"
      ? "Nous offrons un service de consulting juridique en direction des personnes morales de droit public international, de nationalité étrangère ou basées à l'étranger, dont les activités sont telles qu'elles ont besoin d'une veille juridique ou d'un accompagnement dans l'optimisation de leur appréhension du droit français."
      : "We offer international legal consulting services for public entities, foreign bodies, or international institutions that require legal monitoring or guidance in mastering French law.",
    intro_p2: lang === "fr"
      ? "Qu'il s'agisse de la circulation des personnes et des biens, de problématiques liées au développement, droit international de l'environnement, droits fondamentaux, protection de l'enfance, défis économiques du millénaire, questions du genre, exécution de décisions internationales, sécurité numérique ou financière, etc., nous pouvons rédiger pour vous et vous accompagner dans vos prises de décision."
      : "Whether concerning cross-border movement of people and goods, sustainable development, international environmental law, human rights, child protection, economic challenges, gender equality, execution of international decisions, or cybersecurity, we write and guide your decision-making.",
    scenarios_tag: lang === "fr" ? "Ces situations vous concernent-elles ?" : "Do Any of These Apply to You?",
    sc1: lang === "fr"
      ? "Vous êtes décideur au sein du département juridique d'un ministère dans un pays africain francophone par exemple ?"
      : "Are you a decision-maker within the legal department of a ministry in a French-speaking African country, for example?",
    sc2: lang === "fr"
      ? "Vous devez préparer des négociations ou signer un contrat en droit français, et il vous faut préalablement des conseils dans ce système juridique et procédural auquel vous n'êtes pas familiarisé ?"
      : "Do you need to prepare negotiations or sign a contract governed by French law, requiring specialized advice in a legal system you are unfamiliar with?",
    sc3: lang === "fr"
      ? "Vous souhaitez bénéficier de l'avis éclairé de juristes de haute qualité, tout en craignant d'exposer des honoraires exorbitants auprès d'un avocat ?"
      : "Do you seek top-tier legal advice while avoiding exorbitant law firm billable rates?",
    sc4: lang === "fr"
      ? "Vous avez besoin d'une plume sûre pour rédiger pour vous une convention, un accord, un discours, un protocole quelconque impliquant une solide connaissance du droit français ?"
      : "Do you need an authoritative legal writer for conventions, agreements, speeches, or protocols requiring solid expertise in French law?",
    photo1: lang === "fr" ? "Relations Internationales" : "International Relations",
    photo2: lang === "fr" ? "Conseil Stratégique" : "Strategic Advisory",
    method_title: lang === "fr" ? "Notre Méthode de Travail" : "Our Working Method",
    method_p1: lang === "fr"
      ? "Notre méthode de travail est très simple : vous nous adressez votre demande par écrit, accompagnée de toutes les pièces nécessaires à son appréhension optimale ; et nous convenons d'un rendez-vous par visioconférence pour définir ensemble les modalités pratiques et financières de l'exécution de notre mission."
      : "Our working method is straightforward: send us your written request with all supporting documents, and we will schedule a video consultation to define the scope and financial terms.",
    method_p2: lang === "fr"
      ? "Il n'y a pas de formule d'abonnement pour les institutions publiques ; et nous ne pouvons exécuter notre mission sans une provision au moins équivalente aux trois quarts du devis que vous auriez préalablement validé."
      : "No subscription plans apply to public institutions; missions commence upon receipt of an advance payment equal to at least 75% of the approved quote.",
    method_p3: lang === "fr"
      ? "Un projet d'écritures vous sera soumis, et sujet à amendement s'il y a lieu, dans un délai qui aura lui aussi été défini contractuellement."
      : "A draft version of the legal documentation will be submitted for your review within the contractually agreed timeframe.",
    method_p4: lang === "fr"
      ? "Notre équipe se tiendra à votre entière disposition pour autant de conférences téléphoniques ou visiophoniques que vous jugerez nécessaires."
      : "Our team remains at your full disposal for as many conference calls or video meetings as required.",
    method_p5: lang === "fr"
      ? "Le solde du marché devra avoir été réglé avant l'envoi de la version finale de nos écritures, qui deviendront dès lors votre exclusive propriété."
      : "The remaining balance must be settled prior to delivering the final documentation, which becomes your exclusive property.",
    method_warn: lang === "fr"
      ? "⚠ Il n'est pas prévu pour les institutions publiques la possibilité que nous acceptions une mission dans des conditions d'urgence (délai inférieur ou égal à 48 heures)."
      : "⚠ Please note: Urgent turnarounds (48 hours or less) are not available for public institutions.",
    rates_tag: lang === "fr" ? "Clarté & Transparence" : "Clarity & Transparency",
    rates_title: lang === "fr" ? "Nos Tarifs" : "Our Pricing",
    rate1_title: lang === "fr" ? "Forfait Rédaction" : "Drafting Package",
    rate1_price: "3 500 €",
    rate1_tax: lang === "fr" ? " TTC" : " incl. tax",
    rate1_f1: lang === "fr" ? "Dans la limite de 20 pages rédigées" : "Up to 20 written pages",
    rate1_f2: lang === "fr" ? "Lecture/audition des documents : gratuite" : "Document review/reading: free",
    rate1_f3: lang === "fr" ? "Version finale = votre exclusive propriété" : "Final version = your exclusive property",
    rate2_title: lang === "fr" ? "Pages Supplémentaires" : "Additional Pages",
    rate2_price: "1 000 €",
    rate2_unit: lang === "fr" ? " / 10 pages" : " / 10 pages",
    rate2_f1: lang === "fr" ? "Au-delà des 20 premières pages" : "Beyond the first 20 pages",
    rate2_f2: lang === "fr" ? "Facturation par tranche de 10 pages" : "Billed in 10-page increments",
    rate3_title: lang === "fr" ? "Consultation Orale" : "Oral Advisory",
    rate3_price: "500 €",
    rate3_unit: lang === "fr" ? " / heure" : " / hour",
    rate3_f1: lang === "fr" ? "Consultation non écrite" : "Oral consultation (non-written)",
    rate3_f2: lang === "fr" ? "Environ une heure de conversation" : "Approximately 1 hour session",
    rate3_f3: lang === "fr" ? "Sans engagement de rédaction" : "No drafting obligation",
    cta_title: lang === "fr" ? "Engageons la conversation" : "Let's Start a Conversation",
    cta_sub: lang === "fr"
      ? "Adressez-nous votre demande par écrit — nous vous proposons un rendez-vous par visioconférence."
      : "Send us your request in writing — we will arrange a video consultation.",
    cta_btn: lang === "fr" ? "Nous Contacter →" : "Contact Us →",
    back: lang === "fr" ? "← RETOUR À L'ACCUEIL" : "← BACK TO HOME",
  };

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] relative">
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (vs/1 style exact) ──────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden mb-8">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerinstitu.png"
            alt="Bannière Institutions Publiques — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105"
          />
        </div>
      </header>

      {/* Background filigrane */}
      <div className="absolute inset-0 -z-10 opacity-[0.07] pointer-events-none">
        <Image src="/images/background.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12 md:pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest flex-wrap">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{tx.breadcrumb_home}</Link>
          <span>/</span>
          <Link href="/conseil-juridique" className="hover:text-[#E9D18F] transition-colors">{tx.breadcrumb_legal}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{tx.breadcrumb_page}</span>
        </div>

        {/* ── HERO ── */}
        <div className="text-center mb-14">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md">
            {tx.hero_tag}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-5 mb-4">
            {tx.hero_title}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>

          {/* ── ROTATING GLOBE ── */}
          <div className="flex justify-center">
            <RotatingGlobe />
          </div>

          {/* Link below globe */}
          <div className="mt-8">
            <Link
              href="#methode"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-105"
            >
              {tx.hero_btn}
            </Link>
          </div>
        </div>

        {/* ── INTRO ── */}
        <section className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed">
          <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
            {tx.intro_p1}
          </p>
          <p className="mt-5">
            {tx.intro_p2}
          </p>
        </section>

        {/* ── 4 SCENARIO CARDS ── */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase">
              {tx.scenarios_tag}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ScenarioCard
              icon={<CourtIcon className="w-7 h-7 text-[#C5A059] flex-shrink-0" />}
              text={tx.sc1}
            />
            <ScenarioCard
              icon={<DocumentTextIcon className="w-7 h-7 text-[#C5A059] flex-shrink-0" />}
              text={tx.sc2}
            />
            <ScenarioCard
              icon={<ScaleIcon className="w-7 h-7 text-[#C5A059] flex-shrink-0" />}
              text={tx.sc3}
            />
            <ScenarioCard
              icon={<DocumentTextIcon className="w-7 h-7 text-[#C5A059] flex-shrink-0" />}
              text={tx.sc4}
            />
          </div>
        </section>

        {/* ── Photo Strip ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {[
            { src: "/images/Embrassade.jpg", label: tx.photo1 },
            { src: "/images/Board image.jpg", label: tx.photo2 },
          ].map((item, i) => (
            <div key={i} className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image src={item.src} alt={item.label} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <span className="font-cinzel text-xs text-[#E9D18F] tracking-widest uppercase">◆ {item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── METHODE ── */}
        <section id="methode" className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12">
          <div className="flex items-center gap-3 mb-7">
            <SearchIcon className="w-7 h-7 text-[#C5A059]" />
            <h2 className="font-cinzel text-2xl text-[#E9D18F] font-bold">{tx.method_title}</h2>
          </div>
          <div className="space-y-5 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed">
            <p>{tx.method_p1}</p>
            <p>{tx.method_p2}</p>
            <p>{tx.method_p3}</p>
            <p>{tx.method_p4}</p>
            <p>{tx.method_p5}</p>
            <div className="p-5 rounded-xl bg-[#0F3823]/50 border border-[#C5A059]/30 text-[#EDE4CF]/80 text-base">
              {tx.method_warn}
            </div>
          </div>
        </section>

        {/* ── TARIFS ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">{tx.rates_tag}</span>
            <h2 className="font-cinzel text-3xl text-[#E9D18F]">{tx.rates_title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rédaction */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#0F3823] to-[#131513] border-2 border-[#C5A059] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-[#C5A059] text-black font-cinzel text-[10px] tracking-widest uppercase rounded-bl-2xl">Principal</div>
              <h3 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest mb-1">{tx.rate1_title}</h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                {tx.rate1_price}<span className="text-sm font-normal text-[#cabfa6] font-cormorant">{tx.rate1_tax}</span>
              </p>
              <ul className="space-y-2 font-cormorant text-base text-[#EDE4CF]/80">
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate1_f1}</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate1_f2}</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate1_f3}</li>
              </ul>
            </div>

            {/* Pages suppl. */}
            <div className="p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl">
              <h3 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest mb-1">{tx.rate2_title}</h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                {tx.rate2_price}<span className="text-sm font-normal text-[#cabfa6] font-cormorant">{tx.rate2_unit}</span>
              </p>
              <ul className="space-y-2 font-cormorant text-base text-[#EDE4CF]/80">
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate2_f1}</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate2_f2}</li>
              </ul>
            </div>

            {/* Consultation */}
            <div className="p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl">
              <h3 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest mb-1">{tx.rate3_title}</h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                {tx.rate3_price}<span className="text-sm font-normal text-[#cabfa6] font-cormorant">{tx.rate3_unit}</span>
              </p>
              <ul className="space-y-2 font-cormorant text-base text-[#EDE4CF]/80">
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate3_f1}</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate3_f2}</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>{tx.rate3_f3}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-[#0F3823]/70 via-[#131513] to-[#0F3823]/70 border border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">
            {tx.cta_title}
          </h3>
          <p className="font-cormorant text-lg text-[#cabfa6] mb-6">
            {tx.cta_sub}
          </p>
          <a
            href="mailto:contact@generalesquire.com"
            className="inline-block px-12 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:scale-105"
          >
            {tx.cta_btn}
          </a>
        </div>

        {/* Back */}
        <div className="text-center mt-12">
          <Link href="/" className="font-cinzel text-xs tracking-widest text-[#C5A059] hover:text-[#E9D18F] transition-colors inline-flex items-center gap-2">
            {tx.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
