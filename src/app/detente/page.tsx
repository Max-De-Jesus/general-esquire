"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

// ─── Wellness Carousel Slides ────────────────────────────────────────────────
const WELLNESS_SLIDES = [
  {
    src: "/images/Massage.jpg",
    tag: "Massages & Soins Corps",
    title: "Séances de Massage Apaisantes",
    desc: "Laissez-vous choyer par nos praticiens qualifiés pour libérer toutes les tensions accumulées.",
  },
  {
    src: "/images/Femmezen2.jpg",
    tag: "Douceur & Sérénité",
    title: "Bienvenue dans un Monde de Douceur",
    desc: "Un cadre idyllique spécialement conçu pour accueillir votre processus de résilience.",
  },
  {
    src: "/images/massage2.jpg",
    tag: "Ressourcement Psychologique",
    title: "Prise en Charge de la Souffrance Émotionnelle",
    desc: "Un accompagnement attentif pour panser les blessures de la vie et des épreuves judiciaires.",
  },
  {
    src: "/images/Soins.jpg",
    tag: "Guide Personnel Attentif",
    title: "Un Accompagnant à Vos Côtés",
    desc: "Votre guide personnel veille à ce que rien n'entame vos précieux instants de bonheur.",
  },
  {
    src: "/images/Chant2.jpg",
    tag: "Soirées & Spectacles",
    title: "Récitals, Musique & Convivialité",
    desc: "Des moments de joie partagée dans une ambiance amicale et chaleureuse.",
  },
];

// ─── Photo Gallery ───────────────────────────────────────────────────────────
const GALLERY = [
  { src: "/images/Massage.jpg", title: "Massage & Relaxation", category: "Soins" },
  { src: "/images/massage2.jpg", title: "Rituel Bien-Être", category: "Détente" },
  { src: "/images/massage3.jpg", title: "Apaisement Profond", category: "Sérénité" },
  { src: "/images/massage4.jpg", title: "Soins & Huiles Essentielles", category: "Massage" },
  { src: "/images/Soins.jpg", title: "Soins du Corps", category: "Esthétique" },
  { src: "/images/Soins2.jpg", title: "Instant de Ressourcement", category: "Calme" },
  { src: "/images/Femmezen.jpg", title: "Sérénité Intérieure", category: "Bien-Être" },
  { src: "/images/Femmezen2.jpg", title: "Douceur & Paix", category: "Évasion" },
  { src: "/images/Bougie.jpg", title: "Ambiance Tamisée & Récital", category: "Soirées" },
  { src: "/images/Chant2.jpg", title: "Spectacles & Musique", category: "Culture" },
  { src: "/images/Embrassade.jpg", title: "Chaleur Humaine & Partage", category: "Bienveillance" },
  { src: "/images/Welcome.jpg", title: "Promenades en Ville", category: "Balades" },
];

// ─── Carousel Component ──────────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % WELLNESS_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + WELLNESS_SLIDES.length) % WELLNESS_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 shadow-2xl bg-[#131513]">
      <div className="relative h-[320px] sm:h-[420px] md:h-[500px] w-full">
        {WELLNESS_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === current ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover object-center filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-[#131513]/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 max-w-2xl">
              <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase px-3 py-1 bg-[#131513]/80 rounded-full border border-[#C5A059]/40 backdrop-blur-md inline-block mb-2">
                {slide.tag}
              </span>
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-white tracking-wide drop-shadow-md">
                {slide.title}
              </h2>
              <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 mt-2 font-light drop-shadow">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#131513]/70 border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center cursor-pointer"
        aria-label="Diapositive précédente"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#131513]/70 border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all flex items-center justify-center cursor-pointer"
        aria-label="Diapositive suivante"
      >
        &#10095;
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 right-6 z-20 flex gap-2">
        {WELLNESS_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-[#C5A059] w-7" : "bg-[#C5A059]/40"
            }`}
            aria-label={`Aller à la diapositive ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────
export default function DetentePage() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Soins", "Massage", "Sérénité", "Soirées", "Bienveillance"];

  const filteredGallery = selectedCategory === "Tous"
    ? GALLERY
    : GALLERY.filter((item) => item.category === selectedCategory);

  return (
    <>
      {/* ─── 1. EN-TÊTE : BANNIÈRE DÉTENTE ─────────────────────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/Femmezen2.jpg"
            alt="Bannière Détente & Sérénité — General Esquire Chrysalides"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      <div className="w-full px-4 sm:px-8 xl:px-16 py-12 md:py-20 relative">
        {/* Background filigrane */}
        <div className="absolute inset-0 -z-10 opacity-[0.08] pointer-events-none">
          <Image src="/images/background.jpeg" alt="" fill className="object-cover" />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] uppercase tracking-widest flex-wrap">
            <Link href="/" className="hover:text-[#E9D18F] transition-colors">
              {lang === "fr" ? "Accueil" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">
              {lang === "fr" ? "Cocooning Touristique" : "Tourist Cocooning"}
            </Link>
            <span>/</span>
            <span className="text-[#EDE4CF]">
              {lang === "fr" ? "Détente & Sérénité" : "Relaxation & Serenity"}
            </span>
          </div>
          <Link
            href="/cocooning-touristique"
            className="font-cinzel text-xs text-[#C5A059] hover:text-[#E9D18F] transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> {lang === "fr" ? "RETOUR AU COCOONING" : "BACK TO COCOONING"}
          </Link>
        </div>

        {/* Hero Header Title Block */}
        <div className="text-center mb-12">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md">
            Chrysalides — {lang === "fr" ? "Soins, Détente & Résilience" : "Care, Relaxation & Resilience"}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-4 mb-4">
            DÉTENTE
          </h1>
          <p className="font-cormorant text-2xl sm:text-3xl text-[#E9D18F] italic font-light">
            Bienvenue dans un monde de douceur
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* Hero Carousel */}
        <section className="mb-16">
          <HeroCarousel />
        </section>

        {/* ─── PRINCIPAL TEXTE DE PRÉSENTATION & BIENVEILLANCE ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-cormorant text-xl sm:text-2xl text-[#EDE4CF]/90 leading-relaxed mb-16">
          
          {/* Card 1: Prise en charge émotionnelle */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🌿</span>
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">
                {lang === "fr" ? "Prendre en charge votre souffrance émotionnelle" : "Taking Care of Your Emotional Well-Being"}
              </h2>
            </div>
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
              {lang === "fr" ? (
                "General Esquire, cabinet de conseil juridique, se veut aussi une agence de cocooning touristique. Cela signifie concrètement, que notre ambition est de prendre en charge votre souffrance émotionnelle, pendant la quinzaine de votre séjour auprès de nous."
              ) : (
                "General Esquire, a legal advisory firm, also acts as a tourist cocooning agency. Concretely, our ambition is to take care of your emotional well-being throughout your two-week stay with us."
              )}
            </p>
            <p className="mt-4">
              {lang === "fr" ? (
                "Nous le faisons avec beaucoup de bienveillance pour que celles et ceux d’entre vous qui ont durement été affectés par les difficultés de la vie, ou simplement éprouvés par la dureté d’une procédure judiciaire, puissent rapidement entamer leur processus de résilience."
              ) : (
                "We do so with great compassion so that those of you affected by life's hardships or tested by difficult legal procedures can quickly embark on their journey of resilience."
              )}
            </p>
          </div>

          {/* Card 2: Le rôle de votre guide personnel */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🤝</span>
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">
                {lang === "fr" ? "Un guide personnel dédié à votre bonheur" : "A Dedicated Personal Guide"}
              </h2>
            </div>
            <p>
              {lang === "fr" ? (
                "Pendant tout votre séjour, votre guide personnel est à vos côtés pour veiller à ce que vous ne manquiez de rien, ou que rien n’entame vos instants heureux."
              ) : (
                "Throughout your entire stay, your personal guide stands by your side to ensure you lack nothing and that nothing diminishes your happy moments."
              )}
            </p>
          </div>

          {/* Card 3: Activités de détente & Ambiance bonne enfant */}
          <div className="bg-gradient-to-r from-[#0F3823]/90 via-[#131513] to-[#0F3823]/90 border-2 border-[#C5A059]/50 rounded-3xl p-8 sm:p-12 shadow-2xl lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">✨</span>
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">
                {lang === "fr" ? "Activités, Massages & Convivialité" : "Activities, Massages & Shared Joy"}
              </h2>
            </div>
            <p>
              {lang === "fr" ? (
                "Au titre de ceux-ci, sont prévues plusieurs activités comme des séances de massage, des promenades en ville avec votre guide, des soirées dansantes, des récitals ou spectacles auxquels vous serez convié(e) ou associé(e) si vous avez envie de nous faire profiter de vos talents."
              ) : (
                "Among these moments, several activities are organized: relaxing massage sessions, city walks with your guide, dance evenings, recitals or shows to which you are invited or involved if you wish to share your talents."
              )}
            </p>
            <p className="mt-4 italic text-[#E9D18F] font-light">
              {lang === "fr" ? (
                "« Il n’y a aucune raison d’être timide ; c’est une ambiance bonne enfant, le mot d’ordre étant la bienveillance. »"
              ) : (
                "“There is no reason to be shy; it is a warm, friendly atmosphere where kindness is our guiding principle.”"
              )}
            </p>
          </div>

        </div>

        {/* ─── 4 PILLARS OF DETENTE GRID ────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Programme de Sérénité" : "Serenity Program"}
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-[#E9D18F]">
              {lang === "fr" ? "Nos Moments Privilégiés" : "Our Special Moments"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0e100e] border border-[#C5A059]/40 hover:border-[#E9D18F] transition-all text-center group">
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">💆</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider mb-2">
                MASSAGES & SOINS
              </h3>
              <p className="font-cormorant text-base text-[#EDE4CF]/80">
                Séances de massage professionnel et rituels de relaxation du corps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e100e] border border-[#C5A059]/40 hover:border-[#E9D18F] transition-all text-center group">
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🚶</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider mb-2">
                PROMENADES EN VILLE
              </h3>
              <p className="font-cormorant text-base text-[#EDE4CF]/80">
                Balades guidées et découvertes urbaines avec votre guide dédié.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e100e] border border-[#C5A059]/40 hover:border-[#E9D18F] transition-all text-center group">
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">💃</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider mb-2">
                SOIRÉES DANSANTES
              </h3>
              <p className="font-cormorant text-base text-[#EDE4CF]/80">
                Fêtes conviviales, rythmes entraînants et joie partagée.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0e100e] border border-[#C5A059]/40 hover:border-[#E9D18F] transition-all text-center group">
              <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🎭</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider mb-2">
                RÉCITALS & SPECTACLES
              </h3>
              <p className="font-cormorant text-base text-[#EDE4CF]/80">
                Représentations culturelles et scènes ouvertes pour vos talents.
              </p>
            </div>
          </div>
        </section>

        {/* ─── GALERIE DE PHOTOS DÉTENTE ───────────────────────────────────────── */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Galerie d'Ambiance" : "Atmosphere Gallery"}
            </span>
            <h2 className="font-cinzel text-2xl sm:text-4xl text-[#E9D18F] mb-6">
              {lang === "fr" ? "Instants de Douceur en Images" : "Moments of Softness in Pictures"}
            </h2>

            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-cinzel text-xs tracking-wider transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#C5A059] text-black font-bold shadow-md"
                      : "bg-[#131513] text-[#EDE4CF]/70 border border-[#C5A059]/30 hover:text-[#E9D18F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredGallery.map((item, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group cursor-pointer"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="font-cinzel text-[10px] text-[#C5A059] tracking-widest uppercase bg-[#131513]/80 px-2.5 py-0.5 rounded-full border border-[#C5A059]/30 inline-block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-cinzel text-sm font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CALL TO ACTION ──────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border border-[#C5A059]/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <h2 className="font-cinzel text-2xl sm:text-4xl text-[#E9D18F] font-bold mb-4">
            {lang === "fr" ? "Prêt(e) à vivre cet instant de douceur ?" : "Ready to Experience True Serenity?"}
          </h2>
          <p className="font-cormorant text-xl text-[#EDE4CF]/90 max-w-2xl mx-auto mb-8 font-light">
            {lang === "fr"
              ? "Rejoignez-nous pour notre prochain séjour de cocooning touristique. Tout est pensé pour votre bien-être et votre résilience."
              : "Join us for our upcoming tourist cocooning retreat. Everything is tailored for your well-being and resilience."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cocooning-touristique"
              className="px-8 py-4 rounded-full font-cinzel text-xs sm:text-sm font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:shadow-[0_0_20px_rgba(197,160,89,0.6)] hover:scale-105 transition-all duration-300 uppercase"
            >
              {lang === "fr" ? "Réserver mon séjour →" : "Book My Stay →"}
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
