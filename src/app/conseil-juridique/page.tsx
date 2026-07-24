"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function ConseilJuridiquePage() {
  const { lang } = useLanguage();

  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nom: "",
    prenoms: "",
    structure: "",
    dateNaissance: "",
    lieuNaissance: "",
    adresse: "",
    codePostal: "",
    ville: "",
    pays: "France",
    telephone: "",
    courriel: "",
    probleme: "",
    urgent: "non",
    rgpd: false,
  });

  const countWords = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rgpd) {
      alert(
        lang === "fr"
          ? "Veuillez cocher la case d'avertissement RGPD avant de valider."
          : "Please check the GDPR consent box before submitting."
      );
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1A1C1A] text-[#EDE4CF] flex flex-col justify-between overflow-x-hidden">
      {/* ─── 1. EN-TÊTE : BANNIÈRE SEULE (vs/1 style exact) ──────────────── */}
      <header className="w-full bg-[#131513] overflow-hidden">
        <div className="w-full h-[clamp(180px,34vw,460px)] relative overflow-hidden">
          <Image
            src="/images/BANNERCJ.png"
            alt="Bannière Conseil Juridique — Défendre vos droits, protéger vos intérêts"
            fill
            priority
            className="object-cover object-[center_40%] filter brightness-95 contrast-105 animate-kenburns"
          />
        </div>
      </header>

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH) ────────────────────── */}
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

      {/* ─── 3. CONTENU PRINCIPAL CONSEIL JURIDIQUE ───────────────────── */}
      <main className="max-w-[840px] mx-auto px-4 sm:px-8 py-10 sm:py-16 flex-grow text-left">
        {/* En-tête Rubrique */}
        <div className="mb-8">
          <span className="font-cinzel text-xs uppercase tracking-[0.26em] text-[#C5A059] block mb-2 font-semibold">
            {lang === "fr" ? "Nos services" : "Our Services"}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#E9D18F] mb-3 leading-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.8)]">
            {lang === "fr" ? "Conseil juridique" : "Legal Advisory"}
          </h1>
          <div className="w-[70px] h-[2px] bg-[#C5A059] my-4 opacity-75"></div>
        </div>

        {/* Accroche Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e100e]/90 border border-[#C5A059]/35 shadow-xl mb-10 text-center">
          <p className="font-cormorant text-xl sm:text-2xl text-[#EDE4CF] font-light leading-relaxed mb-3">
            {lang === "fr" ? (
              <>Avez-vous besoin d'un avis, d'un conseil,<br />ou d'accompagnement juridique ?</>
            ) : (
              <>Do you need legal advice, guidance,<br />or representation support?</>
            )}
          </p>
          <p className="font-cinzel text-xl sm:text-2xl font-bold text-[#E9D18F] uppercase tracking-wider drop-shadow-md">
            {lang === "fr" ? "Vous êtes au bon endroit." : "You are in the right place."}
          </p>
        </div>

        {/* Photo Bureau (Bureau modifié.jpg) */}
        <figure className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl mb-10 group">
          <Image
            src="/images/Bureau modifié.jpg"
            alt="Bureau du cabinet General Esquire — Chrysalides"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1A]/60 via-transparent to-transparent opacity-60"></div>
        </figure>

        {/* Corps du texte */}
        <div className="space-y-6 font-cormorant text-lg sm:text-xl text-[#EDE4CF]/90 leading-[1.95] font-light mb-10">
          <p>
            {lang === "fr"
              ? "Nul n'est censé ignorer la loi, dit l'adage, dans un monde où la loi elle-même, le dénominateur commun par lequel tous nos actes sont jugés, est en constante évolution."
              : "Ignorance of the law is no excuse, as the adage goes, in a world where the law itself—the common denominator by which all our actions are judged—is constantly evolving."}
          </p>
          <p>
            {lang === "fr"
              ? "Pour prendre certaines décisions importantes, préserver nos droits et notre responsabilité, ester en justice, ou défendre à une action ou poursuite, nous avons bien souvent besoin d'un avis, d'un conseil ou d'une opinion éclairée."
              : "To make critical decisions, protect our rights and liability, take legal action, or defend against a lawsuit, we often require clear, expert legal counsel."}
          </p>
          <p>
            {lang === "fr" ? (
              <>
                General Esquire est un cabinet de conseil de premier choix, qui offre en présentiel comme en distanciel, un service d'<span className="whitespace-nowrap font-medium text-[#E9D18F]">accompagnement juridique</span> complet qui varie suivant votre profil et vos besoins :
              </>
            ) : (
              <>
                General Esquire is a premier consulting firm offering comprehensive legal support—in person or remotely—tailored to your specific profile and requirements:
              </>
            )}
          </p>
        </div>

        {/* ─── 4 PROFILS CLIQUABLES (GRILLE 2x2 DISPOSITION & COULEURS DU SCREENSHOT) ─── */}
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-8" aria-label="Profils clients">
          {/* 1. Professionnel du droit */}
          <Link
            href="/professionnel"
            className="group px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2.5 shadow-sm cursor-pointer"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.72rem] sm:text-[0.78rem] font-semibold tracking-[0.11em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug">
              {lang === "fr" ? "VOUS ÊTES UN PROFESSIONNEL DU DROIT" : "YOU ARE A LEGAL PROFESSIONAL"}
            </span>
          </Link>

          {/* 2. Institution publique */}
          <Link
            href="/institution"
            className="group px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2.5 shadow-sm cursor-pointer"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.72rem] sm:text-[0.78rem] font-semibold tracking-[0.11em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug">
              {lang === "fr" ? "VOUS ÊTES UNE INSTITUTION PUBLIQUE" : "YOU ARE A PUBLIC INSTITUTION"}
            </span>
          </Link>

          {/* 3. Chef d'entreprise */}
          <Link
            href="/entrepreneur"
            className="group px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2.5 shadow-sm cursor-pointer"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.72rem] sm:text-[0.78rem] font-semibold tracking-[0.11em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug">
              {lang === "fr" ? "VOUS ÊTES UN CHEF D'ENTREPRISE" : "YOU ARE A BUSINESS LEADER"}
            </span>
          </Link>

          {/* 4. Simple particulier */}
          <Link
            href="/articuliers"
            className="group px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2.5 shadow-sm cursor-pointer"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.72rem] sm:text-[0.78rem] font-semibold tracking-[0.11em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug">
              {lang === "fr" ? "VOUS ÊTES UN SIMPLE PARTICULIER" : "YOU ARE AN INDIVIDUAL"}
            </span>
          </Link>
        </nav>

        {/* CTA TEXT & FORMULAR BUTTON TOGGLE */}
        <p className="font-cormorant text-xl text-[#EDE4CF] text-center italic leading-relaxed mb-12">
          {lang === "fr" ? (
            <>
              Vous pouvez remplir le{" "}
              <button
                type="button"
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) {
                    setTimeout(() => {
                      document.getElementById("formulaire-cj")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
                className="font-cinzel not-italic text-[#E9D18F] underline hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/40"
              >
                formulaire
              </button>{" "}
              ci-après, et nous prendrons rapidement contact avec vous.
            </>
          ) : (
            <>
              You may fill out the{" "}
              <button
                type="button"
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) {
                    setTimeout(() => {
                      document.getElementById("formulaire-cj")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }
                }}
                className="font-cinzel not-italic text-[#E9D18F] underline hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-[#C5A059]/10 border border-[#C5A059]/40"
              >
                form below
              </button>
              , and we will contact you promptly.
            </>
          )}
        </p>

        {/* ─── FORMULAIRE DE CONTACT (VS/1 EXACT) ────────────────────── */}
        {showForm && (
          <section id="formulaire-cj" className="bg-[#131513] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-10 shadow-2xl mb-12 animate-fade-in">
            <h2 className="font-cinzel text-2xl sm:text-3xl text-[#E9D18F] font-bold text-center mb-1">
              {lang === "fr" ? "Formulaire de contact" : "Contact Form"}
            </h2>
            <p className="font-cinzel text-xs sm:text-sm text-[#C5A059] text-center tracking-widest uppercase mb-6">
              « {lang === "fr" ? "Conseil Juridique" : "Legal Advisory"} »
            </p>

            {/* Avertissement Box */}
            <div className="p-5 rounded-2xl bg-[#0a0b0a] border border-[#C5A059]/25 font-cormorant text-sm sm:text-base text-[#cabfa6] leading-relaxed mb-8 italic">
              <h3 className="font-cinzel not-italic text-xs text-[#E9D18F] uppercase tracking-wider mb-2 font-semibold">
                {lang === "fr" ? "Avertissement" : "Notice"}
              </h3>
              <p>
                {lang === "fr"
                  ? "Les champs marqués d'un astérisque (*) sont obligatoires. Vous pouvez écrire jusqu'à 2 000 mots et joindre jusqu'à 4 documents (PDF, Word, JPEG ou PNG — 5 Mo maximum par fichier). Vos documents peuvent être rédigés en français, anglais, chinois ou russe. La réponse « Non » est cochée par défaut pour l'urgence. Veuillez sélectionner « Oui » si une réaction de notre part est nécessaire sous 48 h. Conformément aux articles 16 et 19 du RGPD, vous disposez d'un droit de rectification auprès de la CNIL."
                  : "Fields marked with an asterisk (*) are mandatory. You may write up to 2,000 words and attach up to 4 files (PDF, Word, JPEG, PNG — max 5MB/file). Documents may be submitted in French, English, Chinese, or Russian. 'No' is selected by default for urgency; choose 'Yes' if response is required within 48 hours."}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-[#0F3823]/80 border border-[#C5A059] text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center mx-auto text-[#E9D18F] text-2xl font-bold">
                  ✓
                </div>
                <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold">
                  {lang === "fr" ? "Votre message a bien été transmitted." : "Your message was sent successfully."}
                </h3>
                <p className="font-cormorant text-base text-[#EDE4CF]">
                  {lang === "fr"
                    ? "General Esquire vous remercie pour votre message. Une confirmation de réception vous parviendra dans votre boîte mail."
                    : "General Esquire thanks you for your message. A confirmation will be sent to your email inbox."}
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="font-cinzel text-xs text-[#C5A059] underline hover:text-[#E9D18F]"
                >
                  {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 font-cormorant text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Votre nom *" : "Your Last Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex. Dupont"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Vos prénoms" : "Your First Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="ex. Jean-Pierre"
                      value={formData.prenoms}
                      onChange={(e) => setFormData({ ...formData, prenoms: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                    {lang === "fr" ? "Nom de votre structure" : "Organization Name"}
                  </label>
                  <input
                    type="text"
                    placeholder="Société, cabinet, association…"
                    value={formData.structure}
                    onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Date de naissance" : "Date of Birth"}
                    </label>
                    <input
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Lieu de naissance" : "Place of Birth"}
                    </label>
                    <input
                      type="text"
                      placeholder="Ville, Pays"
                      value={formData.lieuNaissance}
                      onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                    {lang === "fr" ? "Adresse *" : "Street Address *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Numéro et nom de la rue"
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Code postal" : "Postal Code"}
                    </label>
                    <input
                      type="text"
                      placeholder="ex. 75008"
                      value={formData.codePostal}
                      onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Ville *" : "City *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex. Paris"
                      value={formData.ville}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Pays *" : "Country *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex. France"
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Téléphone *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+33 6 00 00 00 00"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                      {lang === "fr" ? "Courriel *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="vous@exemple.com"
                      value={formData.courriel}
                      onChange={(e) => setFormData({ ...formData, courriel: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-cinzel text-xs text-[#C5A059] uppercase tracking-wider">
                      {lang === "fr" ? "Exposez votre problème *" : "Describe Your Problem *"}
                    </label>
                    <span className="font-cinzel text-[11px] text-[#C5A059]/80">
                      {countWords(formData.probleme)} / 2 000 {lang === "fr" ? "mots" : "words"}
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    placeholder="Décrivez votre situation, le contexte juridique, et les questions que vous souhaitez soumettre à notre cabinet…"
                    value={formData.probleme}
                    onChange={(e) => setFormData({ ...formData, probleme: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors placeholder:text-gray-600"
                  ></textarea>
                </div>

                {/* Urgence Radio */}
                <div>
                  <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                    {lang === "fr" ? "Mon problème est urgent *" : "My problem is urgent *"}
                  </label>
                  <div className="flex items-center gap-6 text-[#EDE4CF]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="urgent"
                        value="oui"
                        checked={formData.urgent === "oui"}
                        onChange={() => setFormData({ ...formData, urgent: "oui" })}
                        className="accent-[#C5A059]"
                      />
                      <span className="text-[#FF6B35] font-semibold">
                        {lang === "fr" ? "Oui (Sous 48h)" : "Yes (Within 48h)"}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="urgent"
                        value="non"
                        checked={formData.urgent === "non"}
                        onChange={() => setFormData({ ...formData, urgent: "non" })}
                        className="accent-[#C5A059]"
                      />
                      <span>{lang === "fr" ? "Non" : "No"}</span>
                    </label>
                  </div>
                </div>

                {/* Checkbox RGPD */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="rgpd-cj"
                    checked={formData.rgpd}
                    onChange={(e) => setFormData({ ...formData, rgpd: e.target.checked })}
                    className="mt-1 accent-[#C5A059] w-4 h-4"
                  />
                  <label htmlFor="rgpd-cj" className="text-sm text-[#cabfa6] leading-snug cursor-pointer">
                    {lang === "fr"
                      ? "En cliquant sur Valider, vous consentez au traitement de vos données personnelles par General Esquire conformément au RGPD."
                      : "By clicking Submit, you consent to the processing of your personal data by General Esquire in accordance with GDPR regulations."}
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 rounded-xl bg-[#0F3823] border border-[#C5A059] text-[#E9D18F] font-cinzel font-bold text-sm tracking-widest uppercase hover:bg-[#C5A059] hover:text-black transition-all shadow-lg cursor-pointer"
                  >
                    {lang === "fr" ? "VALIDER" : "SUBMIT"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="py-4 px-8 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#C5A059] font-cinzel text-xs tracking-widest uppercase hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    {lang === "fr" ? "ANNULER" : "CANCEL"}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* Retour à l'accueil */}
        <div className="pt-6">
          <Link
            href="/"
            className="font-cinzel text-xs text-[#C5A059] hover:text-[#E9D18F] uppercase tracking-widest transition-colors inline-flex items-center gap-2 border-b border-transparent hover:border-[#E9D18F]"
          >
            ← {lang === "fr" ? "Retour à l'accueil" : "Back to Home"}
          </Link>
        </div>
      </main>

    </div>
  );
}
