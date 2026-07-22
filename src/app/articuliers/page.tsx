"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const SITUATIONS_FR = [
  "Vous êtes convoqué à la gendarmerie et vous ignorez quelle en sera la suite.",
  "Votre compagnon ou le père de vos enfants ne paie plus la pension alimentaire.",
  "Cela fait plusieurs mois que vous attendez la délivrance de votre titre de séjour.",
  "Votre employeur vous a convoqué en vue de votre licenciement disciplinaire.",
  "Un de vos proches doit se rendre dans un commissariat de police pour déposer plainte.",
  "Votre fille a un problème récurrent avec son copain qui la frappe ou la menace.",
  "Vos voisins font du bruit dans leur appartement, et vous ne savez plus que faire.",
  "La Caisse d'allocations familiales menace de saisir votre compte bancaire.",
  "Le préfet vous a notifié une obligation de quitter le territoire français (OQTF).",
  "Votre compagne est partie avec votre enfant, à votre insu, et sans laisser de contact.",
  "Vous recevez un avis de contravention pour une voiture que vous ne conduisiez pas.",
  "Vous découvrez un trou dans votre plafond et votre bailleur refuse de le réparer.",
  "L'appareil que vous avez reçu ne correspond pas à celui que vous avez commandé.",
  "Vous souhaitez sortir de tous les crédits à la consommation qui ruinent votre quiétude.",
  "Quelqu'un a usurpé votre identité, et c'est vous qui recevez à sa place des amendes.",
  "Vous envisagez ou avez déjà un avocat, mais quelque chose vous pèse sur le cœur."
];

const SITUATIONS_EN = [
  "You are summoned to the police station and do not know what will happen next.",
  "Your partner or the father of your children has stopped paying child support.",
  "You have been waiting several months for your residence permit to be issued.",
  "Your employer has summoned you for a disciplinary dismissal interview.",
  "A relative needs to go to a police station to file an official complaint.",
  "Your daughter faces recurring abuse or threats from her boyfriend.",
  "Your neighbors are noisy in their apartment and you don't know what to do.",
  "The family allowance agency threatens to seize your bank account.",
  "The prefect notified you of an obligation to leave French territory (OQTF).",
  "Your partner left with your child without your knowledge or contact details.",
  "You receive a traffic fine notice for a vehicle you were not driving.",
  "You discover a leak/hole in your ceiling and your landlord refuses to repair it.",
  "The item you received does not correspond to what you ordered online.",
  "You want to get out of consumer debt/loans that are ruining your peace of mind.",
  "Someone stole your identity, and you are receiving fines meant for them.",
  "You are considering or already have a lawyer, but something still weighs on your heart."
];

export default function ParticuliersPage() {
  const { lang } = useLanguage();
  const situations = lang === "fr" ? SITUATIONS_FR : SITUATIONS_EN;

  const tx = {
    breadcrumb_home: lang === "fr" ? "Accueil" : "Home",
    breadcrumb_page: lang === "fr" ? "Particuliers" : "Individuals",
    hero_tag: lang === "fr" ? "Espace Conseil Juridique" : "Legal Advisory Desk",
    hero_title: lang === "fr" ? "Vous êtes un simple particulier" : "You Are an Individual",
    quote: lang === "fr"
      ? "« Peu importe votre origine ou votre nationalité ; General Esquire se fera l’honneur et la joie de vous accueillir pour vous écouter, vous renseigner et vous assister. »"
      : "“Regardless of your origin or nationality, General Esquire considers it an honor to welcome, advise, and assist you.”",
    situations_title: lang === "fr" ? "Est-ce que l'une des situations suivantes vous parle ?" : "Do Any of the Following Situations Apply to You?",
    situations_sub: lang === "fr" ? "Sachant que la liste n’est pas exhaustive :" : "Note that this list is not exhaustive:",
    highlight_title: lang === "fr" ? "Si oui, vous êtes au cœur de notre activité !" : "If so, you are at the core of our practice!",
    highlight_desc: lang === "fr"
      ? "Dans toutes les situations sus-évoquées ou qui s'en rapprochent, pour tout besoin d'assistance juridique ou administrative, et plus particulièrement toute rédaction précontentieuse ou contentieuse, General Esquire se tient à vos côtés."
      : "In all the aforementioned situations or similar matters, for any legal or administrative assistance—especially pre-litigation or litigation drafting—General Esquire stands by your side.",
    gallery_tag: lang === "fr" ? "Galerie & Ambiance" : "Gallery & Atmosphere",
    gallery_title: lang === "fr" ? "Un Accompagnement Humain & Dévoué" : "Dedicated & Compassionate Support",
    offers_tag: lang === "fr" ? "Accompagnement Sur Mesure" : "Tailored Guidance",
    offers_title: lang === "fr" ? "Nos Offres de Service" : "Our Service Offerings",
    step1_title: lang === "fr" ? "Rendez-vous Initial" : "Initial Consultation",
    step1_desc: lang === "fr"
      ? "Votre parcours commence par un entretien approfondi où vous nous exposez votre préoccupation et le résultat que vous souhaitez atteindre."
      : "Your journey begins with an in-depth consultation to discuss your situation and desired resolution.",
    step2_title: lang === "fr" ? "Dévouement & Moyens" : "Commitment & Expertise",
    step2_desc: lang === "fr"
      ? "Forts de plus de 20 années d'expérience, nous mettons toutes nos connaissances en œuvre pour obtenir le meilleur résultat possible."
      : "With over 20 years of experience, we deploy all our knowledge to achieve the best possible outcome for you.",
    step3_title: lang === "fr" ? "Services Gratuits & Inclus" : "Included & Complimentary Services",
    step3_desc: lang === "fr"
      ? "Photocopieur/scanner mis à disposition gratuitement. Traduction en français et anglais offerte pour vos documents juridiques."
      : "Complimentary scanner/copy access. Free French and English translation for your legal documents.",
    rates_tag: lang === "fr" ? "Clarté & Transparence" : "Clarity & Transparency",
    rates_title: lang === "fr" ? "Nos Tarifs" : "Our Rates",
    rate1_title: lang === "fr" ? "Consultation Initiale" : "Initial Consultation",
    rate1_price: "100 €",
    rate1_sub: lang === "fr" ? "Tarif fixe" : "Fixed Fee",
    rate1_desc: lang === "fr"
      ? "Des frais de consultation au tarif fixe de 100 € sont à prévoir, quelles que soient les modalités pratiques de déroulement de la consultation."
      : "A fixed consultation fee of €100 applies, regardless of whether it is conducted in person or remotely.",
    rate2_title: lang === "fr" ? "Traductions Spécifiques" : "Specialized Translations",
    rate2_price: "10 €",
    rate2_sub: lang === "fr" ? "/ page ou / minute" : "/ page or / minute",
    rate2_desc: lang === "fr"
      ? "Les traductions en chinois et russe sont facturées 10 € la page pour un document écrit, et 10 € la minute pour un fichier audiovisuel."
      : "Chinese and Russian translations are billed at €10 per page for documents and €10 per minute for audiovisual files.",
    note1: lang === "fr"
      ? "• Prestations sur mesure : Toutes les autres prestations sont facturées de gré à gré en fonction des enjeux et de vos revenus."
      : "• Tailored Services: All other legal work is quoted transparently based on complexity and financial capability.",
    note2: lang === "fr"
      ? "• Facilités : Des facilités de paiement peuvent être accordées. Aucun abonnement n’est imposé aux particuliers."
      : "• Flexible Payment: Payment installments are available. No subscription commitment required for individuals.",
    btn_appt: lang === "fr" ? "Prendre Rendez-vous →" : "Book an Appointment →",
  };

  return (
    <div className="min-h-screen bg-[#1a1c1a] text-[#EDE4CF] py-12 md:py-20 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Background */}
        <div className="absolute inset-0 -z-10 opacity-15 overflow-hidden pointer-events-none">
          <Image
            src="/images/background.jpeg"
            alt="Fond Filigrane"
            fill
            className="object-cover object-center filter brightness-75 contrast-125"
          />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-cinzel text-xs text-[#C5A059] mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#E9D18F] transition-colors">{tx.breadcrumb_home}</Link>
          <span>/</span>
          <span className="text-[#EDE4CF]">{tx.breadcrumb_page}</span>
        </div>

        {/* Hero Header with Custom Image */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/40 mb-12 shadow-2xl">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <Image
              src="/images/Avocate enceinte.jpg"
              alt="Espace Particuliers — General Esquire"
              fill
              priority
              className="object-cover object-center filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c1a] via-[#1a1c1a]/60 to-transparent"></div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-center sm:text-left">
            <span className="text-[#C5A059] text-xs font-cinzel tracking-widest uppercase bg-[#131513]/80 px-4 py-1 rounded-full border border-[#C5A059]/40 backdrop-blur-md">
              {tx.hero_tag}
            </span>
            <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold tracking-wider text-white mt-3 drop-shadow-md">
              {tx.hero_title}
            </h1>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="font-cormorant text-xl sm:text-2xl text-[#cabfa6] italic font-light">
            {tx.quote}
          </p>
        </div>

        {/* ===== SITUATIONS DE LA VIE COURANTE ===== */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F] mb-3">
              {tx.situations_title}
            </h2>
            <p className="font-cormorant text-base text-[#cabfa6]">
              {tx.situations_sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {situations.map((situation, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#131513]/90 border border-[#C5A059]/25 hover:border-[#C5A059] hover:bg-[#0F3823]/40 transition-all duration-300 flex items-start gap-4 shadow-md group"
              >
                <span className="text-[#C5A059] text-sm mt-0.5 group-hover:scale-125 transition-transform">◆</span>
                <p className="font-cormorant text-lg text-[#EDE4CF]/90 leading-snug">
                  {situation}
                </p>
              </div>
            ))}
          </div>

          {/* Highlight Box */}
          <div className="mt-10 p-8 rounded-2xl bg-gradient-to-r from-[#0F3823]/60 via-[#131513] to-[#0F3823]/60 border border-[#C5A059]/40 text-center shadow-xl">
            <h3 className="font-cinzel text-xl text-[#E9D18F] font-bold mb-3">
              {tx.highlight_title}
            </h3>
            <p className="font-cormorant text-lg text-[#EDE4CF] max-w-3xl mx-auto leading-relaxed">
              {tx.highlight_desc}
            </p>
          </div>
        </section>

        {/* ===== PHOTO GALLERY FOR PARTICULIERS ===== */}
        <section className="mb-20">
          <div className="text-center mb-8">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {tx.gallery_tag}
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl text-[#E9D18F]">
              {tx.gallery_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Image Particuliers5.jpg"
                alt="Accompagnement Particuliers"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Avocate enceinte3.jpg"
                alt="Ecoute et conseils"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg group">
              <Image
                src="/images/Image Particuliers9.jpg"
                alt="Protection des droits"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* ===== NOS OFFRES DE SERVICE ===== */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {tx.offers_tag}
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#E9D18F]">
              {tx.offers_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#0F3823] text-[#E9D18F] font-cinzel font-bold flex items-center justify-center mb-4 border border-[#C5A059]/30">
                  01
                </div>
                <h3 className="font-cinzel text-lg text-[#E9D18F] font-semibold mb-3">
                  {tx.step1_title}
                </h3>
                <p className="font-cormorant text-base text-[#cabfa6] leading-relaxed">
                  {tx.step1_desc}
                </p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#0F3823] text-[#E9D18F] font-cinzel font-bold flex items-center justify-center mb-4 border border-[#C5A059]/30">
                  02
                </div>
                <h3 className="font-cinzel text-lg text-[#E9D18F] font-semibold mb-3">
                  {tx.step2_title}
                </h3>
                <p className="font-cormorant text-base text-[#cabfa6] leading-relaxed">
                  {tx.step2_desc}
                </p>
              </div>
            </div>

            <div className="p-7 rounded-2xl bg-[#131513] border border-[#C5A059]/30 hover:border-[#C5A059] transition-all shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#0F3823] text-[#E9D18F] font-cinzel font-bold flex items-center justify-center mb-4 border border-[#C5A059]/30">
                  03
                </div>
                <h3 className="font-cinzel text-lg text-[#E9D18F] font-semibold mb-3">
                  {tx.step3_title}
                </h3>
                <p className="font-cormorant text-base text-[#cabfa6] leading-relaxed">
                  {tx.step3_desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== NOS TARIFS ===== */}
        <section className="mb-16 bg-[#131513] border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase block mb-2">
              {tx.rates_tag}
            </span>
            <h2 className="font-cinzel text-3xl md:text-4xl text-[#E9D18F]">
              {tx.rates_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/20">
              <h3 className="font-cinzel text-lg text-[#C5A059] font-bold mb-2">
                {tx.rate1_title}
              </h3>
              <p className="font-cinzel text-3xl text-white font-extrabold mb-3">
                {tx.rate1_price} <span className="text-xs font-normal text-[#cabfa6] font-cormorant">{tx.rate1_sub}</span>
              </p>
              <p className="font-cormorant text-base text-[#cabfa6]">
                {tx.rate1_desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1a1c1a] border border-[#C5A059]/20">
              <h3 className="font-cinzel text-lg text-[#C5A059] font-bold mb-2">
                {tx.rate2_title}
              </h3>
              <p className="font-cinzel text-2xl text-white font-bold mb-3">
                {tx.rate2_price} <span className="text-xs font-normal text-[#cabfa6] font-cormorant">{tx.rate2_sub}</span>
              </p>
              <p className="font-cormorant text-base text-[#cabfa6]">
                {tx.rate2_desc}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-[#0F3823]/30 border border-[#C5A059]/20 font-cormorant text-lg text-[#EDE4CF] space-y-2">
            <p>{tx.note1}</p>
            <p>{tx.note2}</p>
          </div>

          {/* CTA Button */}
          <div className="mt-10 text-center">
            <a
              href="mailto:contact@generalesquire.com"
              className="inline-block px-10 py-4 rounded-full font-cinzel text-xs tracking-widest font-semibold uppercase text-black bg-gradient-to-r from-[#C5A059] via-[#E9D18F] to-[#C5A059] hover:brightness-110 transition-all duration-300 shadow-[0_0_25px_rgba(197,160,89,0.4)] hover:scale-105"
            >
              {tx.btn_appt}
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
