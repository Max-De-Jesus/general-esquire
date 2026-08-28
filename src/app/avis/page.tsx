"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AvisGooglePage() {
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [showPaymentModal] = useState<boolean>(true);

  const priceFormatted = "69,56 €";

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] font-sans antialiased flex flex-col justify-between selection:bg-[#c2e7ff] selection:text-[#001d35]">
      {/* ─── GOOGLE TOP NAVIGATION BAR ─── */}
      <header className="w-full bg-white border-b border-[#dadce0] sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-[0_1px_3px_rgba(60,64,67,0.08)]">
        <div className="flex items-center gap-3">
          {/* Logo Officiel Google Vectoriel */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <svg className="w-20 sm:w-24 h-auto" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.86 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.62h9.45zm-8.98 21.01c0-7.81-5.21-13.44-11.84-13.44-6.72 0-12.35 5.63-12.35 13.44 0 7.72 5.63 13.44 12.35 13.44 6.63 0 11.84-5.71 11.84-13.44z"/>
              <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
              <path fill="#EA4335" d="M262.02 54.49l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.99 14.11l1.01 2.52-29.07 12.01c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.33-5.87zm-19.66-8.07l19.49-8.07c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.26 12.77z"/>
              <path fill="#4285F4" d="M35.29 41.41V32h33.58c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.04 9.66C17.32 69.35 0 53.79 0 34.68 0 15.56 17.32 0 37.15 0c10.92 0 18.73 4.28 24.61 9.83l-6.97 6.97c-4.2-3.95-9.91-7.06-17.64-7.06-14.36 0-25.54 11.68-25.54 26.04s11.17 26.04 25.54 26.04c9.32 0 14.62-3.7 18.06-7.14 2.77-2.77 4.62-6.72 5.38-12.27H35.29z"/>
            </svg>
            <span className="hidden sm:inline-block h-5 w-[1px] bg-[#dadce0]" />
            <span className="text-xs sm:text-sm font-medium text-[#5f6368] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1a73e8] inline-block animate-pulse" />
              Avis & Référencement Moteur de Recherche
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fce8e6] text-[#c5221f] border border-[#f5c6cb]">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Autorisation Requise
          </span>

          <Link
            href="/"
            className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:text-[#174ea6] hover:bg-[#f1f3f4] px-3 py-1.5 rounded-md transition-colors"
          >
            Retour au site
          </Link>
        </div>
      </header>

      {/* ─── CORPS DE PAGE BLANCHE PRINCIPALE (STYLE GOOGLE) ─── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center">
        {/* CARTE D'ALERTE PRINCIPALE GOOGLE */}
        <div className="w-full bg-white border border-[#dadce0] rounded-2xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(60,64,67,0.12)] text-left relative overflow-hidden">
          {/* Bandeau supérieur coloré style Google */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

          <div className="flex flex-col sm:flex-row items-start gap-5 mb-6 sm:mb-8">
            {/* Icône Google Info / Alerte Bleue */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0 shadow-sm border border-[#d2e3fc]">
              <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-1 rounded-md mb-2">
                Système d'Indexation & Référencement Google
              </div>

              {/* Phrase EXACTE demandée par l'utilisateur */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#202124] leading-tight tracking-tight">
                Oups, veuillez avoir l'autorisation de Google avant d'avoir accès à la référence d'avis et être sur les premiers sur le moteur de recherche
              </h1>
            </div>
          </div>

          <div className="bg-[#f8f9fa] border border-[#e8eaed] rounded-xl p-5 sm:p-6 mb-8">
            <h2 className="text-sm sm:text-base font-semibold text-[#202124] mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#34A853]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Processus d'éligibilité et de certification des avis
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368] leading-relaxed">
              Afin de garantir l'authenticité des témoignages clients et de positionner votre fiche dans les premiers résultats du moteur de recherche Google, une validation officielle d'autorisation et d'indexation est nécessaire.
            </p>
          </div>

          {/* SIMULATION VISUELLE DES ÉTOILES D'AVIS */}
          <div className="border border-[#dadce0] rounded-xl p-5 mb-8 bg-white">
            <p className="text-xs font-semibold text-[#5f6368] uppercase tracking-wider mb-2">
              Aperçu de la notation & étoiles sur Google Search
            </p>
            <div className="flex items-center gap-2">
              <div className="flex text-[#fbbc04]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-none"
                    aria-label={`${star} étoiles`}
                  >
                    <svg
                      className={`w-7 h-7 ${star <= selectedStars ? "fill-current" : "text-[#dadce0] fill-current"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="text-sm font-bold text-[#202124] ml-2">
                {selectedStars}.0 / 5.0
              </span>
              <span className="text-xs text-[#5f6368]">
                (Indexation certifiée Google Reviews)
              </span>
            </div>
          </div>

          {/* ─── PETITE FENÊTRE / ENCART DE PAIEMENT GOOGLE DEMANDÉ ─── */}
          {showPaymentModal && (
            <div className="w-full bg-[#f8fafd] border-2 border-[#1a73e8]/30 rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(26,115,232,0.12)] relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Autorisation & Certification de Référencement
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#202124]">
                    Frais d'accès & validation du référencement
                  </h3>

                  {/* PHRASE EXACTE DU PAIEMENT */}
                  <p className="text-base sm:text-lg text-[#3c4043] font-medium mt-1">
                    Le paiement s'évalue à <span className="text-[#1a73e8] font-bold text-xl sm:text-2xl">{priceFormatted}</span>
                  </p>

                  <ul className="mt-3 space-y-1.5 text-xs sm:text-sm text-[#5f6368]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#34a853] font-bold">✓</span> Activation de l'autorisation d'avis certifiés Google
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#34a853] font-bold">✓</span> Positionnement prioritaire sur les premiers résultats
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#34a853] font-bold">✓</span> Protection et visibilité maximale
                    </li>
                  </ul>
                </div>

                {/* ACTIONS GOOGLE */}
                <div className="flex flex-col gap-2.5 sm:min-w-[200px] justify-center">
                  <Link
                    href="/"
                    className="w-full inline-flex items-center justify-center py-3 px-5 rounded-xl text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557bf] active:bg-[#174ea6] shadow-[0_2px_6px_rgba(26,115,232,0.3)] transition-colors text-center"
                  >
                    Retourner à l'accueil
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ENCART TECHNIQUE & MENTION DÉVELOPPEUR */}
        <div className="w-full mt-6 bg-[#f1f3f4] border border-[#dadce0] rounded-xl p-4 text-xs text-[#3c4043] flex items-start gap-3 shadow-sm">
          <svg className="w-5 h-5 text-[#1a73e8] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="space-y-1">
            <p className="font-semibold text-[#202124]">
              Conditions d'activation de l'API & Compte Développeur :
            </p>
            <p className="text-[#5f6368] leading-relaxed">
              L'achat de l'API de référencement doit obligatoirement être effectué par un développeur. Cette clé d'authentification est à usage unique (utilisable une seule fois) et seul un compte développeur Gravity agréé peut procéder au paiement.
            </p>
          </div>
        </div>

        {/* MENTIONS DE BAS DE PAGE STYLE GOOGLE SUPPORT */}
        <div className="w-full mt-4 text-center text-xs text-[#5f6368] space-y-1">
          <p>Service de référencement & gestion d'avis — Intégration conforme aux normes de visibilité web.</p>
          <p>© {new Date().getFullYear()} Google LLC / Service Partenaire. Tous droits réservés.</p>
        </div>
      </main>

      {/* ─── GOOGLE MINIMAL FOOTER ─── */}
      <footer className="w-full bg-[#f2f2f2] border-t border-[#dadce0] px-4 sm:px-8 py-4 text-xs text-[#5f6368] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-semibold text-[#3c4043]">France</span>
            <span className="text-[#dadce0]">|</span>
            <span>Console API Développeur</span>
          </div>
          <span className="text-[11px] text-[#5f6368] bg-[#e8eaed] px-2.5 py-0.5 rounded-full border border-[#dadce0]">
            Accès réservé : Compte développeur Gravity (Clé à usage unique)
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/conseil-juridique" className="hover:underline">Conseil juridique</Link>
          <Link href="/cocooning-touristique" className="hover:underline">Cocooning touristique</Link>
        </div>
      </footer>
    </div>
  );
}
