"use client";

/**
 * Runwei Video — page d'abonnements (route /runwei).
 * Habillage General Esquire masqué sur cette route : voir src/lib/standalonePages.ts.
 * Configuration (prix, statuts, régime fiscal, services) : ./config.ts
 *
 * Règles : aucun paiement simulé, aucun statut « payé » posé par un clic,
 * aucune éligibilité déduite sans service réel.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CONFIG,
  STATUS,
  computeJourney,
  describeTax,
  formatNumber,
  formatPrice,
  isAllowedCheckoutUrl,
  validateQuote,
  type PaymentStatus,
  type QuoteData,
} from "./config";

/* ───────────── Pictogrammes ───────────── */
type IconName = "check" | "minus" | "film" | "spark" | "building" | "x" | "image" | "wave" | "cut" | "text" | "lock";
const ICON_PATHS: Record<IconName, React.ReactNode> = {
  check: <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  minus: <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  film: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></g>,
  spark: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></g>,
  building: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M4 21V5a2 2 0 012-2h7a2 2 0 012 2v16M15 9h3a2 2 0 012 2v10M2 21h20" /><path d="M8 7h3M8 11h3M8 15h3" strokeLinecap="round" /></g>,
  x: <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
  image: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M4 18l5-5 4 4 3-3 4 4" /></g>,
  wave: <path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  cut: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.6 7.6L20 18M8.6 16.4L20 6" /></g>,
  text: <path d="M5 6h14M12 6v13M9 19h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  lock: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 018 0v3" /></g>,
};

function Icon({ name, size }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {ICON_PATHS[name]}
    </svg>
  );
}

function BrandMark({ simple = false }: { simple?: boolean }) {
  if (simple) {
    return (
      <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="2" y="2" width="44" height="44" rx="13" fill="#0b1630" stroke="#5b9bff" strokeWidth="1.5" />
        <path d="M18 14.5v19l15-9.5z" fill="#22d3ee" />
      </svg>
    );
  }
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="rw-g-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b9bff" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="#0b1630" stroke="url(#rw-g-mark)" strokeWidth="1.5" />
      <path d="M18 14.5v19l15-9.5z" fill="url(#rw-g-mark)" />
      <g stroke="#9fd8ff" strokeWidth="1.2" opacity=".85" fill="none">
        <path d="M33 24l7-6M33 24l7 6M18 14.5L10 10M18 33.5L10 38" />
      </g>
      <g fill="#e6f6ff">
        <circle cx="40" cy="18" r="2" />
        <circle cx="40" cy="30" r="2" />
        <circle cx="10" cy="10" r="2" />
        <circle cx="10" cy="38" r="2" />
      </g>
    </svg>
  );
}

/* ───────────── Apparition au défilement ─────────────
   Affichage immédiat de ce qui est à l'écran, observateur pour le reste,
   filet de sécurité si l'observateur ne répond jamais. */
function useReveal(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // JavaScript actif : les blocs peuvent être masqués avant leur apparition
    // (sans JS, rien n'est masqué).
    root.classList.add("js-on");
    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    const showAll = () => items.forEach((el) => el.classList.add("is-visible"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }
    const vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
    });
    let answered = false;
    const io = new IntersectionObserver(
      (entries) => {
        answered = true;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((el) => io.observe(el));
    const failsafe = window.setTimeout(() => {
      if (!answered) showAll();
    }, 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [rootRef]);
}

/* ───────────── Statut de paiement ───────────── */
function StatusBox({ plan }: { plan: "starter" | "extension" }) {
  const cfg = CONFIG.plans[plan];
  const status: PaymentStatus = cfg.status;
  const s = STATUS[status];
  return (
    <div
      className={`status status--${s.css}`}
      data-status-box={plan}
      role="group"
      aria-label={plan === "starter" ? "Statut de paiement de la formule Starter" : "Statut de paiement de l'Extension Premium IA"}
    >
      <div className="status-line">
        <span className="status-title">{s.title}</span>
        <span className={`badge badge--${s.css}`}>
          {status === "paid" ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path className="check-path" d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : status === "failed" ? (
            <Icon name="x" />
          ) : null}
          {s.badge}
        </span>
      </div>
      {plan === "starter" && status === "paid" && (
        <>
          <p>Cette première formule a déjà été payée par l&apos;entreprise associée au compte {CONFIG.plans.starter.account}.</p>
          <p className="status-meta">
            Compte associé : <strong>{CONFIG.plans.starter.account}</strong>
          </p>
          <p className="status-meta">
            {CONFIG.plans.starter.verified
              ? "Paiement enregistré dans notre système de paiement."
              : `Confirmation communiquée par ${CONFIG.plans.starter.account}.`}
          </p>
        </>
      )}
      {plan === "extension" && status === "pending" && (
        <p>Cette extension n&apos;a pas encore été réglée : le montant de {formatPrice(CONFIG.plans.extension.price)} reste à payer.</p>
      )}
      {status === "failed" && <p>Le dernier paiement n&apos;a pas abouti. Aucun montant n&apos;a été encaissé.</p>}
    </div>
  );
}

/* ───────────── Messages ───────────── */
type NoticeKind = "info" | "blocked" | "ok";
interface Notice {
  kind: NoticeKind;
  title: string;
  text: string;
}
function NoticeLine({ id, notice, style }: { id: string; notice: Notice | null; style?: React.CSSProperties }) {
  return (
    <p className={`notice${notice ? ` notice--${notice.kind}` : ""}`} id={id} role="status" aria-live="polite" hidden={!notice} style={style}>
      {notice && (
        <>
          <strong>{notice.title}</strong> {notice.text}
        </>
      )}
    </p>
  );
}

function CompareCell({ value, label, premium }: { value: boolean | "scope"; label: string; premium?: boolean }) {
  const cls = premium ? "col-premium" : undefined;
  if (value === true)
    return (
      <td data-label={label} className={cls}>
        <span className="yes" role="img" aria-label="Inclus">
          <Icon name="check" />
        </span>
      </td>
    );
  if (value === "scope")
    return (
      <td data-label={label} className={cls}>
        <span className="scope">
          <span className="yes" aria-hidden="true">
            <Icon name="check" />
          </span>
          Selon devis et périmètre convenu
        </span>
      </td>
    );
  return (
    <td data-label={label} className={cls}>
      <span className="no" role="img" aria-label="Non inclus" />
    </td>
  );
}

const FIELD_IDS: Record<keyof QuoteData, string> = {
  company: "q-company",
  contactName: "q-name",
  email: "q-email",
  phone: "q-phone",
  volume: "q-volume",
  description: "q-desc",
};

function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <p className="field-error" id={`${id}-err`}>
      {error ?? ""}
    </p>
  );
}

type Eligibility = "unknown" | "unavailable" | "eligible" | "ineligible" | "error";

/* ═════════════════════════ PAGE ═════════════════════════ */
export default function RunweiPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const awaitingDecision = useRef(false);

  const [eligibility, setEligibility] = useState<{ state: Eligibility; reason: string }>({ state: "unknown", reason: "" });
  const [eligibilityNotice, setEligibilityNotice] = useState<Notice | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [premiumBusy, setPremiumBusy] = useState<string | null>(null);
  const [premiumNotice, setPremiumNotice] = useState<Notice | null>(null);
  const [quoteErrors, setQuoteErrors] = useState<Partial<Record<keyof QuoteData, string>>>({});
  const [quoteNotice, setQuoteNotice] = useState<Notice | null>(null);
  const [quoteBusy, setQuoteBusy] = useState(false);

  const { starter, extension } = CONFIG.plans;
  const journey = computeJourney(CONFIG.plans);
  const tax = describeTax(extension.price, extension.tax);
  const payable = tax.confirmed ? tax.ttc : extension.price;
  const extensionBlockedByStarter = starter.status !== "paid";

  useReveal(rootRef);

  // Développement uniquement : permet aux tests de brancher de faux services
  // (window.__runweiConfig.services). Retiré du build de production.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __runweiConfig?: typeof CONFIG }).__runweiConfig = CONFIG;
    }
  }, []);

  /* ── Éligibilité développeur : jamais déduite sans service réel ── */
  const checkEligibility = useCallback(async () => {
    const endpoint = CONFIG.services.eligibilityEndpoint;
    let result: { state: Eligibility; reason: string };
    if (!endpoint) {
      result = { state: "unavailable", reason: "La vérification des comptes développeurs n'est pas encore disponible sur cette page." };
    } else {
      try {
        const res = await fetch(endpoint, { method: "GET", credentials: "include", headers: { Accept: "application/json" } });
        if (res.status === 401) {
          result = { state: "ineligible", reason: "Vous n'êtes pas connecté à un compte développeur." };
        } else {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          result =
            data && data.eligible === true
              ? { state: "eligible", reason: "" }
              : { state: "ineligible", reason: (data && typeof data.reason === "string" && data.reason) || "Votre compte ne dispose pas de l'éligibilité développeur requise." };
        }
      } catch {
        result = { state: "error", reason: "La vérification de votre éligibilité a échoué. Réessayez plus tard." };
      }
    }
    setEligibility(result);
    setEligibilityNotice(
      result.state === "eligible"
        ? { kind: "ok", title: "Compte développeur vérifié.", text: "Les actions d'achat sont disponibles." }
        : { kind: "blocked", title: "Achats bloqués.", text: result.reason },
    );
    return result;
  }, []);

  const onCheckEligibility = async () => {
    setCheckingEligibility(true);
    await checkEligibility();
    setCheckingEligibility(false);
  };

  /* ── Extension Premium IA : éligibilité → confirmation → prestataire ── */
  const onCompleteSubscription = async () => {
    if (extension.status === "paid" || extensionBlockedByStarter) return;
    setPremiumBusy("Vérification de l'éligibilité…");
    const result = await checkEligibility();
    setPremiumBusy(null);
    if (result.state !== "eligible") {
      setPremiumNotice({ kind: "blocked", title: "Achat bloqué.", text: `${result.reason} Le complément d'abonnement est réservé aux comptes développeurs vérifiés.` });
      return;
    }
    const dialog = dialogRef.current;
    if (dialog && typeof dialog.showModal === "function") {
      awaitingDecision.current = true;
      dialog.showModal();
      dialog.querySelector<HTMLButtonElement>("#confirm-ok")?.focus();
    } else {
      setPremiumNotice({ kind: "blocked", title: "Confirmation impossible.", text: "Votre navigateur ne prend pas en charge la fenêtre de confirmation." });
    }
  };

  const startCheckout = async () => {
    const endpoint = CONFIG.services.checkoutEndpoint;
    if (!endpoint) {
      setPremiumNotice({ kind: "info", title: "Paiement en ligne indisponible.", text: "Aucune transaction n'a été effectuée : l'extension reste « En attente de paiement »." });
      return;
    }
    setPremiumBusy("Redirection vers le paiement…");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ plan: "premium-extension" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!isAllowedCheckoutUrl(data?.url)) throw new Error("URL de paiement inattendue");
      window.location.assign(String(data.url));
    } catch {
      setPremiumBusy(null);
      setPremiumNotice({ kind: "blocked", title: "Le paiement n'a pas pu être initié.", text: "Aucun montant n'a été prélevé. Réessayez plus tard." });
    }
  };

  /* Décision traitée UNE seule fois, déclenchée directement par les boutons et
     la touche Échap ; l'événement « close » n'est qu'un filet de sécurité. */
  const decide = async (value: "confirm" | "cancel") => {
    if (!awaitingDecision.current) return;
    awaitingDecision.current = false;
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close(value);
    if (value !== "confirm") {
      setPremiumNotice({ kind: "info", title: "Opération annulée.", text: "Aucun paiement n'a été initié." });
      return;
    }
    await startCheckout();
  };

  /* ── Devis Business ── */
  const onQuoteSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as QuoteData;
    const errors = validateQuote(data);
    setQuoteErrors(errors);
    const firstKey = (Object.keys(FIELD_IDS) as Array<keyof QuoteData>).find((k) => errors[k]);
    if (firstKey) {
      setQuoteNotice({ kind: "blocked", title: "Formulaire incomplet.", text: "Corrigez les champs signalés." });
      document.getElementById(FIELD_IDS[firstKey])?.focus();
      return;
    }
    const endpoint = CONFIG.services.quoteEndpoint;
    if (!endpoint) {
      setQuoteNotice({ kind: "info", title: "Demande non transmise.", text: "L'envoi des demandes de devis n'est pas encore disponible en ligne. Vos informations n'ont été envoyées nulle part et restent dans le formulaire." });
      return;
    }
    setQuoteBusy(true);
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setQuoteNotice({ kind: "ok", title: "Demande envoyée.", text: "Nous revenons vers vous rapidement." });
    } catch {
      setQuoteNotice({ kind: "blocked", title: "Envoi impossible.", text: "Votre demande n'a pas été transmise. Réessayez plus tard." });
    } finally {
      setQuoteBusy(false);
    }
  };

  const fieldProps = (key: keyof QuoteData) => ({
    id: FIELD_IDS[key],
    name: key,
    "aria-invalid": quoteErrors[key] ? (true as const) : undefined,
    "aria-describedby": `${FIELD_IDS[key]}-err`,
  });

  const eligibilityLabel: Record<Eligibility, string> = {
    unknown: "non vérifié",
    unavailable: "vérification indisponible",
    eligible: "éligible",
    ineligible: "non éligible",
    error: "vérification impossible",
  };

  return (
    <div ref={rootRef} className="rw" id="top">
      <div className="backdrop" aria-hidden="true">
        <div className="grid-lines" />
      </div>

      <header className="topbar">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Runwei Video — haut de page">
            <BrandMark />
            <span className="brand-name">
              RUNWEI VIDEO<span>STUDIO IA</span>
            </span>
          </a>
          <nav className="nav" aria-label="Navigation de la page">
            <a href="#formules">Formules</a>
            <a href="#comparatif">Comparatif</a>
            <a href="#devis">Devis entreprise</a>
          </nav>
        </div>
      </header>

      <div className="wrap">
        {/* ═══ EN-TÊTE ═══ */}
        <section className="hero" aria-labelledby="hero-title">
          <span className="eyebrow reveal">
            <i aria-hidden="true" />
            Plateforme de création vidéo IA
          </span>
          <h1 id="hero-title" className="reveal" style={{ ["--delay" as string]: ".08s" }}>
            Transformez vos idées en vidéos grâce à <em>l&apos;intelligence artificielle</em>
          </h1>
          <p className="lead reveal" style={{ ["--delay" as string]: ".16s" }}>
            Découvrez nos formules de création vidéo, du montage automatique à la génération avancée de scènes visuelles et sonores par IA.
          </p>
          <p className="tagline reveal" style={{ ["--delay" as string]: ".24s" }}>
            <span>Création intelligente.</span>
            <span>Montage automatisé.</span>
            <span>Vidéos professionnelles.</span>
          </p>
        </section>

        {/* ═══ AVERTISSEMENT — COMPTES DÉVELOPPEURS ═══ */}
        <section className="warning" aria-labelledby="warning-title">
          <div className="warning-head">
            <svg className="warning-icon" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 5L45 42H3z" fill="rgba(255,77,94,.18)" stroke="#ff4d5e" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M24 18v12" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="24" cy="35.5" r="2.3" fill="#fff" />
            </svg>
            <div>
              <h2 id="warning-title">
                <span aria-hidden="true">⚠️ </span>Attention — Accès réservé aux comptes développeurs
              </h2>
              <p>
                Ce lien vous a été partagé par un compte développeur. Cette page présente des formules d&apos;abonnement réservées aux utilisateurs autorisés. Si vous ne disposez pas d&apos;un compte développeur éligible, vous ne pouvez pas souscrire à ces offres ni effectuer d&apos;achat depuis cette page.
              </p>
              <p className="warning-sub">
                Vous pouvez consulter les différentes formules et leurs caractéristiques, mais l&apos;accès aux actions réservées nécessite une vérification de votre éligibilité.
              </p>
              <p className="warning-cta">Ayez un compte développeur avant l&apos;achat de cette formule.</p>
            </div>
          </div>
        </section>

        <div className="eligibility reveal" role="region" aria-label="Vérification de l'éligibilité développeur">
          <div className="eligibility-state">
            <span className={`dot${eligibility.state === "eligible" ? " is-ok" : ""}`} aria-hidden="true" />
            <span>
              Statut de votre compte développeur : <strong id="eligibility-label">{eligibilityLabel[eligibility.state]}</strong>
            </span>
          </div>
          <button type="button" className="btn btn-ghost" id="eligibility-btn" onClick={onCheckEligibility} disabled={checkingEligibility}>
            <Icon name="lock" size={18} />
            Vérifier mon éligibilité
          </button>
          <NoticeLine id="eligibility-msg" notice={eligibilityNotice} style={{ flexBasis: "100%" }} />
        </div>

        {/* ═══ PARCOURS EN DEUX ÉTAPES ═══ */}
        <section id="formules" aria-labelledby="plans-title">
          <div className="section-head reveal">
            <h2 id="plans-title">Votre parcours de création vidéo</h2>
            <p>Starter constitue la base du service ; l&apos;Extension Premium IA la complète pour accéder à la génération vidéo avancée.</p>
          </div>

          <ol className="journey-strip reveal" aria-label="Étapes du parcours">
            <li className="step-chip step-chip--paid">
              <span className="n" aria-hidden="true">1</span>
              <b>Étape 1 — Starter</b> : <span data-price="starter">{formatPrice(starter.price)}</span> — Déjà payé
            </li>
            <li className="strip-arrow" aria-hidden="true">→</li>
            <li className="step-chip step-chip--pending">
              <span className="n" aria-hidden="true">2</span>
              <b>Étape 2 — Extension Premium IA</b> : <span data-price="extension">{formatPrice(extension.price)}</span> — En attente de paiement
            </li>
          </ol>

          <div className="journey">
            {/* ── ÉTAPE 1 : STARTER ── */}
            <article className="plan reveal" style={{ ["--delay" as string]: ".05s" }} aria-labelledby="starter-title" data-plan="starter">
              <span className="step-label">Étape 1 · Base du service</span>
              <div className="plan-top">
                <span className="plan-icon" aria-hidden="true">
                  <Icon name="film" />
                </span>
              </div>
              <h3 id="starter-title">STARTER</h3>
              <p className="plan-desc">Transformez vos images existantes en une vidéo structurée.</p>
              <div className="price">
                <span className="price-amount" data-price="starter">{formatPrice(starter.price)}</span>
              </div>
              <StatusBox plan="starter" />
              <ul className="features" aria-label="Fonctionnalités Starter">
                {[
                  "Utilisation des images déjà présentes dans le dossier de création.",
                  "Compilation automatique des images en vidéo.",
                  "Ajout de textes et de titres correspondant aux images.",
                  "Organisation des séquences et montage automatisé de base.",
                ].map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="feature-group">
                <h4>Limites de la formule</h4>
                <ul className="features features--limits" aria-label="Limites de la formule Starter">
                  {[
                    "Pas de génération de nouvelles images par IA.",
                    "Pas de génération de nouvelles séquences vidéo par IA.",
                    "Pas d'accès aux outils avancés de génération audio et vidéo IA.",
                  ].map((f) => (
                    <li key={f}>
                      <Icon name="minus" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="plan-note">Cette option constitue la base indispensable du service Runwei Video.</p>
              <div className="plan-spacer" />
              <div className="plan-actions">
                {starter.status === "paid" ? (
                  <div className="plan-included-label">
                    <Icon name="check" size={18} />
                    Étape 1 réglée — aucun achat requis
                  </div>
                ) : (
                  <p className="notice notice--info">La formule Starter doit être réglée avant l&apos;extension.</p>
                )}
              </div>
            </article>

            {/* ── Liaison lumineuse ── */}
            <div className="connector reveal" style={{ ["--delay" as string]: ".1s" }} aria-hidden="true">
              <span className="connector-line" />
              <span className="connector-arrow">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="connector-text">
                Complète
                <br />
                l&apos;étape 1
              </span>
            </div>

            {/* ── ÉTAPE 2 : EXTENSION PREMIUM IA ── */}
            <article className="plan plan--premium reveal" style={{ ["--delay" as string]: ".15s" }} aria-labelledby="premium-title" data-plan="premium">
              <span className="step-label">Étape 2 · Extension de Starter</span>
              <div className="plan-top">
                <span className="plan-icon" aria-hidden="true">
                  <Icon name="spark" />
                </span>
                <span className="tag tag--premium">
                  <Icon name="spark" size={12} />
                  Premium
                </span>
              </div>
              <h3 id="premium-title">EXTENSION PREMIUM IA — COMPLÉMENT OBLIGATOIRE</h3>
              <p className="plan-subtitle">
                Cette extension complète votre formule Starter et permet d&apos;accéder aux fonctionnalités avancées de génération vidéo par intelligence artificielle.
              </p>
              <div className="price">
                <span className="price-amount" data-price="extension">{formatPrice(extension.price)}</span>
                <span className="price-unit">prix de l&apos;extension complémentaire</span>
              </div>
              <p className="price-meta" id="extension-tax">{tax.text}</p>
              {tax.confirmed && (
                <div className="vat-box" id="extension-vat" aria-label="Détail de la TVA de l'extension">
                  <div className="vat-row"><span>Prix hors taxes</span><strong>{formatPrice(tax.ht)}</strong></div>
                  <div className="vat-row"><span>TVA ({formatNumber(tax.rate)} %)</span><strong>{formatPrice(tax.vat)}</strong></div>
                  <div className="vat-row vat-row--total"><span>Total TTC de l&apos;extension</span><strong>{formatPrice(tax.ttc)}</strong></div>
                </div>
              )}
              <StatusBox plan="extension" />
              <div className="feature-group">
                <h4>Fonctionnalités ajoutées par l&apos;extension</h4>
                <ul className="features" aria-label="Fonctionnalités de l'Extension Premium IA">
                  {(
                    [
                      ["image", "Génération de nouvelles images par IA."],
                      ["film", "Génération de séquences vidéo par IA."],
                      ["spark", "Accès aux fonctionnalités avancées des API de génération vidéo configurées sur la plateforme."],
                      ["wave", "Ajout et intégration de sons et de musiques."],
                      ["check", "Combinaison des images existantes et des contenus générés par IA."],
                      ["cut", "Montage avancé et assemblage intelligent des scènes."],
                    ] as Array<[IconName, string]>
                  ).map(([icon, f]) => (
                    <li key={f}>
                      <Icon name={icon} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="api-note">L&apos;accès aux API de génération est ouvert après règlement de l&apos;extension, pour les API configurées sur la plateforme.</p>
              </div>
              <p className="mandatory" role="note">
                <strong>IMPORTANT :</strong> l&apos;extension Premium IA complète obligatoirement la formule Starter pour le parcours de génération vidéo complète décrit ici. La première formule couvre le montage à partir des images existantes ; la seconde ajoute les capacités avancées de génération vidéo et de contenus par IA.
              </p>
              <div className="plan-spacer" />
              <div className="plan-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  id="premium-btn"
                  aria-describedby="premium-msg"
                  onClick={onCompleteSubscription}
                  disabled={premiumBusy !== null || extension.status === "paid" || extensionBlockedByStarter}
                  aria-busy={premiumBusy !== null || undefined}
                >
                  {premiumBusy ? <span className="spinner" aria-hidden="true" /> : <Icon name="spark" size={18} />}
                  <span className="btn-label">
                    {premiumBusy ?? (extension.status === "paid" ? "Extension déjà réglée" : "COMPLÉTER MON ABONNEMENT")}
                  </span>
                </button>
                <NoticeLine
                  id="premium-msg"
                  notice={
                    extensionBlockedByStarter
                      ? { kind: "blocked", title: "Étape 1 requise.", text: "L'Extension Premium IA complète la formule Starter : réglez d'abord la formule Starter." }
                      : premiumNotice
                  }
                />
              </div>
            </article>
          </div>

          {/* ── Coût global ── */}
          <section className="recap reveal" aria-labelledby="recap-title">
            <h3 id="recap-title">Coût global du parcours complet</h3>
            <div className="recap-grid">
              <div className="recap-item recap-item--paid">
                <span className="k">Starter — déjà payé</span>
                <span className="v" data-price="paid">{formatPrice(journey.paid)}</span>
                <span className="s">Pris en charge par {starter.account}</span>
              </div>
              <div className="recap-item recap-item--due">
                <span className="k">Extension Premium IA — reste à régler</span>
                <span className="v" data-price="extension-due">{formatPrice(journey.due)}</span>
                <span className="s">En attente de paiement</span>
              </div>
              <div className="recap-item recap-item--total">
                <span className="k">Coût total des deux formules</span>
                <span className="v" data-price="total">{formatPrice(journey.total)}</span>
                <span className="s">Avant toute taxe supplémentaire applicable</span>
              </div>
            </div>
            <p className="recap-foot">Le montant déjà payé est présenté séparément du montant restant à régler. Aucune taxe n&apos;est ajoutée tant que le régime fiscal applicable n&apos;est pas confirmé.</p>
          </section>
        </section>

        {/* ═══ COMPARATIF ═══ */}
        <section id="comparatif" aria-labelledby="compare-title" style={{ marginTop: "clamp(64px,9vw,104px)" }}>
          <div className="section-head reveal">
            <h2 id="compare-title">Comparez les formules</h2>
            <p>L&apos;essentiel de chaque formule, en un coup d&apos;œil.</p>
          </div>
          <div className="compare-wrap reveal">
            <table className="compare">
              <caption>Coche verte : inclus · tiret : non inclus</caption>
              <thead>
                <tr>
                  <th scope="col">Fonctionnalités</th>
                  <th scope="col">Starter</th>
                  <th scope="col" className="col-premium">Starter + Extension Premium IA</th>
                  <th scope="col">Business</th>
                </tr>
              </thead>
              <tbody id="compare-body">
                {CONFIG.comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <CompareCell value={row.starter} label="Starter" />
                    <CompareCell value={row.premium} label="Starter + Extension" premium />
                    <CompareCell value={row.business} label="Business" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="compare-note">Business : périmètre et fonctionnalités définis dans le devis, après étude de vos besoins.</p>
        </section>

        {/* ═══ BUSINESS + DEVIS ═══ */}
        <section id="devis" aria-labelledby="quote-title" style={{ marginTop: "clamp(64px,9vw,104px)" }}>
          <div className="section-head reveal">
            <h2 id="quote-title">Formule Business</h2>
            <p>Pour les entreprises, agences et professionnels qui produisent des vidéos à plus grande échelle.</p>
          </div>
          <div className="business-layout">
            <article className="plan reveal" style={{ ["--delay" as string]: ".05s" }} aria-labelledby="business-title" data-plan="business">
              <div className="plan-top">
                <span className="plan-icon" aria-hidden="true">
                  <Icon name="building" />
                </span>
                <span className="tag tag--pro">Offre professionnelle</span>
              </div>
              <h3 id="business-title">BUSINESS</h3>
              <p className="plan-desc">Une solution adaptée aux entreprises, agences et professionnels qui souhaitent produire des vidéos à plus grande échelle.</p>
              <div className="price">
                <span className="price-quote">SUR DEVIS</span>
              </div>
              <ul className="features" aria-label="Fonctionnalités Business">
                {[
                  "Étude personnalisée des besoins.",
                  "Configuration commerciale sur mesure.",
                  "Adaptation au volume de production.",
                  "Accompagnement professionnel selon les services disponibles.",
                  "Étude des possibilités d'intégration.",
                  "Conditions commerciales personnalisées.",
                  "Possibilité de fonctionnalités spécifiques après validation technique.",
                ].map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="plan-spacer" />
              <div className="plan-actions">
                <a
                  className="btn btn-ghost btn-block"
                  href="#quote-form"
                  id="quote-link"
                  onClick={() => window.setTimeout(() => document.getElementById("q-company")?.focus({ preventScroll: true }), 450)}
                >
                  <Icon name="building" size={18} />
                  Demander un devis
                </a>
              </div>
            </article>

            <div className="form-card reveal" style={{ ["--delay" as string]: ".1s" }}>
              <form id="quote-form" noValidate aria-describedby="quote-legal" onSubmit={onQuoteSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="q-company">Nom de l&apos;entreprise <span className="req" aria-hidden="true">*</span></label>
                    <input {...fieldProps("company")} type="text" autoComplete="organization" required maxLength={120} />
                    <FieldError id={FIELD_IDS.company} error={quoteErrors.company} />
                  </div>
                  <div className="field">
                    <label htmlFor="q-name">Nom du responsable <span className="req" aria-hidden="true">*</span></label>
                    <input {...fieldProps("contactName")} type="text" autoComplete="name" required maxLength={120} />
                    <FieldError id={FIELD_IDS.contactName} error={quoteErrors.contactName} />
                  </div>
                  <div className="field">
                    <label htmlFor="q-email">Adresse e-mail professionnelle <span className="req" aria-hidden="true">*</span></label>
                    <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" required maxLength={160} placeholder="nom@entreprise.com" />
                    <FieldError id={FIELD_IDS.email} error={quoteErrors.email} />
                  </div>
                  <div className="field">
                    <label htmlFor="q-phone">Téléphone <span className="opt">(facultatif)</span></label>
                    <input {...fieldProps("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={30} placeholder="+229 01 00 00 00 00" />
                    <FieldError id={FIELD_IDS.phone} error={quoteErrors.phone} />
                  </div>
                  <div className="field field--full">
                    <label htmlFor="q-volume">Volume mensuel de vidéos souhaité <span className="req" aria-hidden="true">*</span></label>
                    <select {...fieldProps("volume")} required defaultValue="">
                      <option value="">Sélectionnez un volume</option>
                      <option value="1-10">1 à 10 vidéos par mois</option>
                      <option value="11-50">11 à 50 vidéos par mois</option>
                      <option value="51-200">51 à 200 vidéos par mois</option>
                      <option value="200+">Plus de 200 vidéos par mois</option>
                    </select>
                    <FieldError id={FIELD_IDS.volume} error={quoteErrors.volume} />
                  </div>
                  <div className="field field--full">
                    <label htmlFor="q-desc">Description du projet <span className="req" aria-hidden="true">*</span></label>
                    <textarea {...fieldProps("description")} required minLength={30} maxLength={3000} placeholder="Objectifs, formats, délais, contraintes…" />
                    <FieldError id={FIELD_IDS.description} error={quoteErrors.description} />
                  </div>
                </div>
                <div className="form-foot">
                  <button type="submit" className="btn btn-primary" id="quote-submit" disabled={quoteBusy} aria-busy={quoteBusy || undefined}>
                    {quoteBusy && <span className="spinner" aria-hidden="true" />}
                    <span className="btn-label">{quoteBusy ? "Envoi en cours…" : "Envoyer la demande de devis"}</span>
                  </button>
                  <NoticeLine id="quote-msg" notice={quoteNotice} />
                  <p className="form-legal" id="quote-legal">
                    Les champs marqués d&apos;un astérisque sont obligatoires. Vos informations servent uniquement à établir le devis. Nous ne vous demanderons jamais de mot de passe, ni Google ni autre.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* ═══ CONFIRMATION AVANT PAIEMENT ═══ */}
      <dialog
        className="confirm"
        id="confirm-dialog"
        ref={dialogRef}
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        onCancel={(ev) => {
          ev.preventDefault();
          decide("cancel");
        }}
        onClose={() => decide(dialogRef.current?.returnValue === "confirm" ? "confirm" : "cancel")}
      >
        <div className="confirm-body">
          <h2 id="confirm-title">Compléter mon abonnement</h2>
          <p id="confirm-desc">
            Vous allez régler l&apos;Extension Premium IA, complément de votre formule Starter déjà réglée. Vous serez redirigé vers la page de paiement sécurisée du prestataire. Montant de l&apos;extension :{" "}
            <strong id="confirm-amount">{formatPrice(payable) + (tax.confirmed ? " TTC" : " (hors taxe éventuelle, régime à confirmer)")}</strong>.
          </p>
          <p>Le statut de votre abonnement ne passera à « Payé » qu&apos;après confirmation du paiement par le prestataire.</p>
        </div>
        <div className="confirm-actions">
          <button type="button" className="btn btn-ghost" id="confirm-cancel" onClick={() => decide("cancel")}>
            Annuler
          </button>
          <button type="button" className="btn btn-primary" id="confirm-ok" onClick={() => decide("confirm")}>
            Continuer vers le paiement
          </button>
        </div>
      </dialog>

      {/* ═══ PIED DE PAGE ═══ */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <a className="brand" href="#top">
                <BrandMark simple />
                <span className="brand-name">
                  RUNWEI VIDEO<span>STUDIO IA</span>
                </span>
              </a>
              <p className="footer-about">Création vidéo assistée par intelligence artificielle : montage automatique, génération de scènes, intégration sonore.</p>
            </div>
            <nav aria-label="Abonnements">
              <h3>Abonnements</h3>
              <ul>
                <li><a href="#formules">Formules et tarifs</a></li>
                <li><a href="#comparatif">Comparatif</a></li>
                <li><a href="#info-prix">Prix et TVA</a></li>
              </ul>
            </nav>
            <nav aria-label="Informations légales">
              <h3>Légal</h3>
              <ul>
                <li><a href="#info-cgv">Conditions générales</a></li>
                <li><a href="#info-confidentialite">Politique de confidentialité</a></li>
                <li><a href="#info-eligibilite">Éligibilité développeur</a></li>
              </ul>
            </nav>
            <nav aria-label="Contact">
              <h3>Contact</h3>
              <ul>
                <li><a href="#devis">Contact professionnel</a></li>
                <li><a href="#quote-form">Demande de devis</a></li>
              </ul>
            </nav>
          </div>

          <div className="footer-info">
            <details id="info-prix">
              <summary>Informations sur les prix et la TVA</summary>
              <p>
                Les prix sont exprimés en francs CFA (FCFA). Starter : {formatPrice(starter.price)}. Extension Premium IA, complément obligatoire de Starter : {formatPrice(extension.price)}. Coût total des deux formules : {formatPrice(journey.total)}, avant toute taxe supplémentaire applicable. Le régime de TVA (prix HT ou TTC, taux) reste à confirmer ; aucune taxe n&apos;est ajoutée tant qu&apos;il ne l&apos;est pas. Le prix définitif est celui confirmé sur la page de paiement du prestataire.
              </p>
            </details>
            <details id="info-eligibilite">
              <summary>Conditions d&apos;éligibilité développeur</summary>
              <p>La souscription est réservée aux comptes développeurs autorisés. L&apos;éligibilité est vérifiée par un service dédié ; tant qu&apos;elle n&apos;est pas confirmée, les achats restent bloqués. Votre statut n&apos;est jamais déduit de votre navigateur.</p>
            </details>
            <details id="info-cgv">
              <summary>Conditions générales</summary>
              <p>Les conditions générales d&apos;abonnement vous sont communiquées avant toute souscription et doivent être acceptées sur la page de paiement.</p>
            </details>
            <details id="info-confidentialite">
              <summary>Politique de confidentialité</summary>
              <p>Les données saisies dans le formulaire de devis servent uniquement au traitement de votre demande. Aucune donnée bancaire n&apos;est saisie ni conservée sur cette page.</p>
            </details>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Runwei Video</span>
            <span>Runwei Video — Plateforme de création vidéo assistée par intelligence artificielle.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
