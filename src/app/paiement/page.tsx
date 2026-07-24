"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

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
    { id: "chrys-stay", nameFr: "Séjour Cocooning Touristique Bénin (2 semaines)", nameEn: "Bénin Tourist Cocooning Stay (2 weeks)", price: 1350 },
    { id: "chrys-custom", nameFr: "Forfait de groupe sur devis", nameEn: "Group Package Quote", price: 0, isCustom: true },
  ],
};

export default function PaymentPage() {
  const { lang } = useLanguage();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileType, setProfileType] = useState<string>("Particulier");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [translationPages, setTranslationPages] = useState<number>(1);
  const [isUrgent, setIsUrgent] = useState(false);

  // Computed totals
  const [calculatedAmount, setCalculatedAmount] = useState(100);

  // Payment UI state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "virement">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState("");

  // Card details mock state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // PayPal dialog simulation
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalPassword, setPaypalPassword] = useState("");
  const [paypalProcessing, setPaypalProcessing] = useState(false);

  // Load default service when profileType changes
  useEffect(() => {
    const list = SERVICE_PRESETS[profileType] || SERVICE_PRESETS["Particulier"];
    if (list.length > 0) {
      setSelectedServiceId(list[0].id);
      setCustomPrice("");
      setTranslationPages(1);
    }
  }, [profileType]);

  // Recalculate price when dependencies change
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

    // Urgency surcharge check
    let finalPrice = basePrice;
    if (isUrgent) {
      if (profileType === "Particulier") {
        finalPrice = basePrice * 1.5; // +50%
      } else {
        finalPrice = basePrice + 1500; // +1500 € standard
      }
    }

    setCalculatedAmount(finalPrice);
  }, [profileType, selectedServiceId, customPrice, translationPages, isUrgent]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceId(e.target.value);
  };

  const getSelectedServiceText = () => {
    const list = SERVICE_PRESETS[profileType] || SERVICE_PRESETS["Particulier"];
    const service = list.find((s) => s.id === selectedServiceId);
    if (!service) return "";
    return lang === "fr" ? service.nameFr : service.nameEn;
  };

  // Main Submit handler (Supabase integration)
  const submitTransaction = async (method: string, extraStatus = "Payé") => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Create client first if needed
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
        // Create new client record in Supabase
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

      // 2. Insert payment record into Supabase
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
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || "Une erreur est survenue lors de l'enregistrement du règlement.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Card Pay Handler
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert(lang === "fr" ? "Veuillez remplir votre nom et email." : "Please fill in your name and email.");
      return;
    }
    if (!cardNumber || !cardExpiry || !cardCvv) {
      alert(lang === "fr" ? "Veuillez remplir les informations de carte." : "Please fill in the card details.");
      return;
    }

    setIsProcessing(true);
    // Simulate 2 seconds loading
    setTimeout(async () => {
      await submitTransaction("Carte Bancaire");
    }, 2000);
  };

  // PayPal Simulation Confirm Handler
  const handlePaypalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaypalProcessing(true);

    setTimeout(async () => {
      setPaypalProcessing(false);
      setShowPaypalModal(false);
      await submitTransaction("PayPal");
    }, 2000);
  };

  // Bank Transfer (Virement) Confirm Handler
  const handleVirementConfirm = async () => {
    if (!fullName || !email) {
      alert(lang === "fr" ? "Veuillez remplir votre nom et email." : "Please fill in your name and email.");
      return;
    }
    // Set status to pending/en attente
    await submitTransaction("Virement", "En attente");
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

  return (
    <>
      {/* Banner */}
      <header className="w-full bg-[#131513] border-b border-[#C5A059]/20 relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/Bureau modifié.jpg"
            alt="General Esquire Bureau Background"
            fill
            className="object-cover object-center filter blur-[2px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#131513] via-[#131513]/70 to-[#131513]/40 z-1" />

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

      {/* Main Section */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12 flex-grow">
        {paymentSuccess ? (
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
                  avec succès. Un email de confirmation a été transmis à l'adresse <strong>{email}</strong>.
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

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/"
                className="px-8 py-3 rounded-full font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition-all uppercase"
              >
                {lang === "fr" ? "Retour à l'accueil" : "Back to Home"}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form configuration column */}
            <div className="lg:col-span-7 bg-[#131513] border border-[#C5A059]/30 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <h2 className="font-cinzel text-xl font-bold text-[#E9D18F] tracking-wide border-b border-[#C5A059]/20 pb-3 uppercase">
                {lang === "fr" ? "1. Vos coordonnées & service" : "1. Your Details & Service"}
              </h2>

              {/* Personal Info */}
              <div className="space-y-4 font-cormorant text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                      {lang === "fr" ? "Nom Complet *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jean Dupont"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F]"
                    />
                  </div>
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                      {lang === "fr" ? "Adresse Email *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jean.dupont@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                    {lang === "fr" ? "Numéro de téléphone (optionnel)" : "Phone Number (optional)"}
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +33 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                      {lang === "fr" ? "Votre Profil Client" : "Your Client Profile"}
                    </label>
                    <select
                      value={profileType}
                      onChange={(e) => setProfileType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F]"
                    >
                      <option value="Particulier">{lang === "fr" ? "Particulier" : "Individual"}</option>
                      <option value="Chef d'Entreprise">{lang === "fr" ? "Chef d'Entreprise" : "Business Owner"}</option>
                      <option value="Institution">{lang === "fr" ? "Institution Publique" : "Public Institution"}</option>
                      <option value="Professionnel du Droit">{lang === "fr" ? "Professionnel du Droit" : "Legal Professional"}</option>
                      <option value="Chrysalides">{lang === "fr" ? "Séjour Chrysalides / Détente" : "Chrysalides Stay / Retreat"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                      {lang === "fr" ? "Sélectionner le Service" : "Select Service"}
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={handleServiceChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F]"
                    >
                      {(SERVICE_PRESETS[profileType] || []).map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {lang === "fr" ? preset.nameFr : preset.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conditional Custom Price Field */}
                {(() => {
                  const list = SERVICE_PRESETS[profileType] || [];
                  const activePreset = list.find((s) => s.id === selectedServiceId);
                  if (activePreset?.isCustom) {
                    return (
                      <div className="animate-slideDown">
                        <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                          {lang === "fr" ? "Saisir le Montant (€) *" : "Enter Custom Amount (€) *"}
                        </label>
                        <input
                          type="number"
                          required
                          min="5"
                          placeholder="e.g. 250"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F] font-bold"
                        />
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Conditional Translation Pages Selector */}
                {(() => {
                  const list = SERVICE_PRESETS[profileType] || [];
                  const activePreset = list.find((s) => s.id === selectedServiceId);
                  if (activePreset?.type === "translation") {
                    return (
                      <div className="animate-slideDown grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-cinzel text-xs text-[#C5A059] uppercase tracking-wider mb-1.5">
                            {lang === "fr" ? "Nombre de Pages / Minutes" : "Number of Pages / Minutes"}
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={translationPages}
                            onChange={(e) => setTranslationPages(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-4 py-2.5 rounded-xl bg-[#1a1c1a] border border-[#C5A059]/40 text-white focus:outline-none focus:border-[#E9D18F]"
                          />
                        </div>
                        <div className="flex items-center text-sm italic text-[#cabfa6] pt-5">
                          * 10 € {lang === "fr" ? "par page de document ou par minute audiovisuelle." : "per page of text or minute of audio/video."}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Urgency Surcharge Checkbox */}
                <div className="flex items-start gap-3 bg-black/30 border border-[#C5A059]/10 rounded-2xl p-4 mt-2">
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
              </div>
            </div>

            {/* Payment columns & Summary */}
            <div className="lg:col-span-5 space-y-6">
              {/* Payment Summary Box */}
              <div className="bg-[#131513] border border-[#C5A059]/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[#C5A059]/[0.01] pointer-events-none" />

                <h2 className="font-cinzel text-xs text-[#C5A059] uppercase tracking-[0.2em] font-semibold border-b border-[#C5A059]/20 pb-3 mb-4">
                  {lang === "fr" ? "Récapitulatif" : "Payment Summary"}
                </h2>

                <div className="space-y-3 font-cormorant text-base">
                  <div className="flex justify-between">
                    <span className="text-[#cabfa6]">{lang === "fr" ? "Profil" : "Profile"}</span>
                    <span className="font-bold text-white">{getProfileName(profileType)}</span>
                  </div>
                  <div>
                    <span className="text-[#cabfa6] block mb-1">{lang === "fr" ? "Prestation" : "Service"}</span>
                    <span className="font-bold text-white text-sm leading-tight block">
                      {getSelectedServiceText()}
                    </span>
                  </div>

                  {isUrgent && (
                    <div className="flex justify-between text-amber-400 text-sm">
                      <span>{lang === "fr" ? "Supplément Urgence" : "Urgency Fee"}</span>
                      <span>
                        {profileType === "Particulier"
                          ? "+50%"
                          : "+1 500 €"}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-[#C5A059]/30 pt-4 mt-4 flex items-center justify-between">
                    <span className="font-cinzel text-sm text-[#C5A059] font-bold tracking-wider">TOTAL</span>
                    <span className="font-cinzel text-3xl font-bold text-[#E9D18F]">
                      {calculatedAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Box */}
              <div className="bg-[#131513] border border-[#C5A059]/30 rounded-3xl p-6 shadow-xl space-y-6">
                <h2 className="font-cinzel text-xs text-[#C5A059] uppercase tracking-[0.2em] font-semibold border-b border-[#C5A059]/20 pb-3">
                  {lang === "fr" ? "2. Mode de Règlement" : "2. Payment Method"}
                </h2>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-3 rounded-xl border font-cinzel text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "card"
                        ? "bg-[#C5A059]/10 border-[#C5A059] text-[#E9D18F]"
                        : "border-[#C5A059]/20 text-[#EDE4CF]/60 hover:text-white"
                    }`}
                  >
                    <span>💳</span>
                    <span>{lang === "fr" ? "Carte" : "Card"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`py-3 rounded-xl border font-cinzel text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "paypal"
                        ? "bg-[#C5A059]/10 border-[#C5A059] text-[#E9D18F]"
                        : "border-[#C5A059]/20 text-[#EDE4CF]/60 hover:text-white"
                    }`}
                  >
                    <span className="text-[#f2c94c] font-bold">P</span>
                    <span>PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("virement")}
                    className={`py-3 rounded-xl border font-cinzel text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === "virement"
                        ? "bg-[#C5A059]/10 border-[#C5A059] text-[#E9D18F]"
                        : "border-[#C5A059]/20 text-[#EDE4CF]/60 hover:text-white"
                    }`}
                  >
                    <span>🏛️</span>
                    <span>{lang === "fr" ? "Virement" : "Transfer"}</span>
                  </button>
                </div>

                {/* Card View */}
                {paymentMethod === "card" && (
                  <form onSubmit={handleCardPayment} className="space-y-4 font-cormorant text-base animate-fadeIn">
                    <div>
                      <label className="block font-cinzel text-[10px] text-[#C5A059] uppercase tracking-wider mb-1">
                        {lang === "fr" ? "Titulaire de la Carte" : "Cardholder Name"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jean Dupont"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-black/40 border border-[#C5A059]/30 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-cinzel text-[10px] text-[#C5A059] uppercase tracking-wider mb-1">
                        {lang === "fr" ? "Numéro de Carte" : "Card Number"}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-black/40 border border-[#C5A059]/30 text-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-cinzel text-[10px] text-[#C5A059] uppercase tracking-wider mb-1">
                          {lang === "fr" ? "Date d'Expiration" : "Expiry Date"}
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-black/40 border border-[#C5A059]/30 text-white focus:outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="block font-cinzel text-[10px] text-[#C5A059] uppercase tracking-wider mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-black/40 border border-[#C5A059]/30 text-white focus:outline-none text-center"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 mt-2 rounded-xl font-cinzel text-xs font-bold tracking-widest text-black bg-gradient-to-r from-[#C5A059] to-[#E9D18F] hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] disabled:opacity-50 transition-all cursor-pointer uppercase"
                    >
                      {isProcessing
                        ? (lang === "fr" ? "Traitement sécurisé..." : "Processing Transaction...")
                        : `${lang === "fr" ? "Payer" : "Pay"} ${calculatedAmount.toLocaleString("fr-FR")} €`}
                    </button>
                  </form>
                )}

                {/* PayPal View */}
                {paymentMethod === "paypal" && (
                  <div className="space-y-4 text-center animate-fadeIn">
                    <p className="font-cormorant text-sm text-[#cabfa6] italic">
                      {lang === "fr"
                        ? "Règlement sécurisé et rapide via votre compte PayPal ou par Carte via la passerelle PayPal."
                        : "Fast and secure checkout using your PayPal balance or direct credit card via PayPal gateway."}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        if (!fullName || !email) {
                          alert(lang === "fr" ? "Veuillez remplir votre nom et email." : "Please fill in your name and email.");
                          return;
                        }
                        setShowPaypalModal(true);
                      }}
                      className="w-full py-3.5 rounded-xl bg-[#f2c94c] hover:bg-[#e2b93c] text-black font-cinzel text-xs font-extrabold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span>PayPal</span>
                      <span>Checkout</span>
                    </button>
                  </div>
                )}

                {/* Virement Bancaire View */}
                {paymentMethod === "virement" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-black/30 border border-[#C5A059]/25 rounded-2xl p-4 space-y-3 font-cinzel text-[11px] text-[#cabfa6] tracking-widest uppercase">
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
                      className="w-full py-3.5 rounded-xl font-cinzel text-xs font-bold tracking-widest text-[#E9D18F] border border-[#C5A059] hover:bg-[#C5A059]/10 transition-all cursor-pointer uppercase"
                    >
                      {isProcessing
                        ? (lang === "fr" ? "Enregistrement..." : "Saving...")
                        : (lang === "fr" ? "Confirmer l'initiation du Virement" : "Confirm Bank Transfer")}
                    </button>
                  </div>
                )}

                {paymentError && (
                  <p className="text-red-400 font-cormorant text-sm text-center">
                    {paymentError}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PayPal Login Modal Dialog Simulation */}
      {showPaypalModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-cinzel font-extrabold text-[#003087] text-lg tracking-widest">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
              <button
                onClick={() => setShowPaypalModal(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
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
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Adresse Email PayPal
                </label>
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
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Mot de Passe
                </label>
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
