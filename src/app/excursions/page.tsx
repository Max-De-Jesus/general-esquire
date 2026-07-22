"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

// ─── Carousel slides — bilingual ─────────────────────────────────────────────
const SLIDES_FR = [
  {
    src: "/images/excursion1.jpg",
    tag: "Bienvenue au Bénin",
    title: "Un monde d'émerveillement vous attend",
    desc: "Dès votre descente d'avion, votre guide General Esquire – Chrysalides vous accueille.",
  },
  {
    src: "/images/Excursion22.jpg",
    tag: "Cotonou",
    title: "La capitale économique aux mille attraits",
    desc: "Vibrant carrefour d'échanges, de cultures et d'histoires insolites.",
  },
  {
    src: "/images/Excursion12.jpg",
    tag: "Ouidah — Cité du Vaudou",
    title: "Hauts-lieux historiques & Voodoo Days",
    desc: "Participez au festival Voodoo Days, organisé justement pendant votre séjour.",
  },
  {
    src: "/images/Excursion4.jpg",
    tag: "Abomey — Palais Royaux",
    title: "Les rois au passé glorieux",
    desc: "Temples, forêts sacrées, palais royaux — l'histoire du Bénin s'offre à vous.",
  },
  {
    src: "/images/Excursion9.jpg",
    tag: "Découverte & Évasion",
    title: "Plein les yeux, les oreilles et les mains",
    desc: "Quinze jours d'enchantement : danses rituelles, cérémonies vaudou, villages lacustres.",
  },
];

const SLIDES_EN = [
  {
    src: "/images/excursion1.jpg",
    tag: "Welcome to Benin",
    title: "A world of wonder awaits you",
    desc: "From the moment you land, your General Esquire – Chrysalides guide is there to welcome you.",
  },
  {
    src: "/images/Excursion22.jpg",
    tag: "Cotonou",
    title: "The vibrant economic capital",
    desc: "A lively crossroads of commerce, cultures and fascinating stories.",
  },
  {
    src: "/images/Excursion12.jpg",
    tag: "Ouidah — City of Voodoo",
    title: "Historic Sites & Voodoo Days Festival",
    desc: "Take part in the Voodoo Days festival, which takes place during your stay.",
  },
  {
    src: "/images/Excursion4.jpg",
    tag: "Abomey — Royal Palaces",
    title: "Kings of a glorious past",
    desc: "Temples, sacred forests, royal palaces — the history of Benin unfolds before you.",
  },
  {
    src: "/images/Excursion9.jpg",
    tag: "Discovery & Escape",
    title: "A feast for eyes, ears and hands",
    desc: "Fifteen days of enchantment: ritual dances, voodoo ceremonies, lake villages.",
  },
];

const GALLERY = [
  "/images/excursion1.jpg",
  "/images/Excursion2.jpg",
  "/images/Excursion4.jpg",
  "/images/Excursion5.webp",
  "/images/Excursion6.jpg",
  "/images/Excursion7.jpg",
  "/images/Excursion9.jpg",
  "/images/Excursion10.jpg",
  "/images/Excursion12.jpg",
  "/images/Excursion17.jpg",
  "/images/Excursion18.jpeg",
  "/images/Excursion19.jpg",
  "/images/Excursion20.jpg",
  "/images/Excursion21.jpg",
  "/images/Excursion22.jpg",
  "/images/Excursion23.jpg",
  "/images/Excursion24.jpg",
  "/images/Excursion25.jpg",
  "/images/Excursion26.jpg",
  "/images/Excursions27.jpg",
  "/images/Excursion28.jpg",
  "/images/Excursion30.jpg",
  "/images/Excursion31.jpg",
  "/images/Egungun.jpg",
  "/images/Chant2.jpg",
  "/images/Chant3.jpg",
  "/images/Tchooh7.jpg",
  "/images/Tchooh9.jpg",
  "/images/Tchooh12.jpeg",
];

// ─── Hero Carousel ────────────────────────────────────────────────────────────
function HeroCarousel({ slides }: { slides: typeof SLIDES_FR }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 400);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl">
      <div
        className="relative w-full h-[340px] sm:h-[460px] transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image src={slide.src} alt={slide.title} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 transition-all duration-500"
        style={{ opacity: fading ? 0 : 1, transform: fading ? "translateY(8px)" : "translateY(0)" }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#C5A059]/50 bg-[#0F3823]/70 backdrop-blur-md text-[#C5A059] font-cinzel text-[10px] tracking-[0.25em] uppercase mb-3">
          ◆ {slide.tag}
        </span>
        <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-white leading-snug mb-2 drop-shadow-lg max-w-2xl">
          {slide.title}
        </h2>
        <p className="font-cormorant text-base sm:text-xl text-[#EDE4CF]/90 max-w-xl leading-relaxed">{slide.desc}</p>
      </div>

      <div className="absolute top-5 right-5 font-cinzel text-xs text-[#C5A059] bg-[#131513]/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30">
        {current + 1} / {slides.length}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg">‹</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg">›</button>

      <div className="absolute bottom-4 right-6 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "w-7 h-2 bg-[#C5A059]" : "w-2 h-2 bg-white/30 hover:bg-[#C5A059]/60"}`}
          />
        ))}
      </div>
    </div>
  );
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
    subtitle: lang === "fr" ? "« Bienvenue dans un monde d'émerveillement »" : "\u201cWelcome to a World of Wonder\u201d",
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
      ? "En quinze jours, vous n'aurez peut-être pas vu tout le Bénin ; mais il y a des incontournables, à commencer par la capitale économique Cotonou, Ouidah, la cité du Vaudou, et Abomey, celle des rois au passé glorieux."
      : "In fifteen days you may not see all of Benin, but the must-sees include the economic capital Cotonou, Ouidah the city of Voodoo, and Abomey, the city of kings with a glorious past.",
    must_p2: lang === "fr"
      ? "Vous aurez sans doute l'occasion d'assister à des danses rituelles, des démonstrations de magie, des cérémonies vaudou… toutes choses qui vont vous émerveiller et élargir votre ouverture d'esprit."
      : "You will likely witness ritual dances, magic demonstrations, voodoo ceremonies — all of which will fill you with wonder and broaden your mind.",
    must_quote: lang === "fr"
      ? "Notre préoccupation est de vous divertir, vous faire passer d'agréables moments, et vous apporter une forme de soutien psychologique par-delà la dureté de la vie."
      : "Our goal is to entertain you, help you enjoy wonderful moments, and offer a form of psychological support beyond the hardships of daily life.",
    gallery_tag: lang === "fr" ? "Découvrez la variété" : "Discover the Variety",
    gallery_title: lang === "fr" ? "Galerie des Excursions" : "Excursions Gallery",
    gallery_sub_pre: lang === "fr" ? "" : "",
    cta_title: lang === "fr" ? "Prêt pour l'aventure béninoise ?" : "Ready for the Beninese Adventure?",
    cta_sub: lang === "fr"
      ? "Inscriptions ouvertes de février à fin septembre pour le séjour de janvier."
      : "Registrations open from February to end of September for the January stay.",
    cta_btn: lang === "fr" ? "S'inscrire au Séjour →" : "Book Your Stay →",
    back: lang === "fr" ? "← RETOUR À L'ACCUEIL" : "← BACK TO HOME",
  };

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] relative">
      <div className="absolute inset-0 -z-10 opacity-[0.07] pointer-events-none">
        <Image src="/images/background.jpeg" alt="" fill className="object-cover" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{tx.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{tx.breadcrumb_page}</span>
        </div>

        {/* Page header */}
        <div className="text-center mb-10">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md">
            {tx.tag}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-4 mb-4">
            {tx.title}
          </h1>
          <p className="font-cormorant text-2xl text-[#E9D18F] italic font-light">{tx.subtitle}</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Hero Carousel */}
        <section className="mb-16">
          <HeroCarousel slides={slides} />
        </section>

        {/* Content Blocks */}
        <div className="space-y-10 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed mb-16">

          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-7 h-7 text-[#C5A059] text-2xl">🧭</span>
              <h2 className="font-cinzel text-xl text-[#E9D18F] font-bold">{tx.guide_title}</h2>
            </div>
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">{tx.guide_p1}</p>
            <p className="mt-4">{tx.guide_p2}</p>
          </div>

          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📅</span>
              <h2 className="font-cinzel text-xl text-[#E9D18F] font-bold">{tx.prep_title}</h2>
            </div>
            <p>{tx.prep_p}</p>
          </div>

          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🌍</span>
              <h2 className="font-cinzel text-xl text-[#E9D18F] font-bold">{tx.heart_title}</h2>
            </div>
            <p>{tx.heart_p1}</p>
            <p className="mt-4">{tx.heart_p2}</p>
          </div>

          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🏛️</span>
              <h2 className="font-cinzel text-xl text-[#E9D18F] font-bold">{tx.must_title}</h2>
            </div>
            <p>{tx.must_p1}</p>
            <p className="mt-4">{tx.must_p2}</p>
            <blockquote className="mt-6 pl-6 border-l-4 border-[#C5A059] text-[#E9D18F] italic font-light text-lg">
              {tx.must_quote}
            </blockquote>
          </div>
        </div>

        {/* Gallery */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">{tx.gallery_tag}</span>
            <h2 className="font-cinzel text-3xl text-[#E9D18F]">{tx.gallery_title}</h2>
            <p className="font-cormorant text-base text-[#cabfa6] mt-2">
              {GALLERY.length} {lang === "fr" ? "photos pour vous donner un avant-goût de votre aventure béninoise" : "photos to give you a taste of your Beninese adventure"}
            </p>
          </div>
          <div className="[column-count:2] sm:[column-count:3] lg:[column-count:4]" style={{ columnGap: "1rem" }}>
            {GALLERY.map((src, i) => (
              <div key={i} className="relative mb-4 break-inside-avoid rounded-xl overflow-hidden border border-[#C5A059]/20 shadow-lg group" style={{ breakInside: "avoid" }}>
                <Image src={src} alt={`Excursion Bénin ${i + 1}`} width={400} height={300}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                <div className="absolute inset-0 bg-[#C5A059]/0 group-hover:bg-[#C5A059]/10 transition-all duration-300 flex items-end p-3 opacity-0 group-hover:opacity-100">
                  <span className="font-cinzel text-[10px] text-[#E9D18F] tracking-widest uppercase bg-[#131513]/70 px-2 py-0.5 rounded-full">◆ Bénin</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-[#0F3823]/70 via-[#131513] to-[#0F3823]/70 border border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">{tx.cta_title}</h3>
          <p className="font-cormorant text-lg text-[#cabfa6] mb-6">{tx.cta_sub}</p>
          <Link href="/cocooning-touristique#formulaire"
            className="inline-block px-12 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:scale-105">
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
