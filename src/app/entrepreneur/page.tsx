"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "./entrepreneur-animations.css";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

// ─── Liste des images avec dimensionnement identique ───────────────────────
const WHEEL_IMAGES = [
  { src: "/images/Chef d'entreprise3.jpg", title: "Conseil & Stratégie Juridique" },
  { src: "/images/Chef d'entreprise7.jpg", title: "Droit du Travail & Licenciements" },
  { src: "/images/Chef d'entreprise4.jpg", title: "Gestion des Risques & Fisc" },
  { src: "/images/Chef d'entreprise8.jpg", title: "Gouvernance & Forme Juridique" },
  { src: "/images/Chef d'entreprise13.jpg", title: "Négociations & Contrats" },
  { src: "/images/Chef d'entreprise6.jpg", title: "Accompagnement des Dirigeants" },
  { src: "/images/Chef d'entreprise16.jpg", title: "Réseau de Professionnels Droit & Finance" },
];

// ─── Composant Étoiles Scintillantes (Effet Wow) ───────────────────────────
function SparklingStars() {
  const stars = [
    { top: "6%", left: "4%", delay: "0s", size: "1.4rem" },
    { top: "12%", left: "92%", delay: "0.8s", size: "1.6rem" },
    { top: "25%", left: "8%", delay: "1.5s", size: "1.2rem" },
    { top: "38%", left: "88%", delay: "0.4s", size: "1.8rem" },
    { top: "50%", left: "3%", delay: "1.9s", size: "1.5rem" },
    { top: "62%", left: "95%", delay: "1.1s", size: "1.3rem" },
    { top: "78%", left: "6%", delay: "0.3s", size: "1.7rem" },
    { top: "86%", left: "91%", delay: "1.6s", size: "1.4rem" },
    { top: "94%", left: "48%", delay: "2.1s", size: "1.5rem" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {stars.map((s, i) => (
        <span
          key={i}
          className="sparkle-star"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            fontSize: s.size,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

// ─── Roue Rotative 3D en Position Verticale (Ferris Wheel Carousel) ─────────
function Vertical3DWheelCarousel() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = WHEEL_IMAGES.length;

  // Animation continue et lente en boucle sans fin
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.35) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Rayon vertical de la roue 3D
  const radiusY = 170; // Rayon vertical
  const radiusZ = 210; // Rayon en profondeur

  return (
    <div className="w-full my-12 sm:my-16 flex flex-col items-center">
      {/* Titre du carrousel */}
      <div className="text-center mb-6">
        <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase border border-[#C5A059]/40 px-4 py-1.5 rounded-full bg-[#131513]/80 inline-block shadow-md">
          ✦ Galerie Rotative 3D — Roue Verticale Continu ✦
        </span>
      </div>

      {/* Conteneur 3D avec Perspective */}
      <div
        className="relative w-full max-w-2xl h-[420px] sm:h-[480px] flex items-center justify-center overflow-hidden rounded-3xl border border-[#C5A059]/30 bg-gradient-to-b from-[#0e100e] via-[#131513] to-[#0e100e] shadow-[0_15px_50px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Halo doré d'arrière-plan */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.12),_transparent_70%)] pointer-events-none" />

        {/* Roue d'images 3D */}
        <div className="relative w-full h-full flex items-center justify-center">
          {WHEEL_IMAGES.map((img, idx) => {
            // Calcul de l'angle 3D propre à chaque image dans la roue
            const stepAngle = 360 / total;
            const itemAngle = (rotationAngle + idx * stepAngle) % 360;
            const rad = (itemAngle * Math.PI) / 180;

            // Position en cercle vertical (Y = hauteur, Z = profondeur)
            const translateY = Math.sin(rad) * radiusY;
            const translateZ = Math.cos(rad) * radiusZ;

            // Transparence en fondu : 1 au premier plan (devant), 0 en arrière-plan (derrière la roue)
            const cosVal = Math.cos(rad);
            // Fondu d'apparition et de disparition fluide (opacité max devant, s'estompe derrière)
            const opacity = Math.max(0.08, Math.pow((cosVal + 1) / 2, 1.8));

            // Calcul d'échelle et de flou (effet de profondeur de champ)
            const scale = 0.65 + 0.38 * ((cosVal + 1) / 2);
            const zIndex = Math.round(100 * cosVal + 100);

            return (
              <div
                key={idx}
                className="absolute transition-all duration-75 ease-linear flex flex-col items-center group"
                style={{
                  transform: `translate3d(0, ${translateY}px, ${translateZ}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                }}
              >
                {/* Image avec dimensionnement strictement uniforme (260px x 260px / mobile: 200px x 200px) */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-[0_10px_30px_rgba(0,0,0,0.9)] bg-black group-hover:border-[#E9D18F] group-hover:shadow-[0_0_25px_rgba(233,209,143,0.6)] transition-all">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    sizes="(max-width: 640px) 200px, 260px"
                    className="object-cover object-center filter brightness-105 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                {/* Titre au premier plan */}
                {cosVal > 0.4 && (
                  <div className="mt-2 px-3 py-1 bg-[#131513]/90 border border-[#C5A059]/50 rounded-full backdrop-blur-md text-center shadow-lg">
                    <span className="font-cinzel text-[11px] font-bold text-[#E9D18F] tracking-wider uppercase">
                      {img.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Légende bas de carrousel */}
        <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none z-40">
          <span className="font-cinzel text-[10px] text-[#C5A059]/80 uppercase tracking-widest bg-black/60 px-3 py-1 rounded-full border border-[#C5A059]/30">
            {isPaused ? "⏸️ Pause (Survolez pour explorer)" : "🔄 Roue rotative 3D continue"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Composant Principal : Page Chef d'Entreprise ───────────────────────────
export default function EntrepreneurPage() {
  const { lang } = useLanguage();
  const [activeModal, setActiveModal] = useState<"methode" | "tarifs" | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0e0d]/50 text-[#EDE4CF] pb-12 md:pb-20 relative">
      {/* Image de fond BACKRN.png */}
      <div className="fixed inset-0 z-0 opacity-55 pointer-events-none overflow-hidden">
        <Image
          src="/images/BACKRN.png"
          alt="Background Chefs d'Entreprise"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0d]/70 via-[#0d0e0d]/40 to-[#0d0e0d]/80" />
      </div>

      {/* ─── 1. EN-TÊTE : BANNIÈRE ────────────────────────────────────────── */}
      <header className="relative z-10 w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/BANNERCJ.png"
            alt="Bannière Chefs d'Entreprise — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER) ────────────────────────────────── */}
      <TickerBanner className="mb-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">
            {lang === "fr" ? "Chefs d'Entreprise" : "Business Owners"}
          </span>
        </div>

        {/* Titre de la rubrique */}
        <div className="text-center mb-8">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3">
            General Esquire — Espace Dirigeants
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mb-4">
            Vous êtes un chef d'entreprise
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* ─── BADGE ROTATIF HAUTS-DE-FRANCE ─────────────────────────────── */}
        <div className="my-6 sm:my-8 flex justify-center items-center relative z-20">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#C5A059]/40 via-[#E9D18F]/30 to-[#C5A059]/40 blur-xl opacity-80 animate-pulse group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#0e100e] border-2 border-[#C5A059] p-3 shadow-[0_0_30px_rgba(197,160,89,0.5)] flex items-center justify-center overflow-hidden">
              <Image
                src="/images/Badge Hauts de France.png"
                alt="Badge Région Hauts-de-France — General Esquire"
                width={170}
                height={170}
                priority
                className="object-contain filter drop-shadow-[0_4px_16px_rgba(197,160,89,0.6)] animate-[spin_25s_linear_infinite] hover:[animation-play-state:paused] transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* ─── CARROUSEL GALERIE ROTATIVE 3D (ROUE VERTICALE CONTINU) ───────── */}
        <Vertical3DWheelCarousel />

        {/* ─── PARAGRAPHE 1 : EFFET SUPER WOW AVEC ÉTOILES SCINTILLANTES ─────── */}
        <div className="wow-container p-8 sm:p-12 mb-10 text-center relative overflow-hidden">
          {/* Étoiles brillantes qui scintillent autour du texte */}
          <SparklingStars />

          <p className="font-cormorant text-xl sm:text-2xl md:text-3xl font-semibold leading-[1.85] text-justify relative z-10">
            <span className="wow-text-gradient">
              Nul n’est, plus qu’un chef d’entreprise, exposé à subir les conséquences de l’ignorance de la loi, en ce qu’elle est à la fois injonctive et prohibitive, mais aussi et plus que tout… sanctionnatrice. Le licenciement d’un salarié par exemple, ne se fait pas de façon hasardeuse. Il en est de même pour les déclarations faites auprès du fisc, dans le cadre d’un contrôle. Déjà la forme juridique de la personne morale elle-même influencera fortement la marge de manœuvre de son dirigeant et de ses associés s’il y en a, sachant que le moindre manquement peut entraîner pour l’entreprise comme pour ses représentants légaux, des sanctions de nature pénale, civile ou administrative. Le risque de la fermeture d’un établissement est en effet réel, et fait aussi mal au portefeuille et à la réputation, que l’emprisonnement du dirigeant, les amendes, ou les dommages et intérêts.
            </span>
          </p>
        </div>

        {/* ─── PARAGRAPHE 2 ─────────────────────────────────────────────────── */}
        <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-10 shadow-xl mb-10">
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.85] text-justify">
            Que vous soyez un homme ou une femme, seul ou associé, notre offre de service et nos tarifs peuvent s’adapter avec flexibilité, en fonction de votre budget et de vos préoccupations.
          </p>
        </div>

        {/* ─── LISTE DES PRESTATIONS PROPOSÉES ──────────────────────────────── */}
        <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-xl mb-12 space-y-6">
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#E9D18F] mb-4">
            Nous vous proposons sur une base annuelle, mensuelle ou ponctuelle :
          </h2>
          <ul className="space-y-4 font-cormorant text-base sm:text-lg text-[#EDE4CF] leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>une veille juridique sur les textes de loi et la jurisprudence ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>la domiciliation temporaire de vos courriers en cas d’urgence ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>l’assistance à l’occasion de vos formalités à forte implication juridique ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>des conseils adaptés à vos besoins si nécessaire en présentiel, et par défaut en visioconférence, audioconférence ou par écrit ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>la traduction de tous vos documents à valeur juridique en français, anglais (sans frais), chinois et russe (supplément à prévoir) ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>la rédaction de contrats, lettres de recrutement, lettres de licenciement, lettres administratives diverses ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>l’assistance lors de vos négociations commerciales et professionnelles ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>l’assistance dans les procédures sans représentation obligatoire ;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C5A059] font-bold text-xl mt-0.5">•</span>
              <span>la mise en relation avec d’autres professionnels du droit, de la finance, de la comptabilité ou de la fiscalité en fonction de vos besoins.</span>
            </li>
          </ul>
        </div>

        {/* ─── BOUTONS DE MODALES (MÉTHODE & TARIFS) ────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 my-12">
          <button
            onClick={() => setActiveModal("methode")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F3823]/20 border border-[#C5A059]/40 text-[#C5A059] hover:text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#0F3823]/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] font-cinzel text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer"
          >
            {lang === "fr" ? "NOTRE MÉTHODE DE TRAVAIL" : "OUR WORKING METHOD"}
          </button>
          <button
            onClick={() => setActiveModal("tarifs")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0F3823]/20 border border-[#C5A059]/40 text-[#C5A059] hover:text-[#E9D18F] hover:border-[#E9D18F] hover:bg-[#0F3823]/40 hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] font-cinzel text-xs sm:text-sm tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer"
          >
            {lang === "fr" ? "NOS TARIFS" : "OUR PRICING"}
          </button>
        </div>

        {/* ─── MODAL 1 : NOTRE MÉTHODE DE TRAVAIL ────────────────────────── */}
        {activeModal === "methode" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Notre méthode de travail
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Fermer la fenêtre"
                >
                  <span className="font-cinzel text-xl sm:text-2xl leading-none font-bold select-none">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-5 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed">
                <p>
                  Notre méthode pour les dirigeants d’entreprise privilégie la clarté et l’efficacité opérationnelle : vous nous confiez votre besoin ou votre litige, nous analysons les pièces juridiques et financières, puis nous établissons une stratégie d’action écrite.
                </p>
                <p>
                  Qu’il s’agisse d'abonnements annuels pour un conseil permanent ou de prestations ponctuelles au dossier, nous vous garantissons une rigueur absolue et des réponses adaptées à vos impératifs de gestion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2 : NOS TARIFS (AVEC TOUS LES TEXTES D'ABONNEMENT) ────── */}
        {activeModal === "tarifs" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{ animation: "fadeIn 0.3s ease" }}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Offres & Tarification — Chef d'Entreprise
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Fermer la fenêtre"
                >
                  <span className="font-cinzel text-xl sm:text-2xl leading-none font-bold select-none">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-8 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90">
                {/* 1. Abonnement annuel */}
                <div className="bg-[#131513] border border-[#C5A059]/30 p-6 rounded-2xl space-y-3">
                  <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Abonnement annuel</h3>
                  <p className="leading-relaxed">
                    Vous avez la possibilité de souscrire auprès de General Esquire, un abonnement prépayé sur une base forfaitaire de 10.000 € par an, sans restriction de volume de mission.
                  </p>
                  <p className="leading-relaxed">
                    Toutefois en cas d’urgence – c’est-à-dire si vous nous sollicitez pour une prestation qui doit être délivrée dans un délai inférieur ou égal à 48 heures – il vous sera facturé un supplément de 1500 € par prestation nécessitant une rédaction.
                  </p>
                  <p className="leading-relaxed">
                    Les documents traduits en chinois et russe donnent lieu à une facturation séparée qui est 10 € la page pour un document écrit, et de 10 € la minute pour un fichier multimédia, audio et/ou vidéo.
                  </p>
                  <p className="leading-relaxed">
                    L’abonnement annuel est renouvelable par tacite reconduction, sauf dénonciation expresse dans un délai de trois mois avant sa date anniversaire par tout écrit ayant date certaine.
                  </p>
                </div>

                {/* 2. Abonnement mensuel */}
                <div className="bg-[#131513] border border-[#C5A059]/30 p-6 rounded-2xl space-y-3">
                  <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Abonnement mensuel</h3>
                  <p className="leading-relaxed">
                    Vous avez également la possibilité de souscrire un abonnement mensuel au tarif de 1000 € par mois, donnant droit à l’ensemble de nos prestations dans les termes et conditions susmentionnés.
                  </p>
                  <p className="leading-relaxed">
                    Il est résiliable à tout moment, tout paiement fait à la société General Esquire lui étant acquis.
                  </p>
                </div>

                {/* 3. Prestation ponctuelle */}
                <div className="bg-[#131513] border border-[#C5A059]/30 p-6 rounded-2xl space-y-3">
                  <h3 className="font-cinzel text-xl font-bold text-[#E9D18F]">Prestation ponctuelle</h3>
                  <p className="leading-relaxed">
                    Il est également possible de solliciter nos services sur une base ponctuelle.
                  </p>
                  <p className="leading-relaxed">
                    Dans cette hypothèse, la facturation fait l’objet d’une convention de gré à gré, qui prend en considération les données propres à la préoccupation que vous nous soumettez, ainsi que notre disponibilité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

