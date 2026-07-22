"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { UtensilsIcon, FlameIcon, CoffeeIcon } from "@/components/Icons";

// ─── Hero Carousel Slides ─────────────────────────────────────────────────────
const SLIDES = [
  {
    src: "/images/Food.jpg",
    tag: "Chrysalides — Gastronomie",
    title: "Bienvenue dans un monde de saveurs",
    desc: "Trois repas par jour préparés avec soin, plus des collations lors des excursions.",
  },
  {
    src: "/images/Bouillie.jpg",
    tag: "Petit-Déjeuner Traditionnel",
    title: "Bouillie & Yovodoko",
    desc: "Découvrez la bouillie de maïs, mil ou sorgho et les fameux beignets yovodoko.",
  },
  {
    src: "/images/food3.jpg",
    tag: "Cuisine Roborative",
    title: "Mets locaux & Plats généreux",
    desc: "Viandes, poissons, crabes et sauces savoureuses à apprécier avec les doigts.",
  },
  {
    src: "/images/Tchooh13.jpg",
    tag: "Spécialités Béninoises",
    title: "Gari délayé & Kluiklui",
    desc: "Dégustez le gari glacé accompagné des galettes d'arachide croquantes.",
  },
  {
    src: "/images/croissant.jpg",
    tag: "Options Sur-Mesure",
    title: "Petit-déjeuner occidental aussi disponible",
    desc: "Nous nous adaptons avec plaisir à vos préférences et régimes alimentaires.",
  },
];

// ─── Complete Food Gallery ────────────────────────────────────────────────────
const FOOD_GALLERY = [
  { src: "/images/Food.jpg", title: "Pain Artisanal & Baguette", tag: "Petit-Déjeuner" },
  { src: "/images/Bouillie.jpg", title: "Bouillie de Maïs & Mil", tag: "Petit-Déjeuner Local" },
  { src: "/images/food2.jpg", title: "Bol de Légumes & Riz", tag: "Plat Équilibré" },
  { src: "/images/food3.jpg", title: "Dîner Convivial & Vin", tag: "Repas du Soir" },
  { src: "/images/food4.jpg", title: "Pâtisseries aux Fraises", tag: "Dessert & Douceurs" },
  { src: "/images/food5.jpg", title: "Jus de Fruits & Toast", tag: "Petit-Déjeuner" },
  { src: "/images/food6.jpg", title: "Œuf au Plat à la Poêle", tag: "Petit-Déjeuner Chaud" },
  { src: "/images/food7.jpg", title: "Rafraîchissement & Moments Zen", tag: "Détente" },
  { src: "/images/food8.jpg", title: "Salade & Pâtes Gourmandes", tag: "Entrée Fraîche" },
  { src: "/images/food9.jpg", title: "Burger Gourmet & Frites", tag: "Snack & Repas" },
  { src: "/images/food10.jpg", title: "Soupe Maison & Légumes", tag: "Potage Warm" },
  { src: "/images/food11.jpg", title: "Sauté Asiatique & Nouilles", tag: "Cuisine du Monde" },
  { src: "/images/food12.jpg", title: "Cocotte d'Œufs & Herbes", tag: "Brunch" },
  { src: "/images/food13.jpg", title: "Muesli Gourmand aux Fruits", tag: "Petit-Déjeuner" },
  { src: "/images/food14.jpg", title: "Assiette Équilibrée & Avocat", tag: "Repas Léger" },
  { src: "/images/food15.jpg", title: "Riz Frit & Cocktails", tag: "Cuisine Épicée" },
  { src: "/images/food16.jpg", title: "Pains Rustiques & Bols", tag: "Buffet" },
  { src: "/images/Tchooh13.jpg", title: "Mets Béninois & Igname", tag: "Spécialité Locale" },
  { src: "/images/Tchooh14.jpg", title: "Gari Délayé & Kluiklui", tag: "Goûter Béninois" },
  { src: "/images/Tchooh15.jpg", title: "Tapioca & Bouillie Blanche", tag: "Saveurs du Bénin" },
  { src: "/images/croissant.jpg", title: "Viennoiseries & Croissants", tag: "Option Occidentale" },
  { src: "/images/cherries.jpg", title: "Cerises & Fruits de Saison", tag: "Vitamines" },
  { src: "/images/sandwich.jpg", title: "Sandwichs Garnis", tag: "Collation Excursion" },
  { src: "/images/Spaghetti.jpg", title: "Spaghetti & Saint-Jacques", tag: "Plat International" },
  { src: "/images/steak.jpg", title: "Grillade de Bœuf", tag: "Viandes" },
  { src: "/images/salmon.jpg", title: "Pavé de Saumon", tag: "Poissons" },
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
        <Image src={slide.src} alt={slide.title} fill priority sizes="100vw" className="object-cover object-center" />
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
          src={item.src}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 transform group-hover:-translate-y-1 transition-transform duration-300">
        <span className="font-cinzel text-[10px] text-[#C5A059] tracking-widest uppercase bg-[#0F3823]/80 border border-[#C5A059]/30 px-3 py-1 rounded-full backdrop-blur-md inline-block mb-2">
          ◆ {item.tag}
        </span>
        <h3 className="font-cinzel text-base sm:text-lg font-bold text-white leading-snug drop-shadow-md">
          {item.title}
        </h3>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RepasPage() {
  const { t, lang } = useLanguage();

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] relative overflow-x-hidden">
      {/* Background filigrane */}
      <div className="absolute inset-0 -z-10 opacity-[0.07] pointer-events-none">
        <Image src="/images/background.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
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
        <section className="mb-16">
          <HeroCarousel />
        </section>

        {/* ── TEXT CONTENT SECTIONS ── */}
        <div className="space-y-10 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed mb-16">

          {/* Section 1 — Les 3 repas et goûter */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <UtensilsIcon className="w-8 h-8 text-[#C5A059]" />
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">{t("repas_sec1_title")}</h2>
            </div>
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:text-[#C5A059] first-letter:font-bold">
              {lang === "fr" ? (
                "Trois repas sont compris dans votre forfait, tous les jours, pendant tout votre séjour : il s'agit du petit-déjeuner, du déjeuner, et du dîner. Lors des excursions, et en cas de fringale, nous aurons également plaisir à vous servir un goûter ou une collation, en attendant le retour sur votre lieu de résidence."
              ) : (
                "Three full meals are included in your stay every single day: breakfast, lunch, and dinner. During excursions or whenever hunger strikes, we delight in offering tea snacks and light refreshments."
              )}
            </p>
            <p className="mt-4">
              {lang === "fr" ? (
                "Nous mettons la priorité sur les mets locaux afin d'éveiller vos papilles à la découverte de nouvelles saveurs ; mais nous respectons toujours votre régime alimentaire si vous avez des préférences particulières. Vous pouvez, si vous le souhaitez, participer à la confection du repas dans une perspective ludique ou pour en acquérir la recette."
              ) : (
                "We highlight rich local gastronomy to introduce your palate to vibrant new flavors, while accommodating any dietary preferences. You are welcome to join cooking workshops to learn authentic recipes."
              )}
            </p>
          </div>

          {/* Section 2 — La cuisine béninoise */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FlameIcon className="w-8 h-8 text-[#C5A059]" />
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">{t("repas_sec2_title")}</h2>
            </div>
            <p>
              {lang === "fr" ? (
                "Roborative et épicée à souhait, la cuisine du Bénin est riche de la diversité de ses sources, résultats d'influences multiples des autres cultures autour d'elle, notamment nigérianes, togolaises, ghanéennes, ivoiriennes, sénégalaises."
              ) : (
                "Hearty and delightfully spiced, Beninese gastronomy draws inspiration from neighboring West African culinary traditions—including Nigerian, Togolese, Ghanaian, Ivorian, and Senegalese flavors."
              )}
            </p>
            <p className="mt-4">
              {lang === "fr" ? (
                "Viandes, crabes, crevettes, poissons et peaux de bœuf sont facilement au menu des plats les plus appréciés qui sont généralement gluants. Pour bien apprécier certains plats comme la pâte de maïs ou le foufou, il vous faudra manger avec les doigts… et les laper aussi régulièrement que possible."
              ) : (
                "Meats, crabs, prawns, fish, and savory sauces accompany popular dishes like corn dough or foufou—traditionally enjoyed with fingers for the full authentic experience."
              )}
            </p>
          </div>

          {/* Section 3 — Petit-déjeuner et gouters */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/25 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <CoffeeIcon className="w-8 h-8 text-[#C5A059]" />
              <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold">{t("repas_sec3_title")}</h2>
            </div>
            <p>
              {lang === "fr" ? (
                "Le petit-déjeuner est généralement fait de bouillie de maïs, mil ou sorgho que l'on prend avec du lait ou du sucre, sinon des beignets ronds à base de farine de blé appelés yovodoko (littéralement, le beignet du blanc)."
              ) : (
                "Breakfast features warm corn or millet porridge served with milk or sugar, alongside crispy golden fritters called yovodoko."
              )}
            </p>
            <p className="mt-4">
              {lang === "fr" ? (
                "On peut aussi prendre au goûter, du tapioka au lait ou des frites d'igname et de banane appelées talétalé. Vous aurez sans doute aussi grand plaisir à découvrir le fameux gari délayé avec des glaçons, des noix ou galettes d'arachide appelées kluiklui. Mais si vous préférez un petit-déjeuner occidental classique, nous saurons vous accommoder."
              ) : (
                "Enjoy afternoon snacks like milk tapioca, fried yam, sweet banana fritters (talétalé), and iced gari with peanut crackers (kluiklui). Western breakfast options are always available."
              )}
            </p>
            <blockquote className="mt-6 pl-6 border-l-4 border-[#C5A059] text-[#E9D18F] italic text-lg sm:text-xl font-light">
              {lang === "fr"
                ? "Imaginez un instant que c'est votre main qui tient ce magnifique beignet qui va régaler vos papilles."
                : "Imagine holding a freshly baked, warm golden fritter ready to delight your taste buds."}
            </blockquote>
          </div>

          {/* Section 4 — Proverbe & Philosophie */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl">
            <div className="absolute inset-0">
              <Image src="/images/Food.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
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
                Vous l’avez déjà compris, la gastronomie est une composante essentielle du cocooning que nous vous promettons. Alors dans toute situation, bonne ou mauvaise, <strong className="text-[#E9D18F]">mangeons d’abord !</strong>
              </p>

              <div className="h-[1px] w-24 bg-[#C5A059]/40 mx-auto" />

              <p className="font-cinzel text-xs text-[#cabfa6] tracking-widest uppercase">
                Toutefois, dans une démarche responsable, les boissons alcoolisées ne sont pas incluses dans votre forfait.
              </p>
            </div>
          </div>

        </div>

        {/* ── SMOOTH SCROLL DOWN ANIMATION GALLERY ── */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              Galerie Gourmande — Smooth Scroll
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#E9D18F]">
              Découvrez la Richesse de Nos Plats
            </h2>
            <p className="font-cormorant text-lg text-[#cabfa6] mt-2">
              Faites défiler la page vers le bas pour révéler chaque spécialité en animation fluide
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOOD_GALLERY.map((item, idx) => (
              <SmoothScrollCard key={idx} item={item} index={idx} />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-[#0F3823]/70 via-[#131513] to-[#0F3823]/70 border border-[#C5A059]/40 shadow-2xl">
          <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-2">
            Prêt à régaler vos papilles au Bénin ?
          </h3>
          <p className="font-cormorant text-lg text-[#cabfa6] mb-6">
            Pension complète incluse dans votre séjour cocooning touristique.
          </p>
          <Link
            href="/cocooning-touristique#formulaire"
            className="inline-block px-12 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:scale-105"
          >
            Réserver mon Séjour →
          </Link>
        </div>

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
