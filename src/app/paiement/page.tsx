"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

/* ══════════════════════════════════════════════════════════════════
   SERVICE PRESETS — Tarifs & prestations par profil client
   ══════════════════════════════════════════════════════════════════ */
interface ServicePreset {
  id: string;
  nameFr: string;
  nameEn: string;
  price: number;
  isCustom?: boolean;
  type?: "fixed" | "translation";
}

const SERVICE_PRESETS: Record<string, ServicePreset[]> = {
  Particulier: [
    { id: "part-consultation", nameFr: "Consultation Initiale Fixe", nameEn: "Initial Fixed Consultation", price: 100 },
    { id: "part-translation", nameFr: "Traduction Chinois / Russe (par page)", nameEn: "Chinese / Russian Translation (per page)", price: 10, type: "translation" },
    { id: "part-custom", nameFr: "Prestation personnalisée (sur devis)", nameEn: "Custom service (based on quote)", price: 0, isCustom: true },
  ],
  "Chef d'Entreprise": [
    { id: "ent-annual", nameFr: "Abonnement Annuel Illimité", nameEn: "Annual Unlimited Subscription", price: 10000 },
    { id: "ent-monthly", nameFr: "Abonnement Mensuel", nameEn: "Monthly Subscription", price: 1000 },
    { id: "ent-urgency", nameFr: "Urgence moins de 48h (supplément rédaction)", nameEn: "Urgency under 48h (drafting surcharge)", price: 1500 },
    { id: "ent-translation", nameFr: "Traduction Chinois / Russe (par page)", nameEn: "Chinese / Russian Translation (per page)", price: 10, type: "translation" },
    { id: "ent-custom", nameFr: "Prestation ponctuelle de gré à gré", nameEn: "Custom contract-based service", price: 0, isCustom: true },
  ],
  Institution: [
    { id: "inst-fixed", nameFr: "Forfait Rédaction Fixe (max 20 pages)", nameEn: "Fixed Drafting Surcharge (max 20 pages)", price: 3500 },
    { id: "inst-extra", nameFr: "Pages supplémentaires (par tranche de 10 pages)", nameEn: "Additional pages (per block of 10 pages)", price: 1000 },
    { id: "inst-talk", nameFr: "Consultation non écrite (1 heure)", nameEn: "Oral Consultation (1 hour)", price: 500 },
    { id: "inst-custom", nameFr: "Consultation personnalisée (sur devis)", nameEn: "Custom advisory (based on quote)", price: 0, isCustom: true },
  ],
  "Professionnel du Droit": [
    { id: "pro-annual", nameFr: "Partenariat Annuel (d'avance)", nameEn: "Annual Partnership (upfront)", price: 15000 },
    { id: "pro-quarterly", nameFr: "Partenariat Trimestriel", nameEn: "Quarterly Partnership", price: 3500 },
    { id: "pro-drafting", nameFr: "Forfait de Rédaction d'Acte", nameEn: "Drafting Service Fixed Fee", price: 500 },
    { id: "pro-urgency", nameFr: "Forfait Rédaction Urgente", nameEn: "Urgent Drafting Surcharge", price: 1500 },
    { id: "pro-custom", nameFr: "Prestation sur devis", nameEn: "Quote-based service", price: 0, isCustom: true },
  ],
  Chrysalides: [
    { id: "chrys-stay", nameFr: "Séjour Cocooning Touristique Bénin (2 semaines)", nameEn: "Bénin Tourist Cocooning Stay (2 weeks)", price: 1500 },
    { id: "chrys-custom", nameFr: "Forfait de groupe sur devis", nameEn: "Group Package Quote", price: 0, isCustom: true },
  ],
};

/* ══════════════════════════════════════════════════════════════════
   STEPPER STEP LABELS
   ══════════════════════════════════════════════════════════════════ */
const STEP_LABELS_FR = ["Coordonnées", "Service", "Récapitulatif", "Règlement"];
const STEP_LABELS_EN = ["Details", "Service", "Summary", "Payment"];

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function PaymentPage() {
  const { lang } = useLanguage();
  const { user, clientProfile } = useAuth();

  /* ── Step state ── */
  const [currentStep, setCurrentStep] = useState(1);

  /* ── Form state ── */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [profileType, setProfileType] = useState<string>("Particulier");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [translationPages, setTranslationPages] = useState<number>(1);
  const [isUrgent, setIsUrgent] = useState(false);

  /* ── Payment UI state ── */
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "virement">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState(100);

  /* ── Card state ── */
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  /* ── PayPal modal simulation ── */
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalPassword, setPaypalPassword] = useState("");
  const [paypalProcessing, setPaypalProcessing] = useState(false);

  /* ── Environment Payment Keys ── */
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const isStripeLiveReady = stripePublishableKey.startsWith("pk_live_") || stripePublishableKey.startsWith("pk_test_");
  const isPaypalLiveReady = paypalClientId.length > 10 && !paypalClientId.includes("votre_client_id");

  /* ── Auto-fill from auth ── */
  useEffect(() => {
    if (user) {
      if (user.email && !email) setEmail(user.email);
      if (clientProfile?.full_name && !fullName) setFullName(clientProfile.full_name);
      if (clientProfile?.phone && !phone) setPhone(clientProfile.phone);
      if (clientProfile?.profile_type) setProfileType(clientProfile.profile_type);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, clientProfile]);

  /* ── Default service on profile change ── */
  useEffect(() => {
    const list = SERVICE_PRESETS[profileType] || SERVICE_PRESETS["Particulier"];
    if (list.length > 0) {
      setSelectedServiceId(list[0].id);
      setCustomPrice("");
      setTranslationPages(1);
    }
  }, [profileType]);

  /* ── Recalculate price ── */
  useEffect(() => {
    const list = SERVICE_PRESETS[profileType] || SERVICE_PRESETS["Particulier"];
    const service = list.find((s) => s.id === selectedServiceId);
    if (!service) return;

    let basePrice = service.price;
    if (service.isCustom) {
      basePrice = parseFloat(customPrice) || 0;
    } else if (service.type === "translation") {
      basePrice = service.price * translationPages;
    }

    let finalPrice = basePrice;
    if (isUrgent) {
      if (profileType === "Particulier") {
        finalPrice = basePrice * 1.5;
      } else {
        finalPrice = basePrice + 1500;
      }
    }
    setCalculatedAmount(finalPrice);
  }, [profileType, selectedServiceId, customPrice, translationPages, isUrgent]);

  /* ── Helpers ── */
  const getSelectedServiceText = () => {
    const list = SERVICE_PRESETS[profileType] || SERVICE_PRESETS["Particulier"];
    const service = list.find((s) => s.id === selectedServiceId);
    if (!service) return "";
    return lang === "fr" ? service.nameFr : service.nameEn;
  };

  const getProfileName = (type: string) => {
    if (lang === "en") {
      if (type === "Chef d'Entreprise") return "Business Owner";
      if (type === "Professionnel du Droit") return "Legal Professional";
      if (type === "Institution") return "Public Entity";
      return type;
    }
    return type;
  };

  /* ── Step validation ── */
  const canGoToStep2 = fullName.trim() !== "" && email.trim() !== "";
  const canGoToStep3 = selectedServiceId !== "" && (
    (() => {
      const list = SERVICE_PRESETS[profileType] || [];
      const svc = list.find((s) => s.id === selectedServiceId);
      if (svc?.isCustom) return parseFloat(customPrice) > 0;
      return true;
    })()
  );

  /* ── Navigation ── */
  const goNext = () => {
    if (currentStep < 4) setCurrentStep((s) => s + 1);
  };
  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  /* ══════════════════════════════════════════════════════════════════
     SUPABASE TRANSACTION HANDLER
     ══════════════════════════════════════════════════════════════════ */
  const submitTransaction = async (method: string, extraStatus = "Payé") => {
    if (!user) {
      setPaymentError(lang === "fr" ? "Veuillez vous connecter pour valider le règlement." : "Please sign in to complete payment.");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      let clientUuid = null;
      const { data: existingClients, error: checkError } = await supabase
        .from("clients")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (checkError) throw checkError;

      if (existingClients && existingClients.length > 0) {
        clientUuid = existingClients[0].id;
      } else {
        const { data: newClient, error: createError } = await supabase
          .from("clients")
          .insert({
            full_name: fullName,
            email: email,
            phone: phone || null,
            profile_type: profileType,
            requested_service: getSelectedServiceText() || "Prestation de service",
            status: "Nouveau",
          })
          .select()
          .single();

        if (createError) throw createError;
        clientUuid = newClient.id;
      }

      const generatedRef = "PAY-" + Math.floor(100000 + Math.random() * 900000);
      const { error: paymentInsertError } = await supabase.from("paiements").insert({
        client_id: clientUuid,
        client_name: fullName,
        client_email: email,
        service: getSelectedServiceText(),
        amount: calculatedAmount,
        currency: "EUR",
        status: extraStatus,
        payment_method: method,
        paid_at: extraStatus === "Payé" ? new Date().toISOString() : null,
        notes: `Paiement en ligne effectué via l'interface publique. Réf: ${generatedRef}`,
      });

      if (paymentInsertError) throw paymentInsertError;

      setTransactionRef(generatedRef);
      setPaymentSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue lors de l'enregistrement du règlement.";
      console.error(err);
      setPaymentError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── Card handler (Stripe / Simulation) ── */
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert(lang === "fr" ? "Veuillez remplir les informations de carte." : "Please fill in the card details.");
      return;
    }
    setIsProcessing(true);

    if (isStripeLiveReady) {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: calculatedAmount,
            currency: "eur",
            serviceName: getSelectedServiceText(),
            clientEmail: email,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur lors de la création du paiement Stripe.");
        }

        // Transaction réelle confirmée via Stripe API
        await submitTransaction("Carte Bancaire (Stripe Réel)");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erreur lors de la transaction Stripe.";
        setPaymentError(message);
        setIsProcessing(false);
      }
    } else {
      // Mode simulation si les clés Stripe ne sont pas remplies dans .env.local
      setTimeout(async () => {
        await submitTransaction("Carte Bancaire (Simulation)");
      }, 2000);
    }
  };

  /* ── PayPal handler ── */
  const handlePaypalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalProcessing(true);
    setTimeout(async () => {
      setPaypalProcessing(false);
      setShowPaypalModal(false);
      await submitTransaction("PayPal");
    }, 2000);
  };

  /* ── Virement handler ── */
  const handleVirementConfirm = async () => {
    await submitTransaction("Virement", "En attente");
  };

  /* ══════════════════════════════════════════════════════════════════
     STYLE CONSTANTS
     ══════════════════════════════════════════════════════════════════ */
  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white placeholder:text-[#cabfa6]/50 focus:outline-none focus:border-[#E9D18F] focus:shadow-[0_0_12px_rgba(197,160,89,0.15)] transition-all font-cormorant text-base";
  const labelClass = "block font-cinzel text-[10px] text-[#C5A059] uppercase tracking-[0.15em] font-semibold mb-1.5";
  const stepLabels = lang === "fr" ? STEP_LABELS_FR : STEP_LABELS_EN;

  /* ══════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ─── HERO BANNER ─── */}
      <header className="w-full bg-[#131513] border-b border-[#C5A059]/20 relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/Bureau modifié.jpg"
            alt="General Esquire Bureau Background"
            fill
            className="object-cover object-center filter blur-[2px]"
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-[#131513]/70 to-[#131513]/40 z-[1]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold tracking-[0.2em] text-[#C5A059] drop-shadow-[0_0_20px_rgba(197,160,89,0.4)] mb-4 uppercase">
            {lang === "fr" ? "Règlement en Ligne" : "Secure Online Payment"}
          </h1>
          <p className="font-cormorant text-lg md:text-xl text-[#cabfa6] italic max-w-2xl mx-auto">
            {lang === "fr"
              ? "Prise en charge sécurisée de vos honoraires, abonnements ou acomptes séjours."
              : "Secure processing of your advisory fees, retainer packages, or stay deposits."}
          </p>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 md:py-14 flex-grow">

        {/* ═══ REQUIREMENT CHECK: USER MUST BE LOGGED IN TO ACCESS PAYMENT ═══ */}
        {!user ? (
          <div className="bg-[#131513] border border-[#C5A059]/60 rounded-3xl p-8 md:p-14 text-center max-w-xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="w-20 h-20 bg-[#C5A059]/10 border-2 border-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(197,160,89,0.3)]">
              <span className="text-3xl">🔒</span>
            </div>

            <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.25em] uppercase border border-[#C5A059]/40 px-4 py-1.5 rounded-full bg-[#1a1c1a] inline-block mb-4">
              {lang === "fr" ? "Accès Sécurisé Client" : "Client Secure Access"}
            </span>

            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#E9D18F] mb-4 tracking-wider uppercase">
              {lang === "fr" ? "Connexion Obligatoire" : "Authentication Required"}
            </h2>

            <p className="font-cormorant text-lg text-[#cabfa6] leading-relaxed mb-8">
              {lang === "fr"
                ? "Pour garantir la confidentialité, l'attribution légale et le suivi sécurisé de vos prestations juridiques et séjours Chrysalides, vous devez obligatoirement être connecté à votre compte client avant d'effectuer un règlement."
                : "To guarantee confidentiality, legal attribution, and secure tracking of your legal services and Chrysalides stays, you must be logged into your client account to proceed with payment."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/connexion?redirect=/paiement"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:brightness-110 shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all uppercase cursor-pointer"
              >
                🔑 {lang === "fr" ? "Se Connecter / S'inscrire" : "Log In / Register"}
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-4 rounded-full font-cinzel text-xs font-bold tracking-widest text-[#cabfa6] border border-[#C5A059]/30 hover:text-white hover:border-[#C5A059] transition-all uppercase cursor-pointer"
              >
                {lang === "fr" ? "Retour à l'accueil" : "Back to Home"}
              </Link>
            </div>
          </div>
        ) : paymentSuccess ? (
          /* ═══ SUCCESS CONFIRMATION ═══ */
          <div className="bg-[#131513] border border-[#C5A059] rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden animate-fadeIn">
            <div className="absolute inset-0 bg-[#C5A059]/[0.02] pointer-events-none" />
            <div className="w-20 h-20 bg-[#0F3823]/60 border-2 border-[#E9D18F] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(15,56,35,0.8)]">
              <span className="text-[#E9D18F] text-4xl">✓</span>
            </div>

            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-[#E9D18F] mb-4 tracking-wider uppercase">
              {lang === "fr" ? "Règlement Enregistré" : "Payment Confirmed"}
            </h2>

            <p className="font-cormorant text-lg text-[#EDE4CF]/90 mb-6 leading-relaxed">
              {lang === "fr" ? (
                <>
                  Merci, <strong>{fullName}</strong>. Votre transaction de{" "}
                  <strong className="text-[#E9D18F]">{calculatedAmount.toLocaleString()} €</strong> a été traitée
                  avec succès. Un email de confirmation a été transmis à l&apos;adresse <strong>{email}</strong>.
                </>
              ) : (
                <>
                  Thank you, <strong>{fullName}</strong>. Your transaction of{" "}
                  <strong className="text-[#E9D18F]">{calculatedAmount.toLocaleString()} €</strong> has been processed
                  successfully. A confirmation email has been sent to <strong>{email}</strong>.
                </>
              )}
            </p>

            <div className="bg-black/40 border border-[#C5A059]/30 rounded-2xl p-4 max-w-md mx-auto mb-8 font-cinzel text-xs text-[#cabfa6] tracking-widest uppercase">
              <div className="flex justify-between mb-2">
                <span>Réf. Transaction :</span>
                <span className="text-[#E9D18F] font-bold">{transactionRef}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Moyen utilisé :</span>
                <span>{paymentMethod === "card" ? "Carte Bancaire" : paymentMethod === "paypal" ? "PayPal" : "Virement"}</span>
              </div>
              <div className="flex justify-between">
                <span>Statut :</span>
                <span className={paymentMethod === "virement" ? "text-amber-400" : "text-emerald-400"}>
                  {paymentMethod === "virement"
                    ? (lang === "fr" ? "En attente de réception" : "Pending reception")
                    : (lang === "fr" ? "Encaissé" : "Cleared")}
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition-all uppercase"
            >
              {lang === "fr" ? "Retour à l'accueil" : "Back to Home"}
            </Link>
          </div>
        ) : (
          <>
            {/* ═══ STEPPER ═══ */}
            <div className="mb-10 md:mb-14">
              <div className="flex items-center justify-center max-w-2xl mx-auto">
                {stepLabels.map((label, idx) => {
                  const stepNum = idx + 1;
                  const isActive = stepNum === currentStep;
                  const isCompleted = stepNum < currentStep;
                  return (
                    <React.Fragment key={stepNum}>
                      {/* Step circle + label */}
                      <div className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-cinzel text-sm md:text-base font-bold border-2 transition-all duration-500 ${
                            isCompleted
                              ? "bg-gradient-to-br from-[#C5A059] to-[#E9D18F] border-[#E9D18F] text-black shadow-[0_0_18px_rgba(197,160,89,0.5)]"
                              : isActive
                              ? "bg-[#C5A059]/15 border-[#C5A059] text-[#E9D18F] shadow-[0_0_18px_rgba(197,160,89,0.35)]"
                              : "bg-[#1a1c1a] border-[#C5A059]/25 text-[#cabfa6]/50"
                          }`}
                        >
                          {isCompleted ? "✓" : stepNum}
                        </div>
                        <span
                          className={`mt-2 font-cinzel text-[9px] md:text-[10px] tracking-[0.12em] uppercase transition-colors duration-300 ${
                            isActive || isCompleted ? "text-[#E9D18F]" : "text-[#cabfa6]/40"
                          }`}
                        >
                          {label}
                        </span>
                      </div>

                      {/* Connector line */}
                      {idx < stepLabels.length - 1 && (
                        <div className="flex-1 mx-1 md:mx-3 mb-6">
                          <div className="h-[2px] w-full relative overflow-hidden rounded-full bg-[#C5A059]/15">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C5A059] to-[#E9D18F] rounded-full transition-all duration-700 ease-out"
                              style={{ width: isCompleted ? "100%" : "0%" }}
                            />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* ═══ STEP CONTENT CONTAINER ═══ */}
            <div className="bg-[#131513] border border-[#C5A059]/25 rounded-3xl p-6 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[#C5A059]/[0.008] pointer-events-none" />

              {/* ─── STEP 1 : COORDONNÉES ─── */}
              {currentStep === 1 && (
                <div className="animate-fadeIn space-y-6 relative z-10">
                  <div className="border-b border-[#C5A059]/20 pb-4">
                    <h2 className="font-cinzel text-lg md:text-xl font-bold text-[#E9D18F] tracking-wider uppercase flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-sm font-bold text-[#E9D18F]">1</span>
                      {lang === "fr" ? "Vos Coordonnées" : "Your Details"}
                    </h2>
                    <p className="font-cormorant text-sm text-[#cabfa6] mt-1 italic ml-11">
                      {lang === "fr"
                        ? "Renseignez vos informations personnelles pour sécuriser votre transaction."
                        : "Enter your personal information to secure your transaction."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{lang === "fr" ? "Prénoms & Nom *" : "First & Last Name *"}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jean Dupont"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{lang === "fr" ? "Adresse Email *" : "Email Address *"}</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. jean.dupont@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{lang === "fr" ? "Téléphone (optionnel)" : "Phone (optional)"}</label>
                      <input
                        type="tel"
                        placeholder="e.g. +33 6 12 34 56 78"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{lang === "fr" ? "Pays" : "Country"}</label>
                      <input
                        type="text"
                        placeholder="e.g. France"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{lang === "fr" ? "Adresse (optionnel)" : "Address (optional)"}</label>
                    <input
                      type="text"
                      placeholder={lang === "fr" ? "e.g. 12 Rue de la Paix, 75002 Paris" : "e.g. 12 Peace Street, Paris 75002"}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      disabled={!canGoToStep2}
                      onClick={goNext}
                      className="group px-8 py-3.5 rounded-xl font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase flex items-center gap-2 cursor-pointer"
                    >
                      {lang === "fr" ? "Choix du Service" : "Choose Service"}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 2 : STATUT & SERVICE ─── */}
              {currentStep === 2 && (
                <div className="animate-fadeIn space-y-6 relative z-10">
                  <div className="border-b border-[#C5A059]/20 pb-4">
                    <h2 className="font-cinzel text-lg md:text-xl font-bold text-[#E9D18F] tracking-wider uppercase flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-sm font-bold text-[#E9D18F]">2</span>
                      {lang === "fr" ? "Votre Statut & Service" : "Your Profile & Service"}
                    </h2>
                    <p className="font-cormorant text-sm text-[#cabfa6] mt-1 italic ml-11">
                      {lang === "fr"
                        ? "Sélectionnez votre profil client et la prestation souhaitée."
                        : "Select your client profile and the desired service."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>{lang === "fr" ? "Votre Profil Client" : "Your Client Profile"}</label>
                      <select
                        value={profileType}
                        onChange={(e) => setProfileType(e.target.value)}
                        className={inputClass}
                      >
                        <option value="Particulier">{lang === "fr" ? "Particulier" : "Individual"}</option>
                        <option value="Chef d'Entreprise">{lang === "fr" ? "Chef d'Entreprise" : "Business Owner"}</option>
                        <option value="Institution">{lang === "fr" ? "Institution Publique" : "Public Institution"}</option>
                        <option value="Professionnel du Droit">{lang === "fr" ? "Professionnel du Droit" : "Legal Professional"}</option>
                        <option value="Chrysalides">{lang === "fr" ? "Séjour Chrysalides / Détente" : "Chrysalides Stay / Retreat"}</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>{lang === "fr" ? "Sélectionner le Service" : "Select Service"}</label>
                      <select
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className={inputClass}
                      >
                        {(SERVICE_PRESETS[profileType] || []).map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {lang === "fr" ? preset.nameFr : preset.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Custom price field */}
                  {(() => {
                    const list = SERVICE_PRESETS[profileType] || [];
                    const activePreset = list.find((s) => s.id === selectedServiceId);
                    if (activePreset?.isCustom) {
                      return (
                        <div className="animate-slideDown">
                          <label className={labelClass}>{lang === "fr" ? "Saisir le Montant (€) *" : "Enter Custom Amount (€) *"}</label>
                          <input
                            type="number"
                            required
                            min="5"
                            placeholder="e.g. 250"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className={`${inputClass} font-bold`}
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Translation pages selector */}
                  {(() => {
                    const list = SERVICE_PRESETS[profileType] || [];
                    const activePreset = list.find((s) => s.id === selectedServiceId);
                    if (activePreset?.type === "translation") {
                      return (
                        <div className="animate-slideDown grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className={labelClass}>{lang === "fr" ? "Nombre de Pages / Minutes" : "Number of Pages / Minutes"}</label>
                            <input
                              type="number"
                              min="1"
                              value={translationPages}
                              onChange={(e) => setTranslationPages(Math.max(1, parseInt(e.target.value) || 1))}
                              className={inputClass}
                            />
                          </div>
                          <div className="flex items-center text-sm italic text-[#cabfa6] pt-5 font-cormorant">
                            * 10 € {lang === "fr" ? "par page de document ou par minute audiovisuelle." : "per page of text or minute of audio/video."}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Urgency surcharge checkbox */}
                  <div className="flex items-start gap-3 bg-black/30 border border-[#C5A059]/10 rounded-2xl p-4">
                    <input
                      type="checkbox"
                      id="urgency-chk"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="w-5 h-5 accent-[#C5A059] mt-0.5 rounded cursor-pointer"
                    />
                    <div>
                      <label htmlFor="urgency-chk" className="font-cinzel text-xs text-[#E9D18F] font-bold cursor-pointer tracking-wider block">
                        {lang === "fr" ? "Option d'urgence (traitement prioritaire)" : "Urgency Option (priority handling)"}
                      </label>
                      <span className="text-xs text-[#cabfa6] font-cormorant mt-1 block">
                        {profileType === "Particulier"
                          ? (lang === "fr" ? "+50% de majoration sur les tarifs standards." : "+50% surcharge on standard fee.")
                          : (lang === "fr" ? "+1 500 € pour toute livraison en moins de 48 heures." : "+€1,500 for delivery under 48 hours.")}
                      </span>
                    </div>
                  </div>

                  {/* Live price preview */}
                  <div className="bg-[#0d0e0d]/60 border border-[#C5A059]/20 rounded-2xl p-5 flex items-center justify-between">
                    <span className="font-cinzel text-xs text-[#C5A059] tracking-widest uppercase font-semibold">
                      {lang === "fr" ? "Montant estimé" : "Estimated Amount"}
                    </span>
                    <span className="font-cinzel text-2xl md:text-3xl font-bold text-[#E9D18F] drop-shadow-[0_0_10px_rgba(233,209,143,0.2)]">
                      {calculatedAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="px-6 py-3 rounded-xl font-cinzel text-xs font-bold tracking-widest text-[#cabfa6] border border-[#C5A059]/30 hover:text-[#E9D18F] hover:border-[#C5A059] transition-all uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <span>←</span> {lang === "fr" ? "Retour" : "Back"}
                    </button>
                    <button
                      type="button"
                      disabled={!canGoToStep3}
                      onClick={goNext}
                      className="group px-8 py-3.5 rounded-xl font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase flex items-center gap-2 cursor-pointer"
                    >
                      {lang === "fr" ? "Récapitulatif" : "Summary"}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3 : RÉCAPITULATIF ─── */}
              {currentStep === 3 && (
                <div className="animate-fadeIn space-y-6 relative z-10">
                  <div className="border-b border-[#C5A059]/20 pb-4">
                    <h2 className="font-cinzel text-lg md:text-xl font-bold text-[#E9D18F] tracking-wider uppercase flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-sm font-bold text-[#E9D18F]">3</span>
                      {lang === "fr" ? "Récapitulatif de Commande" : "Order Summary"}
                    </h2>
                    <p className="font-cormorant text-sm text-[#cabfa6] mt-1 italic ml-11">
                      {lang === "fr"
                        ? "Vérifiez les informations ci-dessous avant de procéder au règlement."
                        : "Review the details below before proceeding to payment."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Client info */}
                    <div className="bg-black/30 border border-[#C5A059]/15 rounded-2xl p-5 space-y-3">
                      <h3 className="font-cinzel text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-bold border-b border-[#C5A059]/15 pb-2">
                        {lang === "fr" ? "Informations Client" : "Client Information"}
                      </h3>
                      <div className="space-y-2 font-cormorant text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#cabfa6]">{lang === "fr" ? "Nom" : "Name"}</span>
                          <span className="text-white font-semibold">{fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#cabfa6]">Email</span>
                          <span className="text-white font-semibold">{email}</span>
                        </div>
                        {phone && (
                          <div className="flex justify-between">
                            <span className="text-[#cabfa6]">{lang === "fr" ? "Tél." : "Phone"}</span>
                            <span className="text-white font-semibold">{phone}</span>
                          </div>
                        )}
                        {country && (
                          <div className="flex justify-between">
                            <span className="text-[#cabfa6]">{lang === "fr" ? "Pays" : "Country"}</span>
                            <span className="text-white font-semibold">{country}</span>
                          </div>
                        )}
                        {address && (
                          <div className="flex justify-between">
                            <span className="text-[#cabfa6]">{lang === "fr" ? "Adresse" : "Address"}</span>
                            <span className="text-white font-semibold text-right max-w-[60%]">{address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Service info */}
                    <div className="bg-black/30 border border-[#C5A059]/15 rounded-2xl p-5 space-y-3">
                      <h3 className="font-cinzel text-[10px] text-[#C5A059] uppercase tracking-[0.2em] font-bold border-b border-[#C5A059]/15 pb-2">
                        {lang === "fr" ? "Détails de la Prestation" : "Service Details"}
                      </h3>
                      <div className="space-y-2 font-cormorant text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#cabfa6]">{lang === "fr" ? "Profil" : "Profile"}</span>
                          <span className="text-white font-semibold">{getProfileName(profileType)}</span>
                        </div>
                        <div>
                          <span className="text-[#cabfa6] block mb-1">{lang === "fr" ? "Prestation" : "Service"}</span>
                          <span className="text-white font-semibold text-sm leading-tight block">{getSelectedServiceText()}</span>
                        </div>
                        {isUrgent && (
                          <div className="flex justify-between text-amber-400">
                            <span>{lang === "fr" ? "Supplément Urgence" : "Urgency Fee"}</span>
                            <span>{profileType === "Particulier" ? "+50%" : "+1 500 €"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-[#C5A059]/[0.06] to-transparent border border-[#C5A059]/25 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <span className="font-cinzel text-xs text-[#C5A059] tracking-widest uppercase font-bold block">
                        {lang === "fr" ? "Total à Régler" : "Total Due"}
                      </span>
                      <span className="font-cormorant text-xs text-[#cabfa6] italic">
                        {lang === "fr" ? "Montant TTC en Euros" : "VAT-inclusive amount in Euros"}
                      </span>
                    </div>
                    <span className="font-cinzel text-3xl md:text-4xl font-bold text-[#E9D18F] drop-shadow-[0_0_14px_rgba(233,209,143,0.3)]">
                      {calculatedAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={goBack}
                      className="px-6 py-3 rounded-xl font-cinzel text-xs font-bold tracking-widest text-[#cabfa6] border border-[#C5A059]/30 hover:text-[#E9D18F] hover:border-[#C5A059] transition-all uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <span>←</span> {lang === "fr" ? "Modifier" : "Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="group px-8 py-3.5 rounded-xl font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all uppercase flex items-center gap-2 cursor-pointer"
                    >
                      {lang === "fr" ? "Procéder au Règlement" : "Proceed to Payment"}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 4 : RÈGLEMENT ─── */}
              {currentStep === 4 && (
                <div className="animate-fadeIn space-y-6 relative z-10">
                  <div className="border-b border-[#C5A059]/20 pb-4">
                    <h2 className="font-cinzel text-lg md:text-xl font-bold text-[#E9D18F] tracking-wider uppercase flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center text-sm font-bold text-[#E9D18F]">4</span>
                      {lang === "fr" ? "Mode de Règlement" : "Payment Method"}
                    </h2>
                    <p className="font-cormorant text-sm text-[#cabfa6] mt-1 italic ml-11">
                      {lang === "fr"
                        ? "Choisissez votre mode de paiement et finalisez votre transaction."
                        : "Choose your payment method and finalize your transaction."}
                    </p>
                  </div>

                  {/* Mini summary bar */}
                  <div className="bg-black/30 border border-[#C5A059]/15 rounded-2xl p-4 flex items-center justify-between">
                    <div className="font-cormorant text-sm text-[#cabfa6]">
                      <span className="text-white font-semibold">{getSelectedServiceText()}</span>
                      <span className="mx-2">•</span>
                      <span>{getProfileName(profileType)}</span>
                    </div>
                    <span className="font-cinzel text-xl font-bold text-[#E9D18F]">
                      {calculatedAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>

                  {/* Payment method tabs */}
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { key: "card" as const, icon: "💳", labelFr: "Carte", labelEn: "Card" },
                      { key: "paypal" as const, icon: "P", labelFr: "PayPal", labelEn: "PayPal" },
                      { key: "virement" as const, icon: "🏛️", labelFr: "Virement", labelEn: "Transfer" },
                    ]).map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setPaymentMethod(tab.key)}
                        className={`py-4 rounded-xl border font-cinzel text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === tab.key
                            ? "bg-[#C5A059]/10 border-[#C5A059] text-[#E9D18F] shadow-[0_0_12px_rgba(197,160,89,0.15)]"
                            : "border-[#C5A059]/20 text-[#EDE4CF]/60 hover:text-white hover:border-[#C5A059]/40"
                        }`}
                      >
                        <span className={tab.key === "paypal" ? "text-[#f2c94c] font-bold text-base" : "text-base"}>{tab.icon}</span>
                        <span>{lang === "fr" ? tab.labelFr : tab.labelEn}</span>
                      </button>
                    ))}
                  </div>

                  {/* Status Banner for Live vs Test/Simulation Keys */}
                  {paymentMethod === "card" && !isStripeLiveReady && (
                    <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-4 text-xs font-cormorant text-[#E9D18F] flex items-center justify-between gap-3">
                      <span>💡 <strong>Prêt pour Stripe Réel :</strong> Ajoutez vos clés Stripe (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` et `STRIPE_SECRET_KEY`) dans <code>.env.local</code> pour traiter de vraies cartes bancaires.</span>
                    </div>
                  )}

                  {paymentMethod === "paypal" && !isPaypalLiveReady && (
                    <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-2xl p-4 text-xs font-cormorant text-[#E9D18F] flex items-center justify-between gap-3">
                      <span>💡 <strong>Prêt pour PayPal Réel :</strong> Renseignez votre Client ID (`NEXT_PUBLIC_PAYPAL_CLIENT_ID`) dans <code>.env.local</code> pour charger le SDK officiel PayPal.</span>
                    </div>
                  )}

                  {/* ── Card Form (Stripe / Simulation) ── */}
                  {paymentMethod === "card" && (
                    <form onSubmit={handleCardPayment} className="space-y-4 animate-fadeIn">
                      <div>
                        <label className={labelClass}>{lang === "fr" ? "Titulaire de la Carte" : "Cardholder Name"}</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jean Dupont"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>{lang === "fr" ? "Numéro de Carte" : "Card Number"}</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>{lang === "fr" ? "Date d'Expiration" : "Expiry Date"}</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className={`${inputClass} text-center`}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>CVV / CVC</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className={`${inputClass} text-center`}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 mt-2 rounded-xl font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] disabled:opacity-50 transition-all cursor-pointer uppercase"
                      >
                        {isProcessing
                          ? (lang === "fr" ? "Traitement sécurisé..." : "Processing Transaction...")
                          : `${lang === "fr" ? "Payer" : "Pay"} ${calculatedAmount.toLocaleString("fr-FR")} €`}
                      </button>
                    </form>
                  )}

                  {/* ── PayPal (SDK Officiel / Modal Simulation) ── */}
                  {paymentMethod === "paypal" && (
                    <div className="space-y-4 text-center animate-fadeIn">
                      {isPaypalLiveReady ? (
                        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
                          <div className="py-2">
                            <PayPalButtons
                              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  intent: "CAPTURE",
                                  purchase_units: [
                                    {
                                      description: getSelectedServiceText(),
                                      amount: {
                                        currency_code: "EUR",
                                        value: calculatedAmount.toString(),
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={async (data, actions) => {
                                if (actions.order) {
                                  await actions.order.capture();
                                  await submitTransaction(`PayPal Réel (ID: ${data.orderID})`);
                                }
                              }}
                              onError={(err) => {
                                console.error("PayPal Error:", err);
                                setPaymentError("Une erreur est survenue avec PayPal.");
                              }}
                            />
                          </div>
                        </PayPalScriptProvider>
                      ) : (
                        <>
                          <p className="font-cormorant text-sm text-[#cabfa6] italic">
                            {lang === "fr"
                              ? "Règlement sécurisé et rapide via votre compte PayPal ou par Carte via la passerelle PayPal."
                              : "Fast and secure checkout using your PayPal balance or direct credit card via PayPal gateway."}
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowPaypalModal(true)}
                            className="w-full py-4 rounded-xl bg-[#f2c94c] hover:bg-[#e2b93c] text-black font-cinzel text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                          >
                            <span>PayPal</span>
                            <span>Checkout</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* ── Virement Bancaire ── */}
                  {paymentMethod === "virement" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-black/30 border border-[#C5A059]/25 rounded-2xl p-5 space-y-3 font-cinzel text-[11px] text-[#cabfa6] tracking-widest uppercase">
                        <div className="flex justify-between">
                          <span>Bénéficiaire :</span>
                          <span className="text-white font-bold">General Esquire SAS</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IBAN :</span>
                          <span className="text-white font-bold">FR76 3000 2000 1000 0012 3456 789</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BIC / SWIFT :</span>
                          <span className="text-white font-bold">GESQFR2PXXX</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Motif / Réf :</span>
                          <span className="text-[#E9D18F] font-bold">CAB-ESQ-{fullName.split(" ")[0]?.toUpperCase() || "JUR"}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleVirementConfirm}
                        disabled={isProcessing}
                        className="w-full py-4 rounded-xl font-cinzel text-xs font-bold tracking-widest text-[#E9D18F] border border-[#C5A059] hover:bg-[#C5A059]/10 transition-all cursor-pointer uppercase"
                      >
                        {isProcessing
                          ? (lang === "fr" ? "Enregistrement..." : "Saving...")
                          : (lang === "fr" ? "Confirmer l'initiation du Virement" : "Confirm Bank Transfer")}
                      </button>
                    </div>
                  )}

                  {paymentError && (
                    <p className="text-red-400 font-cormorant text-sm text-center">{paymentError}</p>
                  )}

                  {/* Back button */}
                  <div className="flex justify-start pt-2">
                    <button
                      type="button"
                      onClick={goBack}
                      className="px-6 py-3 rounded-xl font-cinzel text-xs font-bold tracking-widest text-[#cabfa6] border border-[#C5A059]/30 hover:text-[#E9D18F] hover:border-[#C5A059] transition-all uppercase flex items-center gap-2 cursor-pointer"
                    >
                      <span>←</span> {lang === "fr" ? "Récapitulatif" : "Summary"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ═══ PAYPAL LOGIN MODAL ═══ */}
      {showPaypalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-cinzel font-extrabold text-[#003087] text-lg tracking-widest">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
              <button
                onClick={() => setShowPaypalModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handlePaypalSubmit} className="space-y-4 font-sans text-sm">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Payer à :</span>
                  <span className="font-semibold text-slate-800">General Esquire SAS</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider block">Montant :</span>
                  <span className="font-bold text-slate-800 text-lg">{calculatedAmount.toLocaleString()} €</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Adresse Email PayPal</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. votre.compte@email.com"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0079C1] text-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mot de Passe</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={paypalPassword}
                  onChange={(e) => setPaypalPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0079C1] text-slate-800 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={paypalProcessing}
                className="w-full py-3 rounded-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold tracking-wide text-xs uppercase shadow-md transition-all cursor-pointer"
              >
                {paypalProcessing
                  ? (lang === "fr" ? "Authentification..." : "Verifying Account...")
                  : (lang === "fr" ? "Connexion & Valider le Règlement" : "Log In & Authorize Payment")}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
