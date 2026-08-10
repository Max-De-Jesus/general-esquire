"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

const CAR_PRO_SLIDES = [
  {
    src: "/images/car_pro/pro0.png",
    title: "Expertise Juridique & Rigueur",
    desc: "Rédaction d'actes, requêtes, conclusions et mémoires devant toutes les juridictions.",
  },
  {
    src: "/images/car_pro/pro1.jpg",
    title: "Rédaction d'Actes & Conclusions",
    desc: "Une plume exigeante et documentée en soutien de votre activité d'avocat ou de juriste.",
  },
  {
    src: "/images/car_pro/pro2.jpg",
    title: "Collaboration & Sous-traitance",
    desc: "Un renfort ponctuel ou régulier pour sécuriser vos délais et soulager vos équipes.",
  },
  {
    src: "/images/car_pro/pro3.jpg",
    title: "Analyse Approfondie & Doctrine",
    desc: "Recherches jurisprudentielles ciblées et dossiers argumentés en fait et en droit.",
  },
  {
    src: "/images/car_pro/pro4.jpg",
    title: "Accompagnement Sur Mesure",
    desc: "Abonnement annuel ou prestations ponctuelles au dossier selon vos besoins.",
  },
  {
    src: "/images/car_pro/pro5.jpg",
    title: "COMPÉTENCE & FORCE DU DROIT",
    desc: "Réactivité, discrétion absolue et respect rigoureux de la déontologie.",
  },
  {
    src: "/images/car_pro/Avocate enceinte image.jpg",
    title: "Conseil & Soutien Humain",
    desc: "Un suivi bienveillant et rigoureux, adapté à chaque étape de votre vie professionnelle.",
  },
];

function ProfessionnelCarProCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAR_PRO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CAR_PRO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CAR_PRO_SLIDES.length) % CAR_PRO_SLIDES.length);
  };

  return (
    <div className="my-10 rounded-3xl overflow-hidden border border-[#C5A059]/40 bg-[#131513] shadow-2xl relative group">
      {/* Slide Display Container */}
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[440px] overflow-hidden">
        {CAR_PRO_SLIDES.map((item, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
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
                className="object-cover object-center filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0d] via-black/30 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
                <span className="font-cinzel text-xs text-[#E9D18F] tracking-[0.25em] uppercase block mb-1 drop-shadow-md">
                  COLLABORATION JURIDIQUE
                </span>
                <h3 className="font-cinzel text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1.5 drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="font-cormorant text-xs sm:text-base md:text-lg text-[#EDE4CF] max-w-2xl drop-shadow-md">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#131513]/85 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
          aria-label="Slide précédent"
        >
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#131513]/85 border border-[#C5A059]/60 text-[#E9D18F] hover:bg-[#C5A059] hover:text-black transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg active:scale-95"
          aria-label="Slide suivant"
        >
          ❯
        </button>
      </div>

      {/* Pagination Bar */}
      <div className="bg-[#0a0b0a] border-t border-[#C5A059]/30 p-3 sm:p-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {CAR_PRO_SLIDES.map((_, idx) => (
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
          {currentIndex + 1} / {CAR_PRO_SLIDES.length}
        </span>
      </div>
    </div>
  );
}

export default function ProfessionnelPage() {
  const { lang } = useLanguage();

  const [activeModal, setActiveModal] = useState<"methode" | "tarifs" | null>(null);

  return (
    <div className="min-h-screen bg-[#1A1C1A] text-[#EDE4CF] flex flex-col justify-between overflow-x-hidden">
      {/* ─── 1. BANNIÈRE EN-TÊTE (vs/1 style exact) ────────────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/bannerchef.png"
            alt="Bannière Professionnels du Droit — General Esquire"
            fill
            priority
            className="object-cover object-[center_32%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <TickerBanner className="mb-8" />

      {/* ─── 3. CONTENU PRINCIPAL PROFESSIONNELS DU DROIT ──────────────── */}
      <main className="max-w-[840px] mx-auto px-4 sm:px-8 py-10 sm:py-16 flex-grow text-left">
        {/* Badge Titre (Pilule Dorée VS/1) */}
        <div className="text-center mb-10">
          <span className="inline-block font-cinzel text-xs sm:text-sm uppercase tracking-[0.13em] text-[#1a1c1a] font-semibold bg-gradient-to-r from-[#e8c97a] via-[#c5a059] to-[#e8c97a] border-2 border-[#e9d18f]/60 rounded-full px-8 py-3 shadow-[0_0_18px_rgba(197,160,89,0.45)]">
            {lang === "fr" ? "Vous êtes un professionnel du droit" : "You are a Legal Professional"}
          </span>
        </div>

        {/* Intro Deux Colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 leading-[1.9] font-light mb-10">
          <p className="text-justify">
            {lang === "fr" ? (
              <>
                Que leur activité soit ou non réglementée, les professionnels du droit <em className="text-[#EDE4CF]/70 italic">lato sensu</em>, tels les magistrats, notaires, commissaires de justice, mandataires, commissaires divers, consultants, juristes, etc., sont notoirement soumis à deux contraintes : celle du temps qui passe et qui ne revient plus, et celle de l'information exacte, fiable et qui percute.
              </>
            ) : (
              <>
                Whether regulated or not, legal professionals <em className="text-[#EDE4CF]/70 italic">lato sensu</em>—such as magistrates, notaries, judicial officers, trustees, consultants, and legal counsel—are constrained by passing time and the urgent need for precise, impactful legal intelligence.
              </>
            )}
          </p>
          <p className="text-justify">
            {lang === "fr" ? (
              <>
                Il s'agit pour eux, d'une part, d'être réactifs au moment opportun et en tout cas sans retard, sur les actes par rapport auxquels une certaine action est attendue de leur part ; et d'autre part, de disposer à l'occasion de cette action, de l'information juridique la plus actualisée et la plus pertinente qui puisse servir la cause qui les occupe.
              </>
            ) : (
              <>
                They must act with unyielding responsiveness at the right moment without delay, while accessing up-to-the-minute legal precedents and doctrine to serve their clients effectively.
              </>
            )}
          </p>
        </div>

        {/* Phrase Pivot Centrée avec Ligne Dorée (Style Exact Captures) */}
        <div className="py-6 my-6 border-y border-[#C5A059]/25 text-center">
          <p className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 italic leading-relaxed">
            {lang === "fr" ? (
              <>
                Parmi ces professionnels, il y en a qui, plus que tous les autres, sont en première ligne :
                <br />
                <strong className="not-italic font-semibold text-[#E9D18F] text-2xl sm:text-3xl mt-2 block">ce sont les avocats.</strong>
              </>
            ) : (
              <>
                Among these professionals, one group stands at the absolute forefront:
                <br />
                <strong className="not-italic font-semibold text-[#E9D18F] text-2xl sm:text-3xl mt-2 block">lawyers &amp; advocates.</strong>
              </>
            )}
          </p>
        </div>

        {/* Première Photo Avocate (Contour Asymétrique Arrondi vs/1) */}
        <figure className="relative w-full max-w-[520px] mx-auto h-72 sm:h-[380px] my-10 group">
          <div className="relative w-full h-full rounded-[12px_60px_12px_60px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_3px_rgba(197,160,89,0.25)] border border-[#C5A059]/30">
            <Image
              src="/images/avocate.png"
              alt="Avocate en robe — General Esquire"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
            />
          </div>
        </figure>

        {/* Bloc Développement : Texte s'enroulant autour de l'image flottante à droite */}
        <div className="relative my-12 font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 leading-[1.9] font-light text-justify">
          {/* Photo Avocate Enceinte Flottante à Droite (Cadre Doré) */}
          <div className="float-none sm:float-right sm:ml-7 sm:mb-4 sm:mt-1 w-full sm:w-[320px] md:w-[380px] relative p-2 my-6 sm:my-0">
            <div className="absolute -inset-2 border-2 border-[#C5A059]/45 rounded-xl pointer-events-none"></div>
            <div className="relative w-full h-80 sm:h-[360px] rounded-lg overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5),0_0_0_1px_rgba(197,160,89,0.2)]">
              <Image
                src="/images/Avocate enceinte.jpg"
                alt="Avocate enceinte — General Esquire"
                fill
                className="object-cover object-center filter brightness-95 contrast-105"
              />
            </div>
          </div>

          {/* Texte Continu qui s'enroule autour et s'étend sous l'image */}
          <p className="mb-4">
            {lang === "fr" ? (
              <>
                Justement, pour peu qu'ils soient de la vieille école et peu ou prou familiarisés aux nouvelles technologies de l'information, ne maîtrisent pas tel langage en particulier, aient une activité, politque, sociale, plaidante chronophage, des ennuis ponctuels de santé, un heureux évènement en route, des charges si élevées que le recrutement d'un collaborateur est inenvisageable dans l'immédiat, ou pour tout autre motif d'empêchement prévisible ou non, le risque est grand, soit qu'ils ne tiennent pas leurs délais et s'exposent à une forclusion, soit qu'ils n'adoptent pas la meilleure stratégie dans la défense des intérêts qui leur tiennent à cœur, ce qui les exposerait à une action en responsabilité.
              </>
            ) : (
              <>
                Whether adapting to modern IT tools, overcoming language barriers, managing heavy court schedules, health leaves, or high overheads restricting hiring, attorneys face immense risks of missing critical deadlines or compromising legal strategies.
              </>
            )}
          </p>
          <p>
            {lang === "fr" ? (
              <>
                Face à ces multiples exigences juridiques et déontologiques, l'intervention ponctuelle d'un confrère dédié permet de sécuriser l'ensemble de vos actes tout en garantissant un accompagnement sur mesure pour vos clients.
              </>
            ) : (
              <>
                Faced with these daily legal challenges, dedicated external associate support ensures full compliance with deadlines and rigorous protection of client interests.
              </>
            )}
          </p>
          <div className="clear-both" />
        </div>

        {/* PHRASE ANIMÉE "PAS DE PANIQUE : GENERAL ESQUIRE EST LÀ." (Exact Screenshot 2 Glow) */}
        <div className="text-center py-10 my-8">
          <p className="font-cormorant italic text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide animate-panic-text text-[#FF5522]">
            Pas de panique : General Esquire est là.
          </p>
        </div>

        {/* Offre (Conteneur Émeraude Translucide avec Contour Doré VS/1) */}
        <div className="my-10 p-7 sm:p-9 rounded-xl bg-[#0F3823]/25 border border-[#C5A059]/35 shadow-xl space-y-4">
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

        {/* ─── CARROUSEL DES IMAGES DU DOSSIER CAR_PRO ────────────────────────── */}
        <ProfessionnelCarProCarousel />

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
                  className="px-4 py-2 rounded-full bg-[#0a0b0a] border border-[#C5A059]/50 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] flex items-center gap-2 font-cinzel text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Fermer la fenêtre"
                >
                  <span>{lang === "fr" ? "FERMER" : "CLOSE"}</span>
                  <span className="text-base leading-none font-bold">&times;</span>
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
                <p>
                  Nous pouvons convenir d'une conférence téléphonique ou visiophonique si vous le souhaitez, afin d'harmoniser notre perception mutuelle du dossier, sachant que c'est votre position finale qui l'emporte, car les écritures sont prises en votre nom.
                </p>
                <p>
                  Une fois notre rédaction terminée — éventuellement après prise en compte de toutes vos observations au bout de deux relectures s'il y a lieu —, celle-ci devient votre seule et exclusive propriété, et il vous est loisible d'en disposer à votre guise. Nous n'assumons aucune responsabilité à cet égard, sauf en situation d'urgence.
                </p>
                <p>
                  À votre demande, nous pouvons prendre des écritures en réplique ou en duplique, à partir de nos précédentes productions.
                </p>

                {/* Séparateur doré */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]/60" />
                  <span className="text-[#C5A059] text-xs">◆</span>
                  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]/60" />
                </div>

                <h3 className="font-cinzel text-lg text-[#E9D18F] uppercase tracking-wider font-bold">Nos domaines d'intervention</h3>
                <p className="text-[#EDE4CF]/80 text-base italic leading-relaxed">
                  Généraliste et éclectique, notre champ de pratique juridique porte notamment, mais non exhaustivement, sur les matières suivantes :
                </p>

                {/* Grille 2 colonnes symétriques avec interligne uniforme */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-base sm:text-lg text-[#EDE4CF]/90">
                  <ul className="space-y-4 list-none p-0 m-0">
                    {[
                      "Droit civil — contrats, obligations, responsabilité contractuelle et quasi-délictuelle",
                      "Droit de la consommation — surendettement, crédit personnel et immobilier",
                      "Droit des assurances — assurance-vie, assurances professionnelles",
                      "Droit de la famille — divorce, pension alimentaire",
                      "Droit des baux — litiges locatifs, troubles de voisinage, copropriété",
                      "Droit de la sécurité sociale — litiges avec la CAF, France Travail",
                      "Droit pénal des affaires — abus de biens sociaux, délit d'initié",
                      "Droit de la nationalité — naturalisation française",
                      "Droit de la profession d'avocat — inscription, omission, procédure disciplinaire, défense à une action en responsabilité civile professionnelle",
                      "Droit administratif — litiges de la fonction publique",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="text-[#C5A059] mt-1.5 flex-shrink-0 text-xs">◆</span>
                        <span className="leading-relaxed font-cormorant">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="space-y-4 list-none p-0 m-0">
                    {[
                      "Droit commercial — montage de contrats, recouvrement de créances, voies d'exécution",
                      "Droit bancaire — fraude aux instruments de paiement",
                      "Droit successoral — litiges du testament",
                      "Droit de la construction — garantie décennale, garantie de parfait achèvement, vices cachés",
                      "Droit du travail — procédure de licenciement disciplinaire et économique, reclassement professionnel",
                      "Droit pénal — procédure pénale, chambre de l'instruction, droit pénitentiaire, crimes et délits contre les personnes et contre les biens, infractions routières",
                      "Droit des étrangers — titres de séjour, procédures de référé administratif, visas d'entrée, OQTF, IRTF, regroupement familial, OFPRA et CNDA",
                      "Droits et libertés fondamentaux — requête et procédure devant la Cour européenne des droits de l'Homme",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="text-[#C5A059] mt-1.5 flex-shrink-0 text-xs">◆</span>
                        <span className="leading-relaxed font-cormorant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Séparateur */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#C5A059]/60" />
                  <span className="text-[#C5A059] text-xs">◆</span>
                  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#C5A059]/60" />
                </div>

                <h3 className="font-cinzel text-lg text-[#E9D18F] uppercase tracking-wider font-bold">La situation d'intervention en urgence</h3>
                <p>
                  Il s'agit de la situation dans laquelle nous acceptons de vous prodiguer un conseil écrit, ou de prendre des écritures destinées à être produites en procédure à votre demande, dans un délai inférieur à 48 heures, entre le moment où vous sollicitez notre intervention et le moment où ces écritures ou ce conseil doivent déjà être en votre possession.
                </p>
                <p>
                  Nous comprenons que dans une telle hypothèse, vous pourriez ne pas disposer de suffisamment de recul pour contrévérifier notre production ; et notre sens de la responsabilité en est d'autant exacérbé que nous avons absolument le loisir de refuser la mission que vous auriez souhaité nous confier.
                </p>
                <div className="p-5 rounded-xl bg-red-950/30 border border-red-500/40 text-[#FF7755] font-semibold">
                  En situation d'urgence, la facturation est majorée.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2 : NOS TARIFS ────────────────────── */}
        {activeModal === "tarifs" && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md" style={{animation: 'fadeIn 0.3s ease'}}>
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#0d0f0d] border-2 border-[#C5A059]/70 rounded-3xl shadow-[0_0_80px_rgba(197,160,89,0.25)] mt-4">
              {/* Header sticky */}
              <div className="sticky top-0 z-10 bg-[#0d0f0d]/98 border-b border-[#C5A059]/30 px-6 sm:px-10 py-5 flex items-center justify-between backdrop-blur-sm">
                <h2 className="font-cinzel text-xl sm:text-2xl text-[#E9D18F] font-bold uppercase tracking-wider">
                  Méthode de tarification
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-full bg-[#0a0b0a] border border-[#C5A059]/50 text-[#C5A059] hover:text-[#E9D18F] hover:bg-[#C5A059]/25 hover:border-[#E9D18F] flex items-center gap-2 font-cinzel text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer flex-shrink-0 shadow-md"
                  aria-label="Fermer la fenêtre"
                >
                  <span>{lang === "fr" ? "FERMER" : "CLOSE"}</span>
                  <span className="text-base leading-none font-bold">&times;</span>
                </button>
              </div>

              <div className="px-6 sm:px-10 py-8 space-y-6">

                {/* Tarif 1 : Abonnement annuel annuel */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0F3823]/80 to-[#131513] border-2 border-[#C5A059]/60 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                    <h3 className="font-cinzel text-sm sm:text-base text-[#E9D18F] uppercase tracking-wider font-bold">
                      1. Abonnement annuel — facturation annuelle
                    </h3>
                    <div className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-extrabold flex items-baseline gap-2 flex-wrap shrink-0">
                      <span>15 000 € TTC</span>
                      <span className="text-xs text-[#cabfa6] font-normal font-cormorant">par an</span>
                    </div>
                  </div>
                  <div className="space-y-3 font-cormorant text-base text-[#EDE4CF]/85 leading-relaxed">
                    <p>Vous pouvez choisir de souscrire un abonnement. Celui-ci, annuel, renouvelable par tacite reconduction, peut être résilié à tout moment après l'échéance de son premier anniversaire, moyennant un préavis de quinze jours matérialisé par écrit.</p>
                    <p>La preuve de la réception du préavis peut être rapportée par la production d'un avis postal recommandé, d'une décharge, ou la saisie écran horodatée de l'envoi d'un mail ou d'un SMS. L'une quelconque des deux parties — General Esquire ou son mandant, professionnel du droit — peut prendre l'initiative de mettre un terme à cet abonnement en respectant ces modalités.</p>
                    <p>L'abonnement annuel garantit au professionnel du droit, en toutes circonstances, de bénéficier de l'assistance d'un cabinet juridique expérimenté pour tous types d'intervention rédactionnelle et de consultation, sans limitation de volume, par téléphone, visioconférence et à l'écrit, même en situation d'urgence, exactement comme le ferait un avocat collaborateur ou un juriste de cabinet, clerc d'avocat.</p>
                    <p>C'est en quelque sorte la version premium de notre facturation, qui nous place en qualité de mandataire à la disposition totale du professionnel du droit dont nous recevons la mission de lui donner des avis juridiques et de prendre des écritures pour sa propre activité professionnelle, qu'il l'exerce à titre individuel ou en société.</p>
                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30 text-sm text-[#cabfa6] font-cormorant italic">
                      Ce montant n'est remboursable que sur un solde calculé prorata temporis pour douze mois, advenant la défaillance de General Esquire — signalée par un écrit ayant date certaine — à délivrer sa mission pendant deux mois consécutifs.
                      <br /><br />
                      <strong className="text-[#E9D18F] not-italic">Exemple :</strong> pour un contrat annuel signé en janvier et inexécuté de notre fait à compter d'août, General Esquire rembourserait dès le mois d'octobre la somme de 6 250 € TTC, correspondant aux cinq mois restants avant la date anniversaire.
                    </div>
                    <p className="text-sm text-[#cabfa6]">La société General Esquire justifie d'une assurance garantissant sa solvabilité.</p>
                  </div>
                </div>

                {/* Tarif 2 : Abonnement annuel trimestriel */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#131513] border border-[#C5A059]/40 shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                    <h3 className="font-cinzel text-sm sm:text-base text-[#E9D18F] uppercase tracking-wider font-bold">
                      2. Abonnement annuel — facturation trimestrielle
                    </h3>
                    <div className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-extrabold flex items-baseline gap-2 flex-wrap shrink-0">
                      <span>3 500 € TTC</span>
                      <span className="text-xs text-[#cabfa6] font-normal font-cormorant">par trimestre</span>
                    </div>
                  </div>
                  <div className="space-y-3 font-cormorant text-base text-[#EDE4CF]/85 leading-relaxed">
                    <p>Si l'exécution de l'abonnement se déroule bien pendant les douze premiers mois, la facturation devient trimestrielle à compter du renouvellement tacite du contrat.</p>
                    <p>Un bonus de fidélité est alors accordé au professionnel du droit.</p>
                    <div className="inline-block px-4 py-2 rounded-lg bg-[#0F3823]/60 border border-[#C5A059]/30 text-sm text-[#C5A059] font-cinzel">
                      au lieu de 3 750 € (bonus fidélité)
                    </div>
                    <p>Cette somme est payable d'avance, tout trimestre entamé étant dû, et se terminant au dernier jour du mois, quel que soit le nombre de jours dans le mois ou le nombre de jours outrés.</p>
                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30 text-sm text-[#cabfa6] font-cormorant italic">
                      <strong className="text-[#E9D18F] not-italic">Exemple :</strong> pour un contrat renouvelé en janvier, si notre client signale une défaillance le 20 février, General Esquire rembourse les jours restant depuis cette réclamation jusqu'au 31 mars, soit environ 39 ou 40 jours, correspondant à environ 1 555 €
                    </div>
                  </div>
                </div>

                {/* Tarif 3 : Pas d'abonnement mensuel */}
                <div className="p-5 rounded-2xl bg-[#131513] border border-[#C5A059]/30">
                  <h3 className="font-cinzel text-sm sm:text-base text-[#E9D18F] uppercase tracking-wider font-bold mb-2">
                    3. Abonnement mensuel
                  </h3>
                  <p className="font-cormorant text-base text-[#EDE4CF]/80 leading-relaxed">
                    Il n'est pas proposé d'abonnement mensuel pour les professionnels du droit. Ils peuvent en revanche demander au coup par coup une prestation ponctuelle.
                  </p>
                </div>

                {/* Tarif 4 : Prestation ponctuelle */}
                <div className="p-6 rounded-2xl bg-[#131513] border border-[#C5A059]/40 shadow-lg">
                  <h3 className="font-cinzel text-sm sm:text-base text-[#E9D18F] uppercase tracking-wider font-bold mb-3">
                    4. Prestation ponctuelle — facturation à l'acte
                  </h3>
                  <div className="space-y-4 font-cormorant text-base text-[#EDE4CF]/85 leading-relaxed">
                    <p>Au titre de la prestation ponctuelle, la facturation se compose de deux éléments : un forfait fixe de rédaction, et un forfait variable de lecture.</p>

                    <div className="p-4 rounded-xl bg-[#0F3823]/40 border border-[#C5A059]/30">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <span className="font-cinzel text-xs text-[#C5A059] uppercase tracking-wider">Le forfait fixe de rédaction</span>
                        <span className="font-cinzel text-2xl text-[#E9D18F] font-bold">500 € TTC <span className="text-xs font-normal text-[#cabfa6] font-cormorant">par acte</span></span>
                      </div>
                      <p className="text-sm text-[#cabfa6]">Qu'il s'agisse de requête, d'assignation, de conclusions ou de mémoire, voire d'une question prioritaire de constitutionnalité devant un tribunal, une cour d'appel ou même la Cour de cassation, en demande, défense ou intervention, notre forfait de rédaction est de 500 € TTC, indifféremment du nombre de parties, du nombre de pages rédigées, de la complexité ou de la technicité de l'affaire.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/30">
                      <span className="font-cinzel text-xs text-[#C5A059] uppercase tracking-wider block mb-3">Le forfait variable de lecture</span>
                      <p className="text-sm text-[#cabfa6] mb-3">Le forfait de lecture n'est variable qu'en ce qu'il dépend du nombre de pages à lire par l'équipe de General Esquire.</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm border-b border-[#C5A059]/15 pb-2">
                          <span className="text-[#EDE4CF]/80">Documents écrits (français / anglais)</span>
                          <span className="font-cinzel text-[#E9D18F] font-bold">5 € TTC / page</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-[#C5A059]/15 pb-2">
                          <span className="text-[#EDE4CF]/80">Documents audio, vidéo ou audiovisuels</span>
                          <span className="font-cinzel text-[#E9D18F] font-bold">2 € TTC / minute</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#EDE4CF]/80">Documents en chinois ou en russe (traduction incluse)</span>
                          <span className="font-cinzel text-[#E9D18F] font-bold">10 € TTC / page ou / minute</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#cabfa6] mt-3 italic">Ne sont pas facturés : les textes de loi, codes, jurisprudences, articles de doctrine et coupures de presse que nous lisons dans le cadre de nos recherches, ni les documents déjà facturés lors d'une prestation antérieure et repris dans des écritures en réponse, réplique ou récapitulatives.</p>
                    </div>

                    <p className="text-sm text-[#cabfa6] italic">Le client doit avoir réglé intégralement — forfait fixe de rédaction et forfait variable de lecture — préalablement à l'exécution de sa mission par le cabinet.</p>
                  </div>
                </div>

                {/* Tarif 5 : Urgence */}
                <div className="p-6 rounded-2xl bg-red-950/30 border-2 border-red-500/50 shadow-xl">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                    <h3 className="font-cinzel text-sm sm:text-base text-[#FF5522] uppercase tracking-wider font-bold">
                      5. Prestation en urgence — facturation majorée
                    </h3>
                    <div className="font-cinzel text-3xl text-[#FF5522] font-extrabold whitespace-nowrap">
                      1 500 € TTC
                    </div>
                  </div>
                  <p className="font-cormorant text-base text-[#EDE4CF]/80 leading-relaxed">
                    Forfait de rédaction en urgence (délai &lt; 48 h) — les autres données demeurent inchangées.
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Retour au conseil juridique */}
        <div className="pt-8">
          <Link
            href="/conseil-juridique"
            className="font-cinzel text-xs text-[#C5A059] hover:text-[#E9D18F] uppercase tracking-widest transition-colors inline-flex items-center gap-2 border-b border-transparent hover:border-[#E9D18F]"
          >
            ← {lang === "fr" ? "Retour au Conseil juridique" : "Back to Legal Advisory"}
          </Link>
        </div>
      </main>

    </div>
  );
}
