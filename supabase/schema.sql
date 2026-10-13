-- ============================================================
-- GENERAL ESQUIRE -- SCHEMA SUPABASE COMPLET
-- Cabinet de Conseil Juridique & Agence Chrysalides
-- ============================================================
-- Copiez ce SQL dans : Supabase Dashboard > SQL Editor > New Query
-- puis cliquez "Run"
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. TABLE: actualites
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.actualites (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  subtitle      TEXT,
  summary       TEXT        NOT NULL,
  content       TEXT        NOT NULL,
  category      TEXT        NOT NULL DEFAULT 'Annonce',
  date          DATE        NOT NULL DEFAULT CURRENT_DATE,
  image_url     TEXT        NOT NULL DEFAULT '/images/Femmezen2.jpg',
  author        TEXT        NOT NULL DEFAULT 'Administration General Esquire',
  is_featured   BOOLEAN     NOT NULL DEFAULT false,
  is_published  BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 2. TABLE: clients
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.clients (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name         TEXT        NOT NULL,
  email             TEXT        NOT NULL UNIQUE,
  phone             TEXT,
  profile_type      TEXT        NOT NULL DEFAULT 'Particulier',
  requested_service TEXT        NOT NULL,
  message           TEXT,
  status            TEXT        NOT NULL DEFAULT 'Nouveau',
  nationality       TEXT,
  country           TEXT,
  registered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 3. TABLE: paiements
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.paiements (
  id             UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id      UUID          REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name    TEXT          NOT NULL,
  client_email   TEXT,
  service        TEXT          NOT NULL,
  amount         NUMERIC(10,2) NOT NULL,
  currency       TEXT          NOT NULL DEFAULT 'EUR',
  status         TEXT          NOT NULL DEFAULT 'En attente',
  payment_method TEXT          NOT NULL DEFAULT 'Carte Bancaire',
  notes          TEXT,
  paid_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 4. TABLE: reservations (sejours Chrysalides)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reservations (
  id               UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id        UUID          REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name      TEXT          NOT NULL,
  client_email     TEXT          NOT NULL,
  client_phone     TEXT,
  sejour_type      TEXT          NOT NULL DEFAULT 'Chrysalides Standard',
  date_arrivee     DATE          NOT NULL,
  date_depart      DATE          NOT NULL,
  nb_personnes     INTEGER       NOT NULL DEFAULT 1,
  montant_total    NUMERIC(10,2) NOT NULL,
  acompte_verse    NUMERIC(10,2) DEFAULT 0,
  statut           TEXT          NOT NULL DEFAULT 'En attente',
  besoins_speciaux TEXT,
  notes_admin      TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 5. TABLE: contacts (formulaire public)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contacts (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name        TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  phone            TEXT,
  subject          TEXT        NOT NULL,
  message          TEXT        NOT NULL,
  profile_type     TEXT,
  service_interest TEXT,
  is_read          BOOLEAN     NOT NULL DEFAULT false,
  is_replied       BOOLEAN     NOT NULL DEFAULT false,
  replied_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 6. TABLE: rendez_vous (consultations juridiques)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rendez_vous (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id     UUID          REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name   TEXT          NOT NULL,
  client_email  TEXT          NOT NULL,
  client_phone  TEXT,
  type_rdv      TEXT          NOT NULL DEFAULT 'Consultation Initiale',
  date_rdv      TIMESTAMPTZ   NOT NULL,
  duree_minutes INTEGER       NOT NULL DEFAULT 60,
  lieu          TEXT          DEFAULT 'Cabinet Paris',
  statut        TEXT          NOT NULL DEFAULT 'Confirme',
  notes         TEXT,
  honoraires    NUMERIC(10,2),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 7. TABLE: temoignages (avis clients)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.temoignages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT        NOT NULL,
  client_role TEXT,
  content     TEXT        NOT NULL,
  note        INTEGER     NOT NULL DEFAULT 5,
  service     TEXT,
  is_approved BOOLEAN     NOT NULL DEFAULT false,
  is_featured BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 8. TABLE: demandes_clients (formulaire demande client)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.demandes_clients (
  id            TEXT        PRIMARY KEY,
  full_name     TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  phone         TEXT,
  structure     TEXT,
  country       TEXT,
  subject       TEXT        NOT NULL,
  message       TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'Nouveau',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 9. TABLE: activity_logs (journal d'audit admin)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id          TEXT        PRIMARY KEY,
  admin_email TEXT        NOT NULL,
  action_type TEXT        NOT NULL,
  client_name TEXT        NOT NULL,
  client_email TEXT       NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- 10. INDEXES pour la performance
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_actualites_category     ON public.actualites (category);
CREATE INDEX IF NOT EXISTS idx_actualites_is_featured  ON public.actualites (is_featured);
CREATE INDEX IF NOT EXISTS idx_actualites_is_published ON public.actualites (is_published);
CREATE INDEX IF NOT EXISTS idx_actualites_date         ON public.actualites (date DESC);
CREATE INDEX IF NOT EXISTS idx_clients_email           ON public.clients (email);
CREATE INDEX IF NOT EXISTS idx_clients_profile_type    ON public.clients (profile_type);
CREATE INDEX IF NOT EXISTS idx_clients_status          ON public.clients (status);
CREATE INDEX IF NOT EXISTS idx_paiements_client_id     ON public.paiements (client_id);
CREATE INDEX IF NOT EXISTS idx_paiements_status        ON public.paiements (status);
CREATE INDEX IF NOT EXISTS idx_reservations_statut     ON public.reservations (statut);
CREATE INDEX IF NOT EXISTS idx_reservations_dates      ON public.reservations (date_arrivee, date_depart);
CREATE INDEX IF NOT EXISTS idx_contacts_is_read        ON public.contacts (is_read);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_date        ON public.rendez_vous (date_rdv);
CREATE INDEX IF NOT EXISTS idx_rendez_vous_statut      ON public.rendez_vous (statut);

-- ─────────────────────────────────────────────────────────────
-- 9. TRIGGER auto updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_actualites_updated_at
  BEFORE UPDATE ON public.actualites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_paiements_updated_at
  BEFORE UPDATE ON public.paiements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_rendez_vous_updated_at
  BEFORE UPDATE ON public.rendez_vous
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.actualites   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rendez_vous  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temoignages  ENABLE ROW LEVEL SECURITY;

-- Lecture publique des actualites publiees
CREATE POLICY "actualites_public_read"
  ON public.actualites FOR SELECT
  USING (is_published = true);

-- Admin peut tout faire (service_role bypasses RLS by default)
-- Formulaire de contact: tout le monde peut inserer
CREATE POLICY "contacts_public_insert"
  ON public.contacts FOR INSERT
  WITH CHECK (true);

-- Formulaire de reservation: tout le monde peut inserer
CREATE POLICY "reservations_public_insert"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

-- Temoignages approuves: lecture publique
CREATE POLICY "temoignages_public_read"
  ON public.temoignages FOR SELECT
  USING (is_approved = true);

-- Clients, demandes_clients, activity_logs, paiements et droits administrateur :
-- policies definies dans migration_securite_rls.sql (a executer APRES ce fichier).
-- Les anciennes policies USING (true) sur clients / demandes_clients /
-- activity_logs exposaient toutes les donnees clients a la cle anon publique :
-- elles ont ete supprimees le 2026-10-13 (docs/adr/0002-securite-donnees-rls.md).

-- ─────────────────────────────────────────────────────────────
-- 11. DONNEES INITIALES (seed)
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.actualites (title, subtitle, summary, content, category, date, image_url, author, is_featured, is_published)
VALUES
(
  'Ouverture des Inscriptions pour le Sejour Cocooning Chrysalides 2027 au Benin',
  'Pension complete de 2 semaines sous le signe de la serenite et de la bienveillance',
  'Les reservations pour l edition annuelle du sejour Chrysalides au Benin sont desormais ouvertes. Places limitees a 10 pensionnaires pour un accompagnement d exception.',
  'General Esquire et son enseigne Chrysalides sont heureux d annoncer le lancement des inscriptions pour le grand sejour de cocooning touristique annuel au Benin. Au debut de chaque annee, venez vous evader, decouvrir un patrimoine culturel et gastronomique d exception, et beneficier d une prise en charge bienveillante et d un accompagnement psychologique sur mesure.',
  'Chrysalides', '2026-07-20', '/images/Femmezen2.jpg', 'General Esquire', true, true
),
(
  'Conference Exclusive : Prevention des Risques Juridiques pour Dirigeants d Entreprises',
  'Proteger sa reputation et son patrimoine face aux sanctions administratives',
  'General Esquire organise un petit-dejeuner debat a Paris sur la gestion anticipee des litiges commerciaux et des fermetures d etablissements.',
  'Le risque de fermeture d etablissement ou de poursuites judiciaires peut lourdement impacter le patrimoine et la reputation des chefs d entreprise. Lors de ce seminaire interactif, La société General Esquire partagera ses meilleures strategies precontentieuses pour anticiper les controles et proteger efficacement vos actifs.',
  'Conseil Juridique', '2026-07-15', '/images/bannerchef.png', 'Service Juridique', true, true
),
(
  'Partenariat Culturel : Recitals et Evenements Artistiques lors des Sejours Chrysalides',
  'Celebrer la resilience par la musique, la poesie et les talents partages',
  'En enrichissant ses sejours de moments d expression artistique et de spectacles vivants, Chrysalides offre une veritable parenthese de resilience et de joie.',
  'Chrysalides devoile son nouveau programme d animations culturelles pour les soirees de detente. En plus des promenades guidees et des soins, les pensionnaires pourront assister a des recitals de musique traditionnelle.',
  'Evenement', '2026-07-10', '/images/Chant2.jpg', 'Equipe Animation', false, true
),
(
  'Mise a Disposition de Services d Assistance Gratuite pour les Particuliers',
  'Scanner, photocopieur et traductions offertes pour vos demarches precontentieuses',
  'Fidele a ses engagements de proximite et d ecoute, General Esquire elargit son offre de services inclus pour tous les particuliers accompagnes par le cabinet.',
  'Dans le cadre de la prise en charge des dossiers individuels, General Esquire garantit a tout de ses client(e)s, personnes physiques, un acces gratuit a ses equipements d impression et de numerisation, ainsi qu une traduction integrale en francais et anglais de leurs pieces.',
  'Annonce', '2026-07-02', '/images/bannerparticulier.png', 'Direction General Esquire', false, true
)
ON CONFLICT DO NOTHING;
