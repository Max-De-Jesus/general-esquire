# Supabase Edge Functions — General Esquire

Le frontend est exporté en site 100 % statique (`output: "export"` dans
`next.config.ts`) et déployé par FTP sur LWS.fr. Toute la logique serveur vit
donc ici, dans des Edge Functions Supabase exécutées à la demande :

- emails ;
- écritures en base avec `service_role` ;
- gestion des actualités ;
- paiements.

Décisions de référence :

- `docs/adr/0001-paiement-fedapay.md` — paiement en ligne **exclusivement
  via FedaPay**. Mollie, virement et RIB sont mis en commentaire dans la page.
- `docs/adr/0002-securite-donnees-rls.md` — modèle de sécurité (RLS, comptes
  admin, notifications).

## Fonctions

| Fonction | JWT | Rôle | Appelée par |
|---|---|---|---|
| `fedapay-checkout` | client connecté | Calcule le montant côté serveur (`_shared/catalogue.ts`), crée le paiement « En attente » et la transaction FedaPay, renvoie l'URL de paiement | `components/FedaPayCheckout.tsx` |
| `fedapay-status` | client connecté | Relit la transaction chez FedaPay au retour du client et met le paiement à jour | `paiement/page.tsx` (`?fedapay_ref=`) |
| `fedapay-webhook` | non (signature HMAC) | Reçoit `transaction.*`, vérifie la signature, relit la transaction chez FedaPay, met à jour le paiement et notifie le cabinet | FedaPay |
| `send-notification` | facultatif | Envoi d'email (Resend → FormSubmit → Web3Forms). Destinataire hors cabinet seulement avec un JWT **admin** | `lib/emailNotifier.ts` |
| `manage-news` | admin | CRUD sur `actualites` | `lib/newsAdmin.ts`, `/espace-securise-esquire` |
| `register-payment` | non | N'enregistre qu'une **intention** de règlement (statut forcé à « En attente »). N'est plus appelée par le site | — |
| `mollie-checkout` / `mollie-status` / `mollie-webhook` | — | **Inutilisées** depuis le passage à FedaPay. À supprimer si elles sont déployées (`supabase functions delete …`) | — |

Le frontend lit directement les actualités publiées (`is_published = true`)
via `lib/cloudNewsStore.ts`. La policy RLS `actualites_public_read` suffit.

## Secrets à configurer

`SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` sont
injectés automatiquement par la plateforme. Il faut en revanche configurer :

```bash
supabase secrets set RESEND_API_KEY=<nouvelle clé Resend>
supabase secrets set FEDAPAY_SECRET_KEY=<sk_sandbox_… puis sk_live_…>
supabase secrets set FEDAPAY_ENV=sandbox          # "live" en production
supabase secrets set FEDAPAY_WEBHOOK_SECRET=<clé de signature du webhook FedaPay>
supabase secrets set SITE_URL=https://generalesquire.com
# Optionnels
supabase secrets set RESEND_FROM_EMAIL=<expéditeur vérifié chez Resend>
supabase secrets set WEB3FORMS_ACCESS_KEY=<clé Web3Forms>
```

`FEDAPAY_API_BASE` sert **uniquement** aux tests (serveur simulé) : ne jamais
la définir en production.

⚠️ Jusqu'au 2026-10-13, une clé Resend était codée en base64 (ce qui n'est
pas du chiffrement) dans `src/lib/emailNotifier.ts`, donc
livrée au navigateur. Deux clés différentes figurent dans l'historique Git
du dépôt public. Le code ne contient plus de clé, mais **ces deux clés
doivent être révoquées** dans le tableau de bord Resend et remplacées par une
nouvelle, enregistrée uniquement via `supabase secrets set`.

## Migrations SQL (dans l'ordre, SQL Editor du dashboard)

1. `../schema.sql` — création initiale (déjà faite).
2. `../migration_actualites_images.sql` — galerie d'images des actualités.
3. `../migration_securite_rls.sql` — RLS, suppression des mots de passe en
   clair, trigger de création de la fiche client.
4. `../migration_fedapay.sql` — colonnes FedaPay sur `paiements`.

Toutes sont idempotentes. Les migrations 3 et 4 ont été vérifiées sur un
PostgreSQL de test (26 contrôles d'accès, voir ADR 0002). Elles ont été
**appliquées en production le 2026-10-13**, avec
`supabase db query --linked -f <fichier>` depuis la racine du dépôt.

La mise en pause automatique du projet est empêchée par
`.github/workflows/supabase-keepalive.yml` (ADR 0003).

## Déploiement

```bash
npm install -g supabase
supabase login
supabase link --project-ref szyirafviiswvaooubzs
supabase functions deploy fedapay-checkout fedapay-status fedapay-webhook
supabase functions deploy send-notification register-payment manage-news
```

Ce déploiement est manuel. Il n'est pas branché sur le workflow GitHub, qui
ne fait que construire et pousser le frontend statique par FTP.

Dans le tableau de bord FedaPay, déclarez le webhook
`https://szyirafviiswvaooubzs.supabase.co/functions/v1/fedapay-webhook`.

## Tests

```bash
cd supabase/functions
deno test --allow-env --allow-net=127.0.0.1,esm.sh,jsr.io tests/
```

Résultat attendu : 18 tests réussis, 0 échec. Une suite à 0 test est un
échec.

La cohérence des tarifs entre la page et le serveur se vérifie avec
`node scripts/verifier-tarifs.mjs` (22 prestations).

## Comptes administrateurs

L'espace admin exige un **vrai compte Supabase Auth** dont l'email figure dans
la liste exacte. Cette liste doit rester identique en trois endroits :

- `_shared/admin.ts` ;
- `public.is_admin()` dans `migration_securite_rls.sql` ;
- `src/context/AuthContext.tsx`.

Emails : `admin@generalesquire.com`, `generalesquire@proton.me`,
`contact@generalesquire.com`.

L'ancienne « session admin locale » ouvrait l'espace admin sans vérifier le
mot de passe. Elle a été supprimée. Pour créer un compte, utilisez
`../create-admin.js` en passant le mot de passe en argument : le mot de passe
par défaut écrit dans ce script ne doit pas être utilisé.
