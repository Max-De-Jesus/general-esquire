# ADR 0002 — Modèle de sécurité des données et des notifications

- **Statut** : accepté — demandé par le responsable du projet le 2026-10-13 (« règle tout et sécurise ») ; **migration SQL non encore appliquée** en production, car le projet Supabase est en pause.
- **Date** : 2026-10-13

## Contexte : failles constatées et prouvées

| # | Faille | Preuve |
|---|---|---|
| 1 | Clé Resend réelle encodée en base64 dans `src/lib/emailNotifier.ts`, donc livrée dans le JavaScript public | Clé présente dans le build de référence ; deux clés distinctes dans l'historique Git d'un dépôt **public** |
| 2 | `clients` lisible et modifiable par tous (policies `USING (true)`) | Reproduit sur un PostgreSQL de test : le rôle `anon` lit toutes les fiches |
| 3 | Mots de passe des clients stockés **en clair** (`clients.password_plain`), donc lisibles via la faille 2 | Reproduit : `anon` lit 2 mots de passe sur 2 |
| 4 | `demandes_clients` et `activity_logs` sans RLS activée | Reproduit : `anon` lit les demandes |
| 5 | Contournement de connexion : si la connexion Supabase échouait mais que l'email contenait « admin », une « session admin locale » était ouverte **sans vérifier le mot de passe** (`AuthContext.signIn`) | Lecture du code |
| 6 | `public/api/send-mail.php` était un relais ouvert : destinataire libre, CORS `*`, injection d'en-têtes via `Reply-To` | Reproduit en local : l'ancien script accepte d'envoyer à une adresse externe depuis une origine étrangère |
| 7 | Edge Function `send-notification` : destinataire libre et HTML non échappé | Lecture du code |
| 8 | `register-payment` créait des paiements « Payé » sur simple demande ; la page affichait un succès même en cas d'échec | Lecture du code (voir ADR 0001) |
| 9 | 5 PDF de formulaires de test (avec l'email du responsable) publiés dans `public/` | Fichiers présents dans le build |

## Décision

1. **Aucun secret dans le code livré au navigateur.** Resend n'est appelé que par les Edge Functions, avec le secret `RESEND_API_KEY`. Le canal « Resend direct » du navigateur est supprimé.
2. **Comptes administrateurs = liste exacte d'emails**, en trois endroits, à garder identiques :
   - `public.is_admin()` (SQL) ;
   - `supabase/functions/_shared/admin.ts` ;
   - `src/context/AuthContext.tsx`.

   Seule une session Supabase Auth réelle compte. `user_metadata`, que l'utilisateur peut modifier lui-même, et le `localStorage` n'accordent jamais de droits. Le contrôle côté navigateur ne sert qu'à l'affichage : **la protection réelle est la RLS**.
3. **RLS sur toutes les tables** (`supabase/migration_securite_rls.sql`) :
   - administrateur : accès complet ;
   - client authentifié : lecture et mise à jour de **sa** fiche. Un trigger l'empêche de changer son statut ou son email. Il peut aussi lire ses paiements ;
   - public (`anon`) : actualités publiées, témoignages approuvés et dépôt de formulaires uniquement ;
   - écriture des paiements : **uniquement** par les Edge Functions (`service_role`).
4. **Plus aucun mot de passe stocké par l'application.** La colonne `password_plain` est supprimée, ainsi que son affichage dans l'espace admin. Supabase Auth gère seul les mots de passe (hachés).
5. **La fiche client est créée par un trigger sur `auth.users`.** Cela fonctionne même quand la confirmation d'email est activée, c'est-à-dire avant toute session côté client.
6. **Notifications.**
   - `send-mail.php` : liste blanche de destinataires (boîtes du cabinet), contrôle d'origine, suppression des CR/LF dans les en-têtes, tailles bornées, limite de 8 envois par 10 minutes et par IP, champ piège.
   - `send-notification` : destinataire hors cabinet seulement avec un JWT administrateur, et HTML échappé.

## Conséquences

- L'espace admin du site (`/espace-securise-esquire`) exige un compte Supabase Auth réel, avec un email de la liste. L'ancien accès « local » ne fonctionne plus.
- Le portail local `apps/admin`, qui n'est pas déployé, lit et écrit avec la clé anon. Il a besoin d'une session administrateur pour lire les données.
- Les emails envoyés par l'admin aux clients (décisions de compte) passent uniquement par `send-notification`, avec le JWT admin. Le script PHP les refuse désormais.
- Les mots de passe déjà stockés en clair ont pu être lus par n'importe qui. **Les comptes concernés doivent être considérés comme exposés** : il faut prévenir les clients ou leur demander de réinitialiser leur mot de passe. C'est une décision du cabinet.

## Preuves au 2026-10-13

- Les migrations ont été appliquées sur un PostgreSQL 16 jetable, avec une simulation des rôles et de `auth.jwt()` de Supabase :
  - **26 contrôles d'accès réussis sur 26** ;
  - migrations rejouées sans erreur, donc idempotentes ;
  - la faille a été reproduite **avant** migration.
- Contrôle négatif : une policy sabotée (`USING (true)`) fait tomber exactement les 2 contrôles visés (24/26).
- `send-mail.php` : 5 attaques refusées (origine étrangère, absence d'origine, destinataire externe, CR/LF, GET) et limite de débit active. Contrôle négatif sur l'ancienne version : elle acceptait le destinataire externe.
- **Non prouvé** : l'état réel des policies sur la base de production, illisible tant que le projet Supabase est en pause.
