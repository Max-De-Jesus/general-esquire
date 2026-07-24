export interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  category: "Événement" | "Conseil Juridique" | "Chrysalides" | "Annonce";
  date: string;
  imageUrl: string;
  author: string;
  isFeatured?: boolean;
}

export interface PaymentItem {
  id: string;
  clientName: string;
  clientEmail: string;
  service: string;
  amount: number;
  currency: string;
  date: string;
  status: "Payé" | "En attente" | "Remboursé";
  paymentMethod: "Carte Bancaire" | "Virement" | "PayPal";
}

export interface ClientItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profileType: "Particulier" | "Chef d'Entreprise" | "Institution" | "Professionnel du Droit";
  requestedService: string;
  registeredAt: string;
  status: "Nouveau" | "En cours" | "Terminé";
}

// Initial Mock News
export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Ouverture des Inscriptions pour le Séjour Cocooning Chrysalides 2027 au Bénin",
    subtitle: "Pension complète de 2 semaines sous le signe de la sérénité et de la bienveillance",
    summary: "Les réservations pour l'édition annuelle du séjour Chrysalides au Bénin sont désormais ouvertes. Places limitées à 10 pensionnaires pour un accompagnement d'exception.",
    content: `General Esquire et son enseigne Chrysalides sont heureux d'annoncer le lancement des inscriptions pour le grand séjour de cocooning touristique annuel au Bénin.

Du 1er au 15 janvier 2027, venez vous évader, découvrir un patrimoine culturel et gastronomique d'exception, et bénéficier d'une prise en charge bienveillante et d'un accompagnement psychologique sur mesure.

Au programme :
• Résidence familiale de standing tout confort avec guide personnel dédié.
• Massages, soins corporel et ateliers bien-être quotidiens.
• Excursions guidées à Cotonou, Ouidah et Abomey.
• Pension complète gastronomique mettant à l'honneur les saveurs locales.

N'hésitez pas à vous inscrire dès aujourd'hui auprès de nos équipes.`,
    category: "Chrysalides",
    date: "2026-07-20",
    imageUrl: "/images/Femmezen2.jpg",
    author: "General Esquire",
    isFeatured: true,
  },
  {
    id: "news-2",
    title: "Conférence Exclusive : Prévention des Risques Juridiques pour Dirigeants d'Entreprises",
    subtitle: "Protéger sa réputation et son patrimoine face aux sanctions administratives",
    summary: "General Esquire organise un petit-déjeuner débat à Paris sur la gestion anticipée des litiges commerciaux et des fermetures d'établissements.",
    content: `Le risque de fermeture d'établissement ou de poursuites judiciaires peut lourdement impacter le patrimoine et la réputation des chefs d'entreprise. 

Lors de ce séminaire interactif, Maître General Esquire partagera ses meilleures stratégies précontentieuses pour anticiper les contrôles et protéger efficacement vos actifs.

Lieu : Cabinet General Esquire, Paris.
Nombre de places limité sur réservation.`,
    category: "Conseil Juridique",
    date: "2026-07-15",
    imageUrl: "/images/bannerchef.png",
    author: "Service Juridique",
    isFeatured: true,
  },
  {
    id: "news-3",
    title: "Partenariat Culturel : Récitals & Événements Artistiques lors des Séjours Chrysalides",
    subtitle: "Célébrer la résilience par la musique, la poésie et les talents partagés",
    summary: "En enrichissant ses séjours de moments d'expression artistique et de spectacles vivants, Chrysalides offre une véritable parenthèse de résilience et de joie.",
    content: `Chrysalides dévoile son nouveau programme d'animations culturelles pour les soirées de détente. 

En plus des promenades guidées et des soins, les pensionnaires pourront assister à des récitals de musique traditionnelle, des spectacles vivants et participer s'ils le souhaitent à des scènes ouvertes conviviales.

Parce que l'art et la culture sont de puissants leviers de guérison émotionnelle.`,
    category: "Événement",
    date: "2026-07-10",
    imageUrl: "/images/Chant2.jpg",
    author: "Équipe Animation",
    isFeatured: false,
  },
  {
    id: "news-4",
    title: "Mise à Disposition de Services d'Assistance Gratuite pour les Particuliers",
    subtitle: "Scanner, photocopieur et traductions offertes pour vos démarches précontentieuses",
    summary: "Fidèle à ses engagements de proximité et d'écoute, General Esquire élargit son offre de services inclus pour tous les particuliers accompagnés par le cabinet.",
    content: `Dans le cadre de la prise en charge des dossiers individuels, General Esquire garantit à chaque particulier un accès gratuit à ses équipements d'impression et de numérisation, ainsi qu'une traduction intégrale en français et anglais de leurs pièces justificatives.

Notre priorité : simplifier vos démarches et vous offrir un accompagnement sans stress.`,
    category: "Annonce",
    date: "2026-07-02",
    imageUrl: "/images/bannerparticulier.png",
    author: "Direction General Esquire",
    isFeatured: false,
  },
];

// Initial Mock Payments
export const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: "PAY-9042",
    clientName: "Jean-Paul Delafosse",
    clientEmail: "jp.delafosse@gmail.com",
    service: "Consultation Initiale Particulier",
    amount: 100,
    currency: "EUR",
    date: "2026-07-22 10:14",
    status: "Payé",
    paymentMethod: "Carte Bancaire",
  },
  {
    id: "PAY-9043",
    clientName: "Claire de Saint-Martin",
    clientEmail: "claire.stmartin@entreprise-vital.fr",
    service: "Forfait Cocooning Touristique 2 Semaines",
    amount: 1350,
    currency: "EUR",
    date: "2026-07-21 16:30",
    status: "Payé",
    paymentMethod: "Virement",
  },
  {
    id: "PAY-9044",
    clientName: "Marc-Antoine Vaneau",
    clientEmail: "m.vaneau@cabinet-vaneau.com",
    service: "Accompagnement Juridique Professionnel",
    amount: 450,
    currency: "EUR",
    date: "2026-07-20 09:45",
    status: "Payé",
    paymentMethod: "Carte Bancaire",
  },
  {
    id: "PAY-9045",
    clientName: "Sophie Kowalski",
    clientEmail: "sophie.kowalski@outlook.fr",
    service: "Traduction Documentaire Spécifique (Russe)",
    amount: 80,
    currency: "EUR",
    date: "2026-07-19 14:12",
    status: "En attente",
    paymentMethod: "Virement",
  },
];

// Initial Mock Clients
export const INITIAL_CLIENTS: ClientItem[] = [
  {
    id: "CLI-101",
    fullName: "Jean-Paul Delafosse",
    email: "jp.delafosse@gmail.com",
    phone: "+33 6 12 34 56 78",
    profileType: "Particulier",
    requestedService: "Assistance Litige Bailleur & Logement",
    registeredAt: "2026-07-22",
    status: "Nouveau",
  },
  {
    id: "CLI-102",
    fullName: "Claire de Saint-Martin",
    email: "claire.stmartin@entreprise-vital.fr",
    phone: "+33 6 98 76 54 32",
    profileType: "Chef d'Entreprise",
    requestedService: "Réservation Séjour Chrysalides Bénin 2027",
    registeredAt: "2026-07-21",
    status: "En cours",
  },
  {
    id: "CLI-103",
    fullName: "Marc-Antoine Vaneau",
    email: "m.vaneau@cabinet-vaneau.com",
    phone: "+33 1 42 68 00 11",
    profileType: "Professionnel du Droit",
    requestedService: "Partenariat & Consultation Spécialisée",
    registeredAt: "2026-07-20",
    status: "Terminé",
  },
  {
    id: "CLI-104",
    fullName: "Mairie de Saint-Germain",
    email: "contact@stgermain-mairie.fr",
    phone: "+33 1 39 10 20 30",
    profileType: "Institution",
    requestedService: "Conseil Juridique Collectivité Publique",
    registeredAt: "2026-07-18",
    status: "En cours",
  },
];
