-- ============================================================
-- GENERAL ESQUIRE -- MIGRATION : galerie d'images sur actualites
-- ============================================================
-- Le code frontend (formulaire admin actualités, page publique) gère
-- une galerie de plusieurs images par article, mais schema.sql ne
-- définissait que la colonne image_url (image de couverture).
-- Copiez ce SQL dans : Supabase Dashboard > SQL Editor > New Query
-- puis cliquez "Run" (opération idempotente, sûre à rejouer).
-- ============================================================

ALTER TABLE public.actualites
  ADD COLUMN IF NOT EXISTS images JSONB;

COMMENT ON COLUMN public.actualites.images IS
  'Galerie complète des images de l''article (URLs ou data URLs compressées). image_url reste la couverture principale.';
