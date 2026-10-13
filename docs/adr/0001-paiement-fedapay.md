# ADR 0001 — Paiement en ligne exclusivement via FedaPay

> **REMPLACÉ le 2026-10-13 par [ADR 0004 — Stripe](0004-paiement-stripe.md)**, sur décision du responsable du projet. FedaPay n'a jamais été mis en production : ses fonctions n'ont pas été déployées et aucun paiement n'a eu lieu. Le texte ci-dessous est conservé pour l'historique. Son code (composant, Edge Functions `fedapay-*`, tests) reste dans le dépôt mais est désactivé et ne doit pas être déployé. Les colonnes ajoutées par `migration_fedapay.sql` sont génériques et servent à Stripe.

- **Statut** : **remplacé** par l'ADR 0004 le 2026-10-13. Il avait d'abord été accepté le même jour, sans jamais être mis en production.
- **Date** : 2026-10-13
- **Remplace** : la décision « paiements exclusivement via PayPal » écrite dans `supabase/functions/README.md`, déjà fausse à cette date (le code utilisait Mollie et le virement ; PayPal n'était plus branché nulle part).

## Contexte

Avant ce changement, la page `/paiement` proposait :

- **Mollie** (carte bancaire / Apple Pay), via `components/MollieCheckout.tsx` et les Edge Functions `mollie-*` ;
- **le virement bancaire**, avec un RIB téléchargeable (`utils/generateFormPDF.ts`, `generateRIB_PDF`).

Le composant `AdyenCheckout.tsx` existait aussi mais n'était utilisé nulle part.

L'audit de sécurité du même jour (voir [ADR 0002](0002-securite-donnees-rls.md)) a montré que l'enregistrement des paiements n'était pas fiable :

- la fonction `register-payment` acceptait `status: "Payé"` de n'importe quel appelant, sans vérifier quoi que ce soit auprès d'un prestataire ;
- la page affichait « Règlement enregistré » même quand l'enregistrement échouait (repli silencieux) ;
- le statut Mollie au retour de paiement était accepté sur la foi d'un paramètre d'URL (`status=simulated`).

Le projet touristique se déroule au Bénin. FedaPay est un agrégateur béninois qui couvre le Mobile Money (MTN, Moov) et la carte bancaire.

## Décision

1. **FedaPay est le seul moyen de paiement en ligne du site.** Les autres moyens sont **mis en commentaire, pas supprimés**, pour pouvoir les réactiver par une décision explicite :
   - Mollie et virement : blocs commentés dans `src/app/paiement/page.tsx` ;
   - RIB : bouton commenté ; `generateRIB_PDF` est conservé dans `utils/` ;
   - textes du guide de paiement (`components/EmployerPaymentGuide.tsx`) : l'ancien texte est gardé en commentaire.
2. **Le montant est calculé par le serveur.** Le navigateur n'envoie que des choix : prestation, nombre de pages, urgence, option de séjour. La fonction `fedapay-checkout` recalcule le montant à partir de `supabase/functions/_shared/catalogue.ts`. Le script `scripts/verifier-tarifs.mjs` échoue si ce catalogue diverge de `SERVICE_PRESETS` sur la page.
3. **Paiement réservé au client connecté.** `fedapay-checkout` et `fedapay-status` exigent un JWT Supabase (`verify_jwt = true`). L'email rattaché au paiement est celui du JWT, jamais celui envoyé par le navigateur.
4. **Devise et conversion.** FedaPay encaisse en **XOF (franc CFA)**. Les tarifs restent en euros et la conversion se fait à la **parité fixe 1 € = 655,957 FCFA**, arrondie à l'unité. `paiements.amount`/`currency` gardent le prix en EUR ; `charged_amount`/`charged_currency` gardent ce qui est réellement demandé à FedaPay.
5. **Cycle de vie d'un paiement.**
   - `fedapay-checkout` crée une ligne `paiements` au statut « En attente » (`provider = 'fedapay'`), crée la transaction FedaPay (`POST /v1/transactions`), puis demande le lien de paiement (`POST /v1/transactions/{id}/token`) et redirige le client.
   - FedaPay ramène le client sur `/paiement/?fedapay_ref=<id paiement>`. La page appelle `fedapay-status`, qui **relit la transaction chez FedaPay**. Le paramètre `status` de l'URL n'est jamais cru.
   - `fedapay-webhook` reçoit les événements `transaction.*`. Il vérifie la signature HMAC-SHA256 (`X-FEDAPAY-SIGNATURE`, format `t=…,s=…`, tolérance 300 s, algorithme du SDK officiel `fedapay-node`), puis **relit la transaction chez FedaPay** avant d'écrire.
   - Le montant relu doit être égal à `charged_amount`, sinon rien n'est écrit et une erreur est journalisée.
   - Correspondance des statuts :

     | Statut FedaPay | Statut interne |
     |---|---|
     | `approved`, `transferred`, `*_partially_refunded` | Payé |
     | `refunded` | Rembourse |
     | `declined`, `canceled`, `expired` | Annule |
     | autres | En attente |

   - Le passage à « Payé » est atomique (`UPDATE … WHERE status <> 'Payé'`). Le cabinet reçoit donc **une seule** notification, même si le webhook et le retour du client arrivent en même temps.
6. **Abonnements et échéances.** FedaPay n'offre pas de prélèvement récurrent dans ce montage. Chaque paiement règle **une échéance** : la première tranche du séjour Cocooning, ou le terme en cours d'un abonnement. Les échéances suivantes sont demandées à chaque terme. La page et le libellé du paiement le disent explicitement.
7. **Base de données** : `supabase/migration_fedapay.sql` ajoute à `paiements` les colonnes `provider`, `provider_transaction_id`, `provider_status`, `charged_amount` et `charged_currency`, plus un index unique sur (`provider`, `provider_transaction_id`).

## Conséquences

- Les clients sans compte ne peuvent pas payer en ligne. C'était déjà le cas : la page exige une connexion.
- Il n'y a plus de virement en ligne. Un client institutionnel qui veut virer doit passer par le cabinet, hors site.
- Les **gros montants** (abonnements à 10 000 – 15 000 €, soit 6,5 à 9,8 millions de FCFA) peuvent dépasser les plafonds Mobile Money. **À vérifier avec FedaPay** avant la mise en production : plafonds par moyen de paiement et frais.
- Les fonctions `mollie-checkout`, `mollie-status` et `mollie-webhook` restent dans le dossier mais ne sont plus appelées. Si elles sont déployées, il faut les retirer : `supabase functions delete mollie-checkout` (et les deux autres).
- `register-payment` n'enregistre plus qu'une intention de règlement (« En attente »). Elle n'est plus appelée par la page.

## Mise en service (non faite à la date de l'ADR)

1. ~~Exécuter `supabase/migration_securite_rls.sql`, puis `supabase/migration_fedapay.sql`.~~ **Fait le 2026-10-13.**
2. `supabase secrets set FEDAPAY_SECRET_KEY=sk_sandbox_… FEDAPAY_ENV=sandbox FEDAPAY_WEBHOOK_SECRET=wh_… SITE_URL=https://generalesquire.com`
3. `supabase functions deploy fedapay-checkout fedapay-status fedapay-webhook`
4. Dans le tableau de bord FedaPay, déclarer le webhook `https://szyirafviiswvaooubzs.supabase.co/functions/v1/fedapay-webhook` et en recopier la clé de signature dans `FEDAPAY_WEBHOOK_SECRET`.
5. Faire un paiement complet en **sandbox**. Ce n'est qu'ensuite qu'on passe `FEDAPAY_ENV=live` avec la clé `sk_live_…`.

## Preuves au 2026-10-13

- `deno check` : les fonctions FedaPay, `send-notification`, `register-payment` et `manage-news` passent le typage.
- `deno test supabase/functions/tests/` : 18 tests réussis. Ils couvrent la signature (vecteur de référence calculé avec Node `crypto`), le calcul des montants, la correspondance des statuts, et la synchronisation contre un faux FedaPay et un faux PostgREST.
- Contrôles négatifs. Chaque sabotage fait tomber le test visé, puis la restauration est vérifiée par hash :
  - suppression de la tolérance de rejeu ;
  - suppression de la garde de concurrence ;
  - suppression du contrôle de montant.
- `node scripts/verifier-tarifs.mjs` : 22 prestations identiques. Un catalogue saboté est bien détecté.
- **Non prouvé** : un paiement réel ou sandbox de bout en bout. Aucune clé FedaPay n'est disponible et les fonctions FedaPay ne sont pas encore déployées.
