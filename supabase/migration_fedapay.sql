-- ============================================================
-- GENERAL ESQUIRE -- MIGRATION : paiements FedaPay
-- ============================================================
-- Décision : docs/adr/0001-paiement-fedapay.md.
-- Ajoute à public.paiements la trace du prestataire de paiement :
--   provider                : 'fedapay' (NULL pour les paiements historiques)
--   provider_transaction_id : id de la transaction FedaPay
--   provider_status         : dernier statut FedaPay vérifié par l'API
--   charged_amount          : montant réellement demandé au prestataire
--                             (entier, unité de la devise : FCFA)
--   charged_currency        : devise réellement demandée ('XOF')
-- amount / currency restent le prix catalogue en EUR.
--
-- Exécution : Supabase Dashboard > SQL Editor > Run, APRÈS
-- migration_securite_rls.sql. Idempotente.
-- ============================================================

BEGIN;

ALTER TABLE public.paiements
  ADD COLUMN IF NOT EXISTS provider                TEXT,
  ADD COLUMN IF NOT EXISTS provider_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_status         TEXT,
  ADD COLUMN IF NOT EXISTS charged_amount          BIGINT,
  ADD COLUMN IF NOT EXISTS charged_currency        TEXT;

-- Une transaction FedaPay ne peut être rattachée qu'à un seul paiement.
CREATE UNIQUE INDEX IF NOT EXISTS uq_paiements_provider_tx
  ON public.paiements (provider, provider_transaction_id)
  WHERE provider_transaction_id IS NOT NULL;

COMMIT;
