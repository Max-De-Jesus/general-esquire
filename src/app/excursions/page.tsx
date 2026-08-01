"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

// ─── Carousel slides — bilingual ─────────────────────────────────────────────
const SLIDES_FR = [
  { src: "/images/ex1.png", tag: "Bienvenue au Bénin", title: "Un monde d'émerveillement vous attend", desc: "Dès votre descente d'avion, votre guide General Esquire – Chrysalides vous accueille." },
  { src: "/images/Excursion22.jpg", tag: "Cotonou", title: "La capitale historique aux mille attraits", desc: "Vibrant carrefour d'échanges, de cultures et d'histoires insolites." },
  { src: "/images/ex3.png", tag: "Ouidah — Cité du Vaudou", title: "Hauts-lieux historiques & Voodoo Days", desc: "Participez au festival Voodoo Days, organisé justement pendant votre séjour." },
  { src: "/images/ex4.png", tag: "Abomey — Palais Royaux", title: "Les rois au passé glorieux", desc: "Temples, forêts sacrées, palais royaux — l'histoire du Bénin s'offre à vous." },
  { src: "/images/ex5.png", tag: "Découverte & Évasion", title: "Plein les yeux, les oreilles et les mains", desc: "Quinze jours d'enchantement : danses rituelles, cérémonies vaudou, villages lacustres." },
];
const SLIDES_EN = [
  { src: "/images/excursion1.jpg", tag: "Welcome to Benin", title: "A world of wonder awaits you", desc: "From the moment you land, your General Esquire – Chrysalides guide is there to welcome you." },
  { src: "/images/Excursion22.jpg", tag: "Cotonou", title: "The vibrant economic capital", desc: "A lively crossroads of commerce, cultures and fascinating stories." },
  { src: "/images/Excursion12.jpg", tag: "Ouidah — City of Voodoo", title: "Historic Sites & Voodoo Days Festival", desc: "Take part in the Voodoo Days festival, which takes place during your stay." },
  { src: "/images/Excursion4.jpg", tag: "Abomey — Royal Palaces", title: "Kings of a glorious past", desc: "Temples, sacred forests, royal palaces — the history of Benin unfolds before you." },
  { src: "/images/Excursion9.jpg", tag: "Discovery & Escape", title: "A feast for eyes, ears and hands", desc: "Fifteen days of enchantment: ritual dances, voodoo ceremonies, lake villages." },
];

const GALLERY = [
  { src: "/images/excursion1.jpg", label: "Accueil & Bienvenue" },
  { src: "/images/Excursion2.jpg", label: "Cotonou by Night" },
  { src: "/images/Excursion4.jpg", label: "Abomey — Royauté" },
  { src: "/images/Excursion5.webp", label: "Forêt Sacrée" },
  { src: "/images/Excursion6.jpg", label: "Voudou & Traditions" },
  { src: "/images/Excursion7.jpg", label: "Villages Lacustres" },
  { src: "/images/Excursion9.jpg", label: "Danses Rituelles" },
  { src: "/images/Excursion10.jpg", label: "Art & Culture" },
  { src: "/images/Excursion12.jpg", label: "Ouidah — Temple" },
  { src: "/images/Excursion17.jpg", label: "Marchés Locaux" },
  { src: "/images/Excursion18.jpeg", label: "Artisanat Béninois" },
  { src: "/images/Excursion19.jpg", label: "Côte Atlantique" },
  { src: "/images/Excursion20.jpg", label: "Voodoo Days" },
  { src: "/images/Excursion21.jpg", label: "Échanges & Sourires" },
  { src: "/images/Excursion22.jpg", label: "Cotonou — Centre Ville" },
  { src: "/images/Excursion23.jpg", label: "Paysages du Bénin" },
  { src: "/images/Excursion24.jpg", label: "Moments Précieux" },
  { src: "/images/Excursion25.jpg", label: "Festival & Fêtes" },
  { src: "/images/Excursion26.jpg", label: "Architecture Royale" },
  { src: "/images/Excursions27.jpg", label: "Forêt Enchantée" },
  { src: "/images/Excursion28.jpg", label: "Découverte Locale" },
  { src: "/images/Excursion30.jpg", label: "Paysages Majestueux" },
  { src: "/images/Excursion31.jpg", label: "Coucher de Soleil" },
  { src: "/images/Egungun.jpg", label: "Masques Egungun" },
  { src: "/images/Chant2.jpg", label: "Cérémonies & Chants" },
  { src: "/images/Chant3.jpg", label: "Rythmes Africains" },
  { src: "/images/Tchooh7.jpg", label: "Saveurs du Bénin" },
  { src: "/images/Tchooh9.jpg", label: "Gastronomie Locale" },
];

// ─── Content sections with images ────────────────────────────────────────────
const CONTENT_PANELS = [
  {
    image: "/images/Excursion7.jpg",
    emoji: "🧭",
    keyFR: "guide",
    keyEN: "guide",
    color: "from-[#0F3823] to-[#131513]",
  },
  {
    image: "/images/Excursion20.jpg",
    emoji: "📅",
    keyFR: "prep",
    keyEN: "prep",
    color: "from-[#131513] to-[#0a1a0f]",
  },
  {
    image: "/images/Excursion12.jpg",
    emoji: "🌍",
    keyFR: "heart",
    keyEN: "heart",
    color: "from-[#0a1a0f] to-[#131513]",
  },
  {
    image: "/images/Excursion4.jpg",
    emoji: "🏛️",
    keyFR: "must",
    keyEN: "must",
    color: "from-[#131513] to-[#0F3823]",
  },
];

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel({ slides }: { slides: typeof SLIDES_FR }) {
  const [current, setCurrent] = useState(0);
  const [prev2, setPrev2] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return;
    setPrev2(current);
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => { setPrev2(null); setTransitioning(false); }, 700);
  }, [current, transitioning]);

  const goNext = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const goPrev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext]);

  const slide = slides[current];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl group bg-[#131513]">
      <div className="relative w-full h-[220px] sm:h-[500px]">

        {/* ── Previous slide (fades OUT) */}
        {prev2 !== null && (
          <div className="absolute inset-0 z-10 animate-fadeOut pointer-events-none">
            <Image
              src={slides[prev2].src}
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>
        )}

        {/* ── Current slide (fades IN) */}
        <div className={`absolute inset-0 z-20 ${transitioning ? "animate-fadeIn" : ""}`}>
          <Image
            src={slide.src}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-[8000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
      </div>

      <div className="absolute top-5 right-5 font-cinzel text-xs text-[#C5A059] bg-[#131513]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30 z-30">{current + 1} / {slides.length}</div>
      <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#131513]/80 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/30 transition-all flex items-center justify-center text-2xl shadow-lg backdrop-blur-md z-30">‹</button>
      <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#131513]/80 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/30 transition-all flex items-center justify-center text-2xl shadow-lg backdrop-blur-md z-30">›</button>
      <div className="absolute bottom-5 right-7 flex items-center gap-2 z-30">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-8 h-2.5 bg-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.8)]" : "w-2.5 h-2.5 bg-white/30 hover:bg-[#C5A059]/60"}`}
          />
        ))}
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        .animate-fadeIn  { animation: fadeIn  0.7s ease forwards; }
        .animate-fadeOut { animation: fadeOut 0.7s ease forwards; }
      `}</style>
    </div>
  );
}

// ─── Radial 3D Scroll-Driven Gallery ─────────────────────────────────────────
function RadialGallery3D({ items }: { items: typeof GALLERY }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = items.length;
  const visibleCount = 7; // cartes visibles à la fois (centre + 3 de chaque côté)
  const angleStep = 38; // degrés entre chaque carte visible
  const radius = 420; // rayon du cylindre 3D en px

  const next = useCallback(() => setActiveIdx(p => (p + 1) % total), [total]);
  const prev = useCallback(() => setActiveIdx(p => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (isHovered) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [isHovered, next]);

  // Wheel scroll horizontal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 30) next();
        else if (e.deltaX < -30) prev();
      } else if (Math.abs(e.deltaY) > 40) {
        e.preventDefault();
        if (e.deltaY > 0) next();
        else prev();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
    setTouchStartX(null);
  };

  // Compute cards relative to active (show -3 to +3)
  const visibleCards = Array.from({ length: visibleCount }, (_, i) => {
    const offset = i - Math.floor(visibleCount / 2); // -3..+3
    const idx = ((activeIdx + offset) % total + total) % total;
    return { idx, offset };
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full py-16 overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1100px", perspectiveOrigin: "50% 40%" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Stage */}
      <div className="relative flex items-center justify-center h-[240px] sm:h-[460px]" style={{ transformStyle: "preserve-3d" }}>
        {visibleCards.map(({ idx, offset }) => {
          const absOffset = Math.abs(offset);
          const rotY = offset * angleStep;
          const tz = offset === 0 ? 0 : -radius * (1 - Math.cos((absOffset * angleStep * Math.PI) / 180));
          const scale = offset === 0 ? 1.06 : Math.max(0.65, 1 - absOffset * 0.14);
          const opacity = offset === 0 ? 1 : Math.max(0.25, 1 - absOffset * 0.22);
          const blur = offset === 0 ? 0 : absOffset * 1.5;
          const isCenter = offset === 0;

          return (
            <div
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`absolute cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full overflow-hidden border-2 bg-[#0d0e0c] ${
                isCenter
                  ? "border-[#E9D18F] shadow-[0_0_35px_rgba(197,160,89,0.7),0_16px_36px_rgba(0,0,0,0.8)] z-30"
                  : "border-[#C5A059]/25 hover:border-[#C5A059]/60 z-10"
              }`}
              style={{
                width: isCenter ? "clamp(180px, 28vw, 320px)" : "clamp(130px, 20vw, 220px)",
                height: isCenter ? "clamp(180px, 28vw, 320px)" : "clamp(130px, 20vw, 220px)",
                transform: `rotateY(${rotY}deg) translateZ(${tz}px) scale(${scale})`,
                opacity,
                // No CSS blur — use opacity + dark overlay instead (blur causes ghost bleed)
                transformStyle: "preserve-3d",
                WebkitBoxReflect: isCenter
                  ? "below 8px linear-gradient(transparent, transparent 60%, rgba(0,0,0,0.4))"
                  : undefined,
              }}
            >
              <Image
                src={items[idx].src}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 640px) 190px, 280px"
                className={`object-cover object-center transition-transform duration-700 ${isCenter ? "scale-105 brightness-105" : "brightness-60"}`}
              />
              {/* Dark overlay — heavier on side cards to hide them cleanly */}
              <div className={`absolute inset-0 transition-all duration-500 ${
                isCenter
                  ? "bg-gradient-to-t from-black/80 via-black/10 to-transparent"
                  : `bg-black/${Math.min(85, 55 + absOffset * 10)}`
              }`} />

              {/* Shimmer on center */}
              {isCenter && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] animate-[shimmer_3s_ease-in-out_infinite] pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Nav Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 sm:left-6 sm:right-6 flex justify-between pointer-events-none z-40">
        <button onClick={prev} aria-label="Précédent"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#131513]/85 border-2 border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#0F3823] hover:border-[#E9D18F] transition-all duration-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-110 backdrop-blur-md cursor-pointer">
          ‹
        </button>
        <button onClick={next} aria-label="Suivant"
          className="pointer-events-auto w-12 h-12 rounded-full bg-[#131513]/85 border-2 border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#0F3823] hover:border-[#E9D18F] transition-all duration-300 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-110 backdrop-blur-md cursor-pointer">
          ›
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-1.5 mt-10 flex-wrap px-4 z-30 relative">
        {items.map((_, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-400 cursor-pointer ${
              i === activeIdx
                ? "w-7 h-2.5 bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.9)]"
                : "w-2 h-2 bg-white/20 hover:bg-[#C5A059]/50"
            }`} aria-label={`Carte ${i + 1}`}
          />
        ))}
      </div>

      {/* Hint text */}
      <p className="text-center font-cinzel text-[10px] text-[#C5A059]/50 tracking-widest mt-4">
        ← GLISSEZ OU UTILISEZ LES BOUTONS →
      </p>
    </div>
  );
}

// ─── Animated reveal hook ─────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExcursionsPage() {
  const { lang } = useLanguage();
  const slides = lang === "fr" ? SLIDES_FR : SLIDES_EN;

  const tx = {
    breadcrumb_home: lang === "fr" ? "Accueil" : "Home",
    breadcrumb_page: lang === "fr" ? "Excursions" : "Excursions",
    tag: lang === "fr" ? "Chrysalides — Cocooning Touristique" : "Chrysalides — Tourist Cocooning",
    title: lang === "fr" ? "Excursions au Bénin" : "Excursions in Benin",
    subtitle: lang === "fr" ? "« Bienvenue dans un monde d'émerveillement »" : "\"Welcome to a World of Wonder\"",
    guide_title: lang === "fr" ? "Votre Guide Personnel" : "Your Personal Guide",
    guide_p1: lang === "fr"
      ? "Vous souvenez-vous qu'à votre descente d'avion, vous avez été accueilli(e) par votre guide ? Il ou elle porte un t-shirt, ou un chapeau, ou un badge floqué du logo de General Esquire – Chrysalides, afin d'être aisément dans votre visuel."
      : "Remember how, when you landed, your guide was there to greet you? They wear a t-shirt, cap, or badge bearing the General Esquire – Chrysalides logo, making them easy to spot in a crowd — and you equally easy to find.",
    guide_p2: lang === "fr"
      ? "Tel un metteur en scène, votre guide a la mission de vous photographier et filmer lors des excursions, afin de constituer pour vous des souvenirs précieux. Il ou elle est aussi, en même temps, votre interprète lors des visites touristiques."
      : "Like a director, your guide's mission is to photograph and film you during excursions, creating lasting memories. They also serve as your interpreter at sites where your hosts do not speak French — such as royal palaces and temples.",
    prep_title: lang === "fr" ? "3 Mois de Préparation Minutieuse" : "3 Months of Meticulous Preparation",
    prep_p: lang === "fr"
      ? "Vous souvenez-vous également que les inscriptions sont ouvertes en février et fermées en septembre pour un voyage en janvier de l'année suivante ? C'est justement pour que nous consacrions les trois mois d'octobre à décembre à préparer avec vous les meilleures conditions de votre séjour."
      : "Remember that registrations open in February and close in September for a trip the following January? This is precisely so we can dedicate the three months from October to December to preparing, together with you and your dedicated guides, the very best conditions for your stay.",
    heart_title: lang === "fr" ? "Au Cœur de la Découverte" : "At the Heart of Discovery",
    heart_p1: lang === "fr"
      ? "Maintenant, nous sommes au cœur du tourisme même, de la découverte, de l'évasion, de l'enchantement. Vous allez voir du pays, de la culture, des arts, des musées, des forêts sacrées, des pythons, des temples vaudou, des villages lacustres, des palais royaux, la statue de l'Amazone."
      : "Now we are at the very heart of tourism — discovery, escape, and enchantment. You will see the country, its culture, arts, museums, sacred forests, pythons, voodoo temples, lake villages, royal palaces, and the statue of the Amazon warrior.",
    heart_p2: lang === "fr"
      ? "Pendant quinze jours, vous en aurez plein les yeux, les oreilles et les mains. Ouidah s'offre à vous avec ses hauts-lieux historiques et culturels, et vous aurez le loisir de participer au festival Voodoo Days, qui se déroule justement pendant votre séjour."
      : "For fifteen days, you will be immersed in sights, sounds and sensations. Ouidah alone, with its historic and cultural landmarks, will dazzle you — and you will have the opportunity to attend the Voodoo Days festival, which takes place precisely during your stay.",
    must_title: lang === "fr" ? "Les Incontournables du Bénin" : "Benin's Must-See Destinations",
    must_p1: lang === "fr"
      ? "En quinze jours, vous n'aurez peut-être pas vu tout le Bénin ; mais il y a des incontournables, à commencer par la capitale économique Cotonou, le temple de  Python a Ouidah, la cité du Vaudou, et Abomey, celle des rois au passé glorieux."
      : "In fifteen days you may not see all of Benin, but the must-sees include the economic capital Cotonou, Ouidah the city of Voodoo, and Abomey, the city of kings with a glorious past.",
    must_p2: lang === "fr"
      ? "Vous aurez sans doute l'occasion d'assister à des danses rituelles, des démonstrations de magie, des cérémonies vaudou… toutes choses qui vont vous émerveiller et élargir votre ouverture d'esprit."
      : "You will likely witness ritual dances, magic demonstrations, voodoo ceremonies — all of which will fill you with wonder and broaden your mind.",
    must_quote: lang === "fr"
      ? "Notre préoccupation est de vous divertir, vous faire passer d'agréables moments, et vous apporter une forme de soutien psychologique par-delà la dureté de la vie."
      : "Our goal is to entertain you, help you enjoy wonderful moments, and offer a form of psychological support beyond the hardships of daily life.",
    gallery_tag: lang === "fr" ? "Découvrez la variété" : "Discover the Variety",
    gallery_title: lang === "fr" ? "Galerie des Excursions" : "Excursions Gallery",
    cta_title: lang === "fr" ? "Prêt(e) pour l'aventure béninoise ?" : "Ready for the Beninese Adventure?",
    cta_sub: lang === "fr" ? "Inscriptions ouvertes de février à fin septembre pour le séjour de janvier." : "Registrations open from February to end of September for the January stay.",
    cta_btn: lang === "fr" ? "Inscrivez-vous au Séjour →" : "Book Your Stay →",
    back: lang === "fr" ? "← RETOUR À L'ACCUEIL" : "← BACK TO HOME",
  };

  const panelData = [
    { title: tx.guide_title, emoji: "🧭", p1: tx.guide_p1, p2: tx.guide_p2, image: "/images/GUIDE.png", imageAlt: "Guide General Esquire" },
    { title: tx.prep_title, emoji: "📅", p1: tx.prep_p, p2: null, image: "/images/PREPARE.png", imageAlt: "Préparation du Séjour" },
    { title: tx.heart_title, emoji: "🌍", p1: tx.heart_p1, p2: tx.heart_p2, image: "/images/Excursion12.jpg", imageAlt: "CITE DE GANVIE" },
    { title: tx.must_title, emoji: "🏛️", p1: tx.must_p1, p2: tx.must_p2, quote: tx.must_quote, image: "/images/Excursion4.jpg", imageAlt: "Ouidah Temple Voudou" },
  ];

  return (
    <div className="min-h-screen text-[#EDE4CF] pb-12 md:pb-20 relative overflow-x-hidden">

      {/* ── ARRIÈRE-PLAN FIXE : Excursion23.jpg ─────────────────────────── */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src="/images/Excursion23.jpg"
          alt="Arrière-plan Excursions Bénin"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60 filter brightness-60 saturate-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#12140f]/70 via-[#12140f]/50 to-[#12140f]/75" />
      </div>

      {/* ── 1. BANNIÈRE HERO (ancienne bannière restaurée) ───────────────── */}
      <header className="w-full bg-[#0d0f0c]/60 overflow-hidden relative">
        <div className="w-full h-[clamp(180px,34vw,480px)] relative overflow-hidden">
          <Image
            src="/images/Excursion30.jpg"
            alt="Bannière Excursions — General Esquire"
            fill
            priority
            className="object-cover object-center brightness-90 contrast-105 animate-kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#12140f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          {/* Floating title on banner */}
          <div className="absolute bottom-8 left-8 right-8">
            <span className="inline-block font-cinzel text-[10px] text-[#C5A059] tracking-[0.4em] uppercase border border-[#C5A059]/50 px-4 py-1.5 rounded-full bg-[#131513]/70 backdrop-blur-md mb-3 shadow-md animate-pulse">
              ✦ General Esquire — Chrysalides
            </span>
          </div>
        </div>
      </header>

      {/* ── 2. TICKER ───────────────────────────────────────────────────── */}
      <TickerBanner items={["GENERAL ESQUIRE", "EXCURSIONS", "BÉNIN", "CHRYSALIDES", "VOODOO DAYS", "DÉCOUVERTE"]} className="mb-8" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 md:pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{tx.breadcrumb_home}</Link>
          <span className="text-[#C5A059]/40">/</span>
          <span className="text-[#EDE4CF]">{tx.breadcrumb_page}</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-14">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-5 py-1.5 rounded-full bg-[#131513]/80 backdrop-blur-md inline-block mb-4 shadow-md">
            {tx.tag}
          </span>
          <h1 className="font-cinzel text-4xl sm:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-2 mb-4 drop-shadow-lg">
            {tx.title}
          </h1>
          <p className="font-cormorant text-2xl text-[#E9D18F] italic font-light mb-6">{tx.subtitle}</p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059] animate-spin" style={{ animationDuration: "8s" }}>◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Hero Carousel */}
        <section className="mb-20">
          <HeroCarousel slides={slides} />
        </section>

        {/* ── PANNEAUX FULLSCREEN (Image + Texte en alternance HAUT/BAS) ── */}
        <div className="space-y-16 mb-20">
          {panelData.map((panel, i) => {
            const { ref, inView } = useInView();
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                ref={ref}
                className={`relative rounded-3xl overflow-hidden border border-[#C5A059]/20 shadow-2xl transition-all duration-1000 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                {/* Background tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F3823]/60 via-[#131513]/80 to-[#0a1a0f]/90" />

                <div className={`relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[380px]`}>
                  {/* Image side */}
                  <div className={`relative h-64 lg:h-auto ${isEven ? "lg:order-1" : "lg:order-2"} overflow-hidden`}>
                    <Image
                      src={panel.image}
                      alt={panel.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 ${isEven ? "bg-gradient-to-r from-transparent to-[#0F3823]/60" : "bg-gradient-to-l from-transparent to-[#0F3823]/60"}`} />

                  </div>

                  {/* Text side */}
                  <div className={`relative z-10 p-8 sm:p-12 flex flex-col justify-center ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    {/* Accent line */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="w-10 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-[#E9D18F] rounded-full" />
                      <span className="text-2xl">{panel.emoji}</span>
                      <div className="w-10 h-[2px] bg-gradient-to-l from-transparent via-[#C5A059] to-[#E9D18F] rounded-full" />
                    </div>

                    <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-extrabold uppercase tracking-wider mb-5 leading-tight text-center">
                      {panel.title}
                    </h2>

                    <div className="space-y-4 font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed">
                      <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold first-letter:float-left first-letter:mr-1 first-letter:leading-none">
                        {panel.p1}
                      </p>
                      {panel.p2 && <p>{panel.p2}</p>}
                      {panel.quote && (
                        <blockquote className="mt-4 pl-5 border-l-4 border-[#C5A059] text-[#E9D18F] italic font-light text-base bg-[#C5A059]/5 py-3 pr-3 rounded-r-xl">
                          « {panel.quote} »
                        </blockquote>
                      )}
                    </div>

                    {/* Bottom accent */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <div className="w-10 h-[2px] bg-[#C5A059]/60 rounded-full" />
                      <span className="text-[#C5A059] text-xs">◆</span>
                      <div className="w-10 h-[2px] bg-[#C5A059]/60 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Glowing border effect */}
                <div className={`absolute inset-0 rounded-3xl border border-[#C5A059]/0 hover:border-[#C5A059]/30 transition-all duration-700 pointer-events-none`} />
              </div>
            );
          })}
        </div>

        {/* ── GALERIE RADIALE 3D ─────────────────────────────────────────── */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3 animate-pulse">
              ✦ {tx.gallery_tag}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl text-[#E9D18F] font-bold mb-3">
              {tx.gallery_title}
            </h2>
           
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-[#C5A059]/60" />
              <span className="text-[#C5A059]/60 text-sm">◆</span>
              <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-[#C5A059]/60" />
            </div>
          </div>
          <div className="bg-[#0d0f0c]/70 border border-[#C5A059]/20 rounded-3xl backdrop-blur-sm shadow-2xl overflow-hidden">
            <RadialGallery3D items={GALLERY} />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[#0F3823]/80 via-[#131513]/90 to-[#0F3823]/80 border border-[#C5A059]/40 shadow-[0_0_60px_rgba(197,160,89,0.2)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C5A059]/8,transparent)] pointer-events-none" />
          <span className="inline-block font-cinzel text-xs text-[#E9D18F] tracking-[0.3em] uppercase mb-4 border border-[#C5A059]/50 px-5 py-1.5 rounded-full bg-[#131513]/80 shadow-md animate-pulse">
            ✦ {lang === "fr" ? "Rejoignez l'Aventure" : "Join the Adventure"}
          </span>
          <h3 className="font-cinzel text-2xl sm:text-4xl text-[#E9D18F] font-bold mb-3 drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]">{tx.cta_title}</h3>
          <p className="font-cormorant text-xl text-[#cabfa6] mb-8 max-w-2xl mx-auto leading-relaxed">{tx.cta_sub}</p>
          <Link href="/cocooning-touristique#formulaire"
            className="inline-block px-14 py-4 rounded-full font-cinzel text-sm tracking-widest font-bold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_40px_rgba(197,160,89,0.6)] hover:scale-105">
            {tx.cta_btn}
          </Link>
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
