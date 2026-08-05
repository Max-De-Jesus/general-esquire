export interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string;
  category: "Veille Juridique" | "Espace Activités" | "Événementiels" | "Activités événementielles" | "Communiqués" | "Communiqué" | "Événement" | "Événements" | "Evenement" | "Conseil Juridique" | "Chrysalides" | "Annonce" | "Annonces";
  date: string;
  imageUrl: string;
  images?: string[];
  author: string;
  isFeatured?: boolean;
  isPublished?: boolean;
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

// Initial News (vidé selon la demande de l'utilisateur pour laisser la main à l'Admin)
export const INITIAL_NEWS: NewsItem[] = [];

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
    amount: 1500,
    currency: "EUR",
    date: "2026-07-21 16:30",
    status: "Payé",
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
];
