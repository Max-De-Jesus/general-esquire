-- ============================================================
-- GENERAL ESQUIRE -- MIGRATION : sécurité des données (RLS)
-- ============================================================
-- Contexte (audit du 2026-10-13) — failles corrigées :
--   1. clients : policies SELECT/UPDATE `USING (true)` → toute personne
--      munie de la clé anon (publique, livrée dans le site) pouvait lire
--      et modifier TOUS les clients ;
--   2. clients.password_plain : mots de passe des clients stockés EN CLAIR
--      et donc lisibles publiquement via le point 1 ;
--   3. demandes_clients et activity_logs : RLS jamais activée → tables
--      entièrement ouvertes en lecture/écriture ;
--   4. un client pouvait changer son propre statut (ex. « Refusé » →
--      « Accepté ») ;
--   5. l'espace admin ne lisait les données que grâce aux failles 1 et 3.
--
-- Modèle appliqué :
--   * public.is_admin() : vrai si l'email du JWT Supabase figure dans la
--     liste des comptes du cabinet (même liste que
--     supabase/functions/_shared/admin.ts et src/context/AuthContext.tsx) ;
--   * administrateur authentifié : accès complet à toutes les tables ;
--   * client authentifié : lit et met à jour SA fiche (sans pouvoir changer
--     son statut ni son email), lit SES paiements ;
--   * public (anon) : lecture des actualités publiées et des témoignages
--     approuvés, dépôt de formulaires (contacts, réservations,
--     demandes_clients) — jamais de lecture des données clients ;
--   * la fiche client est créée par un trigger sur auth.users (marche même
--     si la confirmation d'email est activée, c.-à-d. sans session).
--
-- Exécution : Supabase Dashboard > SQL Editor > coller > Run.
-- Idempotente (rejouable). À exécuter APRÈS schema.sql.
-- password_plain : supprimée si présente. En production, la colonne n'a
-- jamais existé (constat du 2026-10-13) : instruction sans effet là-bas.
-- Appliquée en production le 2026-10-13 (docs/adr/0002-securite-donnees-rls.md).
-- ============================================================

BEGIN;

-- ─── 1. Fonction d'autorisation ─────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(lower(auth.jwt() ->> 'email'), '') IN (
    'admin@generalesquire.com',
    'generalesquire@proton.me',
    'contact@generalesquire.com'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.jwt_email()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT lower(auth.jwt() ->> 'email');
$$;

-- ─── 2. Plus aucun mot de passe en clair ───────────────────
ALTER TABLE public.clients DROP COLUMN IF EXISTS password_plain;

-- ─── 3. RLS activée partout ─────────────────────────────────
ALTER TABLE public.actualites       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paiements        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rendez_vous      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temoignages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demandes_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs    ENABLE ROW LEVEL SECURITY;

-- ─── 4. Suppression de TOUTES les policies existantes ───────
-- La base de production contenait des policies absentes de schema.sql
-- (constat du 2026-10-13 : « Public Full Access Clients » et
-- « Public Full Access Activity Logs » en FOR ALL USING (true), et
-- « demandes_clients_admin_all » en USING (true) pour public).
-- Supprimer une liste de noms connus ne suffit donc pas : on supprime tout
-- sur les tables applicatives, puis on recrée l'ensemble complet ci-dessous.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('actualites', 'clients', 'paiements', 'reservations', 'contacts',
                        'rendez_vous', 'temoignages', 'demandes_clients', 'activity_logs')
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- Policies publiques légitimes (identiques à schema.sql et à la production).
CREATE POLICY "actualites_public_read"     ON public.actualites   FOR SELECT USING (is_published = true);
CREATE POLICY "temoignages_public_read"    ON public.temoignages  FOR SELECT USING (is_approved = true);
CREATE POLICY "contacts_public_insert"     ON public.contacts     FOR INSERT WITH CHECK (true);
CREATE POLICY "reservations_public_insert" ON public.reservations FOR INSERT WITH CHECK (true);

-- ─── 5. Policies ────────────────────────────────────────────
-- Administrateurs : accès complet (lecture, écriture, suppression).
CREATE POLICY "actualites_admin_all"   ON public.actualites   FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "clients_admin_all"      ON public.clients      FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "paiements_admin_all"    ON public.paiements    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "reservations_admin_all" ON public.reservations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "contacts_admin_all"     ON public.contacts     FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "rendez_vous_admin_all"  ON public.rendez_vous  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "temoignages_admin_all"  ON public.temoignages  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "demandes_clients_admin_all" ON public.demandes_clients FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "activity_logs_admin_all"    ON public.activity_logs    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Client authentifié : sa propre fiche uniquement.
CREATE POLICY "clients_self_select" ON public.clients FOR SELECT TO authenticated
  USING (lower(email) = public.jwt_email());
CREATE POLICY "clients_self_insert" ON public.clients FOR INSERT TO authenticated
  WITH CHECK (lower(email) = public.jwt_email());
CREATE POLICY "clients_self_update" ON public.clients FOR UPDATE TO authenticated
  USING (lower(email) = public.jwt_email())
  WITH CHECK (lower(email) = public.jwt_email());

-- Client authentifié : lecture de ses paiements (aucune écriture : seules les
-- Edge Functions, en service_role, créent et mettent à jour les paiements).
CREATE POLICY "paiements_self_select" ON public.paiements FOR SELECT TO authenticated
  USING (lower(client_email) = public.jwt_email());

-- Formulaires publics de demande (pages conseil-juridique, cocooning…).
CREATE POLICY "demandes_clients_form_insert" ON public.demandes_clients FOR INSERT TO anon, authenticated
  WITH CHECK (true);


-- ─── 6. Un client ne peut pas changer son statut ni son email ─
CREATE OR REPLACE FUNCTION public.protect_client_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- current_user = rôle de la requête (trigger non SECURITY DEFINER).
  -- service_role / postgres (Edge Functions, SQL Editor) ne sont pas bridés.
  IF current_user IN ('anon', 'authenticated') AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'Accepté';
    ELSE
      NEW.status := OLD.status;
      NEW.email  := OLD.email;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clients_protect_fields ON public.clients;
CREATE TRIGGER trg_clients_protect_fields
  BEFORE INSERT OR UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.protect_client_fields();

-- ─── 7. Fiche client créée à l'inscription (côté serveur) ───
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.clients (email, full_name, phone, profile_type, requested_service, status)
    VALUES (
      lower(NEW.email),
      coalesce(nullif(NEW.raw_user_meta_data ->> 'full_name', ''), split_part(NEW.email, '@', 1)),
      nullif(NEW.raw_user_meta_data ->> 'phone', ''),
      coalesce(nullif(NEW.raw_user_meta_data ->> 'profile_type', ''), 'Particulier'),
      'Inscription Compte Client',
      'Accepté'
    )
    ON CONFLICT (email) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Ne jamais bloquer une inscription à cause de la fiche client.
    RAISE WARNING 'handle_new_auth_user: %', SQLERRM;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_client ON auth.users;
CREATE TRIGGER on_auth_user_created_client
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

COMMIT;
