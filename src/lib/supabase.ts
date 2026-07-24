import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://szyirafviiswvaooubzs.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWlyYWZ2aWlzd3Zhb291YnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NTIzMTksImV4cCI6MjEwMDMyODMxOX0.eohPjJyvz-OqLFe1-2W3xhV4Ia6lkJHg3ScvrUemaVw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types TypeScript alignés sur le schéma Supabase ──────────────────────────

export interface Actualite {
  id: string;
  title: string;
  subtitle?: string | null;
  summary: string;
  content: string;
  category: "Evenement" | "Conseil Juridique" | "Chrysalides" | "Annonce";
  date: string;
  image_url: string;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_type: "Particulier" | "Chef d'Entreprise" | "Institution" | "Professionnel du Droit";
  requested_service: string;
  message?: string | null;
  status: "Nouveau" | "En cours" | "Termine" | "Archive";
  nationality?: string | null;
  country?: string | null;
  registered_at: string;
  updated_at: string;
}

export interface Paiement {
  id: string;
  client_id?: string | null;
  client_name: string;
  client_email?: string | null;
  service: string;
  amount: number;
  currency: string;
  status: "Paye" | "En attente" | "Rembourse" | "Annule";
  payment_method: "Carte Bancaire" | "Virement" | "PayPal" | "Especes" | "Cheque";
  notes?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  client_id?: string | null;
  client_name: string;
  client_email: string;
  client_phone?: string | null;
  sejour_type:
    | "Chrysalides Standard"
    | "Chrysalides Premium"
    | "Chrysalides VIP"
    | "Juridique + Detente"
    | "Personnalise";
  date_arrivee: string;
  date_depart: string;
  nb_personnes: number;
  montant_total: number;
  acompte_verse?: number | null;
  statut: "En attente" | "Confirmee" | "En cours" | "Terminee" | "Annulee";
  besoins_speciaux?: string | null;
  notes_admin?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  profile_type?: string | null;
  service_interest?: string | null;
  is_read: boolean;
  is_replied: boolean;
  replied_at?: string | null;
  created_at: string;
}

export interface RendezVous {
  id: string;
  client_id?: string | null;
  client_name: string;
  client_email: string;
  client_phone?: string | null;
  type_rdv: string;
  date_rdv: string;
  duree_minutes: number;
  lieu?: string | null;
  statut: string;
  notes?: string | null;
  honoraires?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Temoignage {
  id: string;
  client_name: string;
  client_role?: string | null;
  content: string;
  note: number;
  service?: string | null;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}
