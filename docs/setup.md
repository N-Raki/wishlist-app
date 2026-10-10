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
- [ ] Accepter le DPA (accord de sous-traitance) de Supabase et du service d'e-mails, puis dire à Claude lequel est retenu (il apparaît dans la politique de confidentialité).
- [x] Créer un jeton d'accès personnel (*Account → Access Tokens*) pour GitHub (voir 3).

## 2. Expo (EAS)
- [x] Créer un compte sur expo.dev.
- [x] Sur son ordinateur, dans `apps/app` : `npx eas-cli login`, puis `npx eas-cli init` (crée le projet et écrit son identifiant dans `app.json`), puis `npx eas-cli update:configure`. Pousser la modification de `app.json` sur une branche, ou donner l'identifiant de projet à Claude.
- [x] Premier déploiement web, pour choisir l'adresse : `EXPO_PUBLIC_APP_ENV=preprod npx expo export -p web && npx eas-cli deploy --alias preprod`. Fait : `https://wishme.expo.app` (production) et `https://wishme--preprod.expo.app` (preprod). Service d'e-mails retenu : Brevo.
- [x] Créer un jeton d'accès (*Account settings → Access tokens*) pour GitHub (voir 3).
- [ ] Vérifier dans les conditions d'Expo : le DPA, la durée de conservation des journaux d'EAS Hosting, et si un domaine personnalisé (wishme.fr, à la bascule) demande une offre payante.

## 3. GitHub
- [x] *Settings → Secrets and variables → Actions*, onglet Secrets : `EXPO_TOKEN`, `SUPABASE_ACCESS_TOKEN`.
- [x] *Settings → Environments* : créer `preprod` et `production`. Dans chacun : variable `SUPABASE_PROJECT_REF` (l'identifiant du projet, dans son URL) et secret `SUPABASE_DB_PASSWORD`. Facultatif : un relecteur obligatoire sur `production` pour valider chaque mise en production.
- [ ] *Settings → Branches* : protéger `main` (PR obligatoire, checks « Lint, types, unit tests » et « Database, API and end-to-end tests » requis).
- [x] En dernier, variable de dépôt `DEPLOY_ENABLED` = `true`. Le prochain merge déploie la preprod puis la production.

## 4. Stores (avant la publication, étape 3)
- [ ] Apple Developer Program (99 $/an) et Google Play Console (25 $ une fois).
- [ ] `npx eas-cli credentials` dans `apps/app` pour les certificats de signature, puis une clé d'API App Store Connect et un compte de service Google Play pour l'envoi automatique (`eas submit`).

## 5. Mentions légales
- [ ] Donner à Claude, ou remplir dans `apps/app/src/legal/publisher.ts` : nom de l'éditeur, adresse postale (une domiciliation suffit si vous ne voulez pas publier votre adresse personnelle), e-mail de contact, adresse postale d'Expo (hébergeur, sur expo.dev).
