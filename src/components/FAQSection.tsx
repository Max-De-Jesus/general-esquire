"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface FAQItem {
  id: string;
  category: "general" | "pourquoi" | "tarifs" | "sejour";
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
  bulletsFr?: { label: string; text: string }[];
  bulletsEn?: { label: string; text: string }[];
  conclusionFr?: string;
  conclusionEn?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "qui-est-general-esquire",
    category: "general",
    questionFr: "Qui est concrètement General Esquire ?",
    questionEn: "Who is General Esquire in practice?",
    answerFr:
      "General Esquire est une société par actions simplifiées de droit français, qui a pour objet de donner des conseils juridiques à toute personne qui en a besoin, qu’elle soit morale ou physique ; et d’aider à la résilience d’autrui par un séjour touristique de deux semaines tout-inclus, billet d’avion et pension complète.",
    answerEn:
      "General Esquire is a French simplified joint-stock company (SAS) whose mission is to provide legal advisory services to any individual or corporate entity in need; and to foster personal resilience through a two-week all-inclusive tourist stay, including round-trip flights and full board.",
  },
  {
    id: "philosophie",
    category: "general",
    questionFr: "Quelle est la philosophie de General Esquire ?",
    questionEn: "What is the philosophy behind General Esquire?",
    answerFr:
      "La société General Esquire a été fondée par un avocat généraliste international ayant plus de vingt ans de pratique professionnelle, et qui dans son parcours, a pu expérimenter à quel point les préjugés et le manque d’empathie pouvaient fausser l’œuvre de justice même ; raison pour laquelle, à l’activité juridique pure, il a associé ce qu’il a appelé le cocooning touristique, afin d’amener les personnes qui lui font confiance, à découvrir d’autres horizons et panser un tant soit peu, les blessures que d’une manière ou d’une autre, la vie leur a infligées.",
    answerEn:
      "General Esquire was founded by an international generalist attorney with over twenty years of legal practice. Throughout his career, he witnessed firsthand how prejudice and lack of empathy could distort the very pursuit of justice. For this reason, alongside pure legal counsel, he introduced 'touristic cocooning' to guide clients toward new horizons and help heal the emotional wounds that life may have inflicted.",
  },
  {
    id: "pourquoi-choisir",
    category: "pourquoi",
    questionFr: "Pourquoi choisir General Esquire ?",
    questionEn: "Why choose General Esquire?",
    answerFr:
      "Chaque profil bénéficie d'une approche sur-mesure, transparente et humaine :",
    answerEn:
      "Every client profile benefits from a tailored, transparent, and humane approach:",
    bulletsFr: [
      {
        label: "Si tu es avocat :",
        text: "Tu sais ce que représente pour un cabinet, la charge d’avoir un collaborateur, qu’il soit libéral ou salarié. Outre l’aspect financier, tu dois aussi gérer son caractère, ses absences, et souvent son manque d’implication, sans oublier que parfois, tu formes celui ou celle qui un jour, détournera ta clientèle.",
      },
      {
        label: "Si tu es une institution publique :",
        text: "Tu sais que tu n’as pas besoin d’avocat pour te représenter en justice ; mais il te faut bien un juriste de haute qualité qui soit réactif, connaisse les lois et les jurisprudences les plus pertinentes, et surtout, te rédige un mémorandum clair sur lequel fonder tes décisions.",
      },
      {
        label: "Si tu es un chef d’entreprise :",
        text: "Tu te doutes bien que tu n’es pas le seul client de ton avocat, et qu’à brève échéance, la relation entre vous perdra toute humanité, car il n’a pas du temps à te consacrer plus que de raison, surtout si tu ne fais pas pleuvoir les paiements sur lui.",
      },
      {
        label: "Si tu es un simple particulier :",
        text: "Outre tout ce qui a été dit, tu penses bien que ton avocat peut ne pas se présenter à une audience importante pour toi, cesser de communiquer avec toi, ou te facturer sur la base de la perception qu’il a de toi et qui peut être teintée de préjugés.",
      },
    ],
    bulletsEn: [
      {
        label: "If you are an attorney:",
        text: "You understand the operational burden of associates—salaried or freelance. Beyond the financial cost, managing temperament, absenteeism, lack of engagement, or even training someone who might later divert your clientele is a constant risk.",
      },
      {
        label: "If you are a public institution:",
        text: "You do not always require court representation; what you critically need is a top-tier legal analyst who is responsive, masters relevant jurisprudence, and delivers crystal-clear legal memoranda for your executive decisions.",
      },
      {
        label: "If you are a business leader:",
        text: "You know you are rarely your attorney's sole priority. Over time, the relationship often turns transactional and detached, lacking dedicated time unless excessive fees are paid.",
      },
      {
        label: "If you are an individual:",
        text: "Beyond these issues, you may experience missed hearings, radio silence, or inflated fees based on subjective perceptions and prejudices.",
      },
    ],
  },
  {
    id: "ce-que-je-gagne",
    category: "pourquoi",
    questionFr: "Qu’est-ce que je gagne avec General Esquire ?",
    questionEn: "What do I gain with General Esquire?",
    answerFr:
      "Une productivité maximale et une facturation équitable recentrée sur l'essentiel :",
    answerEn:
      "Maximum productivity and fair pricing focused purely on what matters:",
    bulletsFr: [
      {
        label: "Pour les avocats :",
        text: "Tu gagnes toute la productivité et l’expertise rédactionnelles d’un avocat d’expérience, aguerri à différentes procédures juridiques, sans aucun des inconvénients de l’activité d’un collaborateur : pas de partages de locaux ou des équipements, pas de salaires ou rétrocessions à payer, pas de risque de voir ta clientèle détournée, pas de conflit à gérer devant le bâtonnier, pas de complainte pour absentéisme, congés maladie, maternité ou autres.",
      },
      {
        label: "Pour les autres clientèles :",
        text: "Demande-toi ce que te facturerait normalement un avocat : le temps de consultation, les entrevues en cabinet, la prise d'écritures, la plaidoirie, les heures d'attente à l'audience, ainsi que le prestige présomptif qu'il s'attribue.",
      },
    ],
    bulletsEn: [
      {
        label: "For attorneys:",
        text: "You gain the full drafting prowess and procedural expertise of a seasoned lawyer without any associate overhead: no office sharing, no fixed salaries or retrocessions, no client poaching risk, no bar disputes, and no absenteeism.",
      },
      {
        label: "For other clients:",
        text: "Consider traditional lawyer billing: case review hours, office appointments, drafting, court appearances, courtroom waiting time, and brand prestige markups.",
      },
    ],
    conclusionFr:
      "Avec General Esquire, tu n’as aucun de ces travers, car concrètement, seule t’est facturée la rédaction d’écritures, soit de nos jours, l’essence du métier d’avocat.",
    conclusionEn:
      "With General Esquire, none of these pitfalls exist: you are only billed for legal drafting—the true essence of modern legal practice.",
  },
  {
    id: "plaidoirie",
    category: "pourquoi",
    questionFr: "Comment je fais alors pour la plaidoirie ?",
    questionEn: "What about oral pleadings in court?",
    answerFr:
      "La plaidoirie tend de plus en plus à devenir résiduelle aujourd’hui, où pour faire court, l’oralité des débats est cantonnée à la matière pénale, encore que devant la Chambre de l’instruction où se prennent les décisions les plus significatives de la procédure pénale, le législateur a voulu que celle-ci soit écrite.\n\nDevant les autres juridictions, y compris sociales où il était d’usage de plaider en matière prudhommale par exemple, on ne gagne pas son dossier parce qu’on a fait une belle plaidoirie, mais plutôt parce qu’on a pris de belles conclusions.\n\nToutefois avec General Esquire, tu bénéficies d’un réseau d’avocats qui sont prêts à porter la parole pour toi devant toutes juridictions, sur la base des conclusions, mémoires, requêtes ou assignations que nous aurons pris pour toi.\n\nTu comprends dès lors, que cela te revient bien moins cher, et moins stressant.",
    answerEn:
      "Oral pleading is increasingly residual today: oral debates are mostly confined to criminal law, and even before the Investigating Chamber, procedure is primarily written.\n\nBefore other courts (including labor and commercial courts), cases are won on the strength and precision of written submissions (conclusions & briefs), not rhetorical flourishes.\n\nFurthermore, General Esquire connects you with a vetted network of attorneys ready to plead on your behalf in any court, based on the rigorous submissions we prepare for you. This approach is substantially more cost-effective and stress-free.",
  },
  {
    id: "ou-etre-recu",
    category: "general",
    questionFr: "Où puis-je être reçu(e) par General Esquire ?",
    questionEn: "Where can I meet with General Esquire?",
    answerFr:
      "Le siège social de General Esquire est à Paris, où tu peux être reçu(e) si c’est plus commode pour toi ; sinon nous avons un établissement à Noyon dans les Hauts-de-France où nous te recevrons dans des conditions extrêmement confortables (l’adresse te sera indiquée si tu souhaites faire ce déplacement).\n\nGeneral Esquire se déplace également vers toi, si cela te convient mieux, comme en tous autres endroits où il est possible d’avoir un entretien confidentiel, toutes choses qui correspondent à l’ère du temps ainsi qu’aux nouvelles évolutions de la communication qui, depuis la Covid 2019, est de plus en plus dématérialisée.\n\nVidéoconférence et audioconférence sont également possibles à la demande.",
    answerEn:
      "General Esquire's headquarters are located in Paris, where we can welcome you. We also maintain an executive establishment in Noyon (Hauts-de-France) offering optimal comfort and privacy.\n\nOur team can also travel to your location or any private venue suitable for confidential discussions. Fully encrypted videoconferencing and phone consultations are readily available upon request.",
  },
  {
    id: "tarifs",
    category: "tarifs",
    questionFr: "Quels sont les tarifs de General Esquire ?",
    questionEn: "What are General Esquire's rates?",
    answerFr:
      "Les tarifs de General Esquire varient en fonction de ton statut, et des prestations que tu choisis ; et nous les avons clairement définis sur notre site, sachant qu’il y a un algorithme qui t’aide à calculer la somme que tu dois payer, en fonction de tes sélections.\n\nNe t’inquiète surtout pas à ce sujet, car avant le moindre paiement, tu as toujours la possibilité de discuter avec un membre de notre équipe pour déterminer très limpidement avec toi, la portée de ton engagement financier.",
    answerEn:
      "Our fees are structured according to your profile and the specific services selected. Our online calculator instantly estimates your quote based on your requirements.\n\nBefore any financial commitment, you will always speak with a team member to clearly confirm the exact scope of work and pricing.",
  },
  {
    id: "paiement-plusieurs-fois",
    category: "tarifs",
    questionFr: "Puis-je payer en plusieurs fois ?",
    questionEn: "Can I pay in multiple installments?",
    answerFr:
      "Bien évidemment ; tout dépend de ton statut, de l’abonnement que tu as choisi ou des sélections que tu as faites, sachant que la somme minimale est de 100 € à titre de redevance pour une consultation en matière juridique.\n\nSinon, pour le cocooning touristique, l’échelonnement de ton paiement est fixé de façon automatique en fonction du temps de préparation qu’il te reste avant le départ pour le séjour auquel tu t’inscris.",
    answerEn:
      "Yes, installment plans are available depending on your client profile and chosen package (with a base rate of €100 for an initial legal consultation).\n\nFor touristic cocooning retreats, payment schedules are automatically calibrated according to the preparation time remaining prior to departure.",
  },
  {
    id: "pourquoi-un-voyage",
    category: "sejour",
    questionFr: "Pourquoi un voyage ?",
    questionEn: "Why travel?",
    answerFr:
      "D’abord pourquoi pas ? Et ensuite parce que nous souhaitons pour vous, le maximum de plaisir contre le minimum de dépense. Et enfin, parce que nous serions heureux de vous faire découvrir de nouveaux horizons, et de nouvelles personnes.\n\nNous organisons donc un voyage d’agrément pour vous permettre de vous changer les idées, car la vie en général, et le combat judiciaire en particulier, sous quelque forme que ce soit, sont assez violents, émotionnellement parlant.\n\nNous sélectionnons avec soin pour vous, des destinations particulièrement adaptées à votre confort et à votre bien-être.",
    answerEn:
      "First of all, why not? And secondly, because we want you to experience maximum pleasure for minimal expenditure. Finally, because we would be delighted to introduce you to new horizons and new people.\n\nWe therefore organize a leisure journey to allow you to disconnect and clear your mind, because life in general, and legal battles in particular, in whatever form, are emotionally demanding.\n\nWe carefully select destinations tailored to your utmost comfort and well-being.",
  },
  {
    id: "conditions-sejour",
    category: "sejour",
    questionFr: "Quelles sont les conditions du séjour ?",
    questionEn: "What are the terms and conditions of the stay?",
    answerFr:
      "Elles sont minutieusement élaborées en fonction du profil individuel de chaque pensionnaire : type d’alimentation, âge, sexe, préférences diverses.\n\nNous avons fourni des précisions sur notre site ; mais vous aurez toujours auprès de General Esquire, un interlocuteur fiable pour vous renseigner et au besoin, prendre en considération vos préoccupations.\n\nNous rappelons qu’il y a deux voyages par année, en début et en milieu d’année, et que pour des raisons de logistique, le convoi idéal est de dix personnes.",
    answerEn:
      "Stays are meticulously tailored to each guest's individual profile: dietary preferences, age, comfort requirements, and personal interests.\n\nWe organize two curated group trips per year (early and mid-year), with each cohort strictly limited to ten guests to ensure exceptional hospitality, privacy, and dedicated care.",
  },
  {
    id: "annulation-remboursement",
    category: "tarifs",
    questionFr: "Puis-je obtenir l’annulation et le remboursement d’un paiement ?",
    questionEn: "Can I cancel and receive a refund?",
    answerFr:
      "Bien évidemment, toute commande est annulable et remboursable à condition que cette demande ait été sollicitée suffisamment tôt, c’est-à-dire que General Esquire ou ses partenaires, par exemple un auxiliaire de justice engagé par nos soins ou l’agence de voyage ou tout autre prestataire dans le cadre du séjour, n’aient pas déjà engagé des dépenses dont ils ne peuvent obtenir compensation.",
    answerEn:
      "Yes, orders and bookings are cancellable and refundable provided the request is submitted before General Esquire or its partners (legal bailiffs, airlines, luxury travel providers) have incurred non-recoverable commitments and expenses.",
  },
  {
    id: "dispositions-voyage",
    category: "sejour",
    questionFr: "Dois-je prendre des dispositions particulières pour le voyage ?",
    questionEn: "Do I need to make special travel arrangements?",
    answerFr:
      "Pas outre mesure, puisqu’il s’agit d’un séjour préparé longtemps à l’avance, ce qui permet, dans le cadre d’une coopération transparente, d’écarter toutes les situations de surprise désagréable.\n\nGeneral Esquire vous tiendra informé(e), s’il y a des prérequis particuliers tels des exigences sanitaires ou administratives de la part des autorités impliquées dans le processus du séjour, à quelque niveau que ce soit.\n\nLe cas échéant, et dans le respect de la réglementation en vigueur, vous pourrez ramener avec vous, des étrennes ou objets artisanaux confectionnés pour vous ou achetés en votre nom par General Esquire.\n\nLe séjour des mineurs est possible s’ils sont accompagnés d’un parent ; ce qui vaut pour les personnes handicapées qui justifient d’un avis médical favorable.",
    answerEn:
      "No extensive arrangements are needed, as all retreats are planned well in advance with total transparency.\n\nGeneral Esquire will guide you through all administrative and health requirements from relevant authorities. You may also bring back authentic handcrafted keepsakes procured in compliance with regulations.\n\nMinors are welcome when accompanied by a parent, as are travelers with disabilities upon medical clearance.",
  },
];

export default function FAQSection() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(
    "qui-est-general-esquire"
  );

  const categories = [
    {
      id: "all",
      labelFr: "Toutes les questions",
      labelEn: "All questions",
      count: FAQ_ITEMS.length,
    },
    {
      id: "general",
      labelFr: "Qui sommes nous ?",
      labelEn: "Who We Are",
      count: FAQ_ITEMS.filter((i) => i.category === "general").length,
    },
    {
      id: "pourquoi",
      labelFr: "Notre plus-value",
      labelEn: "Our Value Proposition",
      count: FAQ_ITEMS.filter((i) => i.category === "pourquoi").length,
    },
    {
      id: "tarifs",
      labelFr: "Tarifs & Paiements",
      labelEn: "Pricing & Payments",
      count: FAQ_ITEMS.filter((i) => i.category === "tarifs").length,
    },
    {
      id: "sejour",
      labelFr: "Notre bonus",
      labelEn: "Our Bonus",
      count: FAQ_ITEMS.filter((i) => i.category === "sejour").length,
    },
  ];

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const question = (lang === "fr" ? item.questionFr : item.questionEn).toLowerCase();
      const answer = (lang === "fr" ? item.answerFr : item.answerEn).toLowerCase();
      const bullets = (lang === "fr" ? item.bulletsFr : item.bulletsEn)
        ?.map((b) => `${b.label} ${b.text}`)
        .join(" ")
        .toLowerCase() || "";

      return (
        question.includes(q) ||
        answer.includes(q) ||
        bullets.includes(q)
      );
    });
  }, [activeCategory, searchQuery, lang]);

  const toggleItem = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq-general-esquire"
      className="w-full mt-20 pt-16 border-t border-[#C5A059]/30 relative"
      aria-label="Foire Aux Questions"
    >
      {/* Halo d'ambiance dorée */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* En-tête de la FAQ */}
      <div className="text-center max-w-4xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 font-cinzel text-xs text-[#C5A059] tracking-[0.3em] uppercase border border-[#C5A059]/40 px-4 py-1.5 rounded-full bg-[#131513]/90 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(197,160,89,0.15)]">
          <span>✦</span>
          <span>{lang === "fr" ? "Clarifications & Engagements" : "Clarity & Commitments"}</span>
          <span>✦</span>
        </div>

        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-[#E9D18F] mb-4 uppercase tracking-widest drop-shadow-md">
          {lang === "fr" ? "Foire Aux Questions" : "Frequently Asked Questions"}
        </h2>

        <p className="font-cormorant text-lg sm:text-xl text-[#cabfa6] leading-relaxed max-w-3xl mx-auto">
          {lang === "fr"
            ? "Toutes les réponses claires et sans détour sur notre cabinet, nos méthodes juridiques, nos tarifs et nos séjours de cocooning touristique."
            : "Direct and transparent answers regarding our legal practice, methodologies, pricing, and restorative touristic retreats."}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
          <span className="text-[#C5A059] text-sm">◆</span>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
        </div>
      </div>

      {/* Barre de recherche instantanée */}
      <div className="max-w-2xl mx-auto mb-8 relative z-10">
        <div className="relative flex items-center bg-[#131513] border border-[#C5A059]/40 focus-within:border-[#E9D18F] rounded-2xl shadow-[0_0_20px_rgba(197,160,89,0.12)] transition-all duration-300">
          <span className="pl-4 pr-2 text-[#C5A059] text-lg select-none">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "fr"
                ? "Rechercher une question, mot-clé (ex: tarif, plaidoirie, avocat, séjour)..."
                : "Search a question or keyword (e.g. pricing, court, retreat)..."
            }
            className="w-full bg-transparent text-[#EDE4CF] placeholder-[#cabfa6]/50 py-3.5 pr-10 text-sm sm:text-base font-cormorant focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-[#C5A059] hover:text-[#E9D18F] p-1 text-sm rounded-full transition-colors cursor-pointer"
              title="Effacer la recherche"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filtres par catégories */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 relative z-10">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-cinzel text-xs tracking-wider uppercase transition-all duration-300 border cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black border-transparent shadow-[0_0_15px_rgba(197,160,89,0.35)] font-bold scale-105"
                  : "bg-[#131513] text-[#EDE4CF]/80 border-[#C5A059]/30 hover:border-[#E9D18F] hover:text-[#E9D18F]"
              }`}
            >
              <span>{lang === "fr" ? cat.labelFr : cat.labelEn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-black/25 text-black font-bold"
                    : "bg-[#C5A059]/15 text-[#C5A059]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barre d'actions : Compteur + Bouton Tout Replier */}
      <div className="max-w-4xl mx-auto mb-6 px-2 flex items-center justify-between text-xs font-cinzel text-[#C5A059] relative z-10">
        <span>
          {filteredItems.length}{" "}
          {lang === "fr"
            ? filteredItems.length > 1
              ? "questions trouvées"
              : "question trouvée"
            : "questions found"}
        </span>

        {expandedId && (
          <button
            onClick={() => setExpandedId(null)}
            className="hover:text-[#E9D18F] transition-colors underline decoration-[#C5A059]/40 underline-offset-4 cursor-pointer"
          >
            {lang === "fr" ? "Tout replier" : "Collapse all"}
          </button>
        )}
      </div>

      {/* Liste des Questions / Réponses (Accordéons) */}
      <div className="max-w-4xl mx-auto space-y-4 relative z-10">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            const question = lang === "fr" ? item.questionFr : item.questionEn;
            const answer = lang === "fr" ? item.answerFr : item.answerEn;
            const bullets = lang === "fr" ? item.bulletsFr : item.bulletsEn;
            const conclusion =
              lang === "fr" ? item.conclusionFr : item.conclusionEn;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "bg-[#161816] border-[#E9D18F] shadow-[0_0_25px_rgba(197,160,89,0.2)]"
                    : "bg-[#131513]/90 border-[#C5A059]/25 hover:border-[#C5A059]/60 hover:bg-[#151715]"
                }`}
              >
                {/* En-tête cliquable */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none group"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="font-cinzel text-xs sm:text-sm font-bold text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </span>
                    <div>
                      <h3
                        className={`font-cinzel text-base sm:text-lg md:text-xl font-bold leading-snug transition-colors ${
                          isExpanded
                            ? "text-[#E9D18F]"
                            : "text-[#EDE4CF] group-hover:text-[#E9D18F]"
                        }`}
                      >
                        {question}
                      </h3>
                    </div>
                  </div>

                  {/* Bouton toggle rond avec flèche animée */}
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isExpanded
                        ? "bg-[#C5A059] text-black border-[#E9D18F] rotate-180 shadow-[0_0_10px_rgba(197,160,89,0.5)]"
                        : "bg-[#131513] text-[#C5A059] border-[#C5A059]/40 group-hover:border-[#E9D18F] group-hover:text-[#E9D18F]"
                    }`}
                  >
                    <svg
                      className="w-4 h-4 fill-current transition-transform duration-300"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </div>
                </button>

                {/* Contenu Dépliable avec animation */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-[1400px] opacity-100 pb-6 px-5 sm:px-6 pt-0"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="border-t border-[#C5A059]/20 pt-4 space-y-4 font-cormorant text-base sm:text-lg text-[#EDE4CF]/90 leading-relaxed">
                    {/* Paragraphe principal */}
                    <p className="whitespace-pre-line">{answer}</p>

                    {/* Liste à puces pour les profils (avocat, institution, chef d'entreprise, particulier) */}
                    {bullets && bullets.length > 0 && (
                      <div className="space-y-3 pt-2">
                        {bullets.map((b, bIdx) => (
                          <div
                            key={bIdx}
                            className="bg-[#111211] border-l-2 border-[#C5A059] p-3.5 sm:p-4 rounded-r-xl space-y-1"
                          >
                            <span className="font-cinzel text-xs sm:text-sm font-bold text-[#E9D18F] uppercase tracking-wide block">
                              {b.label}
                            </span>
                            <p className="text-[#cabfa6] text-sm sm:text-base leading-relaxed">
                              {b.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Conclusion forte si présente */}
                    {conclusion && (
                      <div className="p-3.5 sm:p-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl text-[#E9D18F] font-semibold italic text-base sm:text-lg">
                        {conclusion}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-[#131513]/70 border border-[#C5A059]/25 rounded-3xl p-8">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="font-cinzel text-base sm:text-lg text-[#E9D18F] font-bold mb-2">
              {lang === "fr"
                ? "Aucune question ne correspond à votre recherche"
                : "No matching questions found"}
            </p>
            <p className="font-cormorant text-sm sm:text-base text-[#cabfa6] mb-4">
              {lang === "fr"
                ? "Essayez un autre mot-clé ou réinitialisez les filtres."
                : "Try a different keyword or reset filters."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-6 py-2 rounded-full bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#E9D18F] hover:text-black font-cinzel text-xs uppercase tracking-wider transition-all cursor-pointer border border-[#C5A059]/40"
            >
              {lang === "fr" ? "Réinitialiser les filtres" : "Reset filters"}
            </button>
          </div>
        )}
      </div>

      {/* Bloc d'appel à l'action final sous la FAQ */}
      <div className="max-w-4xl mx-auto mt-14 bg-gradient-to-b from-[#161816] to-[#101210] border border-[#C5A059]/40 rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_35px_rgba(197,160,89,0.18)] relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <span className="font-cinzel text-xs text-[#C5A059] tracking-[0.28em] uppercase block mb-2">
          {lang === "fr" ? "Une question personnalisée ?" : "Have a specific question?"}
        </span>
        <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#E9D18F] mb-4 uppercase tracking-wider">
          {lang === "fr"
            ? "Discutez directement avec un juriste de notre cabinet"
            : "Speak directly with our legal advisory team"}
        </h3>
        <p className="font-cormorant text-lg text-[#cabfa6] max-w-2xl mx-auto mb-8 leading-relaxed">
          {lang === "fr"
            ? "Avant tout engagement, nous prenons le temps d'analyser vos besoins et de définir ensemble la meilleure stratégie pour vos affaires."
            : "Before any commitment, we take the time to evaluate your unique circumstances and define the most effective strategy for your needs."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/conseil-juridique"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E9D18F] text-black font-cinzel font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,160,89,0.35)]"
          >
            {lang === "fr" ? "Demander une consultation →" : "Request a consultation →"}
          </Link>
          <Link
            href="/cocooning-touristique"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#131513] text-[#E9D18F] border border-[#C5A059]/50 hover:bg-[#C5A059]/15 font-cinzel font-semibold text-xs uppercase tracking-widest transition-all"
          >
            {lang === "fr" ? "Découvrir le cocooning touristique" : "Discover touristic cocooning"}
          </Link>
        </div>
      </div>
    </section>
  );
}
