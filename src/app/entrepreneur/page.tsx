"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

// ─── Carousel slides — Uniform dimensions & high visual impact ─────────────────
const WHEEL_SLIDES = [
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
  {
    src: "/images/Chef d'entreprise6.jpg",
    tag: "Gouvernance & Statuts",
    title: "Sécurisez vos décisions stratégiques",
    desc: "La forme juridique conditionne la responsabilité des dirigeants et associés.",
  },
];

// ─── Sparkle Stars Component ──────────────────────────────────────────────────
function Sparkles() {
  const stars = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    top: Math.random() * 90 + 5,
    left: Math.random() * 90 + 5,
    delay: Math.random() * 2.5,
    size: 11 + Math.random() * 15,
    tx: (Math.random() - 0.5) * 60,
    ty: (Math.random() - 0.5) * 60,
  }));

  return (
    <span className="absolute inset-0 pointer-events-none overflow-hidden">
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

// ─── 3D Vertical Wheel Carousel (Roue Verticale 3D) ─────────────────────────
function VerticalWheelCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = WHEEL_SLIDES.length;
  const VISIBLE_SLOTS = 5; // -2, -1, 0, +1, +2
  const ANGLE_STEP = 36;   // 36 degrees per step on the vertical circle
  const RADIUS = 280;       // Vertical wheel radius in px

  const next = useCallback(() => setActiveIdx((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActiveIdx((p) => (p - 1 + total) % total), [total]);

  // Infinite slow-rhythm auto-rotation
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 4200);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  // Trackpad / Mouse wheel interaction
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 300) return;
      lastWheel = now;
      if (e.deltaY > 15 || e.deltaX > 15) next();
      if (e.deltaY < -15 || e.deltaX < -15) prev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Mobile Touch Swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0].clientY);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 35) dy > 0 ? next() : prev();
    setTouchStartY(null);
  };

  // Slots calculations (-2 to +2 relative to active index)
  const slots = Array.from({ length: VISIBLE_SLOTS }, (_, i) => {
    const offset = i - Math.floor(VISIBLE_SLOTS / 2);
    const idx = ((activeIdx + offset) % total + total) % total;
    return { idx, offset };
  });

  const activeSlide = WHEEL_SLIDES[activeIdx];

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-gradient-to-b from-[#0d0f0c] via-[#131513] to-[#0d0f0c] py-8 sm:py-12 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(197,160,89,0.12),transparent_70%)] pointer-events-none" />

      {/* Title Tag Header */}
      <div className="text-center mb-6 relative z-20">
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C5A059]/50 bg-[#0F3823]/80 backdrop-blur-md text-[#C5A059] font-cinzel text-[10px] tracking-[0.25em] uppercase shadow-md">
          ◆ CARROUSEL 3D — ROUE VERTICALE
        </span>
      </div>

      {/* 3D Vertical Stage */}
      <div
        className="relative flex items-center justify-center h-[340px] sm:h-[440px] md:h-[480px] w-full"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
      >
        <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          {slots.map(({ idx, offset }) => {
            const abs = Math.abs(offset);
            const rotX = -offset * ANGLE_STEP; // Vertical rotation angle around X axis
            const tz = offset === 0 ? 0 : -RADIUS * (1 - Math.cos((abs * ANGLE_STEP * Math.PI) / 180));
            const ty = offset * 85; // Vertical displacement offset
            const scale = offset === 0 ? 1.08 : Math.max(0.65, 1 - abs * 0.18);
            const opacity = offset === 0 ? 1 : Math.max(0.2, 1 - abs * 0.32);
            const isCenter = offset === 0;

            return (
              <div
                key={`${idx}-${offset}`}
                onClick={() => setActiveIdx(idx)}
                style={{
                  position: "absolute",
                  // Strict uniform dimensioning across laptop & mobile
                  width: isCenter ? "clamp(260px, 60vw, 560px)" : "clamp(200px, 48vw, 440px)",
                  height: isCenter ? "clamp(170px, 32vw, 290px)" : "clamp(130px, 24vw, 220px)",
                  transform: `translateY(${ty}px) rotateX(${rotX}deg) translateZ(${tz}px) scale(${scale})`,
                  opacity,
                  zIndex: isCenter ? 30 : 10 - abs,
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  transformStyle: "preserve-3d",
                }}
                className={`rounded-2xl overflow-hidden cursor-pointer border-2 shadow-2xl transition-all duration-700 bg-[#0c0e0c] ${
                  isCenter
                    ? "border-[#E9D18F] shadow-[0_0_50px_rgba(197,160,89,0.5),0_20px_40px_rgba(0,0,0,0.9)]"
                    : "border-[#C5A059]/30 hover:border-[#C5A059]/60"
                }`}
              >
                {/* Image — Strict 100% normalized cover */}
                <Image
                  src={WHEEL_SLIDES[idx].src}
                  alt={WHEEL_SLIDES[idx].title}
                  fill
                  priority={isCenter}
                  sizes="(max-width: 640px) 280px, 560px"
                  className={`object-cover object-center transition-transform duration-700 ${
                    isCenter ? "scale-105 brightness-105" : "brightness-60"
                  }`}
                />

                {/* Fade Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isCenter
                      ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)"
                      : `rgba(0,0,0,${Math.min(0.85, 0.45 + abs * 0.2)})`,
                  }}
                />

                {/* Label Overlay for Active Center Slide */}
                {isCenter && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 transition-all duration-500">
                    <span className="font-cinzel text-[9px] sm:text-xs text-[#C5A059] tracking-widest uppercase bg-[#131513]/90 border border-[#C5A059]/50 px-3 py-1 rounded-full backdrop-blur-md inline-block mb-2 shadow-md">
                      ✦ {WHEEL_SLIDES[idx].tag}
                    </span>
                    <h3 className="font-cinzel text-base sm:text-2xl font-bold text-white drop-shadow-md leading-tight mb-1">
                      {WHEEL_SLIDES[idx].title}
                    </h3>
                    <p className="font-cormorant text-xs sm:text-base text-[#EDE4CF]/90 line-clamp-1 drop-shadow">
                      {WHEEL_SLIDES[idx].desc}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 sm:left-6 sm:right-6 flex justify-between pointer-events-none z-40">
        <button
          onClick={prev}
          aria-label="Précédent"
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#131513]/85 border-2 border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#0F3823] hover:border-[#E9D18F] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] backdrop-blur-md cursor-pointer"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Suivant"
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#131513]/85 border-2 border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#0F3823] hover:border-[#E9D18F] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] backdrop-blur-md cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap px-4 relative z-20">
        {WHEEL_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Slide ${i + 1}`}
            className={`rounded-full transition-all duration-400 cursor-pointer ${
              i === activeIdx
                ? "w-8 h-2.5 bg-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.9)]"
                : "w-2.5 h-2.5 bg-white/20 hover:bg-[#C5A059]/50"
            }`}
          />
        ))}
      </div>

      <p className="text-center font-cinzel text-[10px] text-[#C5A059]/50 tracking-widest mt-3 relative z-20">
        ↑ FAITES DÉFILER OU UTILISEZ LES FLÈCHES POUR TOURNER LA ROUE ↓
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EntrepreneurPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] relative overflow-x-hidden">
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE ─────────────────────────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerentrprise.png"
            alt="Bannière Chef d'Entreprise — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER) ────────────────────────────────── */}
      <div className="w-full bg-[#0d0e0d] border-y border-[#C5A059]/30 py-3 overflow-hidden shadow-inner z-20 mb-8">
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
              <span>Chef d'Entreprise</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Sécurité Juridique</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Veille & Conseil</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Chrysalides</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Excellence</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
            </div>
          ))}
        </div>
      </div>

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
          <span className="text-[#EDE4CF]">{lang === "fr" ? "Vous êtes un chef d'entreprise" : "Business Executive"}</span>
        </div>

        {/* ── HERO HEADER ── */}
        <div className="text-center mb-10">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-5 py-1.5 rounded-full bg-[#131513]/80 backdrop-blur-md shadow-md">
            {lang === "fr" ? "Accompagnement & Conseil Juridique" : "Legal Counsel & Advisory"}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-4 mb-4">
            {lang === "fr" ? "Vous êtes un chef d'entreprise" : "You Are a Business Executive"}
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* ── 3D VERTICAL WHEEL CAROUSEL (ROUE VERTICALE) ── */}
        <section className="mb-16">
          <VerticalWheelCarousel />
        </section>

        {/* ── BODY TEXT (EXACT USER INSTRUCTIONS) ── */}
        <section className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-2xl mb-16 space-y-7 font-cormorant text-xl text-[#EDE4CF]/95 leading-relaxed">
          <p className="first-letter:text-5xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none">
            {lang === "fr" ? (
              "Nul n’est, plus qu’un chef d’entreprise, exposé à subir les conséquences de l’ignorance de la loi, en ce qu’elle est à la fois injonctive et prohibitive, mais aussi et plus que tout… sanctionnatrice. Le licenciement d’un salarié par exemple, ne se fait pas de façon hasardeuse. Il en est de même pour les déclarations faites auprès du fisc, dans le cadre d’un contrôle. Déjà la forme juridique de la personne morale elle-même influencera fortement la marge de manœuvre de son dirigeant et de ses associés s’il y en a, sachant que le moindre manquement peut entraîner pour l’entreprise comme pour ses représentants légaux, des sanctions de nature pénale, civile ou administrative."
            ) : (
              "No one is more exposed to the consequences of legal ignorance than a business leader. The law is both prescriptive and prohibitive, and above all... punitive. Dismissing an employee, for instance, cannot be done casually. The same applies to tax declarations during an audit. The legal entity structure itself heavily influences executive decision-making, where any breach can trigger criminal, civil, or administrative penalties."
            )}
          </p>

          {/* ── SUPER WOW EFFECT SENTENCE (Étoiles scintillantes & Ondulation Tourbillon) ── */}
          <div className="wow-box relative py-8 px-6 sm:px-12 rounded-3xl bg-gradient-to-r from-[#0F3823]/80 via-[#161816] to-[#0F3823]/80 border-2 border-[#E9D18F]/60 overflow-hidden shadow-[0_0_40px_rgba(197,160,89,0.35)]">
            <Sparkles />
            <p className="wow-sentence font-cormorant text-2xl sm:text-3xl font-bold text-center leading-relaxed relative z-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {lang === "fr"
                ? "Le risque de la fermeture d’un établissement est en effet réel, et fait aussi mal au portefeuille et à la réputation, que l’emprisonnement du dirigeant, les amendes, ou les dommages et intérêts."
                : "The risk of business closure is very real, hurting finances and reputation just as severely as executive imprisonment, fines, or damages."}
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-light italic text-[#E9D18F]/95 text-center pt-2">
            {lang === "fr" ? (
              "Que vous soyez un homme ou une femme, seul ou associé, notre offre de service et nos tarifs peuvent s’adapter avec flexibilité, en fonction de votre budget et de vos préoccupations."
            ) : (
              "Whether you operate independently or with partners, our legal service offerings and pricing adapt flexibly to your budget and specific priorities.")}
          </p>
        </section>

        {/* ── NOS PRESTATIONS (EXACT FULL SENTENCES) ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Sur mesure & Flexible" : "Tailored & Flexible"}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#E9D18F] font-bold mb-3">
              {lang === "fr"
                ? "Nous vous proposons sur une base annuelle, mensuelle ou ponctuelle :"
                : "We Offer You on an Annual, Monthly or One-Off Basis:"}
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#C5A059]" />
              <span className="text-[#C5A059]">◆</span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <ScaleIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Veille Juridique",
                text: "une veille juridique sur les textes de loi et la jurisprudence ;",
              },
              {
                icon: <MailIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Domiciliation Temporaire",
                text: "la domiciliation temporaire de vos courriers en cas d’urgence ;",
              },
              {
                icon: <ClipboardIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Assistance Formalités",
                text: "l’assistance à l’occasion de vos formalités à forte implication juridique ;",
              },
              {
                icon: <ChatIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Conseils Adaptés",
                text: "des conseils adaptés à vos besoins si nécessaire en présentiel, et par défaut en visioconférence, audioconférence ou par écrit ;",
              },
              {
                icon: <GlobeIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Traduction Juridique",
                text: "la traduction de tous vos documents à valeur juridique en français, anglais (sans frais), chinois et russe (supplément à prévoir) ;",
              },
              {
                icon: <DocumentTextIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Rédaction d'Actes",
                text: "la rédaction de contrats, lettres de recrutement, lettres de licenciement, lettres administratives diverses ;",
              },
              {
                icon: <HandshakeIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Négociations Commerciales",
                text: "l’assistance lors de vos négociations commerciales et professionnelles ;",
              },
              {
                icon: <CourtIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Procédures Non Obligatoires",
                text: "l’assistance dans les procédures sans représentation obligatoire ;",
              },
              {
                icon: <LinkIcon className="w-8 h-8 text-[#C5A059] mb-3" />,
                title: "Mise en Relation Experts",
                text: "la mise en relation avec d’autres professionnels du droit, de la finance, de la comptabilité ou de la fiscalité en fonction de vos besoins.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#E9D18F] hover:bg-[#0F3823]/35 transition-all duration-300 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {item.icon}
                  <h3 className="font-cinzel text-base text-[#E9D18F] font-bold tracking-wide mb-3 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── NOS FORMULES & TARIFS (EXACT FULL SENTENCES FOR PRICING) ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              Clarté & Transparence
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#E9D18F] font-bold">
              Nos Formules & Tarifs
            </h2>
            <p className="font-cormorant text-lg text-[#cabfa6] mt-2 max-w-xl mx-auto">
              Retrouvez nos conditions et engagements complets ci-dessous :
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* 1. Abonnement Annuel */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#0F3823]/90 via-[#131513] to-[#0F3823]/90 border-2 border-[#C5A059] shadow-[0_0_40px_rgba(197,160,89,0.25)] hover:shadow-[0_0_65px_rgba(197,160,89,0.45)] hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel text-[10px] font-bold tracking-widest uppercase rounded-bl-2xl shadow-md">
                  ✦ RECOMMANDÉ
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  👑
                </div>
                <h3 className="font-cinzel text-lg text-[#E9D18F] font-bold uppercase tracking-widest mb-1">
                  Abonnement Annuel
                </h3>
                <p className="font-cinzel text-4xl sm:text-5xl text-white font-extrabold my-3 drop-shadow-md">
                  10 000 € <span className="text-sm font-normal text-[#C5A059] font-cormorant">/ an</span>
                </p>
                <div className="h-[1px] w-full bg-[#C5A059]/30 my-4" />
                <div className="space-y-4 font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                  <p>
                    Vous avez la possibilité de souscrire auprès de General Esquire, un abonnement prépayé sur une base forfaitaire de 10.000 € par an, sans restriction de volume de mission.
                  </p>
                  <p className="text-base text-[#EDE4CF]/80 border-l-2 border-[#C5A059]/60 pl-3">
                    Toutefois en cas d’urgence – c’est-à-dire si vous nous sollicitez pour une prestation qui doit être délivrée dans un délai inférieur ou égal à 48 heures – il vous sera facturé un supplément de 1500 € par prestation nécessitant une rédaction.
                  </p>
                  <p className="text-base text-[#EDE4CF]/80 border-l-2 border-[#C5A059]/60 pl-3">
                    Les documents traduits en chinois et russe donnent lieu à une facturation séparée qui est 10 € la page pour un document écrit, et de 10 € la minute pour un fichier multimédia, audio et/ou vidéo.
                  </p>
                  <p className="text-base italic text-[#E9D18F]/90 border-l-2 border-[#E9D18F] pl-3">
                    L’abonnement annuel est renouvelable par tacite reconduction, sauf dénonciation expresse dans un délai de trois mois avant sa date anniversaire par tout écrit ayant date certaine.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Abonnement Mensuel */}
            <div className="relative p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl hover:border-[#C5A059] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)] hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  📅
                </div>
                <h3 className="font-cinzel text-lg text-[#E9D18F] font-bold uppercase tracking-widest mb-1">
                  Abonnement Mensuel
                </h3>
                <p className="font-cinzel text-4xl text-white font-extrabold my-3">
                  1 000 € <span className="text-sm font-normal text-[#cabfa6] font-cormorant">/ mois</span>
                </p>
                <div className="h-[1px] w-full bg-[#C5A059]/20 my-4" />
                <div className="space-y-4 font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                  <p>
                    Vous avez également la possibilité de souscrire un abonnement mensuel au tarif de 1000 € par mois, donnant droit à l’ensemble de nos prestations dans les termes et conditions susmentionnés.
                  </p>
                  <p className="text-base text-[#E9D18F]/90 border-l-2 border-[#C5A059] pl-3">
                    Il est résiliable à tout moment, tout paiement fait à la société General Esquire lui étant acquis.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Prestation Ponctuelle */}
            <div className="relative p-8 rounded-3xl bg-[#131513] border border-[#C5A059]/40 shadow-xl hover:border-[#C5A059] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)] hover:scale-[1.02] transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <h3 className="font-cinzel text-lg text-[#E9D18F] font-bold uppercase tracking-widest mb-1">
                  Prestation Ponctuelle
                </h3>
                <p className="font-cinzel text-3xl text-white font-bold my-3">
                  Gré à gré
                </p>
                <div className="h-[1px] w-full bg-[#C5A059]/20 my-4" />
                <div className="space-y-4 font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                  <p>
                    Il est également possible de solliciter nos services sur une base ponctuelle.
                  </p>
                  <p className="text-base text-[#EDE4CF]/85 border-l-2 border-[#C5A059]/50 pl-3">
                    Dans cette hypothèse, la facturation fait l’objet d’une convention de gré à gré, qui prend en considération les données propres à la préoccupation que vous nous soumettez, ainsi que notre disponibilité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA : PRISE DE RENDEZ-VOUS ── */}
        <div className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F3823]/80 via-[#131513] to-[#0F3823]/80 border-2 border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold mb-3 uppercase tracking-wider">
            {lang === "fr" ? "Prise de Rendez-vous" : "Book an Appointment"}
          </h3>
          <p className="font-cormorant text-lg sm:text-xl text-[#cabfa6] mb-8 max-w-2xl mx-auto">
            {lang === "fr"
              ? "Prêt à sécuriser votre entreprise ? Contactez-nous directement via le canal de votre choix :"
              : "Ready to secure your business? Contact us directly via your preferred channel:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <a
              href="mailto:contact@generalesquire.com"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#C5A059]/60 hover:border-[#E9D18F] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-105 group"
            >
              <svg className="w-5 h-5 text-[#C5A059] group-hover:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{lang === "fr" ? "Contacter par Mail" : "Contact via Mail"}</span>
            </a>

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
