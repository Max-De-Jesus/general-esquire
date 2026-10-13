/**
 * Runwei Video — configuration centrale et logique pure de la page /runwei.
 * Prix, statuts, régime fiscal et services externes se modifient ICI.
 * Aucune fonction de ce fichier ne touche au DOM : elles sont testables seules.
 */

export type PaymentStatus = "paid" | "pending" | "failed";

export interface TaxConfig {
  /** Tant que `confirmed` vaut false, AUCUNE taxe n'est calculée ni ajoutée. */
  confirmed: boolean;
  rate: number | null;
  priceIs: "HT" | "TTC" | null;
}

export const CONFIG = {
  locale: "fr-FR",
  currency: "FCFA",

  plans: {
    /** Étape 1 — base indispensable du service. */
    starter: {
      price: 28956,
      status: "paid" as PaymentStatus,
      /** Statut déclaré par l'entreprise ; passer à true seulement après
       *  rapprochement avec un paiement réel dans le système de paiement. */
      verified: false,
      account: "GeneralEsquire.com",
    },
    /** Étape 2 — extension complémentaire de Starter (jamais vendue seule). */
    extension: {
      price: 42856,
      status: "pending" as PaymentStatus,
      tax: { confirmed: false, rate: null, priceIs: null } as TaxConfig,
    },
  },

  /** Services externes. `null` tant qu'aucun service réel n'est branché :
   *  la page affiche alors un message explicite et ne simule RIEN.
   *  - eligibilityEndpoint : GET (cookies inclus) → { eligible: boolean, reason?: string }
   *  - checkoutEndpoint    : POST { plan: "premium-extension" } → { url: "https://checkout.stripe.com/…" }
   *  - quoteEndpoint       : POST JSON du formulaire → réponse 2xx */
  services: {
    eligibilityEndpoint: null as string | null,
    checkoutEndpoint: null as string | null,
    checkoutAllowedHosts: ["checkout.stripe.com"],
    quoteEndpoint: null as string | null,
  },

  comparison: [
    // true = inclus · false = non inclus · "scope" = selon devis et périmètre convenu
    { label: "Compilation des images existantes", starter: true, premium: true, business: true },
    { label: "Ajout de textes", starter: true, premium: true, business: true },
    { label: "Montage automatisé", starter: true, premium: true, business: true },
    { label: "Génération d'images par IA", starter: false, premium: true, business: "scope" },
    { label: "Génération de vidéos par IA", starter: false, premium: true, business: "scope" },
    { label: "Ajout de sons", starter: false, premium: true, business: "scope" },
    { label: "Montage avancé", starter: false, premium: true, business: "scope" },
    { label: "Personnalisation professionnelle", starter: false, premium: false, business: "scope" },
  ] as Array<{ label: string; starter: boolean | "scope"; premium: boolean | "scope"; business: boolean | "scope" }>,
};

/** Trois états distincts, jamais modifiés par un clic. */
export const STATUS: Record<PaymentStatus, { css: string; title: string; badge: string }> = {
  paid: { css: "paid", title: "✓ Déjà payé", badge: "Paiement confirmé" },
  pending: { css: "pending", title: "⏳ En attente de paiement", badge: "⏳ Paiement en attente" },
  failed: { css: "failed", title: "Échec du paiement", badge: "Paiement échoué" },
};

const nf = new Intl.NumberFormat(CONFIG.locale, { maximumFractionDigits: 0 });

/** 28956 → « 28 956 FCFA » (espaces insécables). */
export function formatPrice(amount: number): string {
  return nf.format(amount).replace(/\s/g, " ") + " " + CONFIG.currency;
}

export function formatNumber(n: number): string {
  return nf.format(n);
}

/** TVA arrondie au franc. */
export function computeVat(priceHT: number, ratePercent: number) {
  const vat = Math.round((priceHT * ratePercent) / 100);
  return { ht: priceHT, vat, ttc: priceHT + vat };
}

export function validateVatRate(raw: unknown): { ok: true; value: number } | { ok: false; error: string } {
  const text = String(raw ?? "").trim().replace(",", ".");
  if (text === "" || text === "null") return { ok: false, error: "Saisissez un taux de TVA." };
  const value = Number(text);
  if (!Number.isFinite(value)) return { ok: false, error: "Le taux doit être un nombre." };
  if (value < 0 || value > 100) return { ok: false, error: "Le taux doit être compris entre 0 et 100 %." };
  return { ok: true, value: Math.round(value * 100) / 100 };
}

export type TaxDescription =
  | { confirmed: false; text: string }
  | { confirmed: true; text: string; ht: number; vat: number; ttc: number; rate: number };

/** Ne calcule une taxe que si le régime fiscal est confirmé et cohérent. */
export function describeTax(price: number, tax: TaxConfig | null | undefined): TaxDescription {
  if (!tax || !tax.confirmed) {
    return { confirmed: false, text: "Régime de TVA à confirmer (prix HT ou TTC, taux applicable) : aucune taxe n'est ajoutée à ce montant." };
  }
  const rate = validateVatRate(tax.rate);
  if (!rate.ok || (tax.priceIs !== "HT" && tax.priceIs !== "TTC")) {
    return { confirmed: false, text: "Régime de TVA à confirmer : aucune taxe n'est ajoutée à ce montant." };
  }
  if (tax.priceIs === "TTC") {
    const ht = Math.round(price / (1 + rate.value / 100));
    return { confirmed: true, text: `Prix TTC, TVA ${nf.format(rate.value)} % incluse.`, ht, vat: price - ht, ttc: price, rate: rate.value };
  }
  const v = computeVat(price, rate.value);
  return { confirmed: true, text: `Prix hors taxes ; TVA ${nf.format(rate.value)} % en sus.`, ...v, rate: rate.value };
}

/** Coût du parcours complet : payé et restant affichés séparément. */
export function computeJourney(plans: { starter: { price: number; status: PaymentStatus }; extension: { price: number; status: PaymentStatus } }) {
  const paid =
    (plans.starter.status === "paid" ? plans.starter.price : 0) +
    (plans.extension.status === "paid" ? plans.extension.price : 0);
  const total = plans.starter.price + plans.extension.price;
  return { paid, due: total - paid, total };
}

export interface QuoteData {
  company?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  volume?: string;
  description?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ().-]{6,30}$/;

/** Renvoie { champ: message } ; objet vide = formulaire valide. */
export function validateQuote(d: QuoteData): Partial<Record<keyof QuoteData, string>> {
  const e: Partial<Record<keyof QuoteData, string>> = {};
  if (!d.company || d.company.trim().length < 2) e.company = "Indiquez le nom de l'entreprise.";
  if (!d.contactName || d.contactName.trim().length < 2) e.contactName = "Indiquez le nom du responsable.";
  if (!d.email || !EMAIL_RE.test(d.email.trim())) e.email = "Saisissez une adresse e-mail valide.";
  if (d.phone && d.phone.trim() && !PHONE_RE.test(d.phone.trim())) e.phone = "Numéro invalide (chiffres, espaces, +, - et parenthèses uniquement).";
  if (!d.volume) e.volume = "Sélectionnez un volume mensuel.";
  if (!d.description || d.description.trim().length < 30) e.description = "Décrivez votre projet en 30 caractères au minimum.";
  return e;
}

export function isAllowedCheckoutUrl(raw: unknown): boolean {
  try {
    const url = new URL(String(raw));
    return url.protocol === "https:" && CONFIG.services.checkoutAllowedHosts.includes(url.hostname);
  } catch {
    return false;
  }
}
