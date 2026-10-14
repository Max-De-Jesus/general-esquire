# ADR 0004 — Paiement en ligne exclusivement via Stripe (remplace FedaPay)

- **Statut** : accepté — décision du responsable du projet le 2026-10-13 (« on ne veut plus utiliser FedaPay mais plutôt Stripe ») ; **mise en production en attente** (clés Stripe, déploiement des Edge Functions, webhook — voir « Mise en service »).
- **Date** : 2026-10-13
- **Remplace** : [ADR 0001](0001-paiement-fedapay.md) (FedaPay), qui n'a jamais été mis en production.
- **Revient sur** une décision plus ancienne, notée dans l'ancien README des fonctions : « Stripe / carte bancaire a été retiré du site — décision produit ». Stripe est à nouveau le moyen de paiement retenu.

## Décision

1. **Stripe Checkout est le seul moyen de paiement en ligne.** Le client est redirigé vers la page de paiement hébergée par Stripe (`checkout.stripe.com`), qui propose la carte bancaire, Apple Pay, Google Pay et les autres moyens activés dans le tableau de bord Stripe. Les données bancaires ne passent jamais par le site.
2. **FedaPay est mis en commentaire, comme Mollie, le virement et le RIB** (demande du responsable : « commenter » les autres moyens) :
   - dans `src/app/paiement/page.tsx`, l'import, l'effet de retour et le bloc d'étape 4 sont commentés ;
   - le composant `components/FedaPayCheckout.tsx` reste dans le dépôt mais n'est plus importé ;
   - les Edge Functions `fedapay-*` et leurs tests restent dans le dépôt mais **ne doivent pas être déployées**.
3. **Mêmes garanties que dans l'ADR 0001** :
   - montant calculé par le serveur (`_shared/catalogue.ts`, contrôlé par `scripts/verifier-tarifs.mjs`) ;
   - client connecté obligatoire, avec l'email du JWT ;
   - ligne `paiements` créée « En attente » ;
   - passage à « Payé » uniquement après relecture de la session chez Stripe ;
   - montant et devise vérifiés (`amount_total` en centimes = `charged_amount`, `currency = eur`) ;
   - session rattachée au bon paiement (`metadata.paiement_id`) ;
   - transition atomique, donc une seule notification au cabinet.
4. **Devise : euro, sans conversion.** `charged_amount` est en centimes et `charged_currency` vaut `EUR`. Les colonnes de `migration_fedapay.sql` sont génériques (`provider`, `provider_transaction_id`…) et servent telles quelles (`provider = 'stripe'`, `provider_transaction_id` = id de session `cs_…`). **Aucune nouvelle migration.**
5. **Fonctions** :
   - `stripe-checkout` (JWT requis) crée la session, avec une clé d'idempotence `paiement-<id>` ;
   - `stripe-status` (JWT requis) relit la session au retour sur `/paiement/?stripe_ref=<id>` ;
   - `stripe-webhook` (sans JWT) vérifie l'en-tête `Stripe-Signature` (`t=…,v1=…`, HMAC-SHA256 du corps brut, tolérance 300 s ; les signatures `v0` sont ignorées) pour les événements `checkout.session.completed`, `async_payment_succeeded`, `async_payment_failed` et `expired`.
6. **Correspondance des statuts** :

   | Session Stripe | Statut interne |
   |---|---|
   | `payment_status = paid` | Payé |
   | `status = expired` | Annule |
   | événement signé `async_payment_failed` | Annule |
   | autres | En attente |

   **Un paiement « Payé » ne redescend jamais** par cette synchronisation.
7. **Abonnements et échéances** : même règle que l'ADR 0001. Chaque paiement règle **une** échéance (`mode = payment`). De vrais abonnements Stripe (`mode = subscription`, prélèvement automatique) sont possibles, mais c'est une décision produit séparée, non prise ici.

## Conséquences

- **Remboursements** : ils se font dans le tableau de bord Stripe. Le statut du paiement sur le site n'est pas mis à jour automatiquement. Il faudra ajouter un traitement de `charge.refunded` si le besoin se confirme.
- **Frais Stripe** : à vérifier sur les gros montants (abonnements de 10 000 à 15 000 €).
- **Clients au Bénin sans carte** : le Mobile Money n'est plus proposé (il l'était avec FedaPay).

## Mise en service (non faite à la date de l'ADR)

1. `supabase secrets set STRIPE_SECRET_KEY=sk_test_… STRIPE_WEBHOOK_SECRET=whsec_… SITE_URL=https://generalesquire.com`
2. ~~`supabase functions deploy stripe-checkout stripe-status stripe-webhook`~~ **Fait le 2026-10-14** (`--use-api`) ; `send-notification`, `register-payment` et `manage-news` ont été redéployées dans leur version corrigée le même jour, et les fonctions `mollie-*` supprimées.
3. Dans le tableau de bord Stripe > Développeurs > Webhooks, ajouter le point de terminaison `https://szyirafviiswvaooubzs.supabase.co/functions/v1/stripe-webhook` avec les 4 événements `checkout.session.*`, puis recopier son secret `whsec_…`.
4. Faire un paiement complet en **mode test** (carte 4242 4242 4242 4242), puis passer aux clés `sk_live_…` et créer un webhook live.

## Preuves au 2026-10-13

- `deno check` des 3 fonctions Stripe : OK.
- `deno test tests/` : 37 tests réussis, dont 19 pour Stripe. Ils couvrent :
  - la signature, avec un vecteur de référence calculé avec Node `crypto` ;
  - l'encodage des paramètres au format Stripe ;
  - la correspondance des statuts ;
  - la synchronisation contre une fausse API Stripe et un faux PostgREST ;
  - les refus pour montant, devise, session d'un autre paiement, identifiant invalide ;
  - l'absence de rétrogradation et de double notification.
- Contrôles négatifs. Chacun fait tomber exactement le test visé, puis la restauration est vérifiée par hash :
  - suppression de la tolérance de rejeu ;
  - suppression de la garde de concurrence ;
  - suppression du contrôle de devise ;
  - suppression de la garde anti-rétrogradation.
- Build Next : OK. Le JavaScript publié appelle `stripe-checkout` et ne contient plus `fedapay-checkout`.
- **Non prouvé** : un paiement Stripe de bout en bout, faute de clés Stripe à cette date.
