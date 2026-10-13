# ADR 0002 — Modèle de sécurité des données et des notifications

- **Statut** : accepté et **appliqué en production le 2026-10-13** (demandé par le responsable du projet : « règle tout et sécurise »).
- **Date** : 2026-10-13

## Contexte : failles constatées et prouvées

| # | Faille | Preuve |
|---|---|---|
| 1 | Clé Resend réelle encodée en base64 dans `src/lib/emailNotifier.ts`, donc livrée dans le JavaScript public | Clé présente dans le build de référence ; deux clés distinctes dans l'historique Git d'un dépôt **public** |
| 2 | `clients` lisible et modifiable par tous (policies `USING (true)`) | Reproduit sur un PostgreSQL de test : le rôle `anon` lit toutes les fiches |
| 3 | Le code écrivait les mots de passe des clients **en clair** (`clients.password_plain`) | Reproduit sur la base de test. **En production, la colonne n'a jamais existé** : l'écriture échouait, aucun mot de passe n'y a été stocké (constat du 2026-10-13) |
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

## État réel de la production au 2026-10-13 (avant migration)

L'inspection de la base réelle, limitée aux métadonnées et aux comptages, a
montré des policies **absentes de `schema.sql`** :

- `Public Full Access Clients` et `Public Full Access Activity Logs` :
  `FOR ALL USING (true)` pour le public. N'importe qui pouvait **lire,
  modifier et supprimer** les fiches clients et le journal ;
- `demandes_clients_admin_all` : `USING (true)` pour le public, malgré son nom.

Avec la seule clé publique du site, on pouvait lire 11 fiches clients
(nom, email, téléphone…), 14 demandes clients et 12 entrées du journal.
La première version de la migration ne supprimait que des noms connus et
aurait laissé ces policies en place. Un contrôle négatif sur une réplique de
la production l'a prouvé (5 contrôles sur 26 en échec). La migration
supprime désormais **toutes** les policies des tables applicatives avant de
recréer l'ensemble.

Après application, le public voit 0 client, 0 demande, 0 entrée de journal et
0 paiement, mais toujours les 5 actualités publiées. Les données sont
intactes (11 / 14 / 12 / 4 / 5). L'état des policies d'avant est sauvegardé
hors dépôt dans `supabase/.temp/policies_avant_2026-10-13.csv`, au cas où
un retour arrière serait nécessaire.

## Conséquences

- L'espace admin du site (`/espace-securise-esquire`) exige un compte Supabase Auth réel, avec un email de la liste. L'ancien accès « local » ne fonctionne plus.
- Le portail local `apps/admin`, qui n'est pas déployé, lit et écrit avec la clé anon. Il a besoin d'une session administrateur pour lire les données.
- Les emails envoyés par l'admin aux clients (décisions de compte) passent uniquement par `send-notification`, avec le JWT admin. Le script PHP les refuse désormais.
- Aucun mot de passe n'a été stocké en clair en production. En revanche, les **coordonnées** de 11 clients et le contenu de 14 demandes ont été lisibles publiquement, pendant une durée inconnue. Faut-il en informer les personnes concernées (RGPD, art. 33-34) ? C'est une décision du cabinet.

## Preuves au 2026-10-13

- Les migrations ont été appliquées sur un PostgreSQL 16 jetable, avec une simulation des rôles et de `auth.jwt()` de Supabase :
  - **26 contrôles d'accès réussis sur 26** ;
  - migrations rejouées sans erreur, donc idempotentes ;
  - la faille a été reproduite **avant** migration.
- Contrôle négatif : une policy sabotée (`USING (true)`) fait tomber exactement les 2 contrôles visés (24/26).
- `send-mail.php` : 5 attaques refusées (origine étrangère, absence d'origine, destinataire externe, CR/LF, GET) et limite de débit active. Contrôle négatif sur l'ancienne version : elle acceptait le destinataire externe.
- Production, vérifiée par l'API publique après migration : 0 ligne lisible sur clients, demandes, journal et paiements, 18 policies attendues en place, triggers et colonnes FedaPay présents.
