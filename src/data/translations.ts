export type TranslationKey = keyof typeof translations;

export const translations = {
  // ─── NAVBAR & FOOTER ───
  nav_home: { fr: "Accueil", en: "Home" },
  nav_conseil: { fr: "Conseil Juridique", en: "Legal Advisory" },
  nav_particuliers: { fr: "Particuliers", en: "Individuals" },
  nav_cocooning: { fr: "Cocooning Touristique", en: "Tourist Cocooning" },
  nav_entrepreneur: { fr: "Chef d'entreprise", en: "Entrepreneurs" },
  nav_excursions: { fr: "Excursions", en: "Excursions" },
  nav_hebergement: { fr: "Hébergement", en: "Accommodation" },
  nav_institution: { fr: "Institution Publique", en: "Public Institutions" },
  nav_professionnel: { fr: "Professionnel du Droit", en: "Legal Professionals" },
  nav_repas: { fr: "Repas & Gastronomie", en: "Dining & Gastronomy" },
  nav_services: { fr: "SERVICES", en: "SERVICES" },

  // ─── THEME & LANG ───
  theme_light: { fr: "Clair", en: "Light" },
  theme_dark: { fr: "Sombre", en: "Dark" },

  // ─── HERO & COMMON CTAs ───
  back_to_home: { fr: "← RETOUR À L'ACCUEIL", en: "← BACK TO HOME" },
  take_appointment: { fr: "Prendre Rendez-vous →", en: "Book an Appointment →" },
  contact_us: { fr: "Nous Contacter →", en: "Contact Us →" },
  book_stay: { fr: "S'inscrire au Séjour →", en: "Book Your Stay →" },
  our_rates: { fr: "Nos Tarifs", en: "Our Pricing" },
  clarity_transparency: { fr: "Clarté & Transparence", en: "Clarity & Transparency" },
  our_services_tag: { fr: "NOS SERVICES", en: "OUR SERVICES" },

  // ─── CONSEIL JURIDIQUE PAGE ───
  conseil_title: { fr: "CONSEIL JURIDIQUE", en: "LEGAL ADVISORY" },
  conseil_banner_q: { fr: "Avez-vous besoin d'un avis, d'un conseil, ou d'accompagnement juridique ?", en: "Do you need legal advice, guidance, or representation support?" },
  conseil_banner_a: { fr: "VOUS ÊTES AU BON ENDROIT.", en: "YOU ARE IN THE RIGHT PLACE." },
  conseil_intro1: { fr: "Nul n'est censé ignorer la loi, dit l'adage, dans un monde où la loi elle-même, le dénominateur commun par lequel tous nos actes sont jugés, est en constante évolution.", en: "Ignorance of the law is no excuse, as the adage goes, in a world where the law itself—the common denominator by which all our actions are judged—is constantly evolving." },
  conseil_intro2: { fr: "Pour prendre certaines décisions importantes, préserver nos droits et notre responsabilité, ester en justice, ou défendre à une action ou poursuite, nous avons bien souvent besoin d'un avis, d'un conseil ou d'une opinion éclairée.", en: "To make critical decisions, protect our rights and liability, take legal action, or defend against a lawsuit, we often require clear, expert legal counsel." },
  conseil_intro3: { fr: "General Esquire est un cabinet de conseil de premier choix, qui offre en présentiel comme en distanciel, un service d'accompagnement juridique complet qui varie suivant votre profil et vos besoins :", en: "General Esquire is a premier consulting firm offering comprehensive legal support—in person or remotely—tailored to your specific profile and requirements:" },
  conseil_p1_title: { fr: "Vous êtes un Particulier", en: "You are an Individual" },
  conseil_p1_desc: { fr: "Conseil, rédaction de contrats, démarches administratives et quotidiennes.", en: "Advice, contract drafting, administrative and everyday legal procedures." },
  conseil_p2_title: { fr: "Chef d'Entreprise", en: "Business Leader" },
  conseil_p2_desc: { fr: "Veille juridique, contrats commerciaux, négociation et gouvernance.", en: "Legal monitoring, commercial contracts, negotiation, and corporate governance." },
  conseil_p3_title: { fr: "Institution Publique", en: "Public Institution" },
  conseil_p3_desc: { fr: "Consulting juridique international pour personnes morales et ministères.", en: "International legal consulting for public entities and ministries." },
  conseil_p4_title: { fr: "Cocooning Touristique", en: "Tourist Cocooning" },
  conseil_p4_desc: { fr: "Accompagnement humain et séjour de régénération physique et émotionnelle.", en: "Personal support and restorative physical and emotional retreats." },

  form_title: { fr: "Formulaire de Consultation Juridique", en: "Legal Consultation Form" },
  form_sub: { fr: "Posez votre question ou décrivez votre besoin juridique ci-dessous", en: "Ask your question or describe your legal requirement below" },
  form_word_count: { fr: "Mots rédigés :", en: "Words typed:" },
  form_tariff: { fr: "Tarif estimé :", en: "Estimated price:" },
  form_urgent: { fr: "Urgence (traitement sous 24h) :", en: "Urgent (24h turnaround):" },
  form_yes: { fr: "Oui (+ 50% de majoration)", en: "Yes (+50% surcharge)" },
  form_no: { fr: "Non (Traitement standard)", en: "No (Standard turnaround)" },
  form_submit: { fr: "Envoyer ma demande de devis", en: "Submit my quote request" },

  // ─── CHEF D'ENTREPRISE ───
  entrepreneur_title: { fr: "Vous êtes un Chef d'Entreprise", en: "You Are a Business Leader" },
  entrepreneur_subtitle: { fr: "Espace Conseil Juridique", en: "Legal Advisory Desk" },
  entrepreneur_gallery: { fr: "Galerie Rotative", en: "Featured Highlights" },
  entrepreneur_services_title: { fr: "Nous vous proposons…", en: "What We Offer…" },
  entrepreneur_services_sub: { fr: "Sur une base annuelle, mensuelle ou ponctuelle :", en: "On an annual, monthly, or one-off basis:" },

  s_veille_title: { fr: "Veille Juridique", en: "Legal Monitoring" },
  s_veille_desc: { fr: "Suivi des textes de loi et jurisprudences applicables à votre secteur.", en: "Monitoring of laws and jurisprudence relevant to your sector." },
  s_domicilation_title: { fr: "Domiciliation Courrier", en: "Mail Domiciliation" },
  s_domicilation_desc: { fr: "Domiciliation temporaire de vos courriers en cas d'urgence.", en: "Temporary mail domiciliation for urgent requirements." },
  s_formalites_title: { fr: "Assistance Formalités", en: "Formalities Assistance" },
  s_formalites_desc: { fr: "Accompagnement dans vos formalités à forte implication juridique.", en: "Support for legal procedures and compliance." },
  s_conseils_title: { fr: "Conseils Adaptés", en: "Tailored Advice" },
  s_conseils_desc: { fr: "En présentiel, visioconférence, audioconférence ou par écrit.", en: "In-person, video call, phone call, or written advisory." },
  s_traduction_title: { fr: "Traduction Juridique", en: "Legal Translation" },
  s_traduction_desc: { fr: "Français, anglais (inclus), chinois et russe (supplément) de vos documents.", en: "French, English (included), Chinese and Russian (extra) translation." },
  s_redaction_title: { fr: "Rédaction de Contrats", en: "Contract Drafting" },
  s_redaction_desc: { fr: "Contrats, lettres de recrutement, licenciement, courriers administratifs.", en: "Contracts, hiring & dismissal letters, administrative mail." },
  s_negociations_title: { fr: "Négociations Commerciales", en: "Commercial Negotiations" },
  s_negociations_desc: { fr: "Assistance lors de vos négociations commerciales et professionnelles.", en: "Guidance during business and commercial deal negotiations." },
  s_procedures_title: { fr: "Procédures Judiciaires", en: "Judicial Procedures" },
  s_procedures_desc: { fr: "Assistance dans les procédures sans représentation obligatoire.", en: "Assistance in court cases without mandatory attorney representation." },
  s_reseau_title: { fr: "Mise en Relation", en: "Professional Networking" },
  s_reseau_desc: { fr: "Réseau de professionnels du droit, finance, comptabilité et fiscalité.", en: "Network of experts in law, finance, accounting, and tax." },

  rate_annual_title: { fr: "Abonnement Annuel", en: "Annual Plan" },
  rate_annual_price: { fr: "10 000 € / an", en: "€10,000 / year" },
  rate_monthly_title: { fr: "Abonnement Mensuel", en: "Monthly Plan" },
  rate_monthly_price: { fr: "1 000 € / mois", en: "€1,000 / month" },
  rate_oneoff_title: { fr: "Prestation Ponctuelle", en: "One-Off Service" },
  rate_oneoff_price: { fr: "Au gré à gré", en: "Custom Quote" },

  // ─── EXCURSIONS ───
  excursions_title: { fr: "Excursions au Bénin", en: "Excursions in Benin" },
  excursions_subtitle: { fr: "« Bienvenue dans un monde d'émerveillement »", en: "“Welcome to a World of Wonder”" },
  excursions_guide_title: { fr: "Votre Guide Personnel", en: "Your Personal Guide" },
  excursions_prep_title: { fr: "3 Mois de Préparation Minutieuse", en: "3 Months of Meticulous Preparation" },
  excursions_heart_title: { fr: "Au Cœur de la Découverte", en: "At the Heart of Discovery" },
  excursions_must_title: { fr: "Les Incontournables du Bénin", en: "Benin's Must-See Destinations" },
  excursions_gallery_title: { fr: "Galerie des Excursions", en: "Excursions Gallery" },

  // ─── HEBERGEMENT ───
  hebergement_title: { fr: "Hébergement", en: "Accommodation" },
  hebergement_subtitle: { fr: "« Bienvenue dans un monde de bienveillance »", en: "“Welcome to a World of Kindness”" },
  hebergement_how_title: { fr: "Comment ça marche ?", en: "How Does It Work?" },
  hebergement_arrival_title: { fr: "Arrivée au Bénin", en: "Arrival in Benin" },
  hebergement_strip_title: { fr: "Vous serez bien chez nous", en: "You Will Feel at Home" },

  // ─── INSTITUTIONS PUBLIQUES ───
  institution_title: { fr: "Vous êtes une Institution Publique", en: "You Are a Public Institution" },
  institution_methode_title: { fr: "Notre Méthode de Travail", en: "Our Working Method" },
  institution_rate1_title: { fr: "Forfait Rédaction", en: "Drafting Package" },
  institution_rate2_title: { fr: "Pages Supplémentaires", en: "Additional Pages" },
  institution_rate3_title: { fr: "Consultation Orale", en: "Oral Advisory" },

  // ─── REPAS & GASTRONOMIE ───
  repas_title: { fr: "Repas & Gastronomie", en: "Dining & Gastronomy" },
  repas_subtitle: { fr: "« Bienvenue dans un monde de saveurs »", en: "“Welcome to a World of Flavors”" },
  repas_sec1_title: { fr: "Trois Repas Quotidiens Compris", en: "Three Daily Meals Included" },
  repas_sec2_title: { fr: "Une Cuisine Roborative & Épicée", en: "Rich & Flavorful Cuisine" },
  repas_sec3_title: { fr: "Saveurs du Matin & Douceurs", en: "Morning Delights & Snacks" },
  repas_quote: { fr: "« C’est ce qui entre dans ton ventre qui t’appartient. »", en: "“What goes into your stomach belongs to you.”" },
  repas_gallery_title: { fr: "Découvrez la Richesse de Nos Plats", en: "Discover the Richness of Our Dishes" }
} as const;
