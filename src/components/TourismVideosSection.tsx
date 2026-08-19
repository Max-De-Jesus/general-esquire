"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface TourismVideoItem {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  tagFr: string;
  tagEn: string;
  category: "culture" | "nature" | "cocooning" | "all";
  src: string;
  layout: "featured" | "landscape" | "portrait" | "standard";
  duration: string;
}

const TOURISM_VIDEOS: TourismVideoItem[] = [
  {
    id: "video-1",
    titleFr: "Trésors & Merveilles du Bénin",
    titleEn: "Treasures & Wonders of Benin",
    descriptionFr: "Une plongée visuelle au cœur de l'histoire, des monuments emblématiques et des traditions royales séculaires du Bénin.",
    descriptionEn: "A visual journey into the heart of history, iconic landmarks, and centuries-old royal traditions of Benin.",
    tagFr: "Patrimoine & Histoire",
    tagEn: "Heritage & History",
    category: "culture",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.10.30.mp4",
    layout: "featured",
    duration: "0:30",
  },
  {
    id: "video-2",
    titleFr: "Échappée Belle & Nature Sauvage",
    titleEn: "Wild Nature & Scenic Escapes",
    descriptionFr: "Explorez la faune, la flore et les panoramas préservés de nos parcs et réserves écologiques d'exception.",
    descriptionEn: "Explore the pristine wildlife, lush landscapes, and protected ecological reserves of Benin.",
    tagFr: "Nature & Écotourisme",
    tagEn: "Nature & Ecotourism",
    category: "nature",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.10.49.mp4",
    layout: "landscape",
    duration: "0:25",
  },
  {
    id: "video-3",
    titleFr: "Art de Vivre & Détente Balnéaire",
    titleEn: "Coastal Charms & Seaside Living",
    descriptionFr: "Ressourcez-vous au bord de l'océan Atlantique, entre cocoteraies dorées et résidences d'exception.",
    descriptionEn: "Unwind on the Atlantic coast amidst golden palm groves and luxury residences.",
    tagFr: "Cocooning & Sérénité",
    tagEn: "Cocooning & Serenity",
    category: "cocooning",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.11.14.mp4",
    layout: "portrait",
    duration: "0:28",
  },
  {
    id: "video-4",
    titleFr: "Rituels, Fêtes & Folklore Ancestral",
    titleEn: "Rituals, Festivals & Ancestral Folklore",
    descriptionFr: "Vibrez au rythme des chants sacrés, des danses traditionnelles et des célébrations vivantes uniques au monde.",
    descriptionEn: "Feel the vibrant pulse of sacred songs, traditional dances, and unique ancestral festivities.",
    tagFr: "Culture & Traditions",
    tagEn: "Culture & Traditions",
    category: "culture",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.11.41.mp4",
    layout: "landscape",
    duration: "0:26",
  },
  {
    id: "video-5",
    titleFr: "Saveurs Gourmandes & Terroirs",
    titleEn: "Gourmet Flavors & Local Terroir",
    descriptionFr: "Un voyage sensoriel inoubliable à travers la haute gastronomie béninoise et nos chefs privés.",
    descriptionEn: "An unforgettable culinary journey through refined Beninese cuisine and private dining.",
    tagFr: "Gastronomie & Terroir",
    tagEn: "Gastronomy & Terroir",
    category: "cocooning",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.12.07.mp4",
    layout: "portrait",
    duration: "0:25",
  },
  {
    id: "video-6",
    titleFr: "Cités Lacustres & Fleuves Sacrés",
    titleEn: "Lake Villages & Sacred Rivers",
    descriptionFr: "Navigation magique au fil de l'eau, à la découverte des villages flottants et de l'authenticité locale.",
    descriptionEn: "Scenic boat journey along tranquil waters, discovering stilt villages and authentic local life.",
    tagFr: "Excursions & Aventure",
    tagEn: "Excursions & Adventure",
    category: "nature",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.12.23.mp4",
    layout: "standard",
    duration: "0:15",
  },
  {
    id: "video-7",
    titleFr: "L'Expérience Chrysalides — VIP",
    titleEn: "The Chrysalides VIP Experience",
    descriptionFr: "Un accueil chaleureux dès l'aéroport, un guide personnel dédié et une conciergerie touristique haut de gamme.",
    descriptionEn: "A warm airport reception, dedicated personal guide, and bespoke luxury tourism concierge.",
    tagFr: "Séjour Sur-Mesure",
    tagEn: "Bespoke Journey",
    category: "cocooning",
    src: "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.12.40.mp4",
    layout: "standard",
    duration: "0:20",
  },
];

export default function TourismVideosSection() {
  const { lang } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeModalVideo, setActiveModalVideo] = useState<TourismVideoItem | null>(null);
  const [featuredVideo, setFeaturedVideo] = useState<TourismVideoItem>(TOURISM_VIDEOS[0]);
  const featuredVideoRef = useRef<HTMLVideoElement>(null);

  const filterTabs = [
    { key: "all", labelFr: "Toutes les capsules", labelEn: "All Video Clips" },
    { key: "culture", labelFr: "Culture & Histoire", labelEn: "Culture & Heritage" },
    { key: "nature", labelFr: "Nature & Excursions", labelEn: "Nature & Excursions" },
    { key: "cocooning", labelFr: "Cocooning & Détente", labelEn: "Cocooning & Relaxation" },
  ];

  const filteredVideos = selectedFilter === "all"
    ? TOURISM_VIDEOS
    : TOURISM_VIDEOS.filter((v) => v.category === selectedFilter);

  const handleSelectFeatured = (video: TourismVideoItem) => {
    setFeaturedVideo(video);
    if (featuredVideoRef.current) {
      featuredVideoRef.current.load();
      featuredVideoRef.current.play().catch(() => {});
    }
  };

  return (
    <section className="mt-20 pt-16 border-t border-[#C5A059]/30 relative" aria-labelledby="tourism-videos-heading">
      {/* Halo de fond lumineux */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-96 bg-gradient-to-b from-[#C5A059]/10 via-[#0F3823]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* En-tête de section */}
      <div className="text-center max-w-4xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#131513]/90 border border-[#C5A059]/50 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md mb-4">
          <span className="text-[#C5A059] text-xs">✦</span>
          <span className="font-cinzel text-xs text-[#E9D18F] font-bold tracking-[0.25em] uppercase">
            {lang === "fr" ? "Immersion Touristique & Culturelle" : "Touristic & Cultural Immersion"}
          </span>
          <span className="text-[#C5A059] text-xs">✦</span>
        </div>

        <h2 id="tourism-videos-heading" className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#E9D18F] mb-4 uppercase tracking-widest drop-shadow-md">
          {lang === "fr" ? "Découvrez le Bénin en Vidéos" : "Discover Benin in Videos"}
        </h2>

        <p className="font-cormorant text-xl sm:text-2xl text-[#cabfa6] leading-relaxed max-w-3xl mx-auto italic">
          {lang === "fr"
            ? "Nous vous proposons un aperçu captivant du Bénin à travers nos vidéos exclusives : paysages préservés, traditions royales et douceur de vivre touristique."
            : "Get an exclusive glimpse of Benin through our curated video series: scenic landscapes, royal heritage, and luxury touristic hospitality."}
        </p>

        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          <span className="text-[#C5A059] text-sm">◆</span>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
        </div>
      </div>

      {/* ─── 1. LECTEUR CINÉMATIQUE PRINCIPAL EN VEDETTE ───────────────── */}
      <div className="max-w-5xl mx-auto mb-16 relative z-10">
        <div className="bg-[#131513]/95 border-2 border-[#C5A059]/60 rounded-3xl p-4 sm:p-7 shadow-[0_0_50px_rgba(197,160,89,0.25)] overflow-hidden">
          
          {/* Header du player */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#E9D18F] font-bold">
                {lang === "fr" ? "Lecteur Vidéo Principal" : "Main Cinema Player"}
              </span>
              <span className="text-xs text-[#C5A059]/70">• {lang === "fr" ? featuredVideo.tagFr : featuredVideo.tagEn}</span>
            </div>
            <button
              onClick={() => setActiveModalVideo(featuredVideo)}
              className="inline-flex items-center gap-1.5 font-cinzel text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#E9D18F] bg-[#1a1c1a] hover:bg-[#C5A059]/20 border border-[#C5A059]/40 px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm"
              title="Agrandir en mode cinéma"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
              <span>{lang === "fr" ? "Plein Écran" : "Fullscreen"}</span>
            </button>
          </div>

          {/* Lecteur Vidéo */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#C5A059]/30 shadow-inner group">
            <video
              ref={featuredVideoRef}
              key={featuredVideo.src}
              src={featuredVideo.src}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Informations sous le lecteur principal */}
          <div className="mt-5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#C5A059]/20 pt-4">
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold mb-1">
                {lang === "fr" ? featuredVideo.titleFr : featuredVideo.titleEn}
              </h3>
              <p className="font-cormorant text-lg text-[#EDE4CF]/85 max-w-2xl leading-relaxed">
                {lang === "fr" ? featuredVideo.descriptionFr : featuredVideo.descriptionEn}
              </p>
            </div>

            <button
              onClick={() => setActiveModalVideo(featuredVideo)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(233,209,143,0.5)] hover:scale-105 transition-all duration-300 flex-shrink-0 cursor-pointer"
            >
              <span>▶</span>
              <span>{lang === "fr" ? "Mode Théâtre" : "Theater Mode"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. FILTRES DE CATÉGORIES VIDÉO ───────────────────────────── */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-10 relative z-10">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-5 py-2 rounded-full font-cinzel text-xs font-bold tracking-wider uppercase transition-all duration-300 border cursor-pointer ${
              selectedFilter === tab.key
                ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black border-transparent shadow-[0_0_15px_rgba(197,160,89,0.4)] scale-105"
                : "bg-[#131513]/90 text-[#EDE4CF]/80 border-[#C5A059]/30 hover:border-[#E9D18F] hover:text-white"
            }`}
          >
            {lang === "fr" ? tab.labelFr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* ─── 3. DISPOSITION INTERACTIVE DES VIDÉOS (PAYSAGE & PORTRAIT) ──────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 relative z-10">
        {filteredVideos.map((item, index) => {
          const isCurrentFeatured = featuredVideo.id === item.id;
          const isPortraitLayout = item.layout === "portrait";

          return (
            <div
              key={item.id}
              className={`group relative bg-[#131513]/90 border rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_35px_rgba(197,160,89,0.35)] transition-all duration-500 flex flex-col ${
                isCurrentFeatured
                  ? "border-[#E9D18F] ring-1 ring-[#E9D18F]/50 bg-[#161816]"
                  : "border-[#C5A059]/30 hover:border-[#E9D18F]"
              } ${isPortraitLayout ? "row-span-1" : ""}`}
            >
              {/* Conteneur Vidéo / Aperçu */}
              <div
                className={`relative w-full overflow-hidden bg-black cursor-pointer ${
                  isPortraitLayout ? "aspect-[9/14] max-h-[380px]" : "aspect-video"
                }`}
                onClick={() => {
                  handleSelectFeatured(item);
                  setActiveModalVideo(item);
                }}
              >
                <video
                  src={item.src}
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Badge Thème */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
                  <span className="bg-[#131513]/90 backdrop-blur-md border border-[#C5A059]/60 text-[#E9D18F] font-cinzel text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                    ✦ {lang === "fr" ? item.tagFr : item.tagEn}
                  </span>
                </div>

                {/* Badge Orientation / Format */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2 pointer-events-none">
                  <span className="bg-black/80 backdrop-blur-md border border-[#C5A059]/40 text-[#EDE4CF] font-cinzel text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-md">
                    {isPortraitLayout ? "Format Vertical" : "Format Paysage"}
                  </span>
                </div>

                {/* Bouton Play Central Stylisé */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/70 border-2 border-[#E9D18F] flex items-center justify-center text-[#E9D18F] shadow-[0_0_20px_rgba(233,209,143,0.5)] group-hover:scale-115 group-hover:bg-[#C5A059] group-hover:text-black transition-all duration-300">
                    <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Overlay Titre sur l'image */}
                <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                  <span className="font-cinzel text-xs text-[#C5A059] font-semibold tracking-wider block mb-0.5">
                    {lang === "fr" ? `Capsule #${index + 1}` : `Clip #${index + 1}`}
                  </span>
                  <h4 className="font-cinzel text-base sm:text-lg text-[#EDE4CF] font-bold drop-shadow leading-snug group-hover:text-[#E9D18F] transition-colors">
                    {lang === "fr" ? item.titleFr : item.titleEn}
                  </h4>
                </div>
              </div>

              {/* Description & Actions */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <p className="font-cormorant text-base text-[#cabfa6] leading-relaxed line-clamp-2">
                  {lang === "fr" ? item.descriptionFr : item.descriptionEn}
                </p>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#C5A059]/20">
                  <button
                    onClick={() => handleSelectFeatured(item)}
                    className="font-cinzel text-[11px] uppercase tracking-wider text-[#C5A059] hover:text-[#E9D18F] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>📺</span>
                    <span>{lang === "fr" ? "Charger en haut" : "Load in main player"}</span>
                  </button>

                  <button
                    onClick={() => setActiveModalVideo(item)}
                    className="px-4 py-1.5 rounded-full bg-[#1a1c1a] border border-[#C5A059]/50 hover:bg-[#C5A059] hover:text-black text-[#E9D18F] font-cinzel font-bold text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    {lang === "fr" ? "Regarder ↗" : "Watch ↗"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MODAL THÉÂTRE / PLEIN ÉCRAN INTERACTIF ───────────────────────── */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-fadeIn"
          onClick={() => setActiveModalVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl bg-[#131513] border-2 border-[#C5A059] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(197,160,89,0.35)] p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de Fermeture */}
            <button
              onClick={() => setActiveModalVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/80 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all duration-300 flex items-center justify-center text-xl font-bold cursor-pointer z-20 shadow-lg"
              aria-label="Fermer la vidéo"
            >
              ✕
            </button>

            {/* En-tête Modal */}
            <div className="mb-4 pr-12">
              <span className="inline-block font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase border border-[#C5A059]/40 px-3.5 py-1 rounded-full bg-[#1a1c1a] mb-2">
                ✦ {lang === "fr" ? activeModalVideo.tagFr : activeModalVideo.tagEn}
              </span>
              <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-[#E9D18F] leading-snug">
                {lang === "fr" ? activeModalVideo.titleFr : activeModalVideo.titleEn}
              </h3>
            </div>

            {/* Vidéo Autoplay */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-[#C5A059]/40 shadow-2xl mb-4">
              <video
                src={activeModalVideo.src}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Description & Navigation entre vidéos */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="font-cormorant text-lg text-[#EDE4CF]/90 max-w-xl">
                {lang === "fr" ? activeModalVideo.descriptionFr : activeModalVideo.descriptionEn}
              </p>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    const currentIndex = TOURISM_VIDEOS.findIndex((v) => v.id === activeModalVideo.id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : TOURISM_VIDEOS.length - 1;
                    setActiveModalVideo(TOURISM_VIDEOS[prevIndex]);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-[#EDE4CF] hover:text-[#E9D18F] hover:border-[#E9D18F] font-cinzel text-xs font-bold transition-all cursor-pointer"
                >
                  ← {lang === "fr" ? "Précédente" : "Previous"}
                </button>
                <button
                  onClick={() => {
                    const currentIndex = TOURISM_VIDEOS.findIndex((v) => v.id === activeModalVideo.id);
                    const nextIndex = currentIndex < TOURISM_VIDEOS.length - 1 ? currentIndex + 1 : 0;
                    setActiveModalVideo(TOURISM_VIDEOS[nextIndex]);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-[#EDE4CF] hover:text-[#E9D18F] hover:border-[#E9D18F] font-cinzel text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === "fr" ? "Suivante" : "Next"} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
