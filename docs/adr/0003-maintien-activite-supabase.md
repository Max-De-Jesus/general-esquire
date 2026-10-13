# ADR 0003 — Empêcher la mise en pause automatique de Supabase

- **Statut** : accepté — demandé par le responsable du projet le 2026-10-13.
- **Date** : 2026-10-13

## Contexte

Le projet Supabase (plan gratuit) se met en pause après 7 jours sans
activité. Le 2026-10-13, il était en pause (`INACTIVE`). Tant qu'il l'est :

- les actualités ne se chargent plus ;
- les demandes clients ne sont plus enregistrées en base ;
- les paiements en ligne (Stripe, via les Edge Functions) sont impossibles ;
- l'espace admin est hors service.

## Décision

Le workflow GitHub Actions `.github/workflows/supabase-keepalive.yml` :

- s'exécute le **lundi et le jeudi à 06:17 UTC**, soit un écart maximal de 4 jours, inférieur aux 7 jours de la mise en pause. On peut aussi le lancer à la main ;
- exécute une **vraie requête en base** : lecture d'une actualité publiée via l'API REST, avec la clé publique `anon`, ce que la RLS autorise ;
- **échoue** si la base ne répond pas en HTTP 200 après 3 tentatives, ou si aucune ligne n'est lue. GitHub envoie alors un email d'échec : c'est l'alerte « projet en pause ou en panne ». Un échec n'est jamais transformé en succès ;
- se **réactive** à chaque exécution (`PUT …/actions/workflows/…/enable`), car GitHub désactive les workflows planifiés d'un dépôt public après 60 jours sans activité ;
- ne déploie rien et ne touche pas au site. Ses permissions se limitent à `contents: read` et à `actions: write`, ce dernier uniquement pour la réactivation.

## Limites

- Ce workflow **empêche** la pause, il ne **restaure** pas un projet déjà en pause. La restauration se fait à la main sur supabase.com.
- GitHub ne garantit pas l'heure exacte des tâches planifiées : un retard de quelques heures est possible, ce qui ne pose pas de problème avec une marge de 3 jours.
- Si la clé `anon` change, il faut mettre à jour le secret `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Sans cela, le workflow échoue, ce qui est volontaire.

## Preuves au 2026-10-13

- YAML valide.
- Étape de requête exécutée en local avec la vraie base : HTTP 200, 1 ligne lue, code de sortie 0.
- Projet injoignable (simulé) : code de sortie 1, avec message d'erreur.
- Secrets absents : code de sortie 1.
- Une exécution réelle sur GitHub est déclenchée après le push (voir l'historique des Actions).
