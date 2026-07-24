"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "./entrepreneur-animations.css";
import { useLanguage } from "@/context/LanguageContext";
import {
  ScaleIcon,
  MailIcon,
  ClipboardIcon,
  ChatIcon,
  GlobeIcon,
  DocumentTextIcon,
  HandshakeIcon,
  CourtIcon,
  LinkIcon,
} from "@/components/Icons";

// ─── Carousel slides with overlay text ───────────────────────────────────────
const SLIDES = [
  {
    src: "/images/Chef d'entreprise3.jpg",
    tag: "Conseil & Stratégie",
    title: "Protégez votre entreprise dès aujourd'hui",
    desc: "Une ignorance de la loi peut coûter bien plus qu'une consultation juridique.",
  },
  {
    src: "/images/Chef d'entreprise7.jpg",
    tag: "Droit du Travail",
    title: "Le licenciement ne s'improvise pas",
    desc: "Toute procédure mal conduite expose votre entreprise à des sanctions lourdes.",
  },
  {
    src: "/images/Chef d'entreprise4.jpg",
    tag: "Fiscalité & Contrôle",
    title: "Vos déclarations fiscales méritent une expertise",
    desc: "Un contrôle mal préparé peut engager votre responsabilité civile et pénale.",
  },
  {
    src: "/images/Chef d'entreprise8.jpg",
    tag: "Accompagnement Sur Mesure",
    title: "Flexible selon votre budget et vos besoins",
    desc: "Formule annuelle, mensuelle ou ponctuelle — General Esquire s'adapte.",
  },
  {
    src: "/images/Chef d'entreprise13.jpg",
    tag: "Réseau & Partenaires",
    title: "Un réseau de professionnels à votre service",
    desc: "Droit, finance, comptabilité, fiscalité : nous vous mettons en relation.",
  },
];

// ─── Sparkle Stars ────────────────────────────────────────────────────────────
function Sparkles() {
  const stars = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    size: 10 + Math.random() * 14,
    tx: (Math.random() - 0.5) * 80,
    ty: (Math.random() - 0.5) * 80,
  }));

  return (
    <span className="absolute inset-0 pointer-events-none overflow-visible">
      {stars.map((s) => (
        <span
          key={s.id}
          className="sparkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            // @ts-ignore
            "--tx": `${s.tx}px`,
            "--ty": `${s.ty}px`,
          }}
        >
          ✦
        </span>
      ))}
    </span>
  );
}



// ─── Professional Hero Carousel ───────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimating(false);
      }, 400);
    },
    [animating]
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl group">
      {/* Image Layer */}
      <div
        className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] transition-opacity duration-500"
        style={{ opacity: animating ? 0 : 1 }}
      >
        <Image
          src={slide.src}
          alt={slide.title}
          fill
          priority
          className="object-cover object-center transition-transform duration-700 scale-105 group-hover:scale-100"
          sizes="(max-width: 768px) 100vw, 900px"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Text Overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 transition-all duration-500"
        style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(10px)" : "translateY(0)" }}
      >
        {/* Tag Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C5A059]/50 bg-[#0F3823]/70 backdrop-blur-md text-[#C5A059] font-cinzel text-[10px] tracking-[0.25em] uppercase mb-4">
          ◆ {slide.tag}
        </span>

        {/* Title */}
        <h2 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-bold text-white leading-snug mb-3 drop-shadow-lg max-w-2xl">
          {slide.title}
        </h2>

        {/* Description */}
        <p className="font-cormorant text-base sm:text-xl text-[#EDE4CF]/90 max-w-xl leading-relaxed">
          {slide.desc}
        </p>
      </div>

      {/* Slide counter top-right */}
      <div className="absolute top-5 right-5 font-cinzel text-xs text-[#C5A059] bg-[#131513]/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30">
        {current + 1} / {SLIDES.length}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#131513]/70 backdrop-blur-md border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 hover:border-[#C5A059] transition-all duration-200 flex items-center justify-center shadow-lg text-lg"
        aria-label="Précédent"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#131513]/70 backdrop-blur-md border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 hover:border-[#C5A059] transition-all duration-200 flex items-center justify-center shadow-lg text-lg"
        aria-label="Suivant"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full border ${
              i === current
                ? "w-8 h-2 bg-[#C5A059] border-[#C5A059]"
                : "w-2 h-2 bg-transparent border-[#C5A059]/50 hover:border-[#C5A059]"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EntrepreneurPage() {
  const { t, lang } = useLanguage();

  const WOW_SENTENCE = lang === "fr"
    ? "Le risque de la fermeture d'un établissement est en effet réel, et fait aussi mal au portefeuille et à la réputation, que l'emprisonnement du dirigeant, les amendes, ou les dommages et intérêts."
    : "The risk of business closure is very real, hurting finances and reputation just as severely as executive imprisonment, fines, or damages.";

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] relative overflow-x-hidden">
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (vs/1 style exact) ──────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden mb-8">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerchef.png"
            alt="Bannière Chef d'Entreprise — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105"
          />
        </div>
      </header>

      {/* Background filigrane */}
      <div className="absolute inset-0 -z-10 opacity-[0.08] pointer-events-none overflow-hidden">
        <Image src="/images/background.jpeg" alt="" fill className="object-cover" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12 md:pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">
            {t("nav_home")}
          </Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{t("nav_entrepreneur")}</span>
        </div>

        {/* ── HERO HEADER ── */}
        <div className="text-center mb-10">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md">
            {t("entrepreneur_subtitle")}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-4 mb-4">
            {t("entrepreneur_title")}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* ── PROFESSIONAL CAROUSEL ── */}
        <section className="mb-16">
          <HeroCarousel />
        </section>

        {/* ── BODY TEXT ── */}
        <section className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-2xl mb-16 space-y-7 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed">
          <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
            {lang === "fr" ? (
              "Nul n'est, plus qu'un chef d'entreprise, exposé à subir les conséquences de l'ignorance de la loi, en ce qu'elle est à la fois injonctive et prohibitive, mais aussi et plus que tout… sanctionnatrice. Le licenciement d'un salarié par exemple, ne se fait pas de façon hasardeuse. Il en est de même pour les déclarations faites auprès du fisc, dans le cadre d'un contrôle. Déjà la forme juridique de la personne morale elle-même influencera fortement la marge de manœuvre de son dirigeant et de ses associés s'il y en a, sachant que le moindre manquement peut entraîner pour l'entreprise comme pour ses représentants légaux, des sanctions de nature pénale, civile ou administrative."
            ) : (
              "No one is more exposed to the consequences of legal ignorance than a business leader. The law is both prescriptive and prohibitive, and above all... punitive. Dismissing an employee, for instance, cannot be done casually. The same applies to tax declarations during an audit. The legal entity structure itself heavily influences executive decision-making, where any breach can trigger criminal, civil, or administrative penalties."
            )}
          </p>

          {/* ── WOW SENTENCE — shimmer doré + étoiles ── */}
          <div className="wow-box relative py-8 px-6 sm:px-10 rounded-2xl bg-gradient-to-r from-[#0F3823]/60 via-[#1a1c1a] to-[#0F3823]/60 border border-[#E9D18F]/40 overflow-hidden">
            <Sparkles />
            <p className="wow-sentence font-cormorant text-xl sm:text-2xl font-semibold text-center leading-relaxed relative z-10">
              {WOW_SENTENCE}
            </p>
          </div>

          <p>
            {lang === "fr" ? (
              "Que vous soyez un homme ou une femme, seul ou associé, notre offre de service et nos tarifs peuvent s'adapter avec flexibilité, en fonction de votre budget et de vos préoccupations."
            ) : (
              "Whether you operate independently or with partners, our legal service offerings and pricing adapt flexibly to your budget and specific priorities."
            )}
          </p>
        </section>

        {/* ── NOS PRESTATIONS ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Sur mesure & Flexible" : "Tailored & Flexible"}
            </span>
            <h2 className="font-cinzel text-3xl text-[#E9D18F]">
              {t("entrepreneur_services_title")}
            </h2>
            <p className="font-cormorant text-base text-[#cabfa6] mt-2">
              {t("entrepreneur_services_sub")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <ScaleIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_veille_title"), desc: t("s_veille_desc") },
              { icon: <MailIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_domicilation_title"), desc: t("s_domicilation_desc") },
              { icon: <ClipboardIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_formalites_title"), desc: t("s_formalites_desc") },
              { icon: <ChatIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_conseils_title"), desc: t("s_conseils_desc") },
              { icon: <GlobeIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_traduction_title"), desc: t("s_traduction_desc") },
              { icon: <DocumentTextIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_redaction_title"), desc: t("s_redaction_desc") },
              { icon: <HandshakeIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_negociations_title"), desc: t("s_negociations_desc") },
              { icon: <CourtIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_procedures_title"), desc: t("s_procedures_desc") },
              { icon: <LinkIcon className="w-8 h-8 text-[#C5A059] mb-3" />, title: t("s_reseau_title"), desc: t("s_reseau_desc") },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#0F3823]/30 transition-all duration-300 shadow-md"
              >
                {item.icon}
                <h3 className="font-cinzel text-sm text-[#E9D18F] font-bold tracking-wide mb-2">
                  {item.title}
                </h3>
                <p className="font-cormorant text-base text-[#cabfa6] leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TARIFS ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              Clarté & Transparence
            </span>
            <h2 className="font-cinzel text-3xl text-[#E9D18F]">Nos Tarifs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Annual */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#0F3823] to-[#131513] border-2 border-[#C5A059] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 px-4 py-1 bg-[#C5A059] text-black font-cinzel text-[10px] tracking-widest uppercase rounded-bl-2xl">
                Recommandé
              </div>
              <h3 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest mb-1">
                Abonnement Annuel
              </h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                10 000 €<span className="text-sm font-normal text-[#cabfa6] font-cormorant"> / an</span>
              </p>
              <ul className="space-y-2 font-cormorant text-base text-[#EDE4CF]/80">
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Volume illimité de missions</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Urgence 48h : +1 500 € / prestation rédigée</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Traduction CN/RU : 10 € / page ou min</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Reconduction tacite (résil. 3 mois avant)</li>
              </ul>
            </div>

            {/* Monthly */}
            <div className="p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl">
              <h3 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest mb-1">
                Abonnement Mensuel
              </h3>
              <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                1 000 €<span className="text-sm font-normal text-[#cabfa6] font-cormorant"> / mois</span>
              </p>
              <ul className="space-y-2 font-cormorant text-base text-[#EDE4CF]/80">
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Accès à l'ensemble des prestations</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Résiliable à tout moment</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Tout paiement est définitivement acquis</li>
              </ul>
            </div>

            {/* Ponctual */}
            <div className="p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl">
              <h3 className="font-cinzel text-sm text-[#C5A059] uppercase tracking-widest mb-1">
                Prestation Ponctuelle
              </h3>
              <p className="font-cinzel text-2xl text-white font-bold my-3">
                Au gré à gré
              </p>
              <ul className="space-y-2 font-cormorant text-base text-[#EDE4CF]/80">
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Facturation selon la nature du besoin</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Selon nos disponibilités</li>
                <li className="flex items-start gap-2"><span className="text-[#C5A059] mt-0.5">◆</span>Convention personnalisée</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-[#0F3823]/70 via-[#131513] to-[#0F3823]/70 border border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">
            Prêt à sécuriser votre entreprise ?
          </h3>
          <p className="font-cormorant text-lg text-[#cabfa6] mb-6">
            General Esquire se tient à votre entière disposition pour protéger vos intérêts.
          </p>
          <a
            href="mailto:contact@generalesquire.com"
            className="inline-block px-12 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:scale-105"
          >
            Prendre Rendez-vous →
          </a>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="font-cinzel text-xs tracking-widest text-[#C5A059] hover:text-[#E9D18F] transition-colors inline-flex items-center gap-2"
          >
            ← RETOUR À L'ACCUEIL
          </Link>
        </div>
      </div>
    </div>
  );
}
