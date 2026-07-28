"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

// ─── Wellness Carousel Slides ────────────────────────────────────────────────
const WELLNESS_SLIDES = [
  { src: "/images/Massage.jpg", tag: "Massages & Soins Corps", title: "Séances de Massage Apaisantes", desc: "Laissez-vous choyer par nos praticiens qualifiés pour libérer toutes les tensions accumulées." },
  { src: "/images/Femmezen2.jpg", tag: "Douceur & Sérénité", title: "Bienvenue dans un Monde de Douceur", desc: "Un cadre idyllique spécialement conçu pour accueillir votre processus de résilience." },
  { src: "/images/massage2.jpg", tag: "Ressourcement Psychologique", title: "Prise en Charge de la Souffrance Émotionnelle", desc: "Un accompagnement attentif pour panser les blessures de la vie et des épreuves judiciaires." },
  { src: "/images/Soins.jpg", tag: "Guide Personnel Attentif", title: "Un Accompagnant à Vos Côtés", desc: "Votre guide personnel veille à ce que rien n'entame vos précieux instants de bonheur." },
  { src: "/images/Chant2.jpg", tag: "Soirées & Spectacles", title: "Récitals, Musique & Convivialité", desc: "Des moments de joie partagée dans une ambiance amicale et chaleureuse." },
];

// ─── Gallery (infinite marquee strip) ────────────────────────────────────────
const GALLERY_ROW1 = [
  { src: "/images/Massage.jpg", title: "Massage & Relaxation", category: "Soins" },
  { src: "/images/massage2.jpg", title: "Rituel Bien-Être", category: "Détente" },
  { src: "/images/massage3.jpg", title: "Apaisement Profond", category: "Sérénité" },
  { src: "/images/massage4.jpg", title: "Soins & Huiles Essentielles", category: "Massage" },
  { src: "/images/Soins.jpg", title: "Soins du Corps", category: "Esthétique" },
  { src: "/images/Soins2.jpg", title: "Ressourcement", category: "Calme" },
];
const GALLERY_ROW2 = [
  { src: "/images/Femmezen.jpg", title: "Sérénité Intérieure", category: "Bien-Être" },
  { src: "/images/Femmezen2.jpg", title: "Douceur & Paix", category: "Évasion" },
  { src: "/images/Bougie.jpg", title: "Ambiance Tamisée", category: "Soirées" },
  { src: "/images/Chant2.jpg", title: "Spectacles & Musique", category: "Culture" },
  { src: "/images/Embrassade.jpg", title: "Chaleur Humaine", category: "Bienveillance" },
  { src: "/images/Welcome.jpg", title: "Promenades en Ville", category: "Balades" },
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

// ─── Infinite Marquee Strip ───────────────────────────────────────────────────
function MarqueeStrip({ items, reverse = false }: { items: typeof GALLERY_ROW1; reverse?: boolean }) {
  const doubled = [...items, ...items]; // duplicate for seamless loop
  return (
    <div className="overflow-hidden group">
      <div
        className={`flex gap-4 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: "28s" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-72 h-52 rounded-2xl overflow-hidden border border-[#C5A059]/25 shadow-lg group/card cursor-pointer hover:border-[#E9D18F]/60 transition-all duration-500"
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="288px"
              className="object-cover object-center group-hover/card:scale-110 transition-transform duration-700 brightness-90"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Hover shimmer */}
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 bg-gradient-to-tr from-transparent via-white/8 to-transparent transition-opacity duration-500" />
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover/card:translate-y-0 transition-transform duration-400">
              <span className="font-cinzel text-[9px] text-[#C5A059] tracking-widest uppercase bg-[#131513]/85 border border-[#C5A059]/40 px-2.5 py-0.5 rounded-full inline-block mb-1.5 backdrop-blur-md">
                ✦ {item.category}
              </span>
              <h3 className="font-cinzel text-sm font-bold text-white drop-shadow leading-tight">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Symmetric Info Card (full-width, centered text + image) ─────────────────
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
          <Image src="/images/D├®tente2.jpg" alt="Bannière Détente & Sérénité — General Esquire" fill priority className="object-cover object-[center_40%] brightness-95 contrast-105 animate-kenburns" />
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
            image="/images/Soins.jpg"
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
                  ? "« Il n'y a aucune raison d'être timide ; c'est une ambiance bonne enfant, le mot d'ordre étant la bienveillance. »"
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

        {/* ── GALERIE INFINITE MARQUEE ───────────────────────────────────────── */}
        <section className="mb-20 -mx-4 sm:-mx-8 xl:-mx-16">
          <div className="text-center mb-10 px-4">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3 animate-pulse">
              ✦ {lang === "fr" ? "Galerie d'Ambiance" : "Atmosphere Gallery"}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl text-[#E9D18F] font-bold mb-2">
              {lang === "fr" ? "Instants de Douceur en Images" : "Moments of Softness in Pictures"}
            </h2>
            <p className="font-cormorant text-lg text-[#cabfa6]">
              {lang === "fr" ? "Survolez les images pour mettre en pause le défilement" : "Hover to pause the scroll"}
            </p>
          </div>

          {/* Row 1 — left to right */}
          <div className="mb-4">
            <MarqueeStrip items={GALLERY_ROW1} reverse={false} />
          </div>
          {/* Row 2 — right to left */}
          <MarqueeStrip items={GALLERY_ROW2} reverse={true} />
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

      {/* Marquee keyframes */}
      <style jsx global>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee         { animation: marquee         linear infinite; }
        .animate-marquee-reverse { animation: marquee-reverse linear infinite; }
      `}</style>
    </>
  );
}
