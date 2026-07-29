"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

// ─── Wellness Carousel Slides ────────────────────────────────────────────────
const WELLNESS_SLIDES = [
  { src: "/images/massage8.png", tag: "Massages & Soins Corps", title: "Séances de Massage Apaisantes", desc: "Laissez-vous choyer par nos praticiens qualifiés pour libérer toutes les tensions accumulées." },
  { src: "/images/CARS32.png", tag: "Douceur & Sérénité", title: "Bienvenue dans un Monde de Douceur", desc: "Un cadre idyllique spécialement conçu pour accueillir votre processus de résilience." },
  { src: "/images/massage2.jpg", tag: "Ressourcement Psychologique", title: "Prise en Charge de la Souffrance Émotionnelle", desc: "Un accompagnement attentif pour panser les blessures de la vie et des épreuves judiciaires." },
  { src: "/images/CAR33.png", tag: "Guide Personnel Attentif", title: "Un Accompagnant à Vos Côtés", desc: "Votre guide personnel veille à ce que rien n'entame vos précieux instants de bonheur." },
  { src: "/images/Chant2.jpg", tag: "Soirées & Spectacles", title: "Récitals, Musique & Convivialité", desc: "Des moments de joie partagée dans une ambiance amicale et chaleureuse." },
];

// ─── Gallery items (galerie radiale 3D) ───────────────────────────────────────────
const GALLERY = [
  { src: "/images/Massage.jpg",    label: "Massage & Relaxation",       cat: "Soins" },
  { src: "/images/massage2.jpg",   label: "Rituel Bien-Être",           cat: "Détente" },
  { src: "/images/massage3.jpg",   label: "Apaisement Profond",          cat: "Sérénité" },
  { src: "/images/massage4.jpg",   label: "Soins & Huiles Essentielles", cat: "Massage" },
  { src: "/images/Soins.jpg",      label: "Soins du Corps",              cat: "Esthétique" },
  { src: "/images/Soins2.jpg",     label: "Ressourcement",               cat: "Calme" },
  { src: "/images/Femmezen.jpg",   label: "Sérénité Intérieure",       cat: "Bien-Être" },
  { src: "/images/Bougie.jpg",     label: "Ambiance Tamisée",           cat: "Soirées" },
  { src: "/images/Chant2.jpg",     label: "Spectacles & Musique",        cat: "Culture" },
  { src: "/images/Embrassade.jpg", label: "Chaleur Humaine",             cat: "Bienveillance" },
  { src: "/images/Welcome.jpg",    label: "Promenades en Ville",         cat: "Balades" },
];

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const nextSlide = useCallback(() => setCurrent((p) => (p + 1) % WELLNESS_SLIDES.length), []);
  const prevSlide = useCallback(() => setCurrent((p) => (p - 1 + WELLNESS_SLIDES.length) % WELLNESS_SLIDES.length), []);
  useEffect(() => { const t = setInterval(nextSlide, 5000); return () => clearInterval(t); }, [nextSlide]);
  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#131513]">
      <div className="relative h-[320px] sm:h-[440px] md:h-[520px] w-full">
        {WELLNESS_SLIDES.map((slide, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
            <Image src={slide.src} alt={slide.title} fill priority={i === 0} className="object-cover object-center brightness-90 contrast-105 group-hover:scale-105 transition-transform duration-[8000ms]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-[#131513]/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 sm:bottom-12 sm:left-14 max-w-2xl">
              <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase px-4 py-1.5 bg-[#131513]/80 rounded-full border border-[#C5A059]/40 backdrop-blur-md inline-block mb-3 shadow-md">{slide.tag}</span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-md mb-2">{slide.title}</h2>
              <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 font-light drop-shadow">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#131513]/80 border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center text-xl cursor-pointer backdrop-blur-md">‹</button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#131513]/80 border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center text-xl cursor-pointer backdrop-blur-md">›</button>
      <div className="absolute bottom-5 right-8 z-20 flex gap-2">
        {WELLNESS_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2.5 rounded-full transition-all cursor-pointer ${i === current ? "w-8 bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.8)]" : "w-2.5 bg-[#C5A059]/40"}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Radial 3D Scroll-Driven Gallery ─────────────────────────────────────────
function RadialGallery3D() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total      = GALLERY.length;
  const VISIBLE    = 7;
  const ANGLE_STEP = 34;
  const RADIUS     = 400;

  const next = useCallback(() => setActiveIdx(p => (p + 1) % total), [total]);
  const prev = useCallback(() => setActiveIdx(p => (p - 1 + total) % total), [total]);

  // Auto-play
  useEffect(() => {
    if (isHovered) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [isHovered, next]);

  // Wheel / trackpad
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel < 320) return;
      lastWheel = now;
      if (e.deltaX > 15 || e.deltaY > 15)  next();
      if (e.deltaX < -15 || e.deltaY < -15) prev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 45) dx > 0 ? next() : prev();
    setTouchStartX(null);
  };

  const slots = Array.from({ length: VISIBLE }, (_, i) => {
    const offset = i - Math.floor(VISIBLE / 2);
    const idx    = ((activeIdx + offset) % total + total) % total;
    return { idx, offset };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ perspective: "1200px", perspectiveOrigin: "50% 42%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 3D Stage */}
      <div
        className="relative flex items-center justify-center h-[380px] sm:h-[480px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {slots.map(({ idx, offset }) => {
          const abs     = Math.abs(offset);
          const rotY    = offset * ANGLE_STEP;
          const tz      = offset === 0 ? 0 : -RADIUS * (1 - Math.cos((abs * ANGLE_STEP * Math.PI) / 180));
          const scale   = offset === 0 ? 1.15 : Math.max(0.5, 1 - abs * 0.16);
          const opacity = offset === 0 ? 1    : Math.max(0.2, 1 - abs * 0.25);
          const isCenter = offset === 0;

          return (
            <div
              key={`${idx}-${offset}`}
              onClick={() => setActiveIdx(idx)}
              style={{
                position:   "absolute",
                width:      isCenter ? "clamp(210px,28vw,290px)" : "clamp(120px,16vw,185px)",
                height:     isCenter ? "clamp(280px,36vw,380px)" : "clamp(160px,22vw,250px)",
                transform:  `rotateY(${rotY}deg) translateZ(${tz}px) scale(${scale})`,
                opacity,
                zIndex:     isCenter ? 30 : 10 - abs,
                transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
                transformStyle: "preserve-3d",
                WebkitBoxReflect: isCenter
                  ? "below 6px linear-gradient(transparent 55%, rgba(0,0,0,0.45))"
                  : undefined,
              }}
              className={`rounded-2xl overflow-hidden bg-[#0d0e0c] cursor-pointer border-2 ${
                isCenter
                  ? "border-[#E9D18F] shadow-[0_0_55px_rgba(197,160,89,0.65),0_24px_48px_rgba(0,0,0,0.85)]"
                  : "border-[#C5A059]/20 hover:border-[#C5A059]/50"
              }`}
            >
              <Image
                src={GALLERY[idx].src}
                alt={GALLERY[idx].label}
                fill
                sizes="290px"
                className={`object-cover object-center transition-transform duration-700 ${
                  isCenter ? "scale-105 brightness-105" : "brightness-55"
                }`}
              />
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: isCenter
                    ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.12) 55%, transparent 100%)"
                    : `rgba(0,0,0,${Math.min(0.82, 0.52 + abs * 0.12)})`,
                }}
              />
              {isCenter && (
                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                  <span className="font-cinzel text-[9px] text-[#C5A059] tracking-widest uppercase bg-[#131513]/90 border border-[#C5A059]/50 px-3 py-1 rounded-full backdrop-blur-sm inline-block mb-2">
                    ✦ {GALLERY[idx].cat}
                  </span>
                  <h3 className="font-cinzel text-sm font-bold text-white drop-shadow-lg">{GALLERY[idx].label}</h3>
                </div>
              )}
              {isCenter && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
                    animation:  "shimmerCard 2.8s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 sm:left-4 sm:right-4 flex justify-between pointer-events-none z-50">
        <button onClick={prev} aria-label="Précédent"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#131513]/90 border-2 border-[#C5A059]/55 text-[#E9D18F] text-2xl hover:bg-[#0F3823] hover:border-[#E9D18F] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-[0_0_24px_rgba(197,160,89,0.25)] backdrop-blur-md cursor-pointer">
          ‹
        </button>
        <button onClick={next} aria-label="Suivant"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#131513]/90 border-2 border-[#C5A059]/55 text-[#E9D18F] text-2xl hover:bg-[#0F3823] hover:border-[#E9D18F] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center shadow-[0_0_24px_rgba(197,160,89,0.25)] backdrop-blur-md cursor-pointer">
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-10 flex-wrap px-4">
        {GALLERY.map((_, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-400 cursor-pointer ${
              i === activeIdx
                ? "w-7 h-2.5 bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.9)]"
                : "w-2 h-2 bg-white/20 hover:bg-[#C5A059]/50"
            }`}
          />
        ))}
      </div>
      <p className="text-center font-cinzel text-[10px] text-[#C5A059]/45 tracking-widest mt-4">
        ← GLISSEZ OU UTILISEZ LES BOUTONS →
      </p>

      <style jsx>{`
        @keyframes shimmerCard {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

function SymmetricCard({
  emoji, title, image, imageAlt, children, reverse = false, wide = false,
}: {
  emoji: string; title: string; image: string; imageAlt: string;
  children: React.ReactNode; reverse?: boolean; wide?: boolean;
}) {
  return (
    <div className={`relative rounded-3xl overflow-hidden border border-[#C5A059]/25 shadow-2xl hover:border-[#C5A059]/50 transition-all duration-700 ${wide ? "lg:col-span-2" : ""}`}>
      {/* Glass BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F3823]/70 via-[#131513]/90 to-[#0a1a0f]/80" />
      <div className={`relative z-10 flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} min-h-[320px]`}>
        {/* Image */}
        <div className="relative w-full lg:w-2/5 h-56 lg:h-auto flex-shrink-0 overflow-hidden">
          <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center brightness-90" />
          <div className={`absolute inset-0 ${reverse ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-transparent to-[#131513]/70`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131513]/60 via-transparent to-transparent" />
        </div>
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 py-10 text-center">
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
            <span className="text-3xl">{emoji}</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-extrabold tracking-wider uppercase mb-6 leading-snug">
            {title}
          </h2>
          <div className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 leading-relaxed space-y-4 max-w-xl mx-auto">
            {children}
          </div>
          {/* Bottom accent */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-[1px] w-8 bg-[#C5A059]/30" />
            <span className="text-[#C5A059]/40 text-xs">◆</span>
            <div className="h-[1px] w-8 bg-[#C5A059]/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pillar Card ─────────────────────────────────────────────────────────────
function PillarCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-[#0e100e]/80 border border-[#C5A059]/30 hover:border-[#E9D18F] hover:bg-[#0F3823]/40 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] transition-all duration-500 cursor-default">
      <span className="text-5xl mb-4 block group-hover:scale-115 transition-transform duration-500">{emoji}</span>
      <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-widest mb-3 uppercase">{title}</h3>
      <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mb-3" />
      <p className="font-cormorant text-base text-[#EDE4CF]/80 leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DetentePage() {
  const { lang } = useLanguage();

  return (
    <>
      {/* ── 1. BANNER ──────────────────────────────────────────────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,480px)] relative overflow-hidden">
          <Image src="/images/Sport3.jpg" alt="Bannière Détente & Sérénité — General Esquire" fill priority className="object-cover object-[center_40%] brightness-95 contrast-105 animate-kenburns" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#131513]/80" />
        </div>
      </header>

      {/* ── 2. TICKER ──────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#0d0e0d] border-y border-[#C5A059]/30 py-3 overflow-hidden shadow-inner z-20 mb-10">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 font-cinzel text-xs sm:text-sm text-[#C5A059] tracking-[0.26em] uppercase px-6">
              <span className="drop-shadow-[0_0_12px_rgba(197,160,89,0.35)]">General Esquire</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Sérénité</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Massages & Soins</span>
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

      <div className="w-full px-4 sm:px-8 xl:px-16 py-4 md:py-8 relative">
        {/* BG filigrane */}
        <div className="absolute inset-0 -z-10 opacity-[0.06] pointer-events-none">
          <Image src="/images/background.jpeg" alt="" fill className="object-cover" />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] uppercase tracking-widest flex-wrap">
            <Link href="/" className="hover:text-[#E9D18F] transition-colors">{lang === "fr" ? "Accueil" : "Home"}</Link>
            <span className="text-[#C5A059]/40">/</span>
            <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">{lang === "fr" ? "Cocooning Touristique" : "Tourist Cocooning"}</Link>
            <span className="text-[#C5A059]/40">/</span>
            <span className="text-[#EDE4CF]">{lang === "fr" ? "Détente & Sérénité" : "Relaxation & Serenity"}</span>
          </div>
          <Link href="/cocooning-touristique" className="font-cinzel text-xs text-[#C5A059] hover:text-[#E9D18F] transition-colors hidden sm:flex items-center gap-2">
            ← {lang === "fr" ? "RETOUR AU COCOONING" : "BACK TO COCOONING"}
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-14">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-5 py-1.5 rounded-full bg-[#131513]/80 backdrop-blur-md inline-block mb-4 shadow-md">
            Chrysalides — {lang === "fr" ? "Soins, Détente & Résilience" : "Care, Relaxation & Resilience"}
          </span>
          <h1 className="font-cinzel text-4xl sm:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-2 mb-4">
            DÉTENTE
          </h1>
          <p className="font-cormorant text-2xl sm:text-3xl text-[#E9D18F] italic font-light mb-6">
            {lang === "fr" ? "Bienvenue dans un monde de douceur" : "Welcome to a world of softness"}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059] animate-spin" style={{ animationDuration: "8s" }}>◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Hero Carousel */}
        <section className="mb-20">
          <HeroCarousel />
        </section>

        {/* ── SYMMETRIC CONTENT CARDS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">

          {/* Card 1 */}
          <SymmetricCard
            emoji="🌿"
            title={lang === "fr" ? "Prendre en charge votre souffrance émotionnelle" : "Taking Care of Your Emotional Well-Being"}
            image="/images/massage2.jpg"
            imageAlt="Soins du Corps"
          >
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
              {lang === "fr"
                ? "General Esquire, cabinet de conseil juridique, se veut aussi une agence de cocooning touristique. Notre ambition est de prendre en charge votre souffrance émotionnelle pendant la quinzaine de votre séjour auprès de nous."
                : "General Esquire, a legal advisory firm, also acts as a tourist cocooning agency. Our ambition is to take care of your emotional well-being throughout your two-week stay with us."}
            </p>
            <p>
              {lang === "fr"
                ? "Nous le faisons avec beaucoup de bienveillance pour que celles et ceux d'entre vous qui ont durement été affectés par les difficultés de la vie puissent rapidement entamer leur processus de résilience."
                : "We do so with great compassion so that those affected by life's hardships or difficult legal procedures can quickly embark on their journey of resilience."}
            </p>
          </SymmetricCard>

          {/* Card 2 */}
          <SymmetricCard
            emoji="🤝"
            title={lang === "fr" ? "Un guide personnel dédié à votre bonheur" : "A Dedicated Personal Guide for Your Happiness"}
            image="/images/SOINS12.png"
            imageAlt="Guide Personnel"
            reverse
          >
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
              {lang === "fr"
                ? "Pendant tout votre séjour, votre guide personnel est à vos côtés pour veiller à ce que vous ne manquiez de rien, ou que rien n'entame vos instants heureux. Il ou elle est bien plus qu'un accompagnateur : un ami dévoué."
                : "Throughout your entire stay, your personal guide stands by your side to ensure you lack nothing and that nothing diminishes your happy moments. They are far more than a guide — they are a devoted friend."}
            </p>
          </SymmetricCard>

          {/* Card 3 — full width */}
          <div className="lg:col-span-2">
            <SymmetricCard
              emoji="✨"
              title={lang === "fr" ? "Activités, Massages & Convivialité" : "Activities, Massages & Shared Joy"}
              image="/images/Chant2.jpg"
              imageAlt="Soirées & Spectacles"
            >
              <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
                {lang === "fr"
                  ? "Au titre de ceux-ci, sont prévues plusieurs activités comme des séances de massage, des promenades en ville avec votre guide, des soirées dansantes, des récitals ou spectacles auxquels vous serez convié(e) ou associé(e) si vous avez envie de nous faire profiter de vos talents."
                  : "Among these moments, several activities are organized: relaxing massage sessions, city walks with your guide, dance evenings, recitals or shows to which you are invited — or involved if you wish to share your talents."}
              </p>
              <p className="italic text-[#E9D18F] font-light border-l-4 border-[#C5A059] pl-5 py-2 bg-[#C5A059]/5 rounded-r-xl">
                {lang === "fr"
                  ? "« Il n'y a aucune raison d'être timide ; c'est une ambiance bon enfant, le mot d'ordre étant la bienveillance. »"
                  : "\"There is no reason to be shy; it is a warm, friendly atmosphere where kindness is our guiding principle.\""}
              </p>
            </SymmetricCard>
          </div>
        </div>

        {/* ── 4 PILLARS ──────────────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3 animate-pulse">
              ✦ {lang === "fr" ? "Programme de Sérénité" : "Serenity Program"}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl text-[#E9D18F] font-bold mb-3">
              {lang === "fr" ? "Nos Moments Privilégiés" : "Our Special Moments"}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
              <span className="text-[#C5A059]/60 text-sm">◆</span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <PillarCard emoji="💆" title="MASSAGES & SOINS" text="Séances de massage professionnel et rituels de relaxation du corps." />
            <PillarCard emoji="🚶" title="PROMENADES EN VILLE" text="Balades guidées et découvertes urbaines avec votre guide dédié." />
            <PillarCard emoji="💃" title="SOIRÉES DANSANTES" text="Fêtes conviviales, rythmes entraînants et joie partagée." />
            <PillarCard emoji="🎭" title="RÉCITALS & SPECTACLES" text="Représentations culturelles et scènes ouvertes pour vos talents." />
          </div>
        </section>
        {/* ── GALERIE RADIALE 3D ──────────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3 animate-pulse">
              ✦ {lang === "fr" ? "Galerie d'Ambiance" : "Atmosphere Gallery"}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl text-[#E9D18F] font-bold mb-2">
              {lang === "fr" ? "Instants de Douceur en Images" : "Moments of Softness in Pictures"}
            </h2>
            <p className="font-cormorant text-lg text-[#cabfa6]">
              {lang === "fr" ? "Faites tourner la galerie avec le défilement, le glissement ou les boutons" : "Rotate gallery using scroll, swipe or buttons"}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
              <span className="text-[#C5A059]/60 text-sm">◆</span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
            </div>
          </div>
          <div className="bg-[#0d0f0c]/70 border border-[#C5A059]/20 rounded-3xl backdrop-blur-sm shadow-2xl overflow-hidden py-4">
            <RadialGallery3D />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border border-[#C5A059]/40 rounded-3xl p-10 sm:p-16 text-center shadow-[0_0_60px_rgba(197,160,89,0.2)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(197,160,89,0.08),transparent)] pointer-events-none" />
          <span className="inline-block font-cinzel text-xs text-[#E9D18F] tracking-[0.3em] uppercase mb-4 border border-[#C5A059]/50 px-5 py-1.5 rounded-full bg-[#131513]/80 shadow-md animate-pulse">
            ✦ {lang === "fr" ? "Rejoignez l'Aventure" : "Join the Journey"}
          </span>
          <h2 className="font-cinzel text-2xl sm:text-4xl text-[#E9D18F] font-bold mb-4 drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]">
            {lang === "fr" ? "Prêt(e) à vivre cet instant de douceur ?" : "Ready to Experience True Serenity?"}
          </h2>
          <p className="font-cormorant text-xl text-[#EDE4CF]/90 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            {lang === "fr"
              ? "Rejoignez-nous pour notre prochain séjour de cocooning touristique. Tout est pensé pour votre bien-être et votre résilience."
              : "Join us for our upcoming tourist cocooning retreat. Everything is tailored for your well-being and resilience."}
          </p>
          <Link href="/cocooning-touristique" className="inline-block px-14 py-4 rounded-full font-cinzel text-sm tracking-widest font-bold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(197,160,89,0.5)]">
            {lang === "fr" ? "Réserver mon séjour →" : "Book My Stay →"}
          </Link>
        </section>
      </div>

    </>
  );
}
