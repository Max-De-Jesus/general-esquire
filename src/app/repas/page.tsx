"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";
import { UtensilsIcon, FlameIcon, CoffeeIcon } from "@/components/Icons";

// ─── Hero Carousel Slides ─────────────────────────────────────────────────────
const SLIDES = [
  {
    src: "/images/car_repas/Food.jpg",
    tag: "Chrysalides — Gastronomie",
    title: "Bienvenue dans un monde de saveurs",
    desc: "Trois repas par jour préparés avec soin, plus des collations lors des excursions.",
  },
  {
    src: "/images/car_repas/Bouillie.jpg",
    tag: "Petit-Déjeuner Traditionnel",
    title: "Bouillie & Yovodoko",
    desc: "Découvrez la bouillie de maïs, mil ou sorgho et les fameux beignets yovodoko.",
  },
  {
    src: "/images/car_repas/food3.jpg",
    tag: "Cuisine Roborative",
    title: "Mets locaux & Plats généreux",
    desc: "Viandes, poissons, crabes et sauces savoureuses à apprécier avec les doigts.",
  },
  {
    src: "/images/car_repas/Tchooh14 - Copie.jpg",
    tag: "Spécialités Béninoises",
    title: "Gari Délayé & Arachide",
    desc: "Dégustez le gari glacé accompagné des galettes d'arachide croquantes.",
  },
  {
    src: "/images/car_repas/food14.jpg",
    tag: "Options Sur-Mesure",
    title: "Petit-déjeuner occidental aussi disponible",
    desc: "Nous nous adaptons avec plaisir à vos préférences et régimes alimentaires.",
  },
];

// ─── Complete Food Gallery (images from car_repas folder) ────────────────────
const FOOD_GALLERY = [
  { src: "/images/car_repas/Food.jpg", title: "Pain Artisanal & Baguette", tag: "Petit-Déjeuner" },
  { src: "/images/car_repas/Bouillie.jpg", title: "Bouillie de Maïs & Mil", tag: "Petit-Déjeuner Local" },
  { src: "/images/car_repas/food2.jpg", title: "Bol de Légumes & Riz", tag: "Plat Équilibré" },
  { src: "/images/car_repas/food3.jpg", title: "Dîner Convivial & Vin", tag: "Repas du Soir" },
  { src: "/images/car_repas/food4.jpg", title: "Gateaux aux Fraises", tag: "Dessert & Douceurs" },
  { src: "/images/car_repas/food5.jpg", title: "Jus de Fruits & Toast", tag: "Petit-Déjeuner" },
  { src: "/images/car_repas/food6.jpg", title: "Œuf au Plat à la Poêle", tag: "Petit-Déjeuner Chaud" },
  { src: "/images/car_repas/food8.jpg", title: "Salade & Pâtes Gourmandes", tag: "Entrée Fraîche" },
  { src: "/images/car_repas/food9.jpg", title: "Burger Gourmet & Frites", tag: "Snack & Repas" },
  { src: "/images/car_repas/food10.jpg", title: "Soupe Maison & Légumes", tag: "Potage Chaud" },
  { src: "/images/car_repas/food11.jpg", title: "Sauté Asiatique & Nouilles", tag: "Cuisine du Monde" },
  { src: "/images/car_repas/food12.jpg", title: "Cocotte d'Œufs & Herbes", tag: "Brunch" },
  { src: "/images/car_repas/food13.jpg", title: "Muesli Gourmand aux Fruits", tag: "Petit-Déjeuner" },
  { src: "/images/car_repas/food14.jpg", title: "Assiette Équilibrée & Avocat", tag: "Repas Léger" },
  { src: "/images/car_repas/food15.jpg", title: "Riz Frit & Cocktails", tag: "Cuisine Épicée" },
  { src: "/images/car_repas/food16.jpg", title: "Pains Rustiques & Bols", tag: "Buffet" },
  { src: "/images/car_repas/sandwich.jpg", title: "Sandwichs Garnis", tag: "Collation Excursion" },
  { src: "/images/car_repas/Spaghetti.jpg", title: "Spaghetti & Saint-Jacques", tag: "Plat International" },
  { src: "/images/car_repas/steak - Copie.jpg", title: "Grillade de Bœuf", tag: "Viandes" },
  { src: "/images/car_repas/salmon.jpg", title: "Pavé de Saumon", tag: "Poissons" },
  { src: "/images/car_repas/Tchooh12 - Copie.jpeg", title: "Beignet Yovodoko", tag: "Douceurs Béninoises" },
  { src: "/images/car_repas/Tchooh14 - Copie.jpg", title: "Gari Délayé & Arachide", tag: "Goûter Béninois" },
  { src: "/images/car_repas/Tchooh15 - Copie.jpg", title: "Tapioca & Bouillie Blanche", tag: "Saveurs du Bénin" },
  { src: "/images/car_repas/Excursion26.jpg", title: "Pique-nique en Excursion", tag: "Collation" },
  { src: "/images/car_repas/tchooh - Copie.webp", title: "Spécialité Béninoise", tag: "Cuisine Locale" },
  { src: "/images/car_repas/Tchooh2 - Copie.jpeg", title: "Repas Traditionnel", tag: "Cuisine Béninoise" },
  { src: "/images/car_repas/Tchooh3 - Copie.jpg", title: "Plat du Jour", tag: "Menu Quotidien" },
  { src: "/images/car_repas/tTchooh4 - Copie.webp", title: "Saveurs Authentiques", tag: "Gastronomie" },
  { src: "/images/car_repas/Tchooh5 - Copie.png", title: "Délices du Bénin", tag: "Cuisine Locale" },
  { src: "/images/car_repas/Tchooh6 - Copie.jpeg", title: "Cuisine Familiale", tag: "Repas Convivial" },
  { src: "/images/car_repas/Tchooh7 - Copie.jpg", title: "Festin Béninois", tag: "Grande Table" },
  { src: "/images/car_repas/Tchooh8 - Copie.jpg", title: "Collation Légère", tag: "En-cas" },
  { src: "/images/car_repas/Tchooh9 - Copie.jpg", title: "Recette Traditionnelle", tag: "Héritage Culinaire" },
  { src: "/images/car_repas/Tchooh10 - Copie.webp", title: "Mets Épicés", tag: "Cuisine Pimentée" },
  { src: "/images/car_repas/Tchooh11 - Copie.webp", title: "Bouillon Parfumé", tag: "Soupe du Soir" },
  { src: "/images/car_repas/Tchooh16 - Copie.jpg", title: "Douceurs Locales", tag: "Dessert" },
  { src: "/images/car_repas/Tchooh17 - Copie.jpg", title: "Plateau Garni", tag: "Repas Complet" },
  { src: "/images/car_repas/Tchooh18 - Copie.png", title: "Banquet Chrysalides", tag: "Festin" },
];

// ─── CARROUSEL ROTATIF 3D EN CERCLE (COVER FLOW CYLINDER 3D — 12 CARTES VEDETTES) ──
const CAROUSEL_3D_ITEMS = FOOD_GALLERY.slice(0, 12);

function Rotating3DFoodCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const totalCards = CAROUSEL_3D_ITEMS.length;

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  // Rotation automatique continue toutes les 2,50 secondes sans nécessiter de clic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
    }, 2500);
    return () => clearInterval(timer);
  }, [totalCards]);

  // Normalized offset with circular wrap (-half .. +half)
  const getDiff = (idx: number) => {
    let d = idx - activeIndex;
    if (d > totalCards / 2) d -= totalCards;
    if (d < -totalCards / 2) d += totalCards;
    return d;
  };

  return (
    <div
      className="relative w-full max-w-5xl mx-auto select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const d = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(d) > 40) d > 0 ? nextCard() : prevCard();
        setTouchStartX(null);
      }}
    >
      {/* ── Coverflow Stage ─────────────────────────────── */}
      <div
        className="relative w-full h-[280px] sm:h-[440px] overflow-hidden"
        style={{ perspective: "1100px" }}
      >
        {CAROUSEL_3D_ITEMS.map((item, idx) => {
          const diff = getDiff(idx);
          const absD = Math.abs(diff);
          if (absD > 2) return null; // only center ± 2

          const isCenter = absD === 0;
          const xOffset = diff * 155;      // px horizontal spread
          const rotY = -diff * 42;          // tilt inward
          const scale = isCenter ? 1 : absD === 1 ? 0.76 : 0.55;
          const opacity = isCenter ? 1 : absD === 1 ? 0.68 : 0.38;
          const zIdx = 20 - absD * 6;      // center on top

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="absolute top-1/2 left-1/2 rounded-full overflow-hidden cursor-pointer"
              style={{
                width: "clamp(175px, 27vw, 305px)",
                height: "clamp(175px, 27vw, 305px)",
                transform: `translateX(calc(-50% + ${xOffset}px)) translateY(-50%) rotateY(${rotY}deg) scale(${scale})`,
                opacity,
                zIndex: zIdx,
                transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease",
                border: isCenter ? "2px solid #E9D18F" : "1px solid rgba(197,160,89,0.15)",
                boxShadow: isCenter
                  ? "0 0 50px rgba(197,160,89,0.55), 0 25px 60px rgba(0,0,0,0.6)"
                  : "0 8px 30px rgba(0,0,0,0.35)",
              }}
            >
              <Image
                src={item.src}
                alt={item.title || "Gastronomie General Esquire"}
                fill
                priority={absD < 2}
                unoptimized
                sizes="(max-width: 640px) 175px, 305px"
                className="object-cover object-center"
              />
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  isCenter
                    ? "bg-gradient-to-t from-black/80 via-black/15 to-transparent"
                    : "bg-black/52"
                }`}
              />
              {isCenter && (
                <div className="absolute bottom-4 inset-x-0 text-center px-3">
                  {item.title && (
                    <p className="font-cinzel text-[11px] sm:text-xs text-[#E9D18F] font-bold tracking-wider drop-shadow-md truncate">
                      {item.title}
                    </p>
                  )}
                  {item.tag && (
                    <p className="font-cormorant text-[10px] sm:text-[11px] text-[#C5A059] mt-0.5">
                      {item.tag}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Navigation Buttons ────────────────────────────── */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex items-center justify-between pointer-events-none z-50">
        <button
          onClick={prevCard}
          aria-label="Carte précédente"
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#131513]/80 border-2 border-[#C5A059]/60 text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#0F3823] hover:text-white transition-all duration-300 flex items-center justify-center text-xl sm:text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-110 cursor-pointer backdrop-blur-md"
        >
          ‹
        </button>
        <button
          onClick={nextCard}
          aria-label="Carte suivante"
          className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#131513]/80 border-2 border-[#C5A059]/60 text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#0F3823] hover:text-white transition-all duration-300 flex items-center justify-center text-xl sm:text-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:scale-110 cursor-pointer backdrop-blur-md"
        >
          ›
        </button>
      </div>

      {/* ── Pagination Dots ───────────────────────────────── */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-1.5 sm:gap-2 relative z-30 flex-wrap px-4">
        {CAROUSEL_3D_ITEMS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              idx === activeIndex
                ? "w-6 sm:w-8 h-2 sm:h-2.5 bg-[#C5A059] shadow-[0_0_12px_rgba(197,160,89,0.9)]"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/20 hover:bg-[#C5A059]/50"
            }`}
            aria-label={`Aller à la carte ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Professional Carousel ────────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 400);
  }, []);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl">
      <div
        className="relative w-full h-[220px] sm:h-[480px] transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image src={slide.src} alt="" fill priority unoptimized sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="absolute top-5 right-5 font-cinzel text-xs text-[#C5A059] bg-[#131513]/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30">
        {current + 1} / {SLIDES.length}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg">‹</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg">›</button>

      <div className="absolute bottom-4 right-6 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-7 h-2 bg-[#C5A059]" : "w-2 h-2 bg-white/30 hover:bg-[#C5A059]/60"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Smooth Scroll Reveal Card Component ──────────────────────────────────────
function SmoothScrollCard({ item, index }: { item: typeof FOOD_GALLERY[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-xl group cursor-pointer bg-[#131513]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.12}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.12}s`,
      }}
    >
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        <Image
          src={encodeURI(item.src)}
          alt={item.title || "Gastronomie Repas"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
      </div>


    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RepasPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] pb-12 md:pb-20 relative overflow-x-hidden">
      {/* ─── IMAGE EN ARRIÈRE-PLAN DE LA PAGE REPAS (Tchooh6.png) ─────────── */}
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <Image
          src="/images/Tchooh6.png"
          alt="Arrière-plan Repas General Esquire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 filter brightness-90 contrast-105"
        />
        {/* Layer dégradé sombre pour garantir une parfaite lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c1a]/85 via-[#1a1c1a]/70 to-[#1a1c1a]/90 backdrop-blur-[2px]" />
      </div>
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (PLEINE LARGEUR) ──────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerrepas.png"
            alt="Bannière Repas & Gastronomie — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <TickerBanner items={["GENERAL ESQUIRE", "CHRYSALIDES", "EXCELLENCE"]} className="mb-8" />

      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest flex-wrap">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{t("nav_home")}</Link>
          <span>/</span>
          <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">{t("nav_cocooning")}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{t("repas_title")}</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md">
            Chrysalides — {t("nav_cocooning")}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-4 mb-4">
            {t("repas_title")}
          </h1>
          <p className="font-cormorant text-2xl text-[#E9D18F] italic font-light">
            {t("repas_subtitle")}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Hero Carousel */}
        {/* ── TEXT CONTENT SECTIONS EN ZIG-ZAG ── */}
        <div className="space-y-12 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed mb-16">

          {/* Section 1 — Les 3 repas et goûter (Texte à Gauche, Image à Droite) */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden hover:border-[#E9D18F]/60 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-[#0F3823] border border-[#C5A059]/40 text-[#C5A059]">
                    <UtensilsIcon className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-extrabold uppercase tracking-wider">
                    {t("repas_sec1_title")}
                  </h2>
                </div>
                <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
                  {lang === "fr" ? (
                    "Trois repas sont garantis dans votre forfait, tous les jours, pendant tout votre séjour : il s'agit du petit-déjeuner, du déjeuner, et du dîner. Lors des excursions, et en cas de fringale, nous aurons également plaisir à vous servir un goûter ou une collation, en attendant le retour sur votre lieu de résidence."
                  ) : (
                    "Three full meals are included in your stay every single day: breakfast, lunch, and dinner. During excursions or whenever hunger strikes, we delight in offering tea snacks and light refreshments."
                  )}
                </p>
                <p className="text-[#EDE4CF]/80">
                  {lang === "fr" ? (
                    "Nous mettons la priorité sur les mets locaux afin d'éveiller vos papilles à la découverte de nouvelles saveurs ; mais nous respectons toujours votre régime alimentaire si vous avez des préférences particulières. Vous pouvez, si vous le souhaitez, participer à la confection du repas dans une perspective ludique ou pour en acquérir la recette."
                  ) : (
                    "We highlight rich local gastronomy to introduce your palate to vibrant new flavors, while accommodating any dietary preferences. You are welcome to join cooking workshops to learn authentic recipes."
                  )}
                </p>
              </div>

              <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl group">
                <Image
                  src="/images/car_repas/food13.jpg"
                  alt="Gastronomie et Trois Repas"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Section 2 — La cuisine béninoise (Image à Gauche, Texte à Droite) */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden hover:border-[#E9D18F]/60 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 relative h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl group">
                <Image
                  src="/images/car_repas/Tchooh9 - Copie.jpg"
                  alt="Cuisine Roborative et Épicée"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-[#0F3823] border border-[#C5A059]/40 text-[#C5A059]">
                    <FlameIcon className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-extrabold uppercase tracking-wider">
                    {t("repas_sec2_title")}
                  </h2>
                </div>
                <p>
                  {lang === "fr" ? (
                    "Roborative et épicée à souhait, la cuisine du Bénin est riche de la diversité de ses sources, résultats d'influences multiples des autres cultures autour d'elle, notamment nigérianes, togolaises, ghanéennes, ivoiriennes, sénégalaises."
                  ) : (
                    "Hearty and delightfully spiced, Beninese gastronomy draws inspiration from neighboring West African culinary traditions—including Nigerian, Togolese, Ghanaian, Ivorian, and Senegalese flavors."
                  )}
                </p>
                <p className="text-[#EDE4CF]/80">
                  {lang === "fr" ? (
                    "Viandes, crabes, crevettes, poissons et peaux de bœuf sont facilement au menu des plats les plus appréciés qui sont généralement gluants. Pour bien apprécier certains plats comme la pâte de maïs ou le foufou, il vous faudra manger avec les doigts… et les laper aussi régulièrement que possible."
                  ) : (
                    "Meats, crabs, prawns, fish, and savory sauces accompany popular dishes like corn dough or foufou—traditionally enjoyed with fingers for the full authentic experience."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 — Petit-déjeuner et goûters (Texte à Gauche, Image à Droite) */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden hover:border-[#E9D18F]/60 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-full bg-[#0F3823] border border-[#C5A059]/40 text-[#C5A059]">
                    <CoffeeIcon className="w-6 h-6 text-[#C5A059]" />
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-extrabold uppercase tracking-wider">
                    {t("repas_sec3_title")}
                  </h2>
                </div>
                <p>
                  {lang === "fr" ? (
                    "Le petit-déjeuner est généralement fait de bouillie de maïs, mil ou sorgho que l'on prend avec du lait ou du sucre, sinon des beignets ronds à base de farine de blé appelés yovodoko (littéralement, le beignet du blanc)."
                  ) : (
                    "Breakfast features warm corn or millet porridge served with milk or sugar, alongside crispy golden fritters called yovodoko."
                  )}
                </p>
                <p className="text-[#EDE4CF]/80">
                  {lang === "fr" ? (
                    "On peut aussi prendre au goûter, du tapioka au lait ou des frites d'igname et de banane appelées talétalé. Vous aurez sans doute aussi grand plaisir à découvrir le fameux gari délayé avec des glaçons, des noix ou galettes d'arachide appelées kluiklui. Mais si vous préférez un petit-déjeuner occidental classique, nous saurons vous accommoder."
                  ) : (
                    "Enjoy afternoon snacks like milk tapioca, fried yam, sweet banana fritters (talétalé), and iced gari with peanut crackers (kluiklui). Western breakfast options are always available."
                  )}
                </p>
                <blockquote className="mt-4 pl-4 border-l-4 border-[#C5A059] text-[#E9D18F] italic text-base sm:text-lg">
                  {lang === "fr"
                    ? "Imaginez un instant que c'est votre main qui tient ce magnifique beignet qui va régaler vos papilles."
                    : "Imagine holding a freshly baked, warm golden fritter ready to delight your taste buds."}
                </blockquote>
              </div>

              <div className="lg:col-span-5 relative h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl group">
                <Image
                  src="/images/car_repas/Tchooh12 - Copie.jpeg"
                  alt="Beignet Yovodoko - Saveurs du Matin et Douceurs"
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Section 4 — Proverbe & Philosophie */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl">
            <div className="absolute inset-0">
              <Image src="/images/car_repas/Food.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-[#0F3823]/88" />
            </div>

            <div className="relative z-10 p-8 sm:p-14 text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-[1px] w-16 bg-[#C5A059]" />
                <span className="text-[#C5A059] text-lg">◆</span>
                <div className="h-[1px] w-16 bg-[#C5A059]" />
              </div>

              <p className="font-cinzel text-[#E9D18F] text-xs sm:text-sm tracking-[0.25em] uppercase font-bold">
                Philosophie Gourmande du Séjour
              </p>

              <blockquote className="font-cormorant text-2xl sm:text-4xl text-white font-bold italic drop-shadow-md leading-tight max-w-3xl mx-auto">
                « C’est ce qui entre dans ton ventre qui t’appartient. »
              </blockquote>

              <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 max-w-2xl mx-auto leading-relaxed">
                Vous l’avez déjà compris, la gastronomie est une composante essentielle du cocooning que nous vous promettons. Alors dans toute situation, bonne ou mauvaise, <strong className="text-[#E9D18F] whitespace-nowrap">mangeons d’abord !</strong>
              </p>

              <div className="h-[1px] w-24 bg-[#C5A059]/40 mx-auto" />

              <p className="font-cinzel text-[10px] sm:text-xs text-[#cabfa6] tracking-wider uppercase whitespace-nowrap overflow-x-auto">
                Toutefois, dans une démarche responsable, les boissons alcoolisées ne sont pas incluses dans votre forfait.
              </p>
            </div>
          </div>

        </div>

        {/* ── CARROUSEL ROTATIF DES REPAS ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              Galerie Gourmande
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#E9D18F]">
              Découvrez la Richesse de Nos Plats
            </h2>
            <p className="font-cormorant text-lg text-[#cabfa6] mt-2">
              Découvrez l'ensemble de nos spécialités culinaires et repas préparés avec soin
            </p>
          </div>

          <Rotating3DFoodCarousel />


        </section>

        {/* ── CTA DE RÉSERVATION & 3 BOUTONS DE CONTACT ANIMÉS ── */}
        <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#C5A059]/60 shadow-[0_0_50px_rgba(197,160,89,0.3)] relative overflow-hidden group">
          {/* Sparkle background element */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A059]/10 via-transparent to-transparent pointer-events-none" />

          <span className="inline-block font-cinzel text-xs text-[#E9D18F] tracking-[0.3em] uppercase mb-3 border border-[#C5A059]/50 px-5 py-1.5 rounded-full bg-[#131513]/80 shadow-md animate-pulse">
            ✦ {lang === "fr" ? "Réservation & Contact Direct" : "Direct Contact & Booking"}
          </span>

          <h3 className="font-cinzel text-2xl sm:text-4xl text-white font-extrabold tracking-wider uppercase mb-3 drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]">
            {lang === "fr" ? "PRÊT(E) À RÉGALER VOS PAPILLES ?" : "READY TO DELIGHT YOUR PALATE?"}
          </h3>

          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            {lang === "fr"
              ? "Pension complète incluse dans votre séjour cocooning touristique. Contactez-nous directement ou réservez en ligne."
              : "Full board included in your tourist cocooning stay. Contact us directly or book online."}
          </p>

          {/* 3 Contact Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {/* 1. Email */}
            <a
              href="mailto:generalesquire@proton.me"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#131513] border-2 border-[#C5A059]/60 hover:border-[#E9D18F] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-105 hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] group"
            >
              <svg className="w-5 h-5 text-[#C5A059] group-hover:text-[#3B82F6] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{lang === "fr" ? "Contacter par Mail" : "Contact via Mail"}</span>
            </a>

            {/* 2. WhatsApp / Visio */}
            <a
              href="https://wa.me/33758264254"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#131513] border-2 border-[#25D366]/70 hover:border-[#25D366] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] group"
            >
              <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>{lang === "fr" ? "WhatsApp / Visio" : "WhatsApp / Visio"}</span>
            </a>

            {/* 3. Phone */}
            <a
              href="tel:+33159581725"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#131513] border-2 border-[#C5A059]/60 hover:border-[#E9D18F] text-[#EDE4CF] hover:text-white font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.2)] hover:scale-105 hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] group"
            >
              <svg className="w-5 h-5 text-[#C5A059] group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.12.45 2.33.69 3.58.69a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.58a1 1 0 01-.21 1.11l-2.2 2.2z" />
              </svg>
              <span>{lang === "fr" ? "Appel Direct" : "Direct Phone"}</span>
            </a>
          </div>

          {/* Golden Main Action Button */}
          <Link
            href="/cocooning-touristique#formulaire"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-cinzel text-xs sm:text-sm tracking-widest uppercase font-bold text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all shadow-[0_0_35px_rgba(197,160,89,0.5)] hover:scale-105 group cursor-pointer"
          >
            <span>{lang === "fr" ? "Inscrivez-vous au Séjour →" : "Book my Stay →"}</span>
          </Link>
        </section>

        {/* Back Link */}
        <div className="text-center mt-12">
          <Link href="/" className="font-cinzel text-xs tracking-widest text-[#C5A059] hover:text-[#E9D18F] transition-colors inline-flex items-center gap-2">
            ← RETOUR À L'ACCUEIL
          </Link>
        </div>
      </div>
    </div>
  );
}
