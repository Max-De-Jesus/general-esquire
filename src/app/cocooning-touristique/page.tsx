"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function CocooningTouristiquePage() {
  const { lang } = useLanguage();
  const [showForm, setShowForm] = useState(true);
  const [genre, setGenre] = useState("masculin");
  const [medical, setMedical] = useState("non");
  const [presentation, setPresentation] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);

  const handleDietChange = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const wordCount = presentation.trim() ? presentation.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] py-12 md:py-20 relative">
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
              src="/images/Embrassades001.png"
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
                src="/images/Soins.jpg"
                alt="Soins et bien-être"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Détente.jpg"
                alt="Espaces de détente"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* Tarifs et Inclusions Banner */}
        <section className="mb-16 bg-gradient-to-r from-[#0F3823]/80 via-[#131513] to-[#0F3823]/80 border border-[#C5A059]/40 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {lang === "fr" ? "Formule Complète 2 Semaines" : "Full 2-Week Package"}
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#E9D18F] font-bold">
              1 350 € <span className="text-sm font-normal text-[#cabfa6] font-cormorant">{lang === "fr" ? "/ pensionnaire (hors billet d'avion)" : "/ guest (excl. airfare)"}</span>
            </h2>
            <p className="font-cormorant text-base text-[#cabfa6] mt-2">
              {lang === "fr"
                ? "Outre le billet d’avion Paris-Cotonou-Paris, le coût global indicatif comprend :"
                : "In addition to your Paris-Cotonou round-trip airfare, the package includes:"}
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center my-8">
            <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30">
              <span className="text-3xl mb-2 block">🏡</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider">{lang === "fr" ? "L'HÉBERGEMENT" : "ACCOMMODATION"}</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30">
              <span className="text-3xl mb-2 block">🍽️</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider">{lang === "fr" ? "LES REPAS" : "MEALS"}</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30">
              <span className="text-3xl mb-2 block">🗺️</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider">{lang === "fr" ? "LES EXCURSIONS" : "EXCURSIONS"}</h3>
            </div>
            <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/30">
              <span className="text-3xl mb-2 block">🧘</span>
              <h3 className="font-cinzel text-sm font-bold text-[#E9D18F] tracking-wider">{lang === "fr" ? "LA DÉTENTE" : "RELAXATION"}</h3>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/20 font-cormorant text-base text-[#EDE4CF] text-center max-w-2xl mx-auto">
            {lang === "fr"
              ? "Pour des raisons de logistique, nous organisons une fois par an, au cours des deux premières semaines de janvier, un séjour groupé pour au moins 10 pensionnaires. Inscriptions ouvertes de février à fin septembre."
              : "For logistics reasons, we organize once a year, during the first two weeks of January, a group stay for at least 10 guests. Registrations open from February to end of September."}
          </div>
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

          <form className="space-y-6 max-w-3xl mx-auto font-cormorant text-lg">
            
            {/* NOM & PRÉNOMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                  {lang === "fr" ? "VOTRE NOM *" : "LAST NAME *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "fr" ? "ex. Dupont" : "e.g. Smith"}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#EDE4CF]/10 border border-[#C5A059]/30 text-white placeholder-[#EDE4CF]/40 focus:outline-none focus:border-[#E9D18F]"
                />
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                  {lang === "fr" ? "VOS PRÉNOMS *" : "FIRST NAMES *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "fr" ? "ex. Marie-Claire" : "e.g. Jane"}
                  className="w-full px-5 py-3.5 rounded-xl bg-[#EDE4CF]/10 border border-[#C5A059]/30 text-white placeholder-[#EDE4CF]/40 focus:outline-none focus:border-[#E9D18F]"
                />
              </div>
            </div>

            {/* GENRE */}
            <div className="p-5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/20">
              <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-3">
                {lang === "fr" ? "GENRE" : "GENDER"}
              </label>
              <div className="flex flex-wrap gap-6 font-cinzel text-sm">
                {[
                  { value: "masculin", label: lang === "fr" ? "Masculin" : "Male" },
                  { value: "féminin", label: lang === "fr" ? "Féminin" : "Female" },
                  { value: "non genré", label: lang === "fr" ? "Non genré" : "Non-binary" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2 cursor-pointer capitalize">
                    <input
                      type="radio"
                      name="genre"
                      value={item.value}
                      checked={genre === item.value}
                      onChange={() => setGenre(item.value)}
                      className="accent-[#C5A059]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DATE DE NAISSANCE & LIEU & NATIONALITÉ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                  {lang === "fr" ? "DATE DE NAISSANCE *" : "DATE OF BIRTH *"}
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[#EDE4CF]/10 border border-[#C5A059]/30 text-white focus:outline-none focus:border-[#E9D18F]"
                />
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                  {lang === "fr" ? "LIEU DE NAISSANCE" : "PLACE OF BIRTH"}
                </label>
                <input
                  type="text"
                  placeholder={lang === "fr" ? "Ville, Pays" : "City, Country"}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#EDE4CF]/10 border border-[#C5A059]/30 text-white placeholder-[#EDE4CF]/40 focus:outline-none focus:border-[#E9D18F]"
                />
              </div>
              <div>
                <label className="block font-cinzel text-xs tracking-widest text-[#C5A059] uppercase mb-2">
                  {lang === "fr" ? "NATIONALITÉ *" : "NATIONALITY *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "fr" ? "ex. Française" : "e.g. French"}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#EDE4CF]/10 border border-[#C5A059]/30 text-white placeholder-[#EDE4CF]/40 focus:outline-none focus:border-[#E9D18F]"
                />
              </div>
            </div>

            {/* BOUTON VALIDER */}
            <div className="text-center pt-6">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    lang === "fr"
                      ? "Votre demande de Cocooning Touristique au Bénin a bien été enregistrée. Nos équipes prendront contact avec vous rapidement !"
                      : "Your Tourist Cocooning request in Benin has been recorded. Our team will contact you shortly!"
                  );
                }}
                className="w-full sm:w-auto px-12 py-4 rounded-full font-cinzel text-xs tracking-widest uppercase font-semibold text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all shadow-xl hover:scale-105 cursor-pointer"
              >
                {lang === "fr" ? "Transmettre le formulaire • VALIDER" : "Submit Form • VALIDATE"}
              </button>
            </div>
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
