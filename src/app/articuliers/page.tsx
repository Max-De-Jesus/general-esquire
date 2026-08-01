"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

const SITUATIONS_FR = [
  "Vous êtes convoqué à la gendarmerie et vous ignorez quelle en sera la suite.",
  "Votre compagnon ou le père de vos enfants ne paie plus la pension alimentaire.",
  "Cela fait plusieurs mois que vous attendez la délivrance de votre titre de séjour.",
  "Votre employeur vous a convoqué en vue de votre licenciement disciplinaire.",
  "Un de vos proches doit se rendre dans un commissariat de police pour déposer plainte.",
  "Votre fille a un problème récurrent avec son copain qui la frappe ou la menace.",
  "Vos voisins font du bruit dans leur appartement, et vous ne savez plus que faire.",
  "La Caisse d'allocations familiales menace de saisir votre compte bancaire.",
  "Le préfet vous a notifié une obligation de quitter le territoire français (OQTF).",
  "Votre compagne est partie avec votre enfant, à votre insu, et sans laisser de contact.",
  "Vous recevez un avis de contravention pour une voiture que vous ne conduisiez pas.",
  "Vous découvrez un trou dans votre plafond et votre bailleur refuse de le réparer.",
  "L'appareil que vous avez reçu ne correspond pas à celui que vous avez commandé.",
  "Vous souhaitez sortir de tous les crédits à la consommation qui ruinent votre quiétude.",
  "Quelqu'un a usurpé votre identité, et c'est vous qui recevez à sa place des amendes.",
  "Vous envisagez ou avez déjà un avocat, mais quelque chose vous pèse sur le cœur."
];

const SITUATIONS_EN = [
  "You are summoned to the police station and do not know what will happen next.",
  "Your partner or the father of your children has stopped paying child support.",
  "You have been waiting several months for your residence permit to be issued.",
  "Your employer has summoned you for a disciplinary dismissal interview.",
  "A relative needs to go to a police station to file an official complaint.",
  "Your daughter faces recurring abuse or threats from her boyfriend.",
  "Your neighbors are noisy in their apartment and you don't know what to do.",
  "The family allowance agency threatens to seize your bank account.",
  "The prefect notified you of an obligation to leave French territory (OQTF).",
  "Your partner left with your child without your knowledge or contact details.",
  "You receive a traffic fine notice for a vehicle you were not driving.",
  "You discover a leak/hole in your ceiling and your landlord refuses to repair it.",
  "The item you received does not correspond to what you ordered online.",
  "You want to get out of consumer debt/loans that are ruining your peace of mind.",
  "Someone stole your identity, and you are receiving fines meant for them.",
  "You are considering or already have a lawyer, but something still weighs on your heart."
];

export default function ParticuliersPage() {
  const { lang } = useLanguage();
  const situations = lang === "fr" ? SITUATIONS_FR : SITUATIONS_EN;

  const tx = {
    breadcrumb_home: lang === "fr" ? "Accueil" : "Home",
    breadcrumb_page: lang === "fr" ? "Particuliers" : "Individuals",
    hero_tag: lang === "fr" ? "Espace Conseil Juridique" : "Legal Advisory Desk",
    hero_title: lang === "fr" ? "Vous êtes un simple particulier" : "You Are an Individual",
    quote: lang === "fr"
      ? "« Peu importe votre origine ou votre nationalité ; General Esquire se fera l’honneur et la joie de vous accueillir pour vous écouter, vous renseigner et vous assister. »"
      : "“Regardless of your origin or nationality, General Esquire considers it an honor to welcome, advise, and assist you.”",
    situations_title: lang === "fr" ? "Est-ce que l'une des situations suivantes vous parle ?" : "Do Any of the Following Situations Apply to You?",
    situations_sub: lang === "fr" ? "Sachant que la liste n’est pas exhaustive :" : "Note that this list is not exhaustive:",
    highlight_title: lang === "fr" ? "Si oui, vous êtes au cœur de notre activité !" : "If so, you are at the core of our practice!",
    highlight_desc: lang === "fr"
      ? "Dans toutes les situations sus-évoquées ou qui s'en rapprochent, pour tout besoin d'assistance juridique ou administrative, et plus particulièrement toute rédaction précontentieuse ou contentieuse, General Esquire se tient à vos côtés."
      : "In all the aforementioned situations or similar matters, for any legal or administrative assistance—especially pre-litigation or litigation drafting—General Esquire stands by your side.",
    gallery_tag: lang === "fr" ? "Galerie & Ambiance" : "Gallery & Atmosphere",
    gallery_title: lang === "fr" ? "Un Accompagnement Humain & Dévoué" : "Dedicated & Compassionate Support",
    offers_tag: lang === "fr" ? "Accompagnement Sur Mesure" : "Tailored Guidance",
    offers_title: lang === "fr" ? "Nos Offres de Service" : "Our Service Offerings",
    step1_title: lang === "fr" ? "Rendez-vous Initial" : "Initial Consultation",
    step1_desc: lang === "fr"
      ? "Votre parcours commence par un entretien approfondi où vous nous exposez votre préoccupation et le résultat que vous souhaitez atteindre."
      : "Your journey begins with an in-depth consultation to discuss your situation and desired resolution.",
    step2_title: lang === "fr" ? "Dévouement & Moyens" : "Commitment & Expertise",
    step2_desc: lang === "fr"
      ? "Forts de plus de 20 années d'expérience, nous mettons toutes nos connaissances en œuvre pour obtenir le meilleur résultat possible."
      : "With over 20 years of experience, we deploy all our knowledge to achieve the best possible outcome for you.",
    step3_title: lang === "fr" ? "Services Gratuits & Inclus" : "Included & Complimentary Services",
    step3_desc: lang === "fr"
      ? "Photocopieur/scanner mis à disposition gratuitement. Traduction en français et anglais offerte pour vos documents juridiques."
      : "Complimentary scanner/copy access. Free French and English translation for your legal documents.",
    rates_tag: lang === "fr" ? "Clarté & Transparence" : "Clarity & Transparency",
    rates_title: lang === "fr" ? "Nos Tarifs" : "Our Rates",
    rate1_title: lang === "fr" ? "Consultation Initiale" : "Initial Consultation",
    rate1_price: "100 €",
    rate1_sub: lang === "fr" ? "Tarif fixe" : "Fixed Fee",
    rate1_desc: lang === "fr"
      ? "Pour les particuliers, des frais de consultation au tarif fixe de 100 € sont à prévoir, quelle que soit les modalités pratiques de déroulement de ladite consultation."
      : "For individuals, a fixed consultation fee of €100 is required, regardless of the practical arrangements for conducting the consultation.",
    rate2_title: lang === "fr" ? "Traductions Spécifiques" : "Specialized Translations",
    rate2_price: "10 €",
    rate2_sub: lang === "fr" ? "/ page ou / minute" : "/ page or / minute",
    rate2_desc: lang === "fr"
      ? "Les traductions en chinois et russe sont facturées au prix de 10 € la page pour un document écrit, et 10 € la minute, pour un fichier audiovisuel."
      : "Chinese and Russian translations are billed at €10 per page for written documents, and €10 per minute for audiovisual files.",
    note1: lang === "fr"
      ? "Toutes les autres prestations sont facturées de gré à gré, en fonction des enjeux du dossier et des revenus du client. Ce coût est ajustable en cours de mission suivant la difficulté exceptionnelle présentée a posteriori par le dossier."
      : "All other services are billed on a case-by-case basis, according to the stakes of the case and the client's income. This cost may be adjusted during the course of the mission depending on any exceptional difficulty presented a posteriori by the case.",
    note2: lang === "fr"
      ? "Des facilités de paiement peuvent être accordées. Aucun abonnement n’est prévu pour les particuliers."
      : "Payment facilities may be granted. No subscription plans are provided for individuals.",
    btn_mail: lang === "fr" ? "Contacter par Mail" : "Contact by Email",
    btn_whatsapp: lang === "fr" ? "Contacter par WhatsApp / Visio" : "Contact via WhatsApp / Video",
    btn_phone: lang === "fr" ? "Contacter par Téléphone" : "Contact by Phone",
  };

  return (
    <div className="min-h-screen bg-[#0d0e0d]/50 text-[#EDE4CF] pb-12 md:pb-20 relative">
      {/* Background image backpa.png */}
      <div className="fixed inset-0 z-0 opacity-55 pointer-events-none overflow-hidden">
        <Image
          src="/images/backpa.png"
          alt="Background Particuliers"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0d]/70 via-[#0d0e0d]/40 to-[#0d0e0d]/80" />
      </div>

      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (vs/1 style exact) ──────────────── */}
      <header className="relative z-10 w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerparticulier.png"
            alt="Bannière Particuliers — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <TickerBanner className="mb-8" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{tx.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{tx.breadcrumb_page}</span>
        </div>

        {/* Hero Header with Custom Image */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 mb-12 shadow-2xl">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <Image
              src="/images/Image ParticuLiers9.avif"
              alt="Espace Particuliers — General Esquire"
              fill
              priority
              className="object-cover object-center filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a] via-[#1a1c1a]/60 to-transparent"></div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-center sm:text-left">
            <span className="text-[#C5A059] text-xs font-cinzel tracking-widest uppercase bg-[#131513]/80 px-4 py-1 rounded-full border border-[#C5A059]/40 backdrop-blur-md">
              {tx.hero_tag}
            </span>
            <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white mt-3 drop-shadow-md">
              {tx.hero_title}
            </h1>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-cormorant text-xl sm:text-2xl text-[#cabfa6] italic font-light">
            {tx.quote}
          </p>
        </div>

        {/* ===== SITUATIONS DE LA VIE COURANTE ===== */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F] mb-3">
              {tx.situations_title}
            </h2>
            <p className="font-cormorant text-base text-[#cabfa6]">
              {tx.situations_sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {situations.map((situation, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#131513]/90 border border-[#C5A059]/25 hover:border-[#C5A059] hover:bg-[#0F3823]/40 transition-all duration-300 flex items-start gap-4 shadow-md group"
              >
                <span className="text-[#C5A059] text-sm mt-0.5 group-hover:scale-125 transition-transform">◆</span>
                <p className="font-cormorant text-lg text-[#EDE4CF]/90 leading-snug">
                  {situation}
                </p>
              </div>
            ))}
          </div>

          {/* Highlight Box */}
          <div className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-[#0F3823]/60 via-[#131513] to-[#0F3823]/60 border border-[#C5A059]/40 text-center shadow-xl">
            <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-3">
              {tx.highlight_title}
            </h3>
            <p className="font-cormorant text-lg text-[#EDE4CF] max-w-3xl mx-auto leading-relaxed">
              {tx.highlight_desc}
            </p>
          </div>
        </section>

        {/* ===== PHOTO GALLERY FOR PARTICULIERS ===== */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {tx.gallery_tag}
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F]">
              {tx.gallery_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Image particuliers.jfif"
                alt="Accompagnement Particuliers"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Image ParticuLiers8.avif"
                alt="Ecoute et conseils"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Image ParticuLiers2.avif"
                alt="Protection des droits"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* ===== NOS OFFRES DE SERVICE — ZIGZAG ===== */}
        <section className="mb-20">
          <div className="text-center mb-14">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3">
              {tx.offers_tag}
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#E9D18F]">
              {tx.offers_title}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#C5A059]" />
              <span className="text-[#C5A059] text-xs">◆</span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>
          </div>

          {/* Zigzag Step 1 : Image gauche — Texte droite */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="w-full md:w-1/2 relative h-72 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-2xl flex-shrink-0 group">
              <Image
                src="/images/Image Particuliers5.jpg"
                alt="Rendez-vous initial — General Esquire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131513]/40" />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-extrabold text-xl flex items-center justify-center shadow-[0_0_25px_rgba(197,160,89,0.4)] mb-4">
                01
              </div>
              <h3 className="font-cinzel text-2xl text-[#E9D18F] font-bold">
                {tx.step1_title}
              </h3>
              <div className="h-[2px] w-16 bg-gradient-to-r from-[#C5A059] to-transparent" />
              <p className="font-cormorant text-lg text-[#EDE4CF]/85 leading-relaxed">
                {tx.step1_desc}
              </p>
            </div>
          </div>

          {/* Zigzag Step 2 : Texte gauche — Image droite */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 mb-16">
            <div className="w-full md:w-1/2 relative h-72 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-2xl flex-shrink-0 group">
              <Image
                src="/images/Image ParticuLiers3.avif"
                alt="Dévouement et expertise — General Esquire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#131513]/40" />
            </div>
            <div className="w-full md:w-1/2 space-y-4 md:text-right">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-extrabold text-xl flex items-center justify-center shadow-[0_0_25px_rgba(197,160,89,0.4)] mb-4 md:ml-auto">
                02
              </div>
              <h3 className="font-cinzel text-2xl text-[#E9D18F] font-bold">
                {tx.step2_title}
              </h3>
              <div className="h-[2px] w-16 bg-gradient-to-l from-[#C5A059] to-transparent md:ml-auto" />
              <p className="font-cormorant text-lg text-[#EDE4CF]/85 leading-relaxed">
                {tx.step2_desc}
              </p>
            </div>
          </div>

          {/* Zigzag Step 3 : Image gauche — Texte droite */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 relative h-72 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-2xl flex-shrink-0 group">
              <Image
                src="/images/Image Particuliers9.jpg"
                alt="Services gratuits inclus — General Esquire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131513]/40" />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-extrabold text-xl flex items-center justify-center shadow-[0_0_25px_rgba(197,160,89,0.4)] mb-4">
                03
              </div>
              <h3 className="font-cinzel text-2xl text-[#E9D18F] font-bold">
                {tx.step3_title}
              </h3>
              <div className="h-[2px] w-16 bg-gradient-to-r from-[#C5A059] to-transparent" />
              <p className="font-cormorant text-lg text-[#EDE4CF]/85 leading-relaxed">
                {tx.step3_desc}
              </p>
            </div>
          </div>
        </section>

        {/* ===== NOS TARIFS ===== */}
        <section className="mb-16 bg-[#131513] border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {tx.rates_tag}
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#E9D18F]">
              {tx.rates_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-xl">
              <h3 className="font-cinzel text-lg text-[#E9D18F] font-bold mb-2">
                {tx.rate1_title}
              </h3>
              <p className="font-cinzel text-3xl text-white font-extrabold mb-4">
                {tx.rate1_price} <span className="text-xs font-normal text-[#cabfa6] font-cormorant">{tx.rate1_sub}</span>
              </p>
              <p className="font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                {tx.rate1_desc}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-xl">
              <h3 className="font-cinzel text-lg text-[#E9D18F] font-bold mb-2">
                {tx.rate2_title}
              </h3>
              <p className="font-cinzel text-2xl text-white font-bold mb-4">
                {tx.rate2_price} <span className="text-xs font-normal text-[#cabfa6] font-cormorant">{tx.rate2_sub}</span>
              </p>
              <p className="font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                {tx.rate2_desc}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#0F3823]/40 border border-[#C5A059]/30 font-cormorant text-lg text-[#EDE4CF] space-y-4 shadow-lg">
            <p className="flex items-start gap-3">
              <span className="text-[#C5A059] text-base mt-1 flex-shrink-0">◆</span>
              <span>{tx.note1}</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C5A059] text-base mt-1 flex-shrink-0">◆</span>
              <span>{tx.note2}</span>
            </p>
          </div>

          {/* ===== PRISE DE RENDEZ-VOUS : 03 BOUTONS ===== */}
          <div className="mt-12 pt-10 border-t border-[#C5A059]/30 text-center">
            <h3 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold mb-3 uppercase tracking-wider">
              {lang === "fr" ? "Prise de Rendez-vous" : "Book an Appointment"}
            </h3>
            <p className="font-cormorant text-lg text-[#cabfa6] mb-8">
              {lang === "fr"
                ? "Contactez-nous directement via le canal de votre choix :"
                : "Contact us directly via your preferred channel:"}
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
                <span>{tx.btn_mail}</span>
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
                <span>{tx.btn_whatsapp}</span>
              </a>

              {/* 3. Bouton contacter par téléphone */}
              <a
                href="tel:+33159581725"
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#C5A059]/60 hover:border-[#E9D18F] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-105 group"
              >
                <svg className="w-5 h-5 text-[#C5A059] group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.2 2.2z" />
                </svg>
                <span>{tx.btn_phone}</span>
              </a>
            </div>
          </div>

          {/* ===== GALERIE ANIMÉE DES PHOTOS PARTICULIERS ===== */}
          <div className="mt-16 pt-12 border-t border-[#C5A059]/30 text-center">
            <span className="font-cinzel text-xs text-[#C5A059] uppercase tracking-[0.25em] font-semibold block mb-2">
              ✦ {lang === "fr" ? "Galerie & Ambiance Client" : "Client Gallery & Ambience"}
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold mb-3 uppercase tracking-wider">
              {lang === "fr" ? "Moments & Accompagnements Particuliers" : "Individual Guidance & Moments"}
            </h3>
            <p className="font-cormorant text-lg text-[#cabfa6] mb-8 max-w-2xl mx-auto">
              {lang === "fr"
                ? "Découvrez en images la proximité et l’engagement de notre cabinet auprès de chaque particulier."
                : "Discover in images our commitment and close proximity to each individual."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { src: "/images/photo particulier/Particuliers.jpg", alt: "Accompagnement Client 1" },
                { src: "/images/photo particulier/Particluiers2.jpg", alt: "Accompagnement Client 2" },
                { src: "/images/photo particulier/Particluiers3.jpg", alt: "Accompagnement Client 3" },
                { src: "/images/photo particulier/Particluiers4.jpg", alt: "Accompagnement Client 4" },
                { src: "/images/photo particulier/Particluiers5.webp", alt: "Accompagnement Client 5" },
                { src: "/images/photo particulier/Particluiers6.avif", alt: "Accompagnement Client 6" },
                { src: "/images/photo particulier/Particluiers7.jpg", alt: "Accompagnement Client 7" },
                { src: "/images/photo particulier/Particluiers8.jpg", alt: "Accompagnement Client 8" },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg hover:border-[#E9D18F] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] hover:scale-105 transition-all duration-500 bg-[#131513]"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center filter brightness-95 group-hover:brightness-110 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="font-cinzel text-[10px] text-[#E9D18F] tracking-widest uppercase font-bold">
                      General Esquire
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
