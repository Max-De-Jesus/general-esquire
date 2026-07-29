"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function CocooningTouristiquePage() {
  const { lang } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    genre: "masculin",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "",
    adresse: "",
    telephone: "",
    telephoneConfiance: "",
    courriel: "",
    profession: "",
    preferencesAlimentaires: [] as string[],
    presentationLibre: "",
    surveillanceMedicale: "non",
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo: null,
    passeport: null,
    avisMedical: null,
    autreDocument: null,
  });

  const handleDietToggle = (item: string) => {
    if (formData.preferencesAlimentaires.includes(item)) {
      setFormData({
        ...formData,
        preferencesAlimentaires: formData.preferencesAlimentaires.filter((d) => d !== item),
      });
    } else {
      setFormData({
        ...formData,
        preferencesAlimentaires: [...formData.preferencesAlimentaires, item],
      });
    }
  };

  const wordCount = formData.presentationLibre.trim()
    ? formData.presentationLibre.trim().split(/\s+/).length
    : 0;

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] pb-12 md:pb-20 relative">
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (PLEINE LARGEUR) ──────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannercoo.png"
            alt="Bannière Cocooning Touristique — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <div className="w-full bg-[#0d0e0d] border-y border-[#C5A059]/30 py-3 overflow-hidden shadow-inner z-20 mb-8">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-6 font-cinzel text-xs sm:text-sm text-[#C5A059] tracking-[0.26em] uppercase px-6"
            >
              <span className="drop-shadow-[0_0_12px_rgba(197,160,89,0.35)]">
                General Esquire
              </span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Excellence</span>
              <span className="text-[#C5A059]/40 text-[8px]">◆</span>
              <span>Compétence</span>
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

      <div className="max-w-5xl mx-auto px-6">
        
        {/* Filigrane Background */}
        <div className="absolute inset-0 -z-10 opacity-15 overflow-hidden pointer-events-none">
          <Image
            src="/images/background.jpeg"
            alt="Fond Filigrane"
            fill
            className="object-cover object-center filter brightness-75 contrast-125"
          />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] uppercase tracking-widest">
            <Link href="/" className="hover:text-[#E9D18F] transition-colors">
              {lang === "fr" ? "Accueil" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-[#EDE4CF]">
              {lang === "fr" ? "Cocooning Touristique" : "Tourist Cocooning"}
            </span>
          </div>
          <Link
            href="/"
            className="font-cinzel text-xs text-[#C5A059] hover:text-[#E9D18F] transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> {lang === "fr" ? "RETOUR À L'ACCUEIL" : "BACK TO HOME"}
          </Link>
        </div>

        {/* Hero Header Banner with Dedicated Photo */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 mb-12 shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full">
            <Image
              src="/images/Excursion12.jpg"
              alt="Cocooning Touristique — General Esquire"
              fill
              priority
              className="object-cover object-center filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a] via-[#1a1c1a]/50 to-transparent"></div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-center sm:text-left">
            <span className="text-[#C5A059] text-xs font-cinzel tracking-widest uppercase bg-[#131513]/80 px-4 py-1 rounded-full border border-[#C5A059]/40 backdrop-blur-md">
              {lang === "fr" ? "Chrysalides — Séjours & Soutien" : "Chrysalides — Retreats & Support"}
            </span>
            <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white mt-3 drop-shadow-md">
              {lang === "fr" ? "Cocooning Touristique" : "Tourist Cocooning"}
            </h1>
          </div>
        </div>



        {/* Subtitle Quote */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-cormorant text-2xl text-[#E9D18F] italic font-light leading-relaxed">
            {lang === "fr"
              ? "« Venez vous évader avec nous, découvrir d’autres cultures, déguster des mets savoureux, vous faire dorloter, et souffler un peu face aux difficultés de la vie. »"
              : "“Come escape with us, discover new cultures, savor delicious food, get pampered, and take a breather from life's challenges.”"}
          </p>
        </div>

        {/* Presentation Storytelling Section */}
        <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl mb-16 space-y-6 font-cormorant text-xl text-[#EDE4CF]/90 leading-relaxed font-light">
          <p>
            {lang === "fr"
              ? "General Esquire n’est pas seulement un cabinet de conseil juridique qui se tient à vos côtés lors de vos challenges juridiques. Nous ambitionnons aussi de vous offrir un soutien psychologique sous la forme d’un cocooning touristique."
              : "General Esquire is not merely a legal advisory firm standing by your side in court. We also strive to offer you psychological relief in the form of tourist cocooning."}
          </p>

          <p>
            {lang === "fr"
              ? "Nous vous offrons un séjour touristique tout compris au Bénin, notre destination phare. Pourquoi le Bénin ? Parce que ce pays est riche d’un patrimoine gastronomique et culturel insoupçonné. Démocratie stable depuis plus de trois décennies, pays en pleine expansion économique, le Bénin regorge de nombreuses opportunités d’affaires et de sécurité."
              : "We offer an all-inclusive holiday in Benin, our flagship destination. Why Benin? Because it boasts an unexpectedly rich culinary and cultural heritage. A stable democracy for over three decades, Benin is an expanding economy offering safety and rich business opportunities."}
          </p>

          <p>
            {lang === "fr"
              ? "Le choix du Bénin se justifie également par le fait que la vie y est bien moins chère comparativement à de nombreux autres pays. Cette donnée essentielle permet à General Esquire, sous son enseigne Chrysalides, de vous offrir à un prix compétitif une pension complète pendant deux semaines de vacances."
              : "Benin also offers an affordable cost of living compared to neighboring countries. This crucial factor enables General Esquire, under our Chrysalides brand, to offer a full two-week all-inclusive stay at a highly competitive rate."}
          </p>

          <p className="italic text-[#cabfa6]">
            {lang === "fr"
              ? "Afin justement de vous offrir le maximum contre un prix minimum – tel est notre crédo – nous envisageons aussi pour vous, à moyen terme, la magnifique île de Madagascar comme une destination subsidiaire."
              : "In order to provide maximum value at a minimum price—our core credo—we are also planning to introduce the magnificent island of Madagascar as a secondary destination in the near future."}
          </p>
        </div>

        {/* ─── SECTION 4 CARTES CIRCULAIRES (AVANT GALERIE & BIEN-ÊTRE) ─── */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Nos Services & Formules" : "Our Services & Offers"}
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F]">
              {lang === "fr" ? "Les 4 Piliers de Votre Séjour" : "The 4 Pillars of Your Stay"}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#C5A059]" />
              <span className="text-[#C5A059] text-xs">◆</span>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {/* Carte 1 : L'Hébergement */}
            <Link
              href="/hebergement"
              className="group relative w-[230px] h-[230px] sm:w-[250px] sm:h-[250px] rounded-full border-2 border-[#C5A059] hover:border-[#E9D18F] shadow-2xl hover:shadow-[0_20px_40px_rgba(197,160,89,0.45)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer"
            >
              {/* Image en arrière-plan du cercle */}
              <Image
                src="/images/Dormir.jpg"
                alt="L'Hébergement"
                fill
                priority
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 rounded-full"
              />
              {/* Overlay sombre translucide pour garantir une parfaite lisibilité du texte */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 rounded-full group-hover:bg-black/50 transition-colors" />

              <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mb-2 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all duration-300">
                  🏡
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md transition-colors">
                  {lang === "fr" ? "L'HÉBERGEMENT" : "ACCOMMODATION"}
                </h3>
                <p className="font-cormorant text-xs sm:text-sm text-[#EDE4CF] leading-snug max-w-[190px] font-medium drop-shadow-sm">
                  {lang === "fr"
                    ? "Villas et résidences de standing tout confort pour votre séjour."
                    : "Luxury residences & comfortable villas for your stay."}
                </p>
              </div>
            </Link>

            {/* Carte 2 : Les Repas */}
            <Link
              href="/repas"
              className="group relative w-[230px] h-[230px] sm:w-[250px] sm:h-[250px] rounded-full border-2 border-[#C5A059] hover:border-[#E9D18F] shadow-2xl hover:shadow-[0_20px_40px_rgba(197,160,89,0.45)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer"
            >
              {/* Image en arrière-plan du cercle */}
              <Image
                src="/images/Tchooh10.webp"
                alt="Les Repas"
                fill
                priority
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 rounded-full"
              />
              {/* Overlay sombre translucide */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 rounded-full group-hover:bg-black/50 transition-colors" />

              <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mb-2 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all duration-300">
                  🍽️
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md transition-colors">
                  {lang === "fr" ? "LES REPAS" : "MEALS"}
                </h3>
                <p className="font-cormorant text-xs sm:text-sm text-[#EDE4CF] leading-snug max-w-[190px] font-medium drop-shadow-sm">
                  {lang === "fr"
                    ? "Gastronomie raffinée, pension complète et saveurs locales."
                    : "Refined cuisine, full board & local flavors."}
                </p>
              </div>
            </Link>

            {/* Carte 3 : Les Excursions */}
            <Link
              href="/excursions"
              className="group relative w-[230px] h-[230px] sm:w-[250px] sm:h-[250px] rounded-full border-2 border-[#C5A059] hover:border-[#E9D18F] shadow-2xl hover:shadow-[0_20px_40px_rgba(197,160,89,0.45)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer"
            >
              {/* Image en arrière-plan du cercle */}
              <Image
                src="/images/Excursion22.jpg"
                alt="Les Excursions"
                fill
                priority
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 rounded-full"
              />
              {/* Overlay sombre translucide */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 rounded-full group-hover:bg-black/50 transition-colors" />

              <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mb-2 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all duration-300">
                  🗺️
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md transition-colors">
                  {lang === "fr" ? "LES EXCURSIONS" : "EXCURSIONS"}
                </h3>
                <p className="font-cormorant text-xs sm:text-sm text-[#EDE4CF] leading-snug max-w-[190px] font-medium drop-shadow-sm">
                  {lang === "fr"
                    ? "Découvertes culturelles, visites guidées et paysages d'exception."
                    : "Cultural discoveries, guided tours & stunning sites."}
                </p>
              </div>
            </Link>

            {/* Carte 4 : La Détente */}
            <Link
              href="/detente"
              className="group relative w-[230px] h-[230px] sm:w-[250px] sm:h-[250px] rounded-full border-2 border-[#C5A059] hover:border-[#E9D18F] shadow-2xl hover:shadow-[0_20px_40px_rgba(197,160,89,0.45)] hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col items-center justify-center p-6 text-center overflow-hidden cursor-pointer"
            >
              {/* Image en arrière-plan du cercle */}
              <Image
                src="/images/Detente_Dtente.jpg.jpg"
                alt="La Détente"
                fill
                priority
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700 rounded-full"
              />
              {/* Overlay sombre translucide */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 rounded-full group-hover:bg-black/50 transition-colors" />

              <div className="relative z-10 flex flex-col items-center justify-center h-full px-2">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mb-2 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all duration-300">
                  🧘
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md transition-colors">
                  {lang === "fr" ? "LA DÉTENTE" : "RELAXATION"}
                </h3>
                <p className="font-cormorant text-xs sm:text-sm text-[#EDE4CF] leading-snug max-w-[190px] font-medium drop-shadow-sm">
                  {lang === "fr"
                    ? "Soins, massages, bien-être et ressourcement en toute quiétude."
                    : "Massages, wellness care & total relaxation in serenity."}
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* PHOTO GALLERY FOR COCOONING */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Galerie & Bien-être" : "Gallery & Wellness"}
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F]">
              {lang === "fr" ? "Soins, Détente & Ressourcement" : "Care, Relaxation & Renewal"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Massage.jpg"
                alt="Massage et relaxation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/food3.jpg"
                alt="Soins et bien-être"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Excursion3.jfif"
                alt="Espaces de détente"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* Tarifs et Inclusions Banner — DESIGN DE LUXE ANIMÉ */}
        <section className="mb-16 bg-gradient-to-r from-[#0F3823]/90 via-[#131513] to-[#0F3823]/90 border-2 border-[#C5A059]/50 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(197,160,89,0.25)] relative overflow-hidden">
          {/* Header Prix & Titre */}
          <div className="text-center mb-10 relative z-10">
            <span className="inline-block font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase mb-3 border border-[#C5A059]/40 px-5 py-1.5 rounded-full bg-[#131513]/80 backdrop-blur-md shadow-md animate-pulse">
              ✦ {lang === "fr" ? "Formule Complète 2 Semaines" : "Full 2-Week Package"}
            </span>
            
            <div className="my-4">
              <h2 className="font-cinzel text-4xl sm:text-6xl text-white font-extrabold tracking-tight drop-shadow-[0_0_25px_rgba(197,160,89,0.5)]">
                1 350 € <span className="text-base sm:text-xl font-normal text-[#E9D18F] font-cormorant">{lang === "fr" ? "/ pensionnaire" : "/ guest"}</span>
              </h2>
            </div>

            <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 max-w-2xl mx-auto leading-relaxed">
              {lang === "fr"
                ? "Outre le billet d’avion Paris-Cotonou-Paris, le coût global indicatif comprend l'ensemble des 4 prestations exclusives :"
                : "In addition to your Paris-Cotonou round-trip airfare, the package includes all 4 exclusive services:"}
            </p>
          </div>

          {/* 4 Pillars Grid — Cartes avec images de fond & animations de surbrillance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-10 relative z-10">
            {/* 1. L'Hébergement */}
            <Link
              href="/hebergement"
              className="group relative h-64 sm:h-72 rounded-2xl border-2 border-[#C5A059]/60 hover:border-[#E9D18F] shadow-xl hover:shadow-[0_0_35px_rgba(197,160,89,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-end p-6 cursor-pointer"
            >
              <Image
                src="/images/luxury_villa_benin.png"
                alt="L'Hébergement"
                fill
                sizes="(max-width: 768px) 100vw, 250px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 transition-colors" />

              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mx-auto mb-3 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all">
                  🏡
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md">
                  {lang === "fr" ? "L'HÉBERGEMENT" : "ACCOMMODATION"}
                </h3>
                <span className="inline-flex items-center gap-1 font-cinzel text-[10px] text-[#C5A059] group-hover:text-[#E9D18F] tracking-widest uppercase font-bold transition-colors">
                  {lang === "fr" ? "En savoir plus →" : "Learn more →"}
                </span>
              </div>
            </Link>

            {/* 2. Les Repas */}
            <Link
              href="/repas"
              className="group relative h-64 sm:h-72 rounded-2xl border-2 border-[#C5A059]/60 hover:border-[#E9D18F] shadow-xl hover:shadow-[0_0_35px_rgba(197,160,89,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-end p-6 cursor-pointer"
            >
              <Image
                src="/images/wine.jpg"
                alt="Les Repas"
                fill
                sizes="(max-width: 768px) 100vw, 250px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 transition-colors" />

              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mx-auto mb-3 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all">
                  🍽️
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md">
                  {lang === "fr" ? "LES REPAS" : "MEALS"}
                </h3>
                <span className="inline-flex items-center gap-1 font-cinzel text-[10px] text-[#C5A059] group-hover:text-[#E9D18F] tracking-widest uppercase font-bold transition-colors">
                  {lang === "fr" ? "En savoir plus →" : "Learn more →"}
                </span>
              </div>
            </Link>

            {/* 3. Les Excursions */}
            <Link
              href="/excursions"
              className="group relative h-64 sm:h-72 rounded-2xl border-2 border-[#C5A059]/60 hover:border-[#E9D18F] shadow-xl hover:shadow-[0_0_35px_rgba(197,160,89,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-end p-6 cursor-pointer"
            >
              <Image
                src="/images/Excursion22.jpg"
                alt="Les Excursions"
                fill
                sizes="(max-width: 768px) 100vw, 250px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 transition-colors" />

              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mx-auto mb-3 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all">
                  🗺️
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md">
                  {lang === "fr" ? "LES EXCURSIONS" : "EXCURSIONS"}
                </h3>
                <span className="inline-flex items-center gap-1 font-cinzel text-[10px] text-[#C5A059] group-hover:text-[#E9D18F] tracking-widest uppercase font-bold transition-colors">
                  {lang === "fr" ? "En savoir plus →" : "Learn more →"}
                </span>
              </div>
            </Link>

            {/* 4. La Détente */}
            <Link
              href="/detente"
              className="group relative h-64 sm:h-72 rounded-2xl border-2 border-[#C5A059]/60 hover:border-[#E9D18F] shadow-xl hover:shadow-[0_0_35px_rgba(197,160,89,0.5)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col justify-end p-6 cursor-pointer"
            >
              <Image
                src="/images/Sport10.jpg"
                alt="La Détente"
                fill
                sizes="(max-width: 768px) 100vw, 250px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 transition-colors" />

              <div className="relative z-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#131513]/90 border border-[#C5A059] flex items-center justify-center text-xl mx-auto mb-3 shadow-md group-hover:scale-110 group-hover:bg-[#0F3823] transition-all">
                  🧘
                </div>
                <h3 className="font-cinzel text-sm sm:text-base font-extrabold text-[#E9D18F] group-hover:text-white tracking-wider uppercase mb-1 drop-shadow-md">
                  {lang === "fr" ? "LA DÉTENTE" : "RELAXATION"}
                </h3>
                <span className="inline-flex items-center gap-1 font-cinzel text-[10px] text-[#C5A059] group-hover:text-[#E9D18F] tracking-widest uppercase font-bold transition-colors">
                  {lang === "fr" ? "En savoir plus →" : "Learn more →"}
                </span>
              </div>
            </Link>
          </div>

          {/* Encadré d'information logistique avec effet verre dépoli */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131513]/90 border border-[#C5A059]/30 font-cormorant text-lg text-[#EDE4CF] text-center max-w-3xl mx-auto shadow-2xl relative z-10 backdrop-blur-md">
            <p className="leading-relaxed">
              {lang === "fr"
                ? "Pour des raisons de logistique, nous organisons une fois par an, au cours des deux premières semaines de janvier, un séjour groupé pour au moins 10 pensionnaires. Inscriptions ouvertes de février à fin septembre."
                : "For logistics reasons, we organize once a year, during the first two weeks of January, a group stay for at least 10 guests. Registrations open from February to end of September."}
            </p>
          </div>
        </section>

        {/* BANNIÈRE DE RÉSERVATION & PRICING CTAS — 3 BOUTONS DE CONTACT */}
        <section className="mb-16 bg-gradient-to-r from-[#0F3823] via-[#131513] to-[#0F3823] border-2 border-[#C5A059]/60 rounded-3xl p-8 sm:p-12 shadow-[0_0_50px_rgba(197,160,89,0.3)] text-center relative overflow-hidden group">
          {/* Sparkle background element */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A059]/10 via-transparent to-transparent pointer-events-none" />

          <span className="inline-block font-cinzel text-xs text-[#E9D18F] tracking-[0.3em] uppercase mb-3 border border-[#C5A059]/50 px-5 py-1.5 rounded-full bg-[#131513]/80 shadow-md animate-pulse">
            ✦ {lang === "fr" ? "Réservation En Ligne" : "Online Booking"}
          </span>

          <h2 className="font-cinzel text-2xl sm:text-4xl text-white font-extrabold tracking-wider uppercase mb-4 drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]">
            {lang === "fr" ? "RÉSERVEZ VOTRE PLACE POUR JANVIER" : "BOOK YOUR SPOT FOR JANUARY"}
          </h2>

          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            {lang === "fr"
              ? "Inscriptions ouvertes de février à fin septembre. Ne tardez pas — les places sont limitées à 10 participants minimum."
              : "Registrations open from February to end of September. Don't wait — spots are limited to a minimum of 10 participants."}
          </p>

          {/* 3 Contact Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            {/* 1. Email */}
            <a
              href="mailto:contact@generalesquire.com"
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
          <a
            href="#formulaire"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-cinzel text-xs sm:text-sm tracking-widest uppercase font-bold text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all shadow-[0_0_35px_rgba(197,160,89,0.5)] hover:scale-105 group cursor-pointer"
          >
            <span>{lang === "fr" ? "S'inscrire au Séjour →" : "Register for Stay →"}</span>
          </a>
        </section>

        {/* ===== FORMULAIRE DE CONTACT COCOONING TOURISTIQUE ===== */}
        <section id="formulaire" className="bg-[#131513] border border-[#C5A059]/40 rounded-3xl p-8 sm:p-12 shadow-2xl mb-16">
          
          <h2 className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold text-center mb-1">
            {lang === "fr" ? "Formulaire de Contact" : "Contact Form"}
          </h2>
          <p className="font-cinzel text-sm text-[#C5A059] text-center tracking-widest uppercase mb-4">
            « COCOONING TOURISTIQUE »
          </p>
          <div className="h-[1px] w-16 bg-[#C5A059]/40 mx-auto mb-8"></div>

          {/* Avertissement */}
          <div className="mb-8 p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/20 font-cormorant text-sm text-[#cabfa6] italic leading-relaxed">
            <h3 className="font-cinzel text-xs text-[#E9D18F] uppercase tracking-wider not-italic mb-2 font-bold">
              {lang === "fr" ? "Avertissement" : "Notice"}
            </h3>
            <p>
              {lang === "fr"
                ? "Les champs marqués d’un astérisque (*) sont obligatoires. Vous pouvez écrire jusqu’à 2000 mots en une fois. Conformément aux articles 16 et 19 du RGPD, vous disposez d’un droit de rectification. En cliquant sur « Valider », vous consentez à ce que vos données soient transmises à General Esquire."
                : "Fields marked with an asterisk (*) are required. You can write up to 2000 words. In accordance with GDPR articles 16 and 19, you have the right to rectification. By clicking 'Submit', you consent to transmitting your data to General Esquire."}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormSubmitted(true);
            }}
            className="space-y-6 max-w-4xl mx-auto font-cormorant text-lg"
          >
            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-[#0F3823]/60 border border-[#C5A059] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#C5A059] text-black flex items-center justify-center text-3xl mx-auto font-cinzel font-bold">
                  ✓
                </div>
                <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  {lang === "fr" ? "Formulaire Transmis avec Succès !" : "Form Submitted Successfully!"}
                </h3>
                <p className="font-cormorant text-lg text-[#EDE4CF]">
                  {lang === "fr"
                    ? "General Esquire vous remercie pour votre inscription. Nos équipes étudieront votre dossier et prendront contact avec vous très rapidement."
                    : "General Esquire thanks you for your application. Our teams will review your file and contact you very shortly."}
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="font-cinzel text-xs text-[#C5A059] underline hover:text-[#E9D18F] uppercase tracking-wider"
                >
                  {lang === "fr" ? "Transmettre une autre demande" : "Submit another request"}
                </button>
              </div>
            ) : (
              <>
                {/* 1. NOM & PRÉNOMS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Votre nom *" : "Your Last Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      placeholder={lang === "fr" ? "ex. Dupont" : "e.g. Smith"}
                      className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Vos prénoms *" : "Your First Names *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.prenoms}
                      onChange={(e) => setFormData({ ...formData, prenoms: e.target.value })}
                      placeholder={lang === "fr" ? "ex. Jean-Pierre" : "e.g. Jane"}
                      className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                </div>

                {/* 2. GENRE */}
                <div className="p-5 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30">
                  <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-3">
                    {lang === "fr" ? "Genre" : "Gender"}
                  </label>
                  <div className="flex flex-wrap items-center gap-8 font-cinzel text-sm">
                    {[
                      { id: "masculin", label: "Masculin" },
                      { id: "feminin", label: "Féminin" },
                      { id: "non-genre", label: "Non genré" },
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="genre"
                          value={item.id}
                          checked={formData.genre === item.id}
                          onChange={() => setFormData({ ...formData, genre: item.id })}
                          className="accent-[#C5A059] w-4 h-4"
                        />
                        <span className="text-[#EDE4CF]">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. DATE DE NAISSANCE, LIEU DE NAISSANCE, NATIONALITÉ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Date de naissance *" : "Date of Birth *"}
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dateNaissance}
                      onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:outline-none focus:border-[#E9D18F] transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Lieu de naissance" : "Place of Birth"}
                    </label>
                    <input
                      type="text"
                      value={formData.lieuNaissance}
                      onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                      placeholder={lang === "fr" ? "Ville, Pays" : "City, Country"}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Nationalité *" : "Nationality *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nationalite}
                      onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                      placeholder={lang === "fr" ? "ex. Française" : "e.g. French"}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                </div>

                {/* 4. ADRESSE */}
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                    {lang === "fr" ? "Adresse *" : "Address *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    placeholder={lang === "fr" ? "Numéro, rue, code postal, ville, pays" : "Street, city, postal code, country"}
                    className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                  />
                </div>

                {/* 5. TÉLÉPHONE & TÉLÉPHONE PERSONNE DE CONFIANCE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Téléphone *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Téléphone d’une personne de confiance *" : "Emergency Contact Phone *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telephoneConfiance}
                      onChange={(e) => setFormData({ ...formData, telephoneConfiance: e.target.value })}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                </div>

                {/* 6. COURRIEL & PROFESSION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Courriel *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.courriel}
                      onChange={(e) => setFormData({ ...formData, courriel: e.target.value })}
                      placeholder="vous@exemple.com"
                      className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                      {lang === "fr" ? "Profession" : "Occupation"}
                    </label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder={lang === "fr" ? "ex. Avocat, Médecin, Enseignant..." : "e.g. Lawyer, Doctor..."}
                      className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                    />
                  </div>
                </div>

                {/* 7. PRÉFÉRENCES ALIMENTAIRES */}
                <div className="p-5 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30">
                  <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-3">
                    {lang === "fr" ? "Préférences alimentaires" : "Dietary Preferences"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-cinzel text-sm">
                    {[
                      "Sans porc",
                      "Sans sucre",
                      "Sans sel",
                      "Sans gluten",
                      "Sans lactose",
                      "Végétarien",
                    ].map((item) => (
                      <label key={item} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferencesAlimentaires.includes(item)}
                          onChange={() => handleDietToggle(item)}
                          className="accent-[#C5A059] w-4 h-4 rounded"
                        />
                        <span className="text-[#EDE4CF] text-xs sm:text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 8. PRÉSENTATION LIBRE */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-cinzel text-xs tracking-widest text-[#C5A059] uppercase">
                      {lang === "fr" ? "Présentation libre *" : "Free Presentation *"}
                    </label>
                    <span className="font-cinzel text-[11px] text-[#C5A059]/80">
                      {wordCount} / 2 000 {lang === "fr" ? "mots" : "words"}
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    value={formData.presentationLibre}
                    onChange={(e) => setFormData({ ...formData, presentationLibre: e.target.value })}
                    placeholder={lang === "fr"
                      ? "Présentez-vous librement, vos attentes pour ce séjour, vos centres d'intérêt..."
                      : "Introduce yourself freely, your expectations for this stay..."}
                    className="w-full px-5 py-3.5 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] placeholder-gray-600 focus:outline-none focus:border-[#E9D18F] transition-colors"
                  />
                </div>

                {/* 9. SURVEILLANCE MÉDICALE */}
                <div className="p-5 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30 space-y-3">
                  <div>
                    <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-3">
                      {lang === "fr" ? "Surveillance médicale *" : "Medical Monitoring *"}
                    </label>
                    <div className="flex items-center gap-8 font-cinzel text-sm">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="surveillanceMedicale"
                          value="oui"
                          checked={formData.surveillanceMedicale === "oui"}
                          onChange={() => setFormData({ ...formData, surveillanceMedicale: "oui" })}
                          className="accent-[#C5A059] w-4 h-4"
                        />
                        <span className="text-[#EDE4CF]">Oui</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="surveillanceMedicale"
                          value="non"
                          checked={formData.surveillanceMedicale === "non"}
                          onChange={() => setFormData({ ...formData, surveillanceMedicale: "non" })}
                          className="accent-[#C5A059] w-4 h-4"
                        />
                        <span className="text-[#EDE4CF]">Non</span>
                      </label>
                    </div>
                  </div>
                  {formData.surveillanceMedicale === "oui" && (
                    <p className="text-xs text-[#E9D18F] font-cinzel italic">
                      {lang === "fr"
                        ? "⚠ Si oui, joignez un avis médical dans la section ci-dessous."
                        : "⚠ If yes, please attach a medical notice below."}
                    </p>
                  )}
                </div>

                {/* 10. JOIGNEZ DES FICHIERS */}
                <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30 space-y-4">
                  <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase">
                    {lang === "fr" ? "Joignez des fichiers" : "Attach Files"}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1° Photo */}
                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30">
                      <span className="block font-cinzel text-xs text-[#E9D18F] font-bold mb-2">
                        1° Une photo de vous
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFiles({ ...files, photo: e.target.files?.[0] || null })}
                        className="block w-full text-xs text-[#cabfa6] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-cinzel file:bg-[#C5A059] file:text-black hover:file:bg-[#E9D18F] cursor-pointer"
                      />
                      {files.photo && <p className="text-xs text-[#25D366] mt-1.5 truncate">✓ {files.photo.name}</p>}
                    </div>

                    {/* 2° Passeport */}
                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30">
                      <span className="block font-cinzel text-xs text-[#E9D18F] font-bold mb-2">
                        2° Votre passeport valide
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setFiles({ ...files, passeport: e.target.files?.[0] || null })}
                        className="block w-full text-xs text-[#cabfa6] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-cinzel file:bg-[#C5A059] file:text-black hover:file:bg-[#E9D18F] cursor-pointer"
                      />
                      {files.passeport && <p className="text-xs text-[#25D366] mt-1.5 truncate">✓ {files.passeport.name}</p>}
                    </div>

                    {/* 3° Avis médical */}
                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30">
                      <span className="block font-cinzel text-xs text-[#E9D18F] font-bold mb-2">
                        3° Avis médical s’il y a lieu
                      </span>
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setFiles({ ...files, avisMedical: e.target.files?.[0] || null })}
                        className="block w-full text-xs text-[#cabfa6] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-cinzel file:bg-[#C5A059] file:text-black hover:file:bg-[#E9D18F] cursor-pointer"
                      />
                      {files.avisMedical && <p className="text-xs text-[#25D366] mt-1.5 truncate">✓ {files.avisMedical.name}</p>}
                    </div>

                    {/* 4° Tout autre document important */}
                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30">
                      <span className="block font-cinzel text-xs text-[#E9D18F] font-bold mb-2">
                        4° Tout autre document important
                      </span>
                      <input
                        type="file"
                        accept="*/*"
                        onChange={(e) => setFiles({ ...files, autreDocument: e.target.files?.[0] || null })}
                        className="block w-full text-xs text-[#cabfa6] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-cinzel file:bg-[#C5A059] file:text-black hover:file:bg-[#E9D18F] cursor-pointer"
                      />
                      {files.autreDocument && <p className="text-xs text-[#25D366] mt-1.5 truncate">✓ {files.autreDocument.name}</p>}
                    </div>
                  </div>
                </div>

                {/* BOUTON TRANSMETTRE LE FORMULAIRE • VALIDER */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-12 py-4 rounded-full font-cinzel text-xs tracking-widest uppercase font-bold text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:scale-105 cursor-pointer"
                  >
                    Transmettre le formulaire • VALIDER
                  </button>
                </div>
              </>
            )}
          </form>
        </section>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="font-cinzel text-xs tracking-widest text-[#C5A059] hover:text-[#E9D18F] transition-colors inline-flex items-center gap-2"
          >
            <span>&larr;</span> {lang === "fr" ? "RETOUR À L'ACCUEIL" : "BACK TO HOME"}
          </Link>
        </div>

      </div>
    </div>
  );
}
