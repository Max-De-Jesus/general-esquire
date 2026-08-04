"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import "./entrepreneur-animations.css";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";
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

// ─── Solid Executive Hero Slider (Imposing Active Slide, Zero Background Bleed) ───
function ExecutiveLuxurySlider() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const total = SLIDES.length;

  const next = useCallback(() => setActiveIdx((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setActiveIdx((p) => (p - 1 + total) % total), [total]);

  // Rotation automatique fluide (mise en pause au survol)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5200);
    return () => clearInterval(timer);
  }, [isHovered, next]);

  // Support swipe tactile
  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 35) dx > 0 ? next() : prev();
    setTouchStartX(null);
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-[#C5A059]/40 bg-[#0d0f0c] shadow-2xl select-none group mb-12 sm:mb-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Gold Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(197,160,89,0.14),transparent_70%)] pointer-events-none" />

      {/* Stage Image Unique - 100% Opacité, Zéro Chevauchement par l'arrière */}
      <div className="relative w-full h-[300px] sm:h-[440px] md:h-[500px] overflow-hidden">
        {SLIDES.map((slide, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                isActive
                  ? "opacity-100 scale-100 z-20"
                  : "opacity-0 scale-105 pointer-events-none z-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority={i === 0}
                unoptimized
                sizes="100vw"
                className="object-cover object-[center_35%] filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e0c] via-black/40 to-transparent" />

              {/* Text Caption Overlay */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-30 text-center sm:text-left">
                <span className="inline-block font-cinzel text-xs text-[#E9D18F] font-bold tracking-[0.25em] uppercase bg-[#0F3823]/90 border border-[#C5A059]/60 px-4 py-1.5 rounded-full backdrop-blur-md mb-3 shadow-lg">
                  ✦ {slide.tag}
                </span>
                <h3 className="font-cinzel text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {slide.title}
                </h3>
                <p className="font-cormorant text-base sm:text-xl text-[#EDE4CF] max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed">
                  {slide.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* Flèches de navigation dorées */}
        <button
          onClick={prev}
          aria-label="Précédent"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#131513]/90 border border-[#C5A059]/60 text-[#E9D18F] text-2xl hover:bg-[#0F3823] hover:border-[#E9D18F] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg backdrop-blur-md cursor-pointer"
        >
          ❮
        </button>
        <button
          onClick={next}
          aria-label="Suivant"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#131513]/90 border border-[#C5A059]/60 text-[#E9D18F] text-2xl hover:bg-[#0F3823] hover:border-[#E9D18F] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-lg backdrop-blur-md cursor-pointer"
        >
          ❯
        </button>
      </div>

      {/* Dots & Counter Bar */}
      <div className="bg-[#0a0b0a] border-t border-[#C5A059]/30 p-3 sm:p-4 flex items-center justify-between gap-2 relative z-30">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === activeIdx
                  ? "w-8 bg-[#E9D18F] shadow-[0_0_10px_#E9D18F]"
                  : "w-2.5 bg-[#C5A059]/40 hover:bg-[#C5A059]/80"
              }`}
              aria-label={`Aller au slide ${idx + 1}`}
            />
          ))}
        </div>

        <span className="hidden sm:inline-block font-cinzel text-xs text-[#C5A059] uppercase tracking-widest">
          {activeIdx + 1} / {SLIDES.length}
        </span>
      </div>
    </div>
  );
}

// ─── Main Entrepreneur Page Component ───────────────────────────────────────
export default function EntrepreneurPage() {
  const { lang } = useLanguage();
  const [activeModal, setActiveModal] = useState<"methode" | "tarifs" | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0e0d]/50 text-[#EDE4CF] pb-12 md:pb-20 relative">
      {/* Background image BACKRN.png */}
      <div className="fixed inset-0 z-0 opacity-55 pointer-events-none overflow-hidden">
        <Image
          src="/images/BACKRN.png"
          alt="Background Chefs d'Entreprise"
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
            src="/images/BANNERCJ.png"
            alt="Bannière Chefs d'Entreprise — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <TickerBanner className="mb-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">
            {lang === "fr" ? "Chefs d'Entreprise" : "Business Owners"}
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-8">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3">
            {lang === "fr" ? "Espace Dirigeants & Sociétés" : "Executive & Corporate Services"}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mb-4">
            {lang === "fr" ? "Vous êtes un chef d'entreprise" : "You Are a Business Owner"}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* ─── BADGE ROTATIF ANIMÉ HAUTS-DE-FRANCE ─────────────────────── */}
        <div className="my-6 sm:my-8 flex justify-center items-center relative z-20">
          <div className="relative group">
            {/* Halo lumineux d'arrière-plan avec pulsation */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#C5A059]/40 via-[#E9D18F]/30 to-[#C5A059]/40 blur-xl opacity-80 animate-pulse group-hover:opacity-100 transition-opacity" />
            
            {/* Badge circulaire avec animation de rotation douce */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#0e100e] border-2 border-[#C5A059] p-3 shadow-[0_0_30px_rgba(197,160,89,0.5)] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/Badge Hauts de France.png"
                alt="Badge Région Hauts-de-France — General Esquire"
                width={170}
                height={170}
                priority
                className="object-contain filter drop-shadow-[0_4px_16px_rgba(197,160,89,0.6)] animate-[spin_25s_linear_infinite] hover:[animation-play-state:paused] transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* ─── CARROUSEL SLIDER VEDETTE ─────────────────────────────── */}
        <ExecutiveLuxurySlider />

        {/* ─── TEXTE INTRODUCTIF PRINCIPAL ────────────────────────────────────── */}
        <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12 space-y-6">
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.85] text-justify">
            {lang === "fr" ? (
              <>
                Pour les chefs d’entreprise, les entreprises et les personnes morales, notre cabinet agit comme un véritable partenaire juridique stratégique. De la prévention des risques à la défense contentieuse, nous sécurisons vos décisions d’affaires.
              </>
            ) : (
              <>
                For business leaders and corporate entities, our firm serves as a strategic legal partner, safeguarding your commercial operations and corporate decisions.
              </>
            )}
          </p>
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.85] text-justify">
            {lang === "fr" ? (
              <>
                Qu’il s’agisse de litiges commerciaux, de droit du travail, de procédures collectives ou de conseil en gouvernance, nous vous proposons un accompagnement sur mesure, adapté à la taille et aux enjeux de votre entreprise.
              </>
            ) : (
              <>
                Whether handling commercial litigation, employment law, insolvency procedures, or corporate governance, we deliver tailored guidance aligned with your business scope.
              </>
            )}
          </p>
        </div>

        {/* ─── LES 2 BOUTONS D'ACTION (NOTRE MÉTHODE DE TRAVAIL & NOS TARIFS) ─────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 my-12">
          <button
            onClick={() => setActiveModal("methode")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F3823]/20 border border-[#C5A059]/40 text-[#C5A059] hover:text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#0F3823]/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] font-cinzel text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer"
          >
            {lang === "fr" ? "NOTRE MÉTHODE DE TRAVAIL" : "OUR WORKING METHOD"}
          </button>
          <button
            onClick={() => setActiveModal("tarifs")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F3823]/20 border border-[#C5A059]/40 text-[#C5A059] hover:text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#0F3823]/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] font-cinzel text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer"
          >
            {lang === "fr" ? "NOS TARIFS" : "OUR PRICING"}
          </button>
        </div>

        {/* ─── MODAL 1 : NOTRE MÉTHODE DE TRAVAIL ────────────────── */}
        {activeModal === "methode" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{animation: 'fadeIn 0.3s ease'}}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Notre méthode de travail
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Fermer la fenêtre"
                >
                  <span className="font-cinzel text-xl sm:text-2xl leading-none font-bold select-none">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-5 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed">
                <p>
                  Notre méthode pour les dirigeants d’entreprise privilégie la clarté et l’efficacité opérationnelle : vous nous confiez votre besoin ou votre litige, nous analysons les pièces juridiques et financières, puis nous établissons une stratégie d’action écrite.
                </p>
                <p>
                  Qu’il s’agisse d'abonnements annuels pour un conseil permanent ou de prestations ponctuelles au dossier, nous vous garantissons une rigueur absolue et des réponses adaptées à vos impératifs de gestion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2 : NOS TARIFS ────────────────────── */}
        {activeModal === "tarifs" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{animation: 'fadeIn 0.3s ease'}}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Tarification Chefs d'Entreprise
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Fermer la fenêtre"
                >
                  <span className="font-cinzel text-xl sm:text-2xl leading-none font-bold select-none">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-6 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90">
                <p>
                  Nos abonnements et forfaits de rédaction pour les entreprises sont établis de gré à gré en fonction de la taille de l'entreprise, des volumes d'affaires et de la complexité des affaires.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
