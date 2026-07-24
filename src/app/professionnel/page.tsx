"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

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

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH vs/1) ───────────────── */}
      <div className="w-full bg-[#0d0e0d] border-y border-[#C5A059]/30 py-3 overflow-hidden shadow-inner z-20">
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
                Parmi ces professionnels, il y en a qui, plus que tous les autres, sont en première ligne de ce besoin de réactivité et d'actualité : <strong className="not-italic font-semibold text-[#E9D18F]">ce sont les avocats.</strong>
              </>
            ) : (
              <>
                Among these professionals, one group stands at the absolute forefront of this demand for speed and expertise: <strong className="not-italic font-semibold text-[#E9D18F]">lawyers & advocates.</strong>
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

        {/* Bloc Développement : Texte à gauche + Deuxième Photo (Avocate enceinte) à droite (Design Exact Screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center my-12">
          <div className="font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 leading-[1.9] font-light text-justify">
            <p>
              {lang === "fr" ? (
                <>
                  Justement, pour peu qu'ils soient de la vieille école et peu ou prou familiarisés aux nouvelles technologies de l'information, ne maîtrisent pas tel langage en particulier, aient une activité plaidante chronophage, des ennuis ponctuels de santé, un heureux évènement en route, des charges si élevées que le recrutement d'un collaborateur est inenvisageable dans l'immédiat, ou pour tout autre motif d'empêchement prévisible ou non, le risque est grand, soit qu'ils ne tiennent pas leurs délais et s'exposent à une forclusion, soit qu'ils n'adoptent pas la meilleure stratégie dans la défense des intérêts qui leur tiennent à cœur, ce qui les exposerait à une action en responsabilité.
                </>
              ) : (
                <>
                  Whether adapting to modern IT tools, overcoming language barriers, managing heavy court schedules, health leaves, or high overheads restricting hiring, attorneys face immense risks of missing critical deadlines or compromising legal strategies.
                </>
              )}
            </p>
          </div>

          {/* Photo Avocate Enceinte avec Cadre Doré Décalé (Exact Screenshot 2) */}
          <div className="relative p-2">
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
        </div>

        {/* PHRASE ANIMÉE "PAS DE PANIQUE : GENERAL ESQUIRE EST LÀ." (Exact Screenshot 2 Glow) */}
        <div className="text-center py-10 my-8">
          <p
            className="font-cormorant italic text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide"
            style={{
              color: "#FF5522",
              textShadow:
                "0 0 14px rgba(231,76,60,1), 0 0 38px rgba(192,57,43,0.9), 0 0 75px rgba(192,57,43,0.55), 0 0 120px rgba(231,76,60,0.22)",
            }}
          >
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

        {/* ─── MODAL 1 : NOTRE MÉTHODE DE TRAVAIL ──────────────────────── */}
        {activeModal === "methode" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#131513] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-left">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#0a0b0a] border border-[#C5A059] text-[#C5A059] hover:text-white flex items-center justify-center font-cinzel text-xl transition-colors cursor-pointer"
              >
                &times;
              </button>

              <h2 className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold uppercase tracking-wider border-b border-[#C5A059]/30 pb-4">
                Notre méthode de travail
              </h2>

              <div className="space-y-4 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed font-light">
                <p>
                  Notre méthode de travail est très simple : vous nous adressez votre demande par écrit, accompagnée de toutes les pièces nécessaires à son appréhension optimale.
                </p>
                <p>
                  Nous examinons la demande et les pièces, et nous vous fixons la somme totale que vous devrez payer, dans l'hypothèse où vous n'auriez pas déjà souscrit auprès de notre cabinet un abonnement qui, pour les professionnels du droit, est annuel.
                </p>
                <p>
                  Qu'il s'agisse de requête, assignation, conclusions ou mémoires, en demande, défense ou intervention, en première ou seconde instance, devant les juridictions civiles, sociales, commerciales, pénales, administratives, notre société prend le temps de lire avec soin toutes les pièces transmises.
                </p>

                <h3 className="font-cinzel text-lg text-[#E9D18F] uppercase tracking-wider pt-2">
                  Nos domaines d'intervention
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#cabfa6] list-disc list-inside">
                  <li>Droit civil & obligations</li>
                  <li>Droit commercial & recouvrement</li>
                  <li>Droit de la consommation & surendettement</li>
                  <li>Droit bancaire & assurances</li>
                  <li>Droit de la famille & successions</li>
                  <li>Droit du travail & licenciements</li>
                  <li>Droit pénal & pénal des affaires</li>
                  <li>Droit des étrangers (titres, OQTF, CNDA)</li>
                  <li>Droit administratif & fonction publique</li>
                  <li>Droit de la profession d'avocat</li>
                  <li>Droits et libertés fondamentaux (CEDH)</li>
                </ul>

                <h3 className="font-cinzel text-lg text-[#E9D18F] uppercase tracking-wider pt-2">
                  Intervention en urgence (Sous 48h)
                </h3>
                <p>
                  Il s'agit de la situation dans laquelle nous acceptons de prendre des écritures ou conseils sous un délai inférieur à 48 heures. En situation d'urgence, la facturation est majorée.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2 : NOS TARIFS ────────────────────────────────────── */}
        {activeModal === "tarifs" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#131513] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-left">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#0a0b0a] border border-[#C5A059] text-[#C5A059] hover:text-white flex items-center justify-center font-cinzel text-xl transition-colors cursor-pointer"
              >
                &times;
              </button>

              <h2 className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold uppercase tracking-wider border-b border-[#C5A059]/30 pb-4">
                Méthode de tarification
              </h2>

              <div className="space-y-6 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed font-light">
                {/* Tarif 1 */}
                <div className="p-5 rounded-2xl bg-[#0e100e] border border-[#C5A059]/30">
                  <h3 className="font-cinzel text-base text-[#E9D18F] uppercase tracking-wider mb-2 font-bold">
                    1. Abonnement annuel — Facturation annuelle
                  </h3>
                  <div className="font-cinzel text-2xl text-[#E9D18F] font-bold my-1">
                    15 000 € TTC <span className="text-xs text-[#cabfa6] font-normal">/ an (paiement d'avance)</span>
                  </div>
                  <p className="text-sm text-[#cabfa6]">
                    Assistance illimitée pour tous actes, consultations et rédactions par téléphone, visio et écrit.
                  </p>
                </div>

                {/* Tarif 2 */}
                <div className="p-5 rounded-2xl bg-[#0e100e] border border-[#C5A059]/30">
                  <h3 className="font-cinzel text-base text-[#E9D18F] uppercase tracking-wider mb-2 font-bold">
                    2. Abonnement annuel — Facturation trimestrielle
                  </h3>
                  <div className="font-cinzel text-2xl text-[#E9D18F] font-bold my-1">
                    3 500 € TTC <span className="text-xs text-[#cabfa6] font-normal">/ trimestre (après 1an d'ancienneté)</span>
                  </div>
                  <p className="text-sm text-[#cabfa6]">
                    Bonus de fidélité accordé aux clients fidèles à partir de la 2e année.
                  </p>
                </div>

                {/* Tarif 3 */}
                <div className="p-5 rounded-2xl bg-[#0e100e] border border-[#C5A059]/30">
                  <h3 className="font-cinzel text-base text-[#E9D18F] uppercase tracking-wider mb-2 font-bold">
                    3. Prestation ponctuelle — Facturation à l'acte
                  </h3>
                  <div className="font-cinzel text-xl text-[#E9D18F] font-bold my-1">
                    500 € TTC <span className="text-xs text-[#cabfa6] font-normal">forfait fixe de rédaction / acte</span>
                  </div>
                  <p className="text-sm text-[#cabfa6]">
                    + Forfait variable de lecture : 5 € TTC / page écrite (FR/EN), 2 € TTC / minute audio/vidéo, 10 € TTC / page (Traduction Chinois/Russe incluse).
                  </p>
                </div>

                {/* Tarif 4 */}
                <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/40">
                  <h3 className="font-cinzel text-base text-[#FF5522] uppercase tracking-wider mb-2 font-bold">
                    4. Prestation en urgence (Délai &lt; 48h)
                  </h3>
                  <div className="font-cinzel text-xl text-[#FF5522] font-bold my-1">
                    1 500 € TTC <span className="text-xs text-[#cabfa6] font-normal">forfait de rédaction en urgence</span>
                  </div>
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
