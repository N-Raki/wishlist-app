# Mise en place des comptes

Ce que seul Raki peut faire (comptes, paiements, identifiants). Tant que ce n'est pas fait, la CI tourne mais rien n'est déployé. Cocher au fur et à mesure.

Les valeurs **publiques** (URL, clé publiable, identifiant de projet) peuvent être données en clair dans le fil de projet : Claude les reporte dans le code. Les **secrets** (mots de passe, jetons) ne vont que dans GitHub, jamais dans un message.

## 1. Supabase
- [x] Créer deux projets dans une même organisation : `wishme-preprod` et `wishme-prod`, région **West EU (Paris)**. Noter chaque mot de passe de base dans un gestionnaire de mots de passe.
- [ ] Passer `wishme-prod` en offre **Pro** au plus tard à la bascule (sauvegardes quotidiennes, pas de mise en veille). La preprod peut rester gratuite (elle se met en veille après une semaine sans activité).
- [x] Pour chaque projet, donner à Claude l'URL du projet et la clé **publiable** (*Project Settings → API Keys*).
- [x] Pour chaque projet, dans *Authentication* :
  - *URL Configuration* : Site URL = l'adresse du site de l'environnement (connue après l'étape 2 ci-dessous) ; Redirect URLs : ajouter `wishme://`.
  - *Sign In / Providers → Email* : longueur du code 6, expiration 600 s, mot de passe 8 caractères minimum.
  - *Emails → Templates* : pour « Confirm signup » et « Magic Link », sujet `Votre code Wish Me`, contenu = le fichier `supabase/templates/code.html`.
- [x] Choisir un service d'envoi d'e-mails. Proposition : **Brevo** (société française, données dans l'UE, 300 e-mails/jour gratuits). Y authentifier le domaine `wishme.fr` (enregistrements DNS SPF et DKIM : ils s'ajoutent sans toucher à la v1), puis renseigner ses identifiants SMTP dans *Authentication → Emails → SMTP Settings* des deux projets. Sans ça, Supabase n'envoie que quelques e-mails par heure, et seulement aux membres de l'équipe.
- [x] Accepter le DPA (accord de sous-traitance) de Supabase et du service d'e-mails, puis dire à Claude lequel est retenu (il apparaît dans la politique de confidentialité). Fait : Brevo ; les deux DPA sont inclus dans les conditions d'utilisation acceptées à l'inscription.
- [x] Créer un jeton d'accès personnel (*Account → Access Tokens*) pour GitHub (voir 3).

## 2. Expo (EAS)
- [x] Créer un compte sur expo.dev.
- [x] Sur son ordinateur, dans `apps/app` : `npx eas-cli login`, puis `npx eas-cli init` (crée le projet et écrit son identifiant dans `app.json`), puis `npx eas-cli update:configure`. Pousser la modification de `app.json` sur une branche, ou donner l'identifiant de projet à Claude.
- [x] Premier déploiement web, pour choisir l'adresse : `EXPO_PUBLIC_APP_ENV=preprod npx expo export -p web && npx eas-cli deploy --alias preprod`. Fait : `https://wishme.expo.app` (production) et `https://wishme--preprod.expo.app` (preprod). Service d'e-mails retenu : Brevo.
- [x] Créer un jeton d'accès (*Account settings → Access tokens*) pour GitHub (voir 3).
- [x] Vérifier dans les conditions d'Expo (vérifié le 2026-10-10) :
  - DPA : inclus dans les [conditions d'utilisation](https://expo.dev/terms) (section 3.2, Expo sous-traitant, clauses contractuelles types de la Commission). Expo est aussi certifié Data Privacy Framework ([politique de confidentialité](https://expo.dev/privacy)).
  - Journaux : 7 jours sur l'offre gratuite, 3 mois sur les offres payantes ([tarifs](https://expo.dev/pricing)).
  - Domaine personnalisé : offre payante obligatoire, **Starter à 19 $/mois** minimum, un domaine par projet ([doc](https://docs.expo.dev/eas/hosting/custom-domain/)). À souscrire à la bascule (étape 3) ; mettre alors à jour la durée des journaux dans la politique de confidentialité et le registre.

## 3. GitHub
- [x] *Settings → Secrets and variables → Actions*, onglet Secrets : `EXPO_TOKEN`, `SUPABASE_ACCESS_TOKEN`.
- [x] *Settings → Environments* : créer `preprod` et `production`. Dans chacun : variable `SUPABASE_PROJECT_REF` (l'identifiant du projet, dans son URL) et secret `SUPABASE_DB_PASSWORD`. Facultatif : un relecteur obligatoire sur `production` pour valider chaque mise en production.
- [x] Protéger `main` : voir [Protection de `main`](#protection-de-main) ci-dessous.
- [x] En dernier, variable de dépôt `DEPLOY_ENABLED` = `true`. Le prochain merge déploie la preprod puis la production.

### Protection de `main`
But : rien n'arrive sur `main` (donc en production) sans PR dont les tests sont verts. GitHub propose deux mécanismes ; on prend les *rulesets*, plus récents et plus lisibles que la « branch protection » classique.

1. *Settings → Rules → Rulesets → New ruleset → New branch ruleset*.
2. **Ruleset name** : `main`. **Enforcement status** : *Active*.
3. **Bypass list** : vide. Personne ne contourne les règles, pas même l'admin. En cas d'urgence, on désactive le ruleset le temps du correctif.
4. **Target branches** : *Add target → Include default branch*.
5. **Rules**, cocher :
   - *Restrict deletions* et *Block force pushes*.
   - *Require a pull request before merging*, avec *Required approvals* = **0** (GitHub ne laisse pas approuver sa propre PR ; à monter à 1 le jour où quelqu'un d'autre relit) et *Require conversation resolution before merging*.
   - *Require status checks to pass*, avec *Require branches to be up to date before merging*. Cliquer *Add checks* et ajouter, source *GitHub Actions* :
     - `Lint, types, unit tests`
     - `Database, API and end-to-end tests`
6. Laisser décochés : *Require linear history* (on merge avec des commits de merge), *Require deployments to succeed*, *Require signed commits*. Ne pas rendre obligatoires `web` (aperçu de PR) ni `Supabase Preview` : ils sont sautés selon les cas et bloqueraient les merges.
7. *Create*.

Pour vérifier : ouvrir une PR, le bouton de merge doit rester grisé tant que les deux checks ne sont pas verts. Un `git push` direct sur `main` doit être refusé.

Facultatif, dans *Settings → General → Pull Requests* : cocher *Automatically delete head branches* (les branches disparaissent après merge) et *Allow auto-merge* (une PR se merge seule quand ses checks passent).

## 4. Stores (avant la publication, étape 3)
- [ ] Apple Developer Program (99 $/an) et Google Play Console (25 $ une fois).
- [ ] `npx eas-cli credentials` dans `apps/app` pour les certificats de signature, puis une clé d'API App Store Connect et un compte de service Google Play pour l'envoi automatique (`eas submit`).

## 5. Mentions légales
- [x] Mentions légales : éditeur Nathan Coustance (Raki), à titre non professionnel, contact `wishme@raki.dev`. L'adresse n'est pas publiée (LCEN art. 6-III-2) : elle doit figurer dans le compte Expo (*Account settings → Billing*), c'est-à-dire chez l'hébergeur.
- [ ] Dès que Wish Me rapporte de l'argent (étape 4), l'activité devient professionnelle : ajouter dans `publisher.ts` la structure (dénomination, SIREN, adresse, éventuellement une domiciliation).
