"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import TickerBanner from "@/components/TickerBanner";
import { supabase } from "@/lib/supabase";

export default function ConseilJuridiquePage() {
  const { lang } = useLanguage();

  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    prenoms: "",
    nom: "",
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

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size <= MAX_FILE_SIZE);
    const tooBig = files.filter(f => f.size > MAX_FILE_SIZE);
    if (tooBig.length > 0) {
      alert(lang === "fr"
        ? `${tooBig.length} fichier(s) dépassent 5 Mo et ont été ignorés.`
        : `${tooBig.length} file(s) exceed 5 MB and were ignored.`);
    }
    setUploadedFiles(prev => [...prev, ...validFiles].slice(0, 4));
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Liste des pays avec drapeaux
  const PAYS_LIST = [
    { code: "AF", flag: "🇦🇫", name: "Afghanistan" },
    { code: "ZA", flag: "🇿🇦", name: "Afrique du Sud" },
    { code: "AL", flag: "🇦🇱", name: "Albanie" },
    { code: "DZ", flag: "🇩🇿", name: "Algérie" },
    { code: "DE", flag: "🇩🇪", name: "Allemagne" },
    { code: "AD", flag: "🇦🇩", name: "Andorre" },
    { code: "AO", flag: "🇦🇴", name: "Angola" },
    { code: "AG", flag: "🇦🇬", name: "Antigua-et-Barbuda" },
    { code: "SA", flag: "🇸🇦", name: "Arabie Saoudite" },
    { code: "AR", flag: "🇦🇷", name: "Argentine" },
    { code: "AM", flag: "🇦🇲", name: "Arménie" },
    { code: "AU", flag: "🇦🇺", name: "Australie" },
    { code: "AT", flag: "🇦🇹", name: "Autriche" },
    { code: "AZ", flag: "🇦🇿", name: "Azerbaïdjan" },
    { code: "BS", flag: "🇧🇸", name: "Bahamas" },
    { code: "BH", flag: "🇧🇭", name: "Bahreïn" },
    { code: "BD", flag: "🇧🇩", name: "Bangladesh" },
    { code: "BB", flag: "🇧🇧", name: "Barbade" },
    { code: "BE", flag: "🇧🇪", name: "Belgique" },
    { code: "BZ", flag: "🇧🇿", name: "Belize" },
    { code: "BJ", flag: "🇧🇯", name: "Bénin" },
    { code: "BT", flag: "🇧🇹", name: "Bhoutan" },
    { code: "BY", flag: "🇧🇾", name: "Biélorussie" },
    { code: "BO", flag: "🇧🇴", name: "Bolivie" },
    { code: "BA", flag: "🇧🇦", name: "Bosnie-Herzégovine" },
    { code: "BW", flag: "🇧🇼", name: "Botswana" },
    { code: "BR", flag: "🇧🇷", name: "Brésil" },
    { code: "BN", flag: "🇧🇳", name: "Brunéi" },
    { code: "BG", flag: "🇧🇬", name: "Bulgarie" },
    { code: "BF", flag: "🇧🇫", name: "Burkina Faso" },
    { code: "BI", flag: "🇧🇮", name: "Burundi" },
    { code: "CV", flag: "🇨🇻", name: "Cap-Vert" },
    { code: "KH", flag: "🇰🇭", name: "Cambodge" },
    { code: "CM", flag: "🇨🇲", name: "Cameroun" },
    { code: "CA", flag: "🇨🇦", name: "Canada" },
    { code: "CF", flag: "🇨🇫", name: "Centrafrique" },
    { code: "CL", flag: "🇨🇱", name: "Chili" },
    { code: "CN", flag: "🇨🇳", name: "Chine" },
    { code: "CY", flag: "🇨🇾", name: "Chypre" },
    { code: "CO", flag: "🇨🇴", name: "Colombie" },
    { code: "KM", flag: "🇰🇲", name: "Comores" },
    { code: "CG", flag: "🇨🇬", name: "Congo" },
    { code: "CD", flag: "🇨🇩", name: "Congo (RDC)" },
    { code: "KR", flag: "🇰🇷", name: "Corée du Sud" },
    { code: "KP", flag: "🇰🇵", name: "Corée du Nord" },
    { code: "CR", flag: "🇨🇷", name: "Costa Rica" },
    { code: "CI", flag: "🇨🇮", name: "Côte d’Ivoire" },
    { code: "HR", flag: "🇭🇷", name: "Croatie" },
    { code: "CU", flag: "🇨🇺", name: "Cuba" },
    { code: "DK", flag: "🇩🇰", name: "Danemark" },
    { code: "DJ", flag: "🇩🇯", name: "Djibouti" },
    { code: "DO", flag: "🇩🇴", name: "République dominicaine" },
    { code: "EG", flag: "🇪🇬", name: "Égypte" },
    { code: "AE", flag: "🇦🇪", name: "Émirats arabes unis" },
    { code: "EC", flag: "🇪🇨", name: "Équateur" },
    { code: "ER", flag: "🇪🇷", name: "Érythrée" },
    { code: "ES", flag: "🇪🇸", name: "Espagne" },
    { code: "EE", flag: "🇪🇪", name: "Estonie" },
    { code: "SZ", flag: "🇸🇿", name: "Eswatini" },
    { code: "ET", flag: "🇪🇹", name: "Éthiopie" },
    { code: "FJ", flag: "🇫🇯", name: "Fidji" },
    { code: "FI", flag: "🇫🇮", name: "Finlande" },
    { code: "FR", flag: "🇫🇷", name: "France" },
    { code: "GA", flag: "🇬🇦", name: "Gabon" },
    { code: "GM", flag: "🇬🇲", name: "Gambie" },
    { code: "GE", flag: "🇬🇪", name: "Géorgie" },
    { code: "GH", flag: "🇬🇭", name: "Ghana" },
    { code: "GR", flag: "🇬🇷", name: "Grèce" },
    { code: "GD", flag: "🇬🇩", name: "Grenade" },
    { code: "GT", flag: "🇬🇹", name: "Guatemala" },
    { code: "GN", flag: "🇬🇳", name: "Guinée" },
    { code: "GW", flag: "🇬🇼", name: "Guinée-Bissau" },
    { code: "GQ", flag: "🇬🇶", name: "Guinée équatoriale" },
    { code: "GY", flag: "🇬🇾", name: "Guyana" },
    { code: "HT", flag: "🇭🇹", name: "Haïti" },
    { code: "HN", flag: "🇭🇳", name: "Honduras" },
    { code: "HU", flag: "🇭🇺", name: "Hongrie" },
    { code: "IN", flag: "🇮🇳", name: "Inde" },
    { code: "ID", flag: "🇮🇩", name: "Indonésie" },
    { code: "IQ", flag: "🇮🇶", name: "Irak" },
    { code: "IR", flag: "🇮🇷", name: "Iran" },
    { code: "IE", flag: "🇮🇪", name: "Irlande" },
    { code: "IS", flag: "🇮🇸", name: "Islande" },
    { code: "IL", flag: "🇮🇱", name: "Israël" },
    { code: "IT", flag: "🇮🇹", name: "Italie" },
    { code: "JM", flag: "🇯🇲", name: "Jamaïque" },
    { code: "JP", flag: "🇯🇵", name: "Japon" },
    { code: "JO", flag: "🇯🇴", name: "Jordanie" },
    { code: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
    { code: "KE", flag: "🇰🇪", name: "Kenya" },
    { code: "KG", flag: "🇰🇬", name: "Kirghizistan" },
    { code: "KI", flag: "🇰🇮", name: "Kiribati" },
    { code: "KW", flag: "🇰🇼", name: "Koweët" },
    { code: "LA", flag: "🇱🇦", name: "Laos" },
    { code: "LS", flag: "🇱🇸", name: "Lesotho" },
    { code: "LV", flag: "🇱🇻", name: "Lettonie" },
    { code: "LB", flag: "🇱🇧", name: "Liban" },
    { code: "LR", flag: "🇱🇷", name: "Libéria" },
    { code: "LY", flag: "🇱🇾", name: "Libye" },
    { code: "LI", flag: "🇱🇮", name: "Liechtenstein" },
    { code: "LT", flag: "🇱🇹", name: "Lituanie" },
    { code: "LU", flag: "🇱🇺", name: "Luxembourg" },
    { code: "MK", flag: "🇲🇰", name: "Macédoine du Nord" },
    { code: "MG", flag: "🇲🇬", name: "Madagascar" },
    { code: "MY", flag: "🇲🇾", name: "Malaisie" },
    { code: "MW", flag: "🇲🇼", name: "Malawi" },
    { code: "MV", flag: "🇲🇻", name: "Maldives" },
    { code: "ML", flag: "🇲🇱", name: "Mali" },
    { code: "MT", flag: "🇲🇹", name: "Malte" },
    { code: "MA", flag: "🇲🇦", name: "Maroc" },
    { code: "MH", flag: "🇲🇭", name: "Marshall" },
    { code: "MR", flag: "🇲🇷", name: "Mauritanie" },
    { code: "MU", flag: "🇲🇺", name: "Maurice" },
    { code: "MX", flag: "🇲🇽", name: "Mexique" },
    { code: "FM", flag: "🇫🇲", name: "Micronésie" },
    { code: "MD", flag: "🇲🇩", name: "Moldavie" },
    { code: "MC", flag: "🇲🇨", name: "Monaco" },
    { code: "MN", flag: "🇲🇳", name: "Mongolie" },
    { code: "ME", flag: "🇲🇪", name: "Monténégro" },
    { code: "MZ", flag: "🇲🇿", name: "Mozambique" },
    { code: "MM", flag: "🇲🇲", name: "Myanmar" },
    { code: "NA", flag: "🇳🇦", name: "Namibie" },
    { code: "NR", flag: "🇳🇷", name: "Nauru" },
    { code: "NP", flag: "🇳🇵", name: "Népal" },
    { code: "NI", flag: "🇳🇮", name: "Nicaragua" },
    { code: "NE", flag: "🇳🇪", name: "Niger" },
    { code: "NG", flag: "🇳🇬", name: "Nigéria" },
    { code: "NO", flag: "🇳🇴", name: "Norvège" },
    { code: "NZ", flag: "🇳🇿", name: "Nouvelle-Zélande" },
    { code: "OM", flag: "🇴🇲", name: "Oman" },
    { code: "UG", flag: "🇺🇬", name: "Ouganda" },
    { code: "UZ", flag: "🇺🇿", name: "Ouzbékistan" },
    { code: "PK", flag: "🇵🇰", name: "Pakistan" },
    { code: "PW", flag: "🇵🇼", name: "Palaos" },
    { code: "PS", flag: "🇵🇸", name: "Palestine" },
    { code: "PA", flag: "🇵🇦", name: "Panama" },
    { code: "PG", flag: "🇵🇬", name: "Papouasie-Nouvelle-Guinée" },
    { code: "PY", flag: "🇵🇾", name: "Paraguay" },
    { code: "NL", flag: "🇳🇱", name: "Pays-Bas" },
    { code: "PE", flag: "🇵🇪", name: "Pérou" },
    { code: "PH", flag: "🇵🇭", name: "Philippines" },
    { code: "PL", flag: "🇵🇱", name: "Pologne" },
    { code: "PT", flag: "🇵🇹", name: "Portugal" },
    { code: "QA", flag: "🇶🇦", name: "Qatar" },
    { code: "RO", flag: "🇷🇴", name: "Roumanie" },
    { code: "GB", flag: "🇬🇧", name: "Royaume-Uni" },
    { code: "RU", flag: "🇷🇺", name: "Russie" },
    { code: "RW", flag: "🇷🇼", name: "Rwanda" },
    { code: "KN", flag: "🇰🇳", name: "Saint-Kitts-et-Nevis" },
    { code: "LC", flag: "🇱🇨", name: "Sainte-Lucie" },
    { code: "VC", flag: "🇻🇨", name: "Saint-Vincent-et-les-Grenadines" },
    { code: "SB", flag: "🇸🇧", name: "Salomon" },
    { code: "WS", flag: "🇼🇸", name: "Samoa" },
    { code: "SM", flag: "🇸🇲", name: "Saint-Marin" },
    { code: "ST", flag: "🇸🇹", name: "Sao Tomé-et-Principe" },
    { code: "SN", flag: "🇸🇳", name: "Sénégal" },
    { code: "RS", flag: "🇷🇸", name: "Serbie" },
    { code: "SC", flag: "🇸🇨", name: "Seychelles" },
    { code: "SL", flag: "🇸🇱", name: "Sierra Leone" },
    { code: "SG", flag: "🇸🇬", name: "Singapour" },
    { code: "SK", flag: "🇸🇰", name: "Slovaquie" },
    { code: "SI", flag: "🇸🇮", name: "Slovénie" },
    { code: "SO", flag: "🇸🇴", name: "Somalie" },
    { code: "SD", flag: "🇸🇩", name: "Soudan" },
    { code: "SS", flag: "🇸🇸", name: "Soudan du Sud" },
    { code: "LK", flag: "🇱🇰", name: "Sri Lanka" },
    { code: "SE", flag: "🇸🇪", name: "Suède" },
    { code: "CH", flag: "🇨🇭", name: "Suisse" },
    { code: "SR", flag: "🇸🇷", name: "Suriname" },
    { code: "SY", flag: "🇸🇾", name: "Syrie" },
    { code: "TJ", flag: "🇹🇯", name: "Tadjikistan" },
    { code: "TZ", flag: "🇹🇿", name: "Tanzanie" },
    { code: "TD", flag: "🇹🇩", name: "Tchad" },
    { code: "CZ", flag: "🇨🇿", name: "Tchéquie" },
    { code: "TH", flag: "🇹🇭", name: "Thaïlande" },
    { code: "TL", flag: "🇹🇱", name: "Timor oriental" },
    { code: "TG", flag: "🇹🇬", name: "Togo" },
    { code: "TO", flag: "🇹🇴", name: "Tonga" },
    { code: "TT", flag: "🇹🇹", name: "Trinité-et-Tobago" },
    { code: "TN", flag: "🇹🇳", name: "Tunisie" },
    { code: "TM", flag: "🇹🇲", name: "Turkménistan" },
    { code: "TR", flag: "🇹🇷", name: "Turquie" },
    { code: "TV", flag: "🇹🇻", name: "Tuvalu" },
    { code: "UA", flag: "🇺🇦", name: "Ukraine" },
    { code: "UY", flag: "🇺🇾", name: "Uruguay" },
    { code: "VU", flag: "🇻🇺", name: "Vanuatu" },
    { code: "VE", flag: "🇻🇪", name: "Venezuela" },
    { code: "VN", flag: "🇻🇳", name: "Viêt Nam" },
    { code: "YE", flag: "🇾🇪", name: "Yémen" },
    { code: "ZM", flag: "🇿🇲", name: "Zambie" },
    { code: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
  ].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  const countWords = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rgpd) {
      alert(
        lang === "fr"
          ? "Veuillez cocher la case d'avertissement RGPD avant de valider."
          : "Please check the GDPR consent box before submitting."
      );
      return;
    }

    const fullName = `${formData.prenoms} ${formData.nom}`.trim() || "Client Anonyme";
    const phone = formData.telephone.trim();
    const newDemande = {
      id: "dem_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      full_name: fullName,
      email: formData.courriel,
      phone: phone,
      structure: formData.structure,
      country: formData.pays,
      subject: formData.probleme ? (formData.probleme.slice(0, 80) + (formData.probleme.length > 80 ? "..." : "")) : "Consultation Juridique",
      message: formData.probleme,
      status: "Nouveau",
      registered_at: new Date().toISOString(),
    };

    // 1. Sauvegarde Supabase
    try {
      await supabase.from("demandes_clients").insert([newDemande]);
    } catch (err) {
      console.warn("Supabase insert fallback:", err);
    }

    // 2. Sauvegarde LocalStorage (garantie zéro perte)
    try {
      const stored = JSON.parse(localStorage.getItem("ge_demandes_clients") || "[]");
      stored.unshift(newDemande);
      localStorage.setItem("ge_demandes_clients", JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }

    // 3. Envoi d'email direct automatique à generalesquire@proton.me via API
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: formData.courriel,
          phone: phone,
          structure: formData.structure,
          country: formData.pays,
          subject: `Nouvelle demande Conseil Juridique — ${fullName}`,
          message: `Ville / Code Postal : ${formData.ville} (${formData.codePostal})\nUrgent : ${formData.urgent === 'oui' ? 'OUI' : 'NON'}\n\nDescription du besoin :\n${formData.probleme}`,
          type: "Formulaire Conseil Juridique",
        }),
      });
    } catch (apiErr) {
      console.warn("API /api/contact error:", apiErr);
    }

    // 4. Secours mailto
    const mailSubject = encodeURIComponent(`Nouvelle demande de contact — ${fullName}`);
    const mailBody = encodeURIComponent(
      `Bonjour General Esquire,\n\nUne nouvelle demande de contact / consultation a été soumise sur le site :\n\n` +
      `Nom complet : ${fullName}\n` +
      `Email : ${formData.courriel}\n` +
      `Téléphone : ${phone}\n` +
      `Structure / Organisation : ${formData.structure || 'Non spécifié'}\n` +
      `Pays : ${formData.pays}\n` +
      `Ville / Code Postal : ${formData.ville} (${formData.codePostal})\n` +
      `Caractère urgent : ${formData.urgent === 'oui' ? 'OUI' : 'NON'}\n\n` +
      `Description du besoin :\n${formData.probleme}\n\n` +
      `Date : ${new Date().toLocaleString("fr-FR")}`
    );

    try {
      window.location.href = `mailto:generalesquire@proton.me?subject=${mailSubject}&body=${mailBody}`;
    } catch {}

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

      {/* ─── 2. BANDE DÉROULANTE (TICKER ALL-WIDTH SOUS LA BANNIÈRE) ───────────────── */}
      <TickerBanner className="mb-8" />

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
            className="group px-3.5 sm:px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer overflow-hidden"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.64rem] xs:text-[0.70rem] sm:text-[0.78rem] font-semibold tracking-[0.05em] sm:tracking-[0.10em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
              {lang === "fr" ? "VOUS ÊTES UN PROFESSIONNEL DU DROIT" : "YOU ARE A LEGAL PROFESSIONAL"}
            </span>
          </Link>

          {/* 2. Institution publique */}
          <Link
            href="/institution"
            className="group px-3.5 sm:px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer overflow-hidden"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.64rem] xs:text-[0.70rem] sm:text-[0.78rem] font-semibold tracking-[0.05em] sm:tracking-[0.10em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
              {lang === "fr" ? "VOUS ÊTES UNE INSTITUTION PUBLIQUE" : "YOU ARE A PUBLIC INSTITUTION"}
            </span>
          </Link>

          {/* 3. Chef d'entreprise */}
          <Link
            href="/entrepreneur"
            className="group px-3.5 sm:px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer overflow-hidden"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.64rem] xs:text-[0.70rem] sm:text-[0.78rem] font-semibold tracking-[0.05em] sm:tracking-[0.10em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
              {lang === "fr" ? "VOUS ÊTES UN CHEF D'ENTREPRISE" : "YOU ARE A BUSINESS LEADER"}
            </span>
          </Link>

          {/* 4. Simple particulier */}
          <Link
            href="/articuliers"
            className="group px-3.5 sm:px-5 py-4 rounded-md bg-[#0F1E14]/80 border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#0F3823] transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer overflow-hidden"
          >
            <span className="text-[#C5A059] group-hover:text-[#E9D18F] font-cinzel text-base flex-shrink-0">—</span>
            <span className="font-cinzel text-[0.64rem] xs:text-[0.70rem] sm:text-[0.78rem] font-semibold tracking-[0.05em] sm:tracking-[0.10em] text-[#C5A059] group-hover:text-[#EDE4CF] transition-colors uppercase leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
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
                    <div className="relative cursor-pointer">
                      <input
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                        onClick={(e) => e.currentTarget.showPicker?.()}
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors [color-scheme:dark] cursor-pointer"
                      />
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#C5A059]">
                          <rect x="3" y="4" width="18" height="18" rx="3" stroke="#C5A059" strokeWidth="1.8"/>
                          <path d="M3 9h18" stroke="#C5A059" strokeWidth="1.8"/>
                          <path d="M8 2v4M16 2v4" stroke="#C5A059" strokeWidth="1.8" strokeLinecap="round"/>
                          <circle cx="8" cy="13" r="1.1" fill="#C5A059"/>
                          <circle cx="12" cy="13" r="1.1" fill="#C5A059"/>
                          <circle cx="16" cy="13" r="1.1" fill="#C5A059"/>
                          <circle cx="8" cy="17" r="1.1" fill="#C5A059"/>
                          <circle cx="12" cy="17" r="1.1" fill="#C5A059"/>
                        </svg>
                      </div>
                    </div>
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
                    <div className="relative">
                      <select
                        required
                        value={formData.pays}
                        onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0a0b0a] border border-[#C5A059]/40 text-[#EDE4CF] focus:border-[#E9D18F] focus:outline-none transition-colors appearance-none cursor-pointer"
                      >
                        {PAYS_LIST.map((p) => (
                          <option key={p.code} value={p.name}>
                            {p.flag} {p.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#C5A059]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
                      </div>
                    </div>
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

                {/* Zone upload fichiers */}
                <div>
                  <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                    {lang === "fr" ? "Joindre des documents (max 5 Mo / fichier)" : "Attach Documents (max 5 MB / file)"}
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl bg-[#0a0b0a] border-2 border-dashed border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] cursor-pointer transition-colors group">
                    <svg className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="font-cinzel text-xs tracking-wider">
                      {lang === "fr" ? "Cliquer ou glisser-déposer vos fichiers" : "Click or drag and drop files"}
                    </span>
                    <span className="text-xs text-[#cabfa6] mt-1">
                      {lang === "fr" ? "Tous formats acceptés — 5 Mo max / fichier" : "All formats accepted — 5 MB max / file"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="*/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {/* Liste des fichiers sélectionnés */}
                  {uploadedFiles.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {uploadedFiles.map((file, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm text-[#EDE4CF]/80 bg-[#0a0b0a] border border-[#C5A059]/20 rounded-lg px-3 py-2">
                          <span className="truncate max-w-[80%]">{file.name}</span>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span className="text-[#cabfa6] text-xs">{(file.size / 1024 / 1024).toFixed(1)} Mo</span>
                            <button type="button" onClick={() => removeFile(idx)} className="text-[#C5A059] hover:text-red-400 transition-colors text-base leading-none cursor-pointer">&times;</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
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
