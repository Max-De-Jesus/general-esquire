"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ServicesModal from "@/components/ServicesModal";
import TickerBanner from "@/components/TickerBanner";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { lang } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  // Gestion du fichier audio lié à la bannière d'accueil
  const bannerRef = useRef<HTMLElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isBannerVisibleRef = useRef<boolean>(true);
  const userMutedRef = useRef<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    const banner = bannerRef.current;
    if (!audio) return;

    // Tentative de lecture audio
    const attemptPlay = () => {
      if (!isBannerVisibleRef.current || userMutedRef.current) return;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Politique autoplay du navigateur : sera débloqué dès la 1ère interaction
      });
    };

    // 1. Démarrage automatique dès l'arrivée du visiteur
    attemptPlay();

    // 2. Déblocage immédiat au premier geste utilisateur si autoplay strict
    const onUserGesture = () => {
      attemptPlay();
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
    };

    window.addEventListener("pointerdown", onUserGesture, { passive: true });
    window.addEventListener("touchstart", onUserGesture, { passive: true });
    window.addEventListener("scroll", onUserGesture, { passive: true });
    window.addEventListener("keydown", onUserGesture, { passive: true });

    // 3. Détection de la disparition totale de la bannière vers le haut (IntersectionObserver)
    let observer: IntersectionObserver | null = null;
    if (banner && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const isVisible = entry.isIntersecting;
            isBannerVisibleRef.current = isVisible;
            if (!isVisible) {
              // La bannière a disparu totalement de l'écran : couper le son
              audio.pause();
              setIsPlaying(false);
            } else if (!userMutedRef.current) {
              // La bannière redevient visible : relancer le son
              audio.play().then(() => {
                setIsPlaying(true);
              }).catch(() => {});
            }
          });
        },
        {
          root: null,
          threshold: 0, // 0 = déclenchement dès que la bannière quitte complètement l'écran
        }
      );
      observer.observe(banner);
    }

    // 4. Couper le son si l'utilisateur change d'onglet
    const onVisibilityChange = () => {
      if (document.hidden) {
        audio.pause();
        setIsPlaying(false);
      } else if (isBannerVisibleRef.current && !userMutedRef.current) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("scroll", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (observer && banner) {
        observer.unobserve(banner);
      }
      audio.pause();
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      userMutedRef.current = true;
    } else {
      userMutedRef.current = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const tx = {
    welcome_title:
      lang === "fr" ? "Bienvenue chez General Esquire" : "Welcome to General Esquire",
    lead:
      lang === "fr"
        ? "La société General Esquire est née de la volonté de son président, avocat de formation en France et au Canada, de concilier au sein d'une seule et même structure professionnelle, deux qualités fondamentales qui lui sont propres :"
        : "General Esquire was born from the vision of its president, trained as a lawyer in France and Canada, to unite two fundamental qualities within a single professional firm:",
    bullet1:
      lang === "fr"
        ? "d'une part, sa compétence aiguisée par plusieurs années d'expérience, de juriste rigoureux totalement dévoué à la défense des intérêts de ses clients ;"
        : "on the one hand, a sharp competence forged through years of experience as a rigorous legal expert dedicated to defending clients' best interests;",
    bullet2:
      lang === "fr"
        ? "d'autre part, sa bienveillance d'avocat humaniste au service de leur bien-être temporaire, à raison de la rudesse émotionnelle consubstantielle au combat judiciaire."
        : "on the other hand, the compassionate care of a humanist lawyer devoted to their emotional well-being through the hardships of legal battles.",
    chrysalides_text:
      lang === "fr"
        ? "Notre société, par actions simplifiées, exerce également à l'enseigne « Chrysalides », ce qui n'est pas sans évoquer l'étape essentielle du cheminement de la nymphe de lépidoptère, qui devrait transformer en un flamboyant papillon, la chenille du moment qu'elle est, empêtrée dans les difficultés de son existence."
        : "Our simplified joint-stock company also operates under the trade name “Chrysalides”, evoking the essential metamorphosis of a caterpillar transforming into a radiant butterfly freed from life's struggles.",
    esquire_text:
      lang === "fr"
        ? "Titre porté par les avocats dans certaines juridictions de Common Law, en Grande-Bretagne et aux États-Unis d'Amérique, le « Esquire » ou écuyer, ici « General » car il traite tous types de problèmes juridiques, offre l'image du serviteur aliéné corps et âme au triomphe de la cause de son souverain, celui ou celle dont il reçoit mandat."
        : "A title borne by attorneys in Common Law jurisdictions, “Esquire” (squire), combined here with “General” as it addresses all legal matters, embodies a servant devoted body and soul to the triumph of their sovereign's cause.",
    signature_welcome:
      lang === "fr"
        ? "Nous sommes donc heureux de vous accueillir sur ce site, et c'est peu de dire que :"
        : "We are delighted to welcome you to our website, and it is no exaggeration to say:",
    signature_hands:
      lang === "fr" ? "« Vous êtes entre de bonnes mains »." : "“You are in good hands.”",
    click_here:
      lang === "fr" ? "Cliquer ici" : "Click here",
    click_blason:
      lang === "fr"
        ? "Cliquez sur le blason pour découvrir les rubriques →"
        : "Click the crest to explore all sections →",
  };

  const textBlock = (
    <div className="space-y-6">
      <div className="space-y-4 my-2">
        <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]">
          {tx.bullet1}
        </p>
        <p className="border-l-2 border-[#C5A059] pl-6 italic text-[#EDE4CF]">
          {tx.bullet2}
        </p>
      </div>

      <p className="text-[#EDE4CF]">
        {tx.chrysalides_text}
      </p>

      <p className="text-[#EDE4CF]">
        {tx.esquire_text}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1A1C1A] text-[#EDE4CF] flex flex-col justify-between overflow-x-hidden">
      {/* ─── 1. EN-TÊTE : VIDÉO PUBLICITAIRE PANORAMIQUE ───────────────────
          Même hauteur que l'ancienne bannière image (clamp 180–460 px). La vidéo (~21:9) est
          donc recadrée en object-cover, cadrage à 20 % pour garder les têtes ; logos et textes
          sont placés dans la vidéo pour rester visibles dans ce recadrage jusqu'à 1920 px de
          large (bande 9 %–65 % de la hauteur, contrainte documentée dans video-pub/assemble-v2.mjs).
          V2 (~90 s, 2026-10-15), fichiers suffixés -v2 pour ne pas servir l'ancienne version en cache.
          HD (1920×822) sur grand écran, version légère (1280×548) ailleurs.
          Mouvement réduit demandé : la vidéo est masquée, l'affiche (poster) reste visible. */}
      <header ref={bannerRef} className="w-full bg-[#131513] overflow-hidden relative z-10">
        <div
          className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden bg-cover bg-[center_20%]"
          style={{ backgroundImage: "url('/videos/poster-v2.jpg')" }}
        >
          <video
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] motion-reduce:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/videos/poster-v2.jpg"
            aria-label="General Esquire : conseil juridique et accompagnement touristique au Bénin — vous êtes entre de bonnes mains"
          >
            <source src="/videos/general-esquire-v2-hd.mp4" type="video/mp4" media="(min-width: 1280px)" />
            <source src="/videos/general-esquire-v2-web.mp4" type="video/mp4" />
          </video>

          {/* Fichier audio associé à la bannière d'accueil */}
          <audio
            ref={audioRef}
            src="/audio/banner-audio.mp3"
            preload="auto"
            loop
            playsInline
          />

          {/* Bouton de contrôle audio discret sur la bannière */}
          <button
            type="button"
            onClick={toggleAudio}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-20 flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#131513]/85 border border-[#C5A059]/60 text-[#E9D18F] text-xs font-cinzel hover:bg-gradient-to-r hover:from-[#C5A059] hover:to-[#E9D18F] hover:text-black hover:border-[#E9D18F] backdrop-blur-md transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.8)] cursor-pointer select-none group"
            aria-label={isPlaying ? "Couper le son de la bannière" : "Activer le son de la bannière"}
          >
            <span className="text-sm transition-transform group-hover:scale-110">
              {isPlaying ? "🔊" : "🔇"}
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              {isPlaying
                ? (lang === "fr" ? "Son actif" : "Sound on")
                : (lang === "fr" ? "Activer le son" : "Unmute")}
            </span>
          </button>
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH) ────────────────────── */}
      <TickerBanner />

      {/* ─── 3. MAIN ACCUEIL (MESSAGE DE BIENVENUE AVEC "LE TUEUR DE DRAGON" EN FOND) ─── */}
      <main className="relative z-0 py-10 sm:py-16 px-4 sm:px-8 flex-grow">
        {/* Background image overlay : Le dragon.jpg — FIXE en arrière-plan (-z-10) */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden opacity-85" style={{willChange: 'transform'}}>
          <Image
            src="/images/Le dragon.jpg"
            alt="Le dragon — Fond General Esquire"
            fill
            priority
            className="object-cover object-[50%_35%] filter saturate-110 brightness-115 contrast-105"
            style={{objectFit: 'cover'}}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1A]/30 via-transparent to-[#131513]/70"></div>
        </div>

        <div className="max-w-[760px] mx-auto text-left">
          {/* Main Title */}
          <h1 className="font-cinzel text-2xl sm:text-4xl font-bold uppercase tracking-wide text-[#E9D18F] text-center mb-3 drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
            {tx.welcome_title.split("General Esquire")[0]}
            <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059]">
              General Esquire
            </span>
          </h1>

          {/* Golden Line Divider */}
          <div className="w-[80px] h-[1px] bg-[#C5A059] mx-auto mb-8 opacity-80"></div>

          {/* Lead intro paragraph */}
          <p className="font-cormorant font-semibold text-xl sm:text-2xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] leading-[1.8] mb-6">
            {tx.lead}
          </p>

          {/* ─── FENÊTRE DE DÉFILEMENT VERTICAL ULTRA-LENT & 100% CONTINU (HAUTE VISIBILITÉ & LISIBILITÉ) ─── */}
          <div className="texte-defilant-container shadow-2xl">
            <div className="texte-defilant-piste font-cormorant text-lg sm:text-xl text-[#EDE4CF] font-medium leading-[2.1] flex flex-col gap-6 drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
              {textBlock}
              {textBlock}
              {textBlock}
            </div>
          </div>

          {/* Signature */}
          <div className="pt-6 text-center space-y-2">
            <p className="font-cormorant italic text-xl sm:text-2xl text-[#EDE4CF] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {tx.signature_welcome}
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {tx.signature_hands}
            </p>
          </div>

          {/* ─── 4. BLASON LOGO ZONE (SEUL BOUTON DE MENU AVEC ZOOM IN/OUT & HALO LUMINEUX) ───────────── */}
          <div className="mt-12 sm:mt-16 mb-8 flex flex-col items-center justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="group relative flex flex-col items-center cursor-pointer focus:outline-none select-none transition-transform active:scale-95"
              aria-label="Ouvrir le menu des services"
            >
              {/* HALO LUMINEUX DORÉ D'ARRIÈRE-PLAN (EFFET LUMINEUX PULSANT) */}
              <div
                className="absolute inset-0 m-auto w-52 h-52 sm:w-72 sm:h-72 rounded-full pointer-events-none animate-halo-backlight -z-10"
                style={{
                  background:
                    "radial-gradient(circle, rgba(233, 209, 143, 0.7) 0%, rgba(197, 160, 89, 0.42) 40%, rgba(197, 160, 89, 0.15) 60%, transparent 75%)",
                  filter: "blur(26px)",
                }}
              />

              {/* ONDES LUMINEUSES DORÉES CONCENTRIQUES EN BOUCLE */}
              <div className="absolute inset-0 m-auto w-44 h-44 sm:w-60 sm:h-60 rounded-full border border-[#E9D18F]/50 pointer-events-none animate-radar-wave-1 -z-10" />
              <div className="absolute inset-0 m-auto w-44 h-44 sm:w-60 sm:h-60 rounded-full border border-[#C5A059]/40 pointer-events-none animate-radar-wave-2 -z-10" />

              {/* CONTENEUR DU BLASON ET DE L'ÉCRIT AVEC EFFET ZOOM IN / ZOOM OUT SYNCHRONISÉ EN BOUCLE */}
              <div className="relative p-3 flex flex-col items-center animate-logo-zoom transition-transform duration-300 group-hover:scale-125">
                <Image
                  src="/images/logo.png"
                  alt="Blason General Esquire — Chrysalides"
                  width={260}
                  height={260}
                  className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                  priority
                />

                {/* PHRASE SOUS LE BLASON : CLIQUER ICI (ANIME DANS LE MÊME ÉLAN DORÉ ET ZOOM) */}
                <span className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#E9D18F] bg-[#131513]/90 border border-[#C5A059]/80 shadow-[0_0_18px_rgba(197,160,89,0.4)] backdrop-blur-sm group-hover:bg-gradient-to-r group-hover:from-[#C5A059] group-hover:to-[#E9D18F] group-hover:text-black group-hover:border-[#E9D18F] group-hover:shadow-[0_0_30px_rgba(233,209,143,0.8)] transition-all duration-300">
                  <span>{tx.click_here}</span>
                  <span className="text-[#C5A059] group-hover:text-black transition-colors">✦</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* ─── 5. SLIDE-OVER SERVICES MENU ─────────────────────────────────── */}
      <ServicesModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
