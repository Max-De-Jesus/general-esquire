"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomsAnnouncementCard() {
  const { lang } = useLanguage();

  return (
    <section
      id="formalites-douanieres-benin"
      className="mt-4 mb-8 relative scroll-mt-24"
      aria-label="Communiqué officiel douanes béninoises"
    >
      {/* Halo d'ambiance dorée et verte discrète (rappel Bénin & prestige) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-gradient-to-r from-[#0F3823]/15 via-[#C5A059]/15 to-[#8A1818]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Cadre Principal Haut de Gamme */}
      <div className="relative z-10 bg-gradient-to-b from-[#161916] via-[#121412] to-[#141714] border-2 border-[#C5A059]/40 hover:border-[#E9D18F]/70 transition-all duration-500 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
        
        {/* Liseré supérieur aux couleurs officielles du Bénin */}
        <div className="absolute top-0 left-8 right-8 h-[3px] bg-gradient-to-r from-[#008751] via-[#FCD116] to-[#E8112D] rounded-t-full opacity-80" />

        {/* En-tête du Cadre */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2.5 font-cinzel text-xs text-[#E9D18F] uppercase tracking-[0.25em] bg-[#131513] border border-[#C5A059]/50 px-4 sm:px-5 py-2 rounded-full mb-5 shadow-lg">
            <span className="text-base leading-none">🇧🇯</span>
            <span className="font-bold">
              {lang === "fr" ? "Direction Générale des Douanes Béninoises" : "Benin Customs Directorate"}
            </span>
            <span className="hidden sm:inline text-[#C5A059]">✦</span>
            <span className="hidden sm:inline text-[11px] text-[#C5A059]">
              {lang === "fr" ? "Avis Officiel aux Voyageurs" : "Official Traveler Notice"}
            </span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#F4E3B2] to-[#C5A059] leading-snug sm:leading-tight max-w-4xl mx-auto mb-5 drop-shadow-md">
            {lang === "fr"
              ? "Voyageurs à destination ou en provenance du Bénin : ce qu’il faut savoir sur les formalités douanières 🇧🇯"
              : "Travelers to and from Benin: Essential Customs Formalities & Guidelines 🇧🇯"}
          </h2>

          <p className="font-cormorant text-xl sm:text-2xl text-[#EDE4CF]/90 italic max-w-3xl mx-auto leading-relaxed">
            {lang === "fr"
              ? "Pour voyager l'esprit tranquille, la Direction Générale des Douanes Béninoises a publié la mise à jour de ses règles applicables à l'entrée et à la sortie du territoire. Voici les points essentiels à retenir pour réussir votre passage en douane :"
              : "To travel with total peace of mind, the Benin Customs Directorate has released its updated regulations for entry and departure. Here are the essential requirements for seamless customs clearance:"}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="text-[#C5A059] text-xs">◆</span>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
        </div>

        {/* 3 Cartes Thématiques Détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">

          {/* ─── BLOC 1 : Tolérances & Franchises sur vos bagages ─── */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 hover:border-[#E9D18F] transition-all duration-300 rounded-2xl p-6 sm:p-7 flex flex-col shadow-lg group">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#C5A059]/20">
              <span className="text-3xl">🧳</span>
              <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#C5A059] bg-[#1a1c1a] px-3 py-1 rounded-full border border-[#C5A059]/30">
                {lang === "fr" ? "À l'Entrée" : "Upon Entry"}
              </span>
            </div>

            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#E9D18F] mb-4 leading-snug group-hover:text-white transition-colors">
              {lang === "fr"
                ? "1. Tolérances et franchises sur vos bagages"
                : "1. Baggage Allowances & Duty-Free Entitlements"}
            </h3>

            <ul className="space-y-3.5 font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed flex-grow">
              <li className="flex items-start gap-2.5">
                <span className="text-[#C5A059] text-sm mt-1">✦</span>
                <span>
                  <strong className="text-[#E9D18F] font-semibold">
                    {lang === "fr" ? "Effets personnels en cours d'usage" : "Personal used items"}
                  </strong>{" "}
                  {lang === "fr"
                    ? "(ordinateur, téléphone, appareil photo, vêtements) : admis en franchise de droits et taxes sans formalité écrite."
                    : "(laptop, phone, camera, clothing): admitted duty and tax-free without written formalities."}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-[#C5A059] text-sm mt-1">✦</span>
                <span>
                  <strong className="text-[#E9D18F] font-semibold">
                    {lang === "fr" ? "Franchise de valeur (Aéroport)" : "Airport Value Allowance"}
                  </strong>{" "}
                  :{" "}
                  {lang === "fr"
                    ? "jusqu'à"
                    : "up to"}{" "}
                  <span className="text-[#F4E3B2] font-semibold underline decoration-[#C5A059]/50 underline-offset-2">300 000 FCFA</span>{" "}
                  {lang === "fr" ? "d'achats par adulte et" : "of purchases per adult and"}{" "}
                  <span className="text-[#F4E3B2] font-semibold underline decoration-[#C5A059]/50 underline-offset-2">200 000 FCFA</span>{" "}
                  {lang === "fr" ? "par mineur." : "per minor."}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-[#C5A059] text-sm mt-1">✦</span>
                <span>
                  <strong className="text-[#E9D18F] font-semibold">
                    {lang === "fr" ? "Compatriotes de la diaspora" : "Diaspora travelers"}
                  </strong>{" "}
                  :{" "}
                  {lang === "fr"
                    ? "possibilité d'apporter des cadeaux familiaux sans caractère commercial jusqu'à 300 000 FCFA (adulte) et 200 000 FCFA (mineur)."
                    : "allowance for non-commercial family gifts up to 300,000 FCFA (adult) and 200,000 FCFA (minor)."}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="text-[#C5A059] text-sm mt-1">✦</span>
                <span>
                  <strong className="text-[#E9D18F] font-semibold">
                    {lang === "fr" ? "Tabac et Alcools (18 ans et plus uniquement)" : "Tobacco & Alcohol (18+ only)"}
                  </strong>{" "}
                  :{" "}
                  {lang === "fr"
                    ? "2 cartouches de cigarettes (< 20 paquets), 2 bouteilles de Champagne (< 1,5 L), ou 3 bouteilles de spiritueux."
                    : "2 cartons of cigarettes (< 20 packs), 2 bottles of Champagne (< 1.5 L), or 3 bottles of spirits."}
                </span>
              </li>
            </ul>
          </div>

          {/* ─── BLOC 2 : Contrôle des devises & moyens de paiement ─── */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 hover:border-[#E9D18F] transition-all duration-300 rounded-2xl p-6 sm:p-7 flex flex-col shadow-lg group">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#C5A059]/20">
              <span className="text-3xl">💶</span>
              <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#C5A059] bg-[#1a1c1a] px-3 py-1 rounded-full border border-[#C5A059]/30">
                {lang === "fr" ? "Déclaration Écrite" : "Written Declaration"}
              </span>
            </div>

            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#E9D18F] mb-4 leading-snug group-hover:text-white transition-colors">
              {lang === "fr"
                ? "2. Contrôle des devises et moyens de paiement"
                : "2. Currency & Payment Controls"}
            </h3>

            <p className="font-cormorant text-lg text-[#EDE4CF]/90 mb-4 leading-relaxed">
              {lang === "fr"
                ? "Pensez à déclarer par écrit vos liquidités à l'entrée comme à la sortie hors zone UMOA dès que vous atteignez les seuils suivants :"
                : "Remember to declare in writing your cash funds at entry or exit outside the WAEMU (UMOA) zone once you reach the following thresholds:"}
            </p>

            <div className="space-y-4 font-cormorant text-lg text-[#EDE4CF]/90 flex-grow">
              <div className="bg-[#181c18] border border-[#C5A059]/30 rounded-xl p-4">
                <div className="text-xs font-cinzel text-[#C5A059] uppercase tracking-wider mb-1">
                  {lang === "fr" ? "Zone Franc CFA" : "CFA Franc Zone"}
                </div>
                <div className="font-bold text-[#E9D18F] text-xl font-cinzel mb-1">
                  ≥ 10 000 000 FCFA
                </div>
                <p className="text-base text-[#cabfa6]">
                  {lang === "fr"
                    ? "Billets zone Franc CFA : déclaration obligatoire à partir de 10 000 000 FCFA."
                    : "CFA banknotes: mandatory declaration starting from 10,000,000 FCFA."}
                </p>
              </div>

              <div className="bg-[#181c18] border border-[#C5A059]/30 rounded-xl p-4">
                <div className="text-xs font-cinzel text-[#C5A059] uppercase tracking-wider mb-1">
                  {lang === "fr" ? "Devises Étrangères (EUR, USD, etc.)" : "Foreign Currencies (EUR, USD...)"}
                </div>
                <div className="font-bold text-[#E9D18F] text-xl font-cinzel mb-1">
                  ≥ 5 000 000 FCFA
                </div>
                <p className="text-base text-[#cabfa6]">
                  {lang === "fr"
                    ? "Devises étrangères : déclaration obligatoire à partir de la contre-valeur de 5 000 000 FCFA."
                    : "Foreign currencies: mandatory declaration starting from the counter-value of 5,000,000 FCFA."}
                </p>
              </div>
            </div>
          </div>

          {/* ─── BLOC 3 : Marchandises réglementées ou interdites ─── */}
          <div className="bg-[#131513]/90 border border-[#C5A059]/30 hover:border-[#E9D18F] transition-all duration-300 rounded-2xl p-6 sm:p-7 flex flex-col shadow-lg group">
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#C5A059]/20">
              <span className="text-3xl">🛡️</span>
              <span className="font-cinzel text-[10px] uppercase tracking-wider text-[#C5A059] bg-[#1a1c1a] px-3 py-1 rounded-full border border-[#C5A059]/30">
                {lang === "fr" ? "Réglementation Stricte" : "Strict Regulation"}
              </span>
            </div>

            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#E9D18F] mb-4 leading-snug group-hover:text-white transition-colors">
              {lang === "fr"
                ? "3. Marchandises réglementées ou interdites"
                : "3. Regulated or Prohibited Goods"}
            </h3>

            <div className="space-y-4 font-cormorant text-lg text-[#EDE4CF]/90 leading-relaxed flex-grow">
              <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4">
                <div className="text-xs font-cinzel text-red-300 uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                  <span>⛔</span>
                  <span>{lang === "fr" ? "Interdictions Strictes" : "Strict Prohibitions"}</span>
                </div>
                <p className="text-[#EDE4CF]">
                  {lang === "fr"
                    ? "Stupéfiants, publications ou supports à caractère obscène ou subversif."
                    : "Narcotics, illicit drugs, obscene or subversive publications."}
                </p>
              </div>

              <div className="bg-[#181c18] border border-[#C5A059]/30 rounded-xl p-4 space-y-2">
                <div className="text-xs font-cinzel text-[#E9D18F] uppercase tracking-wider font-bold mb-1 flex items-center gap-1.5">
                  <span>📋</span>
                  <span>{lang === "fr" ? "Autorisations Préalables Requises" : "Prior Authorizations Required"}</span>
                </div>
                <ul className="space-y-2 text-base text-[#cabfa6]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059]">▪</span>
                    <span>
                      <strong className="text-[#EDE4CF]">{lang === "fr" ? "Armes et munitions" : "Weapons & ammunition"}</strong> :{" "}
                      {lang === "fr" ? "Ministère de l'Intérieur" : "Ministry of Interior"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059]">▪</span>
                    <span>
                      <strong className="text-[#EDE4CF]">{lang === "fr" ? "Médicaments" : "Medicines"}</strong>{" "}
                      {lang === "fr" ? "(hors usage personnel avec ordonnance) : Ministère de la Santé" : "(outside personal prescribed use): Ministry of Health"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#C5A059]">▪</span>
                    <span>
                      <strong className="text-[#EDE4CF]">{lang === "fr" ? "Denrées animales" : "Animal products"}</strong> :{" "}
                      {lang === "fr" ? "Ministère de l'Agriculture et de l'Élevage" : "Ministry of Agriculture & Livestock"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de Cadre / Mention informative General Esquire */}
        <div className="border-t border-[#C5A059]/25 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-cormorant text-[#cabfa6]">
          <div className="flex items-center gap-2">
            <span className="text-[#C5A059] text-base">ℹ️</span>
            <span>
              {lang === "fr"
                ? "Document d'information officielle mis à disposition des voyageurs par General Esquire — Chrysalides pour un séjour sécurisé et serein."
                : "Official customs advisory provided by General Esquire — Chrysalides for a safe, hassle-free travel experience."}
            </span>
          </div>

          <div className="font-cinzel text-[10px] tracking-wider uppercase text-[#E9D18F] bg-[#131513] px-3 py-1.5 rounded-full border border-[#C5A059]/30 flex-shrink-0">
            {lang === "fr" ? "Réglementation DGD • République du Bénin" : "Benin Customs Regulation (DGD)"}
          </div>
        </div>

      </div>
    </section>
  );
}
