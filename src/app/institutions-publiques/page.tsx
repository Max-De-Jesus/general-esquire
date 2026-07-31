"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CourtIcon, DocumentTextIcon, ScaleIcon, SearchIcon } from "@/components/Icons";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

// ─── Spinning Globe ───────────────────────────────────────────────────────────
function RotatingGlobe() {
  return (
    <div className="flex flex-col items-center gap-6 mb-6">
      {/* Globe wrapper */}
      <div
        className="relative rounded-full overflow-hidden shadow-[0_0_60px_rgba(197,160,89,0.4),inset_0_0_40px_rgba(0,0,0,0.5)] bg-[#131513]"
        style={{
          width: 260,
          height: 260,
          border: "3px solid rgba(197,160,89,0.6)",
        }}
      >
        <video
          src="/images/globedeo.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-[1.32] rounded-full filter brightness-105 contrast-110"
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
          className="absolute inset-0 rounded-full pointer-events-none"
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
    <div className="p-6 rounded-2xl bg-[#0F3823]/85 backdrop-blur-md border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823]/95 transition-all duration-300 shadow-xl flex gap-4 items-start group">
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
    <div className="min-h-screen text-[#EDE4CF] relative">
      {/* Background backinstitu.png fixe et parfaitement visible */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src="/images/backinstitu.png"
          alt="Arrière-plan Institutions — General Esquire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60 filter brightness-95 contrast-105"
        />
        {/* Voile sombre léger pour garantir une lisibilité optimale tout en laissant voir le décor */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />
      </div>

      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (vs/1 style exact) ──────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerinstitu.png"
            alt="Bannière Institutions Publiques — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <TickerBanner className="mb-8" />

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
            { src: "/images/relation inter.png", label: tx.photo1 },
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

        {/* ── TARIFS LUXE & ANIMATIONS ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">{tx.rates_tag}</span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#E9D18F] font-bold">{tx.rates_title}</h2>
            <p className="font-cormorant text-lg text-[#cabfa6] mt-2 max-w-xl mx-auto">
              {lang === "fr"
                ? "Tarification forfaitaire claire, transparente et sans coûts cachés pour les institutions publiques."
                : "Transparent flat-rate pricing designed for public institutions."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Carte 1 : Forfait Rédaction Principal */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#0F3823]/90 via-[#131513] to-[#0F3823]/90 border-2 border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.25)] hover:shadow-[0_0_65px_rgba(197,160,89,0.45)] hover:scale-[1.03] transition-all duration-500 overflow-hidden group">
              <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel text-[10px] font-bold tracking-widest uppercase rounded-bl-2xl shadow-md">
                ✦ {lang === "fr" ? "FORFAIT PRINCIPAL" : "MAIN PACKAGE"}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📜
              </div>
              <h3 className="font-cinzel text-base text-[#E9D18F] font-bold uppercase tracking-widest mb-1">{tx.rate1_title}</h3>
              <p className="font-cinzel text-4xl sm:text-5xl text-white font-extrabold my-3 drop-shadow-md">
                3 500 € <span className="text-sm font-normal text-[#C5A059] font-cormorant">TTC</span>
              </p>
              <div className="h-[1px] w-full bg-[#C5A059]/30 my-4" />
              <ul className="space-y-3 font-cormorant text-lg text-[#EDE4CF]/90">
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>{lang === "fr" ? "Dans la limite de 20 pages rédigées." : "Up to 20 written pages."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>{lang === "fr" ? "Expertise et rigueur en droit français." : "French legal expertise & accuracy."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059] font-bold">✓</span>
                  <span>{lang === "fr" ? "La mouture finale est votre exclusive propriété." : "The final draft becomes your exclusive property."}</span>
                </li>
              </ul>
            </div>

            {/* Carte 2 : Pages Supplémentaires */}
            <div className="relative p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl hover:border-[#C5A059] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)] hover:scale-[1.02] transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                📑
              </div>
              <h3 className="font-cinzel text-base text-[#E9D18F] font-bold uppercase tracking-widest mb-1">{tx.rate2_title}</h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                1 000 € <span className="text-sm font-normal text-[#cabfa6] font-cormorant">/ 10 pages</span>
              </p>
              <div className="h-[1px] w-full bg-[#C5A059]/20 my-4" />
              <ul className="space-y-3 font-cormorant text-lg text-[#EDE4CF]/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059]">◆</span>
                  <span>{lang === "fr" ? "Pour toutes les pages supplémentaires au-delà des 20 premières." : "For additional pages beyond the first 20."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059]">◆</span>
                  <span>{lang === "fr" ? "Facturation ajustée par tranche de 10 pages." : "Billed in 10-page increments."}</span>
                </li>
              </ul>
            </div>

            {/* Carte 3 : Consultation Orale Non Écrite */}
            <div className="relative p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl hover:border-[#C5A059] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)] hover:scale-[1.02] transition-all duration-500 group">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <h3 className="font-cinzel text-base text-[#E9D18F] font-bold uppercase tracking-widest mb-1">{tx.rate3_title}</h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                500 € <span className="text-sm font-normal text-[#cabfa6] font-cormorant">{lang === "fr" ? "/ conversation d'1h" : "/ 1h session"}</span>
              </p>
              <div className="h-[1px] w-full bg-[#C5A059]/20 my-4" />
              <ul className="space-y-3 font-cormorant text-lg text-[#EDE4CF]/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059]">◆</span>
                  <span>{lang === "fr" ? "Uniquement si vous avez besoin d'une consultation orale non écrite." : "For oral, non-written legal consultation."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059]">◆</span>
                  <span>{lang === "fr" ? "Échange direct d'environ une heure avec nos experts." : "Direct ~1 hour video session."}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059]">◆</span>
                  <span>{lang === "fr" ? "Sans engagement de rédaction." : "No drafting obligation."}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* BANDEAU SPÉCIAL : GRATUITÉ DE LA LECTURE ET VISIONNAGE */}
          <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-[#0F3823]/80 via-[#131513] to-[#0F3823]/80 border-2 border-[#C5A059]/60 shadow-[0_0_35px_rgba(197,160,89,0.2)] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#C5A059] text-black flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-lg animate-bounce">
              🎁
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-cinzel text-xs text-[#C5A059] uppercase tracking-widest font-bold bg-[#C5A059]/20 px-3 py-1 rounded-full border border-[#C5A059]/40">
                  ✦ {lang === "fr" ? "AVANTAGE EXCLUSIF" : "EXCLUSIVE BENEFIT"}
                </span>
                <span className="font-cinzel text-xs text-white font-bold uppercase">{lang === "fr" ? "GRATUITÉ D'ANALYSE" : "FREE REVIEW"}</span>
              </div>
              <p className="font-cormorant text-xl sm:text-2xl text-[#EDE4CF] leading-relaxed italic font-light">
                {lang === "fr" ? (
                  <>
                    « Nous ne facturons pas la <strong className="text-[#E9D18F] not-italic font-semibold">lecture</strong>, l’<strong className="text-[#E9D18F] not-italic font-semibold">audition</strong> ou le <strong className="text-[#E9D18F] not-italic font-semibold">visionnage</strong> des documents ou des fichiers que vous produisez ou vers lesquels vous nous référez. »
                  </>
                ) : (
                  <>
                    “We do not bill for reading, listening to, or reviewing the documents or files you provide or refer us to.”
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA : PRISE DE RENDEZ-VOUS (3 BOUTONS) ── */}
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F3823]/80 via-[#131513] to-[#0F3823]/80 border-2 border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold mb-3 uppercase tracking-wider">
            {lang === "fr" ? "Prise de Rendez-vous" : "Book an Appointment"}
          </h3>
          <p className="font-cormorant text-lg sm:text-xl text-[#cabfa6] mb-8 max-w-2xl mx-auto">
            {lang === "fr"
              ? "Adressez-nous votre demande par écrit ou contactez-nous directement via le canal de votre choix :"
              : "Send us your request in writing or contact us directly via your preferred channel:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* 1. Bouton contacter par mail */}
            <a
              href="mailto:generalesquire@proton.me"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#C5A059]/60 hover:border-[#E9D18F] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-105 group"
            >
              <svg className="w-5 h-5 text-[#C5A059] group-hover:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{lang === "fr" ? "Contacter par Mail" : "Contact via Mail"}</span>
            </a>

            {/* 2. Bouton contacter par WhatsApp ou Visio */}
            <a
              href="https://wa.me/33758264254"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#25D366]/70 hover:border-[#25D366] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:scale-105 group"
            >
              <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{lang === "fr" ? "WhatsApp / Visio" : "WhatsApp / Visio"}</span>
            </a>

            {/* 3. Bouton contacter par téléphone */}
            <a
              href="tel:+33159581725"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#C5A059]/60 hover:border-[#E9D18F] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-105 group"
            >
              <svg className="w-5 h-5 text-[#C5A059] group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.2 2.2z" />
              </svg>
              <span>{lang === "fr" ? "Téléphone" : "Phone Call"}</span>
            </a>
          </div>
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
