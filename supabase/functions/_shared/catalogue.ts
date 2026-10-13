// Catalogue des prestations payables en ligne — SOURCE DE VÉRITÉ DU MONTANT.
// Le navigateur n'envoie que des choix (prestation, nombre de pages, urgence…)
// et le montant est recalculé ici : un prix modifié côté client est ignoré.
//
// Miroir des tarifs de src/app/paiement/page.tsx
// (SERVICE_PRESETS) et de son calcul (useEffect « Recalculate price »).
// Toute modification de tarif se fait aux DEUX endroits ; le script
// scripts/verifier-tarifs.mjs échoue s'ils divergent.

export interface Prestation {
  profile: string;
  nameFr: string;
  price: number;
  isCustom?: boolean;
  type?: "translation";
  subscription?: "Mensuel" | "Trimestriel" | "Annuel";
}

export const CATALOGUE: Record<string, Prestation> = {
  // Particulier
  "part-consultation": { profile: "Particulier", nameFr: "Consultation Initiale Fixe", price: 100 },
  "part-translation": { profile: "Particulier", nameFr: "Traduction Chinois / Russe", price: 10, type: "translation" },
  "part-custom": { profile: "Particulier", nameFr: "Prestation personnalisée", price: 0, isCustom: true },
  // Chef d'Entreprise
  "ent-annual": { profile: "Chef d'Entreprise", nameFr: "Abonnement Annuel Illimité", price: 10000, subscription: "Annuel" },
  "ent-monthly": { profile: "Chef d'Entreprise", nameFr: "Abonnement Mensuel", price: 1000, subscription: "Mensuel" },
  "ent-urgency": { profile: "Chef d'Entreprise", nameFr: "Urgence moins de 48h (supplément)", price: 1500 },
  "ent-translation": { profile: "Chef d'Entreprise", nameFr: "Traduction Chinois / Russe", price: 10, type: "translation" },
  "ent-custom": { profile: "Chef d'Entreprise", nameFr: "Prestation ponctuelle de gré à gré", price: 0, isCustom: true },
  // Institution
  "inst-fixed": { profile: "Institution", nameFr: "Forfait Rédaction Fixe (max 20p)", price: 3500 },
  "inst-extra": { profile: "Institution", nameFr: "Pages supplémentaires (tranche 10p)", price: 1000 },
  "inst-talk": { profile: "Institution", nameFr: "Consultation non écrite (1h)", price: 500 },
  "inst-custom": { profile: "Institution", nameFr: "Consultation personnalisée", price: 0, isCustom: true },
  // Professionnel du Droit
  "pro-annual": { profile: "Professionnel du Droit", nameFr: "Partenariat Annuel (d'avance)", price: 15000, subscription: "Annuel" },
  "pro-quarterly": { profile: "Professionnel du Droit", nameFr: "Partenariat Trimestriel", price: 3500, subscription: "Trimestriel" },
  "pro-drafting": { profile: "Professionnel du Droit", nameFr: "Forfait Rédaction d'Acte", price: 500 },
  "pro-urgency": { profile: "Professionnel du Droit", nameFr: "Forfait Rédaction Urgente", price: 1500 },
  "pro-custom": { profile: "Professionnel du Droit", nameFr: "Prestation sur devis", price: 0, isCustom: true },
  // Chrysalides
  "chrys-stay": { profile: "Chrysalides", nameFr: "Séjour Cocooning Touristique Bénin (2 semaines)", price: 1500 },
  "chrys-custom": { profile: "Chrysalides", nameFr: "Forfait de groupe sur devis", price: 0, isCustom: true },
  // Conseil Juridique
  "cj-monthly": { profile: "Conseil Juridique", nameFr: "Mensualité Conseil Juridique", price: 1000, subscription: "Mensuel" },
  "cj-ponctuel": { profile: "Conseil Juridique", nameFr: "Consultation ponctuelle (forfait)", price: 300 },
  "cj-custom": { profile: "Conseil Juridique", nameFr: "Prestation sur devis", price: 0, isCustom: true },
};

export const COCOONING_TOTAL = 1500;
export const CUSTOM_MIN_EUR = 5;
export const CUSTOM_MAX_EUR = 50000;
export const TRANSLATION_MAX_UNITS = 1000;

export interface ChoixPaiement {
  serviceId: string;
  customPrice?: number | string | null;
  translationPages?: number | string | null;
  isUrgent?: boolean;
  cocooningOption?: "unique" | "tranches";
  cocooningSession?: "janvier" | "juillet";
}

/** Même règle que getCocooningInstallmentMonths() côté page (mois 0 = janvier). */
export function cocooningInstallmentMonths(session: "janvier" | "juillet", currentMonth: number): number {
  if (session === "janvier") {
    if (currentMonth >= 1 && currentMonth <= 8) return Math.max(1, 9 - currentMonth);
    return 6;
  }
  if (currentMonth >= 7 || currentMonth <= 2) {
    const m = currentMonth >= 7 ? currentMonth - 7 : currentMonth + 5;
    return Math.max(1, 8 - m);
  }
  return 6;
}

export interface MontantCalcule {
  prestation: Prestation;
  amountEur: number;
  libelle: string;
}

export class ChoixInvalide extends Error {}

/** Calcule le montant à facturer ; lève ChoixInvalide si la demande est incohérente. */
export function calculerMontant(choix: ChoixPaiement, currentMonth: number): MontantCalcule {
  const prestation = CATALOGUE[choix.serviceId];
  if (!prestation) throw new ChoixInvalide("Prestation inconnue.");

  let base = prestation.price;
  let libelle = prestation.nameFr;

  if (choix.serviceId === "chrys-stay" && choix.cocooningOption === "tranches") {
    const session = choix.cocooningSession === "juillet" ? "juillet" : "janvier";
    const months = cocooningInstallmentMonths(session, currentMonth);
    base = Math.round(COCOONING_TOTAL / months);
    libelle += ` — échéance 1/${months} (session ${session})`;
  } else if (prestation.isCustom) {
    const custom = Number(choix.customPrice);
    if (!Number.isFinite(custom) || custom < CUSTOM_MIN_EUR || custom > CUSTOM_MAX_EUR) {
      throw new ChoixInvalide(`Montant libre attendu entre ${CUSTOM_MIN_EUR} et ${CUSTOM_MAX_EUR} €.`);
    }
    base = Math.round(custom * 100) / 100;
  } else if (prestation.type === "translation") {
    const units = Math.floor(Number(choix.translationPages) || 1);
    if (units < 1 || units > TRANSLATION_MAX_UNITS) {
      throw new ChoixInvalide(`Nombre de pages / minutes attendu entre 1 et ${TRANSLATION_MAX_UNITS}.`);
    }
    base = prestation.price * units;
    libelle += ` — ${units} page(s)/min`;
  }

  let amountEur = base;
  if (choix.isUrgent) {
    amountEur = prestation.profile === "Particulier" ? base * 1.5 : base + 1500;
    libelle += " — option urgence";
  }
  if (prestation.subscription) {
    libelle += ` [Abonnement ${prestation.subscription} — échéance réglée à l'unité]`;
  }

  if (!(amountEur > 0)) throw new ChoixInvalide("Montant nul.");
  return { prestation, amountEur: Math.round(amountEur * 100) / 100, libelle };
}
