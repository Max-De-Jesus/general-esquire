"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

const CAROUSEL_IMAGES = [
  {
    src: "/images/bureau-modifie.jpg",
    title: "Cabinet & Expertise Juridique",
    desc: "Assistance sur-mesure pour avocats, notaires, huissiers et juristes d'entreprise",
  },
  {
    src: "/images/avocate.png",
    title: "Rédaction d'Actes & Conclusions",
    desc: "Rigueur absolue, recherches approfondies et écritures prêtes à déposer",
  },
  {
    src: "/images/Avocate enceinte1.jpg",
    title: "Collaboration & Sous-Traitance",
    desc: "Un soutien réactif pour faire face à vos échéances et surcroîts d'activité",
  },
  {
    src: "/images/case1.png",
    title: "Accompagnement Contentieux",
    desc: "Mémoires en demande et en défense devant toutes juridictions",
  },
  {
    src: "/images/case2.png",
    title: "Excellence & Confidentialité",
    desc: "Engagements de déontologie et sécurité juridique garantis",
  },
];

function Sparkles({ count = 24 }: { count?: number }) {
  const stars = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 88 + 6,
      left: Math.random() * 90 + 4,
      delay: Math.random() * 3,
      size: 10 + Math.random() * 16,
      tx: (Math.random() - 0.5) * 50,
      ty: (Math.random() - 0.5) * 50,
    }));
  }, [count]);

  return (
    <span className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {stars.map((s) => (
        <span
          key={s.id}
          className="sparkle-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            // @ts-ignore
            "--tx": `${s.tx}px`,
            "--ty": `${s.ty}px`,
          }}
        >
          ✦
        </span>
      ))}
    </span>
  );
}

function ProfessionnelCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  return (
    <div
      className="mb-14 rounded-3xl overflow-hidden border-2 border-[#C5A059]/50 bg-[#131513] shadow-[0_15px_50px_rgba(0,0,0,0.6)] relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── SLIDER CONTENEUR ─── */}
      <div className="relative h-[320px] sm:h-[420px] md:h-[480px] w-full overflow-hidden">
        {CAROUSEL_IMAGES.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                isActive
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 pointer-events-none z-0"
              }`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                priority={idx === 0}
                className="object-cover filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0d] via-black/40 to-transparent" />

              {/* Texte overlay sur le slide actif */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-20">
                <span className="font-cinzel text-xs text-[#E9D18F] tracking-[0.25em] uppercase block mb-1 drop-shadow-md">
                  COLLABORATION JURIDIQUE
                </span>
                <h3 className="font-cinzel text-xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="font-cormorant text-sm sm:text-lg text-[#EDE4CF] max-w-2xl drop-shadow-md">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* ─── BOUTONS FLÈCHES GAUCHE & DROITE ─── */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#131513]/80 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg group-hover:scale-105"
          aria-label="Slide précédent"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#131513]/80 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg group-hover:scale-105"
          aria-label="Slide suivant"
        >
          ❯
        </button>
      </div>

      {/* ─── MINIATURES & INDICATEURS EN BAS ─── */}
      <div className="bg-[#0a0b0a] border-t border-[#C5A059]/30 p-3 sm:p-4 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? "w-8 bg-[#E9D18F] shadow-[0_0_10px_#E9D18F]"
                  : "w-2.5 bg-[#C5A059]/40 hover:bg-[#C5A059]/80"
              }`}
              aria-label={`Aller au slide ${idx + 1}`}
            />
          ))}
        </div>

        <span className="hidden sm:inline-block font-cinzel text-xs text-[#C5A059] uppercase tracking-widest">
          {currentIndex + 1} / {CAROUSEL_IMAGES.length}
        </span>
      </div>
    </div>
  );
}

export default function ProfessionnelPage() {
  const { t, lang } = useLanguage();
  const [activeModal, setActiveModal] = useState<"methode" | "tarifs" | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0e0d]/50 text-[#EDE4CF] pb-12 md:pb-20 relative">
      {/* Background image BACKRN.png */}
      <div className="fixed inset-0 z-0 opacity-55 pointer-events-none overflow-hidden">
        <Image
          src="/images/BACKRN.png"
          alt="Background Professionnels du Droit"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0e0d]/70 via-[#0d0e0d]/40 to-[#0d0e0d]/80" />
      </div>

      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE ─────────────────────────────────── */}
      <header className="relative z-10 w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/BANNERCJ.png"
            alt="Bannière Professionnels du Droit — General Esquire"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────── */}
      <TickerBanner items={["GENERAL ESQUIRE", "PROFESSIONNELS DU DROIT", "RÉDACTION D'ACTES", "MEMOIRES & CONCLUSIONS", "COLLABORATION JURIDIQUE", "EXCELLENCE"]} className="mb-8" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{t("nav_home")}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{lang === "fr" ? "Vous êtes un professionnel du droit" : "Legal Professional"}</span>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12">
          <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-3">
            {lang === "fr" ? "Collaboration & Sous-traitance" : "Collaboration & Outsourcing"}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] mb-4">
            {lang === "fr" ? "Vous êtes un professionnel du droit" : "You Are a Legal Professional"}
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059]">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* ─── CARROUSEL SLIDER DES IMAGES (FONCTIONNEL ET AUTO-PLAY) ─────────────── */}
        <ProfessionnelCarousel />

        {/* ─── BANNIÈRE PANNEAU DÉROULANT AVEC ÉTOILES SCINTILLANTES (Capture 2) ─── */}
        <div className="relative mb-12 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#072517] via-[#0D3522] to-[#072517] border-2 border-[#C5A059] shadow-[0_0_50px_rgba(11,34,25,0.8),inset_0_0_30px_rgba(197,160,89,0.15)] overflow-hidden text-center group">
          <Sparkles count={26} />
          
          <div className="relative z-20 max-w-3xl mx-auto space-y-4">
            <p className="font-cormorant text-2xl sm:text-3xl font-bold leading-relaxed text-[#EDE4CF] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] italic">
              {lang === "fr"
                ? "« Le risque de la fermeture d’un établissement est en effet réel, et fait aussi mal au portefeuille et à la réputation, que l’emprisonnement du dirigeant, les amendes, ou les dommages et intérêts. »"
                : "“The risk of business closure is very real, hurting finances and reputation just as severely as executive imprisonment, fines, or damages.”"}
            </p>
          </div>
        </div>

        {/* ─── TEXTE INTRODUCTIF PRINCIPAL ────────────────────────────────────── */}
        <div className="bg-[#131513]/90 border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12 space-y-6">
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.85] text-justify">
            {lang === "fr" ? (
              <>
                Si vous êtes un professionnel du droit — avocat, notaire, huissier de justice, juriste d'entreprise — votre temps est compté. La rédaction d'actes juridiques, de conclusions ou de mémoires exige une rigueur absolue et des recherches approfondies.
              </>
            ) : (
              <>
                If you are a legal professional—attorney, notary, judicial officer, corporate counsel—your time is scarce. Drafting legal instruments, briefs, and pleadings demands absolute rigor and exhaustive research.
              </>
            )}
          </p>
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.85] text-justify">
            {lang === "fr" ? (
              <>
                Nous offrons d'assurer ponctuellement pour vous, exactement comme le ferait un collaborateur, la rédaction devant toutes juridictions, de requêtes, assignations, mémoires et conclusions, en demande comme en défense.
              </>
            ) : (
              <>
                We provide on-demand drafting services—exactly like a senior associate—for motions, writs, pleadings, and briefs across all jurisdictions.
              </>
            )}
          </p>
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF] leading-[1.85] text-justify">
            {lang === "fr" ? (
              <>
                Pour les professionnels du droit, notre méthode de travail et nos tarifs varient en fonction de plusieurs paramètres. Nous distinguons selon que vous avez avec notre cabinet un abonnement, ou que vous nous sollicitez de façon ponctuelle. Nos tarifs varient également selon que vous êtes en demande ou en défense, que vous êtes ou non en situation d'urgence, ou que nos écritures sont initiales ou en réplique.
              </>
            ) : (
              <>
                For legal professionals, our workflow and pricing adapt based on whether you choose an annual retainer subscription or ad-hoc assistance.
              </>
            )}
          </p>
        </div>

        {/* ─── LES 2 BOUTONS D'ACTION (NOTRE MÉTHODE DE TRAVAIL & NOS TARIFS) ─────── */}
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

        {/* ─── MODAL 1 : NOTRE MÉTHODE DE TRAVAIL ────────────────── */}
        {activeModal === "methode" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{animation: 'fadeIn 0.3s ease'}}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              {/* Header sticky */}
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Notre méthode de travail
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label={lang === "fr" ? "Fermer la fenêtre" : "Close window"}
                >
                  <span className="font-cinzel text-xl sm:text-2xl leading-none font-bold select-none">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-5 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed">
                <p>
                  Notre méthode de travail est très simple : vous nous adressez votre demande par écrit, accompagnée de toutes les pièces nécessaires à son appréhension optimale.
                </p>
                <p>
                  Nous examinons la demande et les pièces, et nous vous fixons la somme totale que vous devrez payer, dans l'hypothèse où vous n'auriez pas déjà souscrit auprès de notre cabinet un abonnement qui, pour les professionnels du droit, est annuel.
                </p>
                <p>
                  Vous avez donc soit un abonnement annuel dont la facturation au bout de douze mois devient trimestrielle, soit une demande de prestation ponctuelle qui vous est facturée au coup par coup. Mais dans un cas comme dans l'autre, la méthode de travail reste la même.
                </p>
                <p>
                  Qu'il s'agisse de requête, assignation, conclusions ou mémoires, en demande, défense ou intervention, en première ou seconde instance, devant les juridictions civiles, sociales, commerciales, pénales, administratives, ainsi que tous types d'organisme juridictionnel, notre société prend le temps de lire avec soin toutes les pièces que vous nous adressez, et s'il échet, la lettre de mission que vous nous aurez soumise.
                </p>
                <p>
                  Cette lecture est essentielle, car c'est elle qui nous permet de saisir avec acuité ce que vous souhaitez voir faire, et éventuellement ce qui est pour vous le mieux à l'étape de la procédure où vous vous trouvez ; les règles de droit applicables ainsi que la jurisprudence la plus idoine à garantir le succès de votre cause ; et la facturation dont vous serez requis du paiement, dans l'hypothèse où vous nous auriez sollicité sur la base d'une prestation ponctuelle.
                </p>
                <p>
                  Nous prenons des écritures que nous vous adressons aux formats Word et PDF. Elles sont argumentées en fait et en droit, présentées de façon limpide et digeste, sur la base d'un raisonnement rigoureux appuyé par des jurisprudences pertinentes.
                </p>
                <p>
                  Nous classons et numérotons dans un ordre logique et cohérent toutes les pièces dont nous vous proposons la production, et nous les mettons au format PDF pour vous, le cas échéant, afin de vous en faciliter la communication.
                </p>

                {/* Section Spécifique Fonction Publique en Bas */}
                <div className="mt-8 pt-6 border-t border-[#C5A059]/30 bg-[#0F3823]/20 p-6 rounded-2xl border border-[#C5A059]/30">
                  <h3 className="font-cinzel text-lg text-[#E9D18F] font-bold mb-3 uppercase tracking-wide">
                    Spécificité — Droit Administratif & Fonction Publique
                  </h3>
                  <p className="font-cormorant text-base sm:text-lg text-[#EDE4CF]">
                    Droit administratif — litiges de la fonction publique : nous assurons la rédaction spécialisée des recours gracieux, hiérarchiques et contentieux devant les tribunaux administratifs et cours administratives d'appel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2 : NOS TARIFS ────────────────── */}
        {activeModal === "tarifs" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{animation: 'fadeIn 0.3s ease'}}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              {/* Header sticky */}
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Nos tarifs
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#0a0b0a] border border-[#C5A059]/60 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] hover:rotate-90 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-500 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label={lang === "fr" ? "Fermer la fenêtre" : "Close window"}
                >
                  <span className="font-cinzel text-xl sm:text-2xl leading-none font-bold select-none">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-6 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed">
                <p>
                  Nos tarifs sont particulièrement attractifs et compétitifs par rapport aux tarifs du marché, sachant que pour les professionnels du droit, l'abonnement annuel offre une réduction de 30% sur toutes les prestations sollicitées de façon ponctuelle.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="bg-[#131513] p-5 rounded-2xl border border-[#C5A059]/40 space-y-2">
                    <h4 className="font-cinzel text-[#E9D18F] font-bold text-base">Prestations Ponctuelles</h4>
                    <p className="text-sm text-[#EDE4CF]/80">Facturation au coup par coup selon la complexité, la longueur des pièces et l'urgence de la procédure.</p>
                  </div>
                  <div className="bg-[#0F3823]/30 p-5 rounded-2xl border border-[#C5A059]/60 space-y-2">
                    <h4 className="font-cinzel text-[#E9D18F] font-bold text-base">Abonnement Annuel (-30%)</h4>
                    <p className="text-sm text-[#EDE4CF]/80">Tarif préférentiel garanti avec facturation annuelle initiale puis trimestrielle reconductible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
