"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function TourismVideosSection() {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Chemin vers la vidéo unique
  const videoSrc = "/images/video tourisme/video_principale.mp4";
  // Fallback vers l'une des vidéos existantes jusqu'à ce que la nouvelle vidéo soit ajoutée
  const fallbackSrc = "/images/video tourisme/WhatsApp Video 2026-08-17 at 17.10.30.mp4";

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <section className="mt-20 pt-16 border-t border-[#C5A059]/30 relative" aria-labelledby="tourism-video-heading">
      {/* Halo de fond lumineux */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-96 bg-gradient-to-b from-[#C5A059]/15 via-[#0F3823]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* En-tête de section */}
      <div className="text-center max-w-4xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#131513]/90 border border-[#C5A059]/50 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md mb-4">
          <span className="text-[#C5A059] text-xs">✦</span>
          <span className="font-cinzel text-xs text-[#E9D18F] font-bold tracking-[0.25em] uppercase">
            {lang === "fr" ? "Immersion Touristique & Découverte" : "Touristic & Cultural Immersion"}
          </span>
          <span className="text-[#C5A059] text-xs">✦</span>
        </div>

        <h2 id="tourism-video-heading" className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#E9D18F] mb-4 uppercase tracking-widest drop-shadow-md">
          {lang === "fr" ? "Découvrez le Bénin en Vidéo" : "Discover Benin on Video"}
        </h2>

        <p className="font-cormorant text-xl sm:text-2xl text-[#cabfa6] leading-relaxed max-w-3xl mx-auto italic">
          {lang === "fr"
            ? "Plongez au cœur de l'expérience Chrysalides : patrimoines vivants, paysages préservés et douceur de vivre touristique."
            : "Immerse yourself in the Chrysalides experience: vibrant heritage, pristine landscapes, and authentic hospitality."}
        </p>

        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
          <span className="text-[#C5A059] text-sm">◆</span>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />
        </div>
      </div>

      {/* ─── LECTEUR VIDÉO UNIQUE (LANCEMENT AU CLIC) ───────────────── */}
      <div className="max-w-5xl mx-auto mb-16 relative z-10 px-4">
        <div className="bg-[#131513]/95 border-2 border-[#C5A059]/60 rounded-3xl p-4 sm:p-7 shadow-[0_0_50px_rgba(197,160,89,0.3)] overflow-hidden">
          
          {/* Header du player */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-[#C5A059]"}`} />
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#E9D18F] font-bold">
                {lang === "fr" ? "Capsule Exclusive Chrysalides" : "Exclusive Chrysalides Film"}
              </span>
              <span className="text-xs text-[#C5A059]/70">• {lang === "fr" ? "Tourisme & Sérénité" : "Tourism & Serenity"}</span>
            </div>

            <button
              onClick={handleToggleFullscreen}
              className="inline-flex items-center gap-1.5 font-cinzel text-xs uppercase tracking-wider text-[#C5A059] hover:text-[#E9D18F] bg-[#1a1c1a] hover:bg-[#C5A059]/20 border border-[#C5A059]/40 px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm"
              title={lang === "fr" ? "Plein Écran" : "Fullscreen"}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
              <span>{lang === "fr" ? "Plein Écran" : "Fullscreen"}</span>
            </button>
          </div>

          {/* Cadre du Lecteur Vidéo Interactif */}
          <div
            ref={containerRef}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#C5A059]/40 shadow-2xl group cursor-pointer"
            onClick={handlePlayToggle}
          >
            <video
              ref={videoRef}
              controls={isPlaying}
              playsInline
              preload="metadata"
              poster="/images/Welcome.jpg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== fallbackSrc) {
                  target.src = fallbackSrc;
                }
              }}
              className="w-full h-full object-contain"
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={fallbackSrc} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de cette vidéo.
            </video>

            {/* Overlay bouton PLAY au centre quand la vidéo est en pause */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/30">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#C5A059]/30 animate-ping pointer-events-none" />
                  <button
                    type="button"
                    aria-label="Lancer la vidéo"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#C5A059] via-[#E9D18F] to-[#C5A059] text-black flex items-center justify-center text-3xl sm:text-4xl pl-1 shadow-[0_0_40px_rgba(233,209,143,0.7)] group-hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/50"
                  >
                    ▶
                  </button>
                </div>
                <div className="absolute bottom-6 font-cinzel text-xs sm:text-sm text-[#E9D18F] tracking-[0.2em] uppercase font-bold bg-black/60 px-5 py-2 rounded-full border border-[#C5A059]/40 backdrop-blur-md">
                  {lang === "fr" ? "Cliquez pour lancer la vidéo" : "Click to play the video"}
                </div>
              </div>
            )}
          </div>

          {/* Informations sous le lecteur principal */}
          <div className="mt-5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#C5A059]/20 pt-4">
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold mb-1">
                {lang === "fr" ? "Immersion Exclusive au Bénin — General Esquire" : "Exclusive Benin Journey — General Esquire"}
              </h3>
              <p className="font-cormorant text-lg text-[#EDE4CF]/85 max-w-2xl leading-relaxed">
                {lang === "fr"
                  ? "Une vidéo d'exception illustrant les moments forts de notre accompagnement, la découverte des cités historiques et la sérénité de votre séjour."
                  : "A film capturing the key moments of our bespoke guidance, historical city tours, and the serene retreat experience."}
              </p>
            </div>

            <button
              onClick={handlePlayToggle}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_25px_rgba(233,209,143,0.5)] hover:scale-105 transition-all duration-300 flex-shrink-0 cursor-pointer"
            >
              <span>{isPlaying ? "⏸" : "▶"}</span>
              <span>{isPlaying ? (lang === "fr" ? "Mettre en Pause" : "Pause") : (lang === "fr" ? "Lancer la Vidéo" : "Play Video")}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
