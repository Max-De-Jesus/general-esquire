"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { HomeIcon, HandshakeIcon, StarIcon } from "@/components/Icons";

// ─── Hero carousel slides ─────────────────────────────────────────────────────
const SLIDES = [
  {
    src: "/images/Bienvenue.jpg",
    tag: "Chrysalides — Bénin",
    title: "Bienvenue dans un monde de bienveillance",
    desc: "Un accueil chaleureux vous attend dès votre arrivée à l'aéroport Bernardin Gantin.",
  },
  {
    src: "/images/sejour15.jpg",
    tag: "Résidence Familiale",
    title: "Pas un hôtel — une vraie maison",
    desc: "Un subtil mélange entre le confort hôtelier occidental et la chaleur humaine de votre hôte.",
  },
  {
    src: "/images/sejour14.jpg",
    tag: "Confort & Sérénité",
    title: "Votre lieu de vie pendant 15 jours",
    desc: "Chaque pensionnaire se voit affecter un guide aux petits soins avec lui.",
  },
  {
    src: "/images/Dormir.jpg",
    tag: "Repos Mérité",
    title: "Reposez-vous pleinement",
    desc: "General Esquire a pris toutes les dispositions matérielles pour garantir un séjour de qualité.",
  },
  {
    src: "/images/Repos.jpg",
    tag: "Bienveillance & Humanité",
    title: "Fuyez la solitude anonyme des hôtels",
    desc: "Ici, vous êtes reçu comme un proche, avec authenticité et chaleur africaine.",
  },
];

// ─── Gallery images (hébergement + bien-être) ─────────────────────────────────
const GALLERY = [
  { src: "/images/Bienvenue.jpg", label: "Accueil" },
  { src: "/images/Welcome.jpg", label: "Bienvenue" },
  { src: "/images/sejour15.jpg", label: "Séjour" },
  { src: "/images/sejour14.jpg", label: "Hébergement" },
  { src: "/images/Dormir.jpg", label: "Chambre" },
  { src: "/images/Repos.jpg", label: "Repos" },
  { src: "/images/Femmezen.jpg", label: "Sérénité" },
  { src: "/images/Femmezen2.jpg", label: "Zen" },
  { src: "/images/Massage.jpg", label: "Détente" },
  { src: "/images/Soins.jpg", label: "Soins" },
  { src: "/images/massage2.jpg", label: "Relaxation" },
  { src: "/images/Soins2.jpg", label: "Bien-être" },
];

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
        className="relative w-full h-[340px] sm:h-[480px] transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image src={slide.src} alt={slide.title} fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Text overlay */}
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

      {/* Counter */}
      <div className="absolute top-5 right-5 font-cinzel text-xs text-[#C5A059] bg-[#131513]/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30">
        {current + 1} / {SLIDES.length}
      </div>

      {/* Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg">‹</button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#131513]/70 border border-[#C5A059]/40 text-[#E9D18F] hover:bg-[#C5A059]/20 transition-all flex items-center justify-center text-xl shadow-lg">›</button>

      {/* Dots */}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HebergementPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] relative overflow-x-hidden">
      {/* Background filigrane */}
      <div className="absolute inset-0 -z-10 opacity-[0.07] pointer-events-none">
        <Image src="/images/background.jpeg" alt="" fill className="object-cover" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{t("nav_home")}</Link>
          <span>/</span>
          <Link href="/cocooning-touristique" className="hover:text-[#E9D18F] transition-colors">{t("nav_cocooning")}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{t("hebergement_title")}</span>
        </div>

        {/* Page header */}
        <div className="text-center mb-10">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1 rounded-full bg-[#131513]/80 backdrop-blur-md">
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

        {/* ── CONTENT BLOCKS ── */}
        <div className="space-y-10 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed mb-16">

          {/* Block 1 — Comment ça marche */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">✈️</span>
              <h2 className="font-cinzel text-xl text-[#E9D18F] font-bold">{t("hebergement_how_title")}</h2>
            </div>
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
              {lang === "fr" ? (
                "Sous l'enseigne Chrysalides, notre société déploie au Bénin, une fois par an, ses activités de cocooning touristique. Cela commence à Paris, dans l'un des deux aéroports de la capitale — Roissy-Charles de Gaulle et Orly — où chaque voyageur est accueilli au départ de la France par un membre de notre équipe qui prend le même vol pour la même destination. C'est déjà un premier guide."
              ) : (
                "Under the Chrysalides umbrella, our company organizes annual tourist cocooning retreats in Benin. It begins in Paris, at Roissy-Charles de Gaulle or Orly airport, where each traveler is greeted at departure by a team member taking the same flight. Your guide accompanies you from day one."
              )}
            </p>
            <p className="mt-4">
              {lang === "fr" ? (
                "Entre les mois de février et septembre de l'année précédente, vous avez déjà eu tout le loisir de vous inscrire pour ce séjour touristique d'exception qui est collectif (il faut qu'il y ait au moins dix personnes au départ de Paris), et de payer votre participation ; autrement, vous pourriez ne partir que l'année suivante. Pour des raisons organisationnelles en effet, les inscriptions sont fermées à la fin du mois de septembre, pour un voyage en janvier de l'année d'après."
              ) : (
                "Between February and September of the preceding year, you can register for this exclusive group retreat (minimum 10 participants departing from Paris). Registrations close at the end of September for trips taking place in January of the following year."
              )}
            </p>
          </div>

          {/* Block 2 — Arrivée au Bénin */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🇧🇯</span>
              <h2 className="font-cinzel text-xl text-[#E9D18F] font-bold">{t("hebergement_arrival_title")}</h2>
            </div>
            <p>
              {lang === "fr" ? (
                "Une fois au Bénin, nos équipes vous accueillent collectivement à l'aéroport Bernardin Gantin de Cadjèhoun, et nos véhicules vous conduisent sur votre lieu de séjour. Chaque pensionnaire — ainsi serez-vous désigné — se voit affecter un ou une guide qui est aux petits soins avec lui."
              ) : (
                "Upon arrival in Benin, our teams greet you at Bernardin Gantin de Cadjèhoun International Airport. Private transport takes you directly to your accommodation, where a personal dedicated guide ensures your total comfort."
              )}
            </p>
          </div>

          {/* Block 3 — The KEY statement (highlighted) */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl">
            {/* Background image with strong overlay */}
            <div className="absolute inset-0">
              <Image src="/images/sejour15.jpg" alt="" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-[#0F3823]/88" />
            </div>

            <div className="relative z-10 p-8 sm:p-14 text-center space-y-6">
              {/* Gold separator */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-16 bg-[#C5A059]" />
                <span className="text-[#C5A059] text-lg">◆</span>
                <div className="h-[1px] w-16 bg-[#C5A059]" />
              </div>

              <p className="font-cinzel text-sm sm:text-base text-[#E9D18F] leading-loose tracking-wide font-bold">
                {lang === "fr"
                  ? "Notre société a pris toutes les dispositions matérielles et financières pour vous garantir, chez votre guide, un accueil et un séjour de qualité."
                  : "We have taken all material and financial measures to guarantee exceptional hospitality at your guide's home."}
              </p>

              <div className="h-[1px] w-24 bg-[#C5A059]/40 mx-auto" />

              <p className="font-cormorant text-xl sm:text-2xl text-[#EDE4CF] leading-relaxed italic">
                {lang === "fr" ? (
                  <>
                    Le lieu de résidence n'est pas forcément un hôtel, car il ne sert à rien de prétendre rechercher un cocooning touristique en Afrique si c'est pour demeurer dans la <span className="text-[#C5A059]">l'anonyme, monotone, ennuyeuse, aseptisée et déshumanisée solitude d'un hôtel.</span>
                  </>
                ) : (
                  <>
                    Your residence is not an anonymous hotel room. Tourist cocooning in Africa is designed to break away from <span className="text-[#C5A059]">monotonous, sanitized, and impersonal hotel isolation.</span>
                  </>
                )}
              </p>

              <div className="h-[1px] w-24 bg-[#C5A059]/40 mx-auto" />

              <p className="font-cinzel text-sm sm:text-base text-[#E9D18F] leading-loose tracking-wide font-bold">
                {lang === "fr" ? (
                  <>
                    Il s'agit plutôt d'une résidence familiale avec prestation hôtelière — c'est-à-dire un <span className="text-white">subtil mélange entre le confort de l'hôtel à l'occidental</span>, et la <span className="text-white">chaleur humaine de votre guide</span> qui vous accueillera chez lui ou chez elle.
                  </>
                ) : (
                  <>
                    It is a private family residence offering hotel-grade service—a <span className="text-white">subtle blend of western hotel comfort</span> and <span className="text-white">genuine human warmth</span> from your local host.
                  </>
                )}
              </p>

              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="h-[1px] w-16 bg-[#C5A059]" />
                <span className="text-[#C5A059] text-lg">◆</span>
                <div className="h-[1px] w-16 bg-[#C5A059]" />
              </div>
            </div>
          </div>

          {/* Block 4 — What to expect */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <HomeIcon className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />, title: lang === "fr" ? "Résidence Familiale" : "Family Residence", desc: lang === "fr" ? "Vous êtes logé chez votre guide, dans une vraie maison béninoise avec tout le confort nécessaire." : "Stay with your local guide in an authentic Beninese home equipped with modern amenities." },
              { icon: <HandshakeIcon className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />, title: lang === "fr" ? "Chaleur Humaine" : "Human Warmth", desc: lang === "fr" ? "Un accueil authentique, loin de l'anonymat des hôtels. Vous êtes reçu comme un membre de la famille." : "A warm welcome far from impersonal hotels. You are received like family." },
              { icon: <StarIcon className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />, title: lang === "fr" ? "Prestation Hôtelière" : "Hotel Quality", desc: lang === "fr" ? "Confort, propreté, repas soignés — tous les standards hôteliers dans un cadre humain et chaleureux." : "Comfort, cleanliness, fine meals—hotel standards in a warm human setting." },
            ].map((item, i) => (
              <div key={i} className="p-7 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all duration-300 shadow-lg text-center">
                {item.icon}
                <h3 className="font-cinzel text-sm text-[#E9D18F] font-bold tracking-wide mb-3">{item.title}</h3>
                <p className="font-cormorant text-base text-[#cabfa6] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── PHOTO STRIP — Infinite auto-scroll ── */}
        <section className="mb-16 -mx-6 sm:-mx-0">
          <div className="text-center mb-10 px-6">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              Votre cadre de vie
            </span>
            <h2 className="font-cinzel text-3xl text-[#E9D18F]">Vous serez bien chez nous</h2>
            <p className="font-cormorant text-base text-[#cabfa6] mt-2">
              Confort, sérénité et chaleur humaine — voici votre hébergement
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
              onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
              onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
            >
              {[...GALLERY, ...GALLERY].map((item, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-56 h-40 sm:w-72 sm:h-52 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group cursor-pointer"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="288px"
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

          {/* Row 2 — scroll right (reversed) */}
          <div
            className="overflow-hidden w-full"
            style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}
          >
            <div
              className="flex gap-4 w-max"
              style={{
                animation: "scrollRight 32s linear infinite",
              }}
              onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
              onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
            >
              {[...GALLERY].reverse().concat([...GALLERY].reverse()).map((item, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-56 h-40 sm:w-72 sm:h-52 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group cursor-pointer"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="288px"
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
            @keyframes scrollRight {
              0%   { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </section>

        {/* ── CTA ── */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-[#0F3823]/70 via-[#131513] to-[#0F3823]/70 border border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">
            Réservez votre place pour janvier
          </h3>
          <p className="font-cormorant text-lg text-[#cabfa6] mb-6">
            Inscriptions ouvertes de <strong className="text-[#E9D18F]">février à fin septembre</strong>. Ne tardez pas — les places sont limitées à 10 participants minimum.
          </p>
          <Link
            href="/cocooning-touristique#formulaire"
            className="inline-block px-12 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:scale-105"
          >
            S'inscrire au Séjour →
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link href="/" className="font-cinzel text-xs tracking-widest text-[#C5A059] hover:text-[#E9D18F] transition-colors inline-flex items-center gap-2">
            ← RETOUR À L'ACCUEIL
          </Link>
        </div>
      </div>
    </div>
  );
}
