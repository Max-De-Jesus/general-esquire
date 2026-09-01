"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";
import { HomeIcon, HandshakeIcon, StarIcon } from "@/components/Icons";

// ─── Hero carousel slides (Images 100% uniques) ─────────────────────────────
const SLIDES_FR = [
  {
    src: "/images/Kwabo.avif",
    tag: "Chrysalides — Bénin",
    title: "Bienvenue dans un monde de bienveillance",
    desc: "Un accueil chaleureux vous attend dès votre arrivée à l'aéroport Bernardin Gantin de Cotonou.",
  },
  {
    src: "/images/Dormir.jpg",
    tag: "Résidence & Sérénité",
    title: "Pas un hôtel — une vraie maison",
    desc: "Un subtil mélange entre le confort hôtelier occidental et la chaleur humaine de votre hôte.",
  },
  {
    src: "/images/carousel2.png",
    tag: "Confort & Propreté",
    title: "Votre lieu de vie pendant 15 jours",
    desc: "Chaque pensionnaire se voit affecter un ou une guide dédiée, aux petits soins avec lui.",
  },
  {
    src: "/images/Repos.jpg",
    tag: "Repos Mérité",
    title: "Reposez-vous pleinement",
    desc: "General Esquire a pris toutes les dispositions matérielles pour garantir un séjour de haute qualité.",
  },
  {
    src: "/images/carousel5.png",
    tag: "Bienveillance & Ressourcement",
    title: "Fuyez la solitude anonyme des hôtels",
    desc: "Ici, vous êtes reçu comme un membre de la famille, avec authenticité et chaleur africaine.",
  },
];

const SLIDES_EN = [
  {
    src: "/images/Kwabo.avif",
    tag: "Chrysalides — Benin",
    title: "Welcome to a World of Caring Hospitality",
    desc: "A warm welcome awaits you upon landing at Bernardin Gantin Airport in Cotonou.",
  },
  {
    src: "/images/Dormir.jpg",
    tag: "Private Living & Serenity",
    title: "Not a Hotel — A Real Home",
    desc: "A refined blend of premium hospitality standards and genuine local family warmth.",
  },
  {
    src: "/images/carousel2.png",
    tag: "Comfort & Elegance",
    title: "Your Peaceful Sanctuary for 15 Days",
    desc: "Each guest is accompanied by a dedicated personal guide attending to every need.",
  },
  {
    src: "/images/Repos.jpg",
    tag: "Restful Retreat",
    title: "Unwind in Total Peace",
    desc: "General Esquire ensures high-end comfort and peaceful rest throughout your stay.",
  },
  {
    src: "/images/carousel5.png",
    tag: "Genuine Connection",
    title: "Escape Impersonal Hotel Isolation",
    desc: "Here, you are welcomed like family with authentic, heartwarming African hospitality.",
  },
];

// ─── Gallery images (Photos valides uniques & sans doublons) ─────────────────
const GALLERY = [
  { src: "/images/Bienvenue.jpg", label: "Accueil" },
  { src: "/images/Femmezen.jpg", label: "Détente" },
  { src: "/images/Massage.jpg", label: "Soins" },
  { src: "/images/Soins.jpg", label: "Bien-être" },
  { src: "/images/Soins2.jpg", label: "Ressourcement" },
  { src: "/images/Soins3.jpg", label: "Confort" },
  { src: "/images/Soins4.jpg", label: "Sérénité" },
  { src: "/images/Soins5.jpg", label: "Apaisement" },
  { src: "/images/Soins7.jpg", label: "Tranquillité" },
];

// ─── Professional Carousel ────────────────────────────────────────────────────
function HeroCarousel() {
  const { lang } = useLanguage();
  const slides = lang === "fr" ? SLIDES_FR : SLIDES_EN;
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((idx: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(idx); setFading(false); }, 400);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl">
      <div
        className="relative w-full h-[220px] sm:h-[480px] transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image src={slide.src} alt="" fill priority unoptimized className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Counter */}
      <div className="absolute top-5 right-5 font-cinzel text-xs text-[#C5A059] bg-[#131513]/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30">
        {current + 1} / {slides.length}
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg cursor-pointer">‹</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg cursor-pointer">›</button>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${i === current ? "w-7 h-2 bg-[#C5A059]" : "w-2 h-2 bg-white/30 hover:bg-[#C5A059]/60"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HebergementPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="relative min-h-screen text-[#EDE4CF] pb-12 md:pb-20 overflow-x-hidden">
      {/* ─── IMAGE EN ARRIÈRE-PLAN VISIBLE ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/arriere_plan/arriere-hebergement.jpg"
          alt="Arrière-plan Hébergement Cocooning — General Esquire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55 filter brightness-95 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1c1a]/75 via-[#1a1c1a]/60 to-[#1a1c1a]/85 backdrop-blur-[0.5px]" />
      </div>

      <div className="relative z-10">
        {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (PLEINE LARGEUR) ──────────────── */}
        <header className="w-full bg-[#131513] overflow-hidden">
          <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
            <Image
              src="/images/Welcome.jpg"
              alt="Bannière Hébergement — General Esquire"
              fill
              priority
              className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
            />
          </div>
        </header>

        {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
        <TickerBanner className="mb-8" />

        <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-1.5 font-cinzel text-[10px] sm:text-xs text-[#C5A059] mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{t("nav_home")}</Link>
          <span>/</span>
          <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">{t("nav_cocooning")}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{t("hebergement_title")}</span>
        </div>

        {/* Page header */}
        <div className="text-center mb-10">
          <span className="font-cinzel text-[10px] sm:text-xs text-[#C5A059] tracking-[0.15em] sm:tracking-[0.3em] uppercase border border-[#C5A059]/40 px-3 sm:px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md inline-block max-w-full truncate">
            Chrysalides — {t("nav_cocooning")}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mt-4 mb-4">
            {t("hebergement_title")}
          </h1>
          <p className="font-cormorant text-2xl text-[#E9D18F] italic font-light">
            {t("hebergement_subtitle")}
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

        {/* ── SECTIONS ZIGZAG (TEXTE & IMAGE CÔTÉ À CÔTÉ ALTERNÉS) ── */}
        <div className="space-y-16 mb-20 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed">

          {/* ZIGZAG 1 : Organiser son départ depuis Paris (Texte Gauche — Image Droite) */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden group hover:border-[#C5A059] transition-all">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">✈️</span>
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">
                  {t("hebergement_how_title")}
                </h2>
              </div>
              <div className="h-[2px] w-16 bg-gradient-to-r from-[#C5A059] to-transparent mb-4" />
              <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
                {lang === "fr" ? (
                  "Sous l'enseigne Chrysalides, notre société déploie au Bénin, une fois par an, ses activités de cocooning touristique. Cela commence à Paris, dans l'un des deux aéroports de la capitale — Roissy-Charles de Gaulle ou Orly — où chaque voyageur est accueilli au départ de la France par un membre de notre équipe qui prend le même vol pour la même destination. C'est déjà un premier guide."
                ) : (
                  "Under the Chrysalides umbrella, our company organizes annual tourist cocooning retreats in Benin. It begins in Paris, at Roissy-Charles de Gaulle or Orly airport, where each traveler is greeted at departure by a team member taking the same flight. Your guide accompanies you from day one."
                )}
              </p>
              <p className="text-base text-[#cabfa6]">
                {lang === "fr" ? (
                  "Les inscriptions se déroulent entre février et fin septembre pour le grand séjour collectif de janvier."
                ) : (
                  "Registrations are open from February to September for the group departure in January."
                )}
              </p>
            </div>

            <div className="w-full md:w-1/2 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-xl flex-shrink-0">
              <Image
                src="/images/bienvenue1.png"
                alt="Départ et accueil — General Esquire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* ZIGZAG 2 : L'arrivée au Bénin & Le Guide Dédié (Image Gauche — Texte Droit) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden group hover:border-[#C5A059] transition-all">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  <Image
                    src="/images/contour.jpg"
                    alt="Bénin"
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">
                  {t("hebergement_arrival_title")}
                </h2>
              </div>
              <div className="h-[2px] w-16 bg-gradient-to-r from-[#C5A059] to-transparent mb-4" />
              <p>
                {lang === "fr" ? (
                  "Une fois au Bénin, nos équipes vous accueillent collectivement dès l'aéroport Bernardin Gantin de Cadjèhoun à Cotonou. Nos véhicules vous conduisent directement sur votre lieu de séjour d'exception."
                ) : (
                  "Upon arrival in Benin, our teams greet you at Bernardin Gantin de Cadjèhoun International Airport in Cotonou. Private transport takes you directly to your accommodation."
                )}
              </p>
              <p className="text-lg text-[#EDE4CF]">
                {lang === "fr" ? (
                  "Chaque pensionnaire — ainsi serez-vous chaleureusement nommé — se voit affecter un ou une guide personnelle qui reste aux petits soins avec lui pendant tout le séjour."
                ) : (
                  "Each guest is assigned a dedicated personal guide who ensures your complete well-being throughout the entire trip."
                )}
              </p>
            </div>

            <div className="w-full md:w-1/2 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-xl flex-shrink-0">
              <Image
                src="/images/blanc/bien.png"
                alt="Accueil chaleureux au Bénin — General Esquire"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* ZIGZAG 3 : Le Cœur du Concept (Pas un hôtel - Une résidence familiale) */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center">
              {/* Texte */}
              <div className="w-full md:w-3/5 p-8 sm:p-12 space-y-6 bg-[#0F3823]/90 relative z-10">
                <div className="flex items-center justify-center gap-3">
                  <div className="h-[1px] w-12 bg-[#C5A059]" />
                  <span className="text-[#C5A059] text-xs font-cinzel tracking-widest uppercase">
                    {lang === "fr" ? "L'Esprit Chrysalides" : "The Chrysalides Spirit"}
                  </span>
                  <div className="h-[1px] w-12 bg-[#C5A059]" />
                </div>

                <p className="font-cormorant text-xl sm:text-2xl text-[#EDE4CF] leading-relaxed italic text-center">
                  {lang === "fr" ? (
                    <>
                      « Le lieu de résidence n'est pas forcément un hôtel, car il ne sert à rien de prétendre rechercher un cocooning touristique en Afrique si c'est pour demeurer dans la <span className="text-[#E9D18F] font-semibold">solitude anonyme, monotone et aseptisée d'un hôtel</span>. »
                    </>
                  ) : (
                    <>
                      “Your residence is not an anonymous hotel room. Tourist cocooning is designed to break away from <span className="text-[#E9D18F] font-semibold">monotonous and impersonal hotel isolation</span>.”
                    </>
                  )}
                </p>

                <div className="h-[1px] w-24 bg-[#C5A059]/40 mx-auto" />

                <p className="font-cinzel text-sm sm:text-base text-[#E9D18F] leading-loose tracking-wide font-bold">
                  {lang === "fr" ? (
                    <>
                      Il s'agit d'une résidence familiale de standing avec prestation hôtelière — c'est-à-dire un <span className="text-white">subtil mélange entre le confort hôtelier occidental</span> et la <span className="text-white">chaleur humaine de votre guide</span>.
                    </>
                  ) : (
                    <>
                      It is a private family residence offering hotel-grade service—a <span className="text-white">subtle blend of western hotel comfort</span> and <span className="text-white">genuine human warmth</span>.
                    </>
                  )}
                </p>
              </div>

              {/* Image côte à côte */}
              <div className="w-full md:w-2/5 relative h-80 sm:h-96 md:h-full min-h-[320px] overflow-hidden">
                <Image
                  src="/images/luxury_villa_benin.png"
                  alt="Résidence de standing — Villa d'exception au Bénin"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F3823]/90 via-transparent to-transparent hidden md:block" />
              </div>
            </div>
          </div>

        </div>

        {/* ── 3 PILLIERS DU SÉJOUR (CARTE 3 COLONNES) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <HomeIcon className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />,
              title: lang === "fr" ? "Résidence Familiale" : "Family Residence",
              desc: lang === "fr"
                ? "Vous êtes logé chez votre guide, dans une vraie maison béninoise avec tout le confort nécessaire."
                : "Stay with your local guide in an authentic Beninese home equipped with modern amenities.",
            },
            {
              icon: <HandshakeIcon className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />,
              title: lang === "fr" ? "Chaleur Humaine" : "Human Warmth",
              desc: lang === "fr"
                ? "Un accueil authentique, loin de l'anonymat des hôtels. Vous êtes reçu comme un membre de la famille."
                : "A warm welcome far from impersonal hotels. You are received like family.",
            },
            {
              icon: <StarIcon className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />,
              title: lang === "fr" ? "Prestation Hôtelière" : "Hotel Quality",
              desc: lang === "fr"
                ? "Confort, propreté, repas soignés — tous les standards hôteliers dans un cadre humain et chaleureux."
                : "Comfort, cleanliness, fine meals—hotel standards in a warm human setting.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all duration-300 shadow-xl text-center group hover:-translate-y-1"
            >
              <div className="group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-cinzel text-base text-[#E9D18F] font-bold tracking-wide mb-3">{item.title}</h3>
              <p className="font-cormorant text-base text-[#cabfa6] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── PHOTO STRIP — Infinite auto-scroll (Photos uniques) ── */}
        <section className="mb-16 -mx-6 sm:-mx-0">
          <div className="text-center mb-10 px-6">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Votre cadre de vie" : "Your Living Setting"}
            </span>
            <h2 className="font-cinzel text-3xl text-[#E9D18F]">
              {lang === "fr" ? "Vous serez bien chez nous" : "You Will Feel Right at Home"}
            </h2>
            <p className="font-cormorant text-base text-[#cabfa6] mt-2">
              {lang === "fr"
                ? "Confort, sérénité et chaleur humaine — voici votre hébergement"
                : "Comfort, serenity, and human warmth — your peaceful retreat"}
            </p>
          </div>

          {/* Row 1 — scroll left */}
          <div
            className="overflow-hidden w-full mb-4"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-4 w-max"
              style={{
                animation: "scrollLeft 28s linear infinite",
              }}
            >
              {[...GALLERY, ...GALLERY].map((item, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-44 h-32 sm:w-56 sm:h-40 rounded-xl overflow-hidden border border-[#C5A059]/30 shadow-lg group cursor-pointer"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 640px) 176px, 224px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="font-cinzel text-[10px] text-[#E9D18F] tracking-widest uppercase bg-[#131513]/70 px-2 py-0.5 rounded-full">
                      ◆ {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inject keyframes */}
          <style>{`
            @keyframes scrollLeft {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {/* ── CTA ── */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-[#0F3823]/70 via-[#131513] to-[#0F3823]/70 border border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">
            Réservez votre place
          </h3>
          <p className="font-cormorant text-lg text-[#cabfa6] mb-6">
            Inscriptions ouvertes de <strong className="text-[#E9D18F]">février à fin septembre</strong>. Ne tardez pas — Départ garanti à partir de 10 participants minimum..
          </p>
          <Link
            href="/cocooning-touristique#formulaire"
            className="inline-block px-12 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:scale-105"
          >
            Inscrivez-vous au Séjour →
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-12 pb-8">
          <Link
            href="/cocooning-touristique"
            className="font-cinzel text-xs tracking-widest text-[#C5A059] hover:text-[#E9D18F] transition-colors inline-flex items-center gap-2 border-b border-transparent hover:border-[#E9D18F]"
          >
            ← {lang === "fr" ? "RETOUR AU COCOONING TOURISTIQUE" : "BACK TO TOURIST COCOONING"}
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
}
