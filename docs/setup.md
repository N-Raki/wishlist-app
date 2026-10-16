# Mise en place des comptes

Ce que seul Raki peut faire (comptes, paiements, identifiants). Tant que ce n'est pas fait, la CI tourne mais rien n'est déployé. Cocher au fur et à mesure.

Les valeurs **publiques** (URL, clé publiable, identifiant de projet) peuvent être données en clair dans le fil de projet : Claude les reporte dans le code. Les **secrets** (mots de passe, jetons) ne vont que dans GitHub, jamais dans un message.

## 1. Supabase
- [x] Créer deux projets dans une même organisation : `wishme-preprod` et `wishme-prod`, région **West EU (Paris)**. Noter chaque mot de passe de base dans un gestionnaire de mots de passe.
- [ ] Passer `wishme-prod` en offre **Pro** au plus tard à la bascule (sauvegardes quotidiennes, pas de mise en veille). La preprod peut rester gratuite (elle se met en veille après une semaine sans activité).
- [x] Pour chaque projet, donner à Claude l'URL du projet et la clé **publiable** (*Project Settings → API Keys*).
- [x] Pour chaque projet, dans *Authentication* :
  - *URL Configuration* : Site URL = l'adresse du site de l'environnement (connue après l'étape 2 ci-dessous) ; Redirect URLs :
    - preprod : `wishme://`, `wishme://auth/callback`, `https://wishme--preprod.expo.app/auth/callback`, `https://wishme--*.expo.app/auth/callback` (aperçus des PR) et `exp://**` (Expo Go) ;
    - production : `wishme://`, `wishme://auth/callback` et `https://wishme.expo.app/auth/callback` (plus `https://wishme.fr/auth/callback` à la bascule).
  - *Sign In / Providers → Email* : longueur du code 6, expiration 600 s, mot de passe 8 caractères minimum.
  - *Emails → Templates* : pour « Confirm signup » et « Magic Link », sujet `Votre code Wish Me`, contenu = le fichier `supabase/templates/code.html`.
- [x] Choisir un service d'envoi d'e-mails. Proposition : **Brevo** (société française, données dans l'UE, 300 e-mails/jour gratuits). Y authentifier le domaine `wishme.fr` (enregistrements DNS SPF et DKIM : ils s'ajoutent sans toucher à la v1), puis renseigner ses identifiants SMTP dans *Authentication → Emails → SMTP Settings* des deux projets. Sans ça, Supabase n'envoie que quelques e-mails par heure, et seulement aux membres de l'équipe.
- [x] Accepter le DPA (accord de sous-traitance) de Supabase et du service d'e-mails, puis dire à Claude lequel est retenu (il apparaît dans la politique de confidentialité). Fait : Brevo ; les deux DPA sont inclus dans les conditions d'utilisation acceptées à l'inscription.
- [x] Créer un jeton d'accès personnel (*Account → Access Tokens*) pour GitHub (voir 3).

### Mot de passe facultatif (étape 3, « Compte complet »)
Pour chacun des deux projets Supabase :
- [ ] *Authentication → Sign In / Providers → Email* : activer **Secure password change**. Choisir un mot de passe sur un compte connecté depuis plus de 24 h demande alors un code envoyé par e-mail.
- [ ] *Authentication → Emails → Templates* : pour « Reauthentication », sujet `Votre code Wish Me`, contenu = `supabase/templates/code.html`.
- [ ] *Authentication → Emails → Notifications* (ou *Security notifications*) : activer « Password changed », sujet `Mot de passe Wish Me modifié`, contenu = `supabase/templates/password-changed.html`.

### Connexion Google
1. [console.cloud.google.com](https://console.cloud.google.com) : créer un projet `Wish Me`.
2. *Google Auth Platform → Branding* : nom `Wish Me`, e-mail d'assistance = le compte Gmail connecté (Google n'accepte que ce compte ou un groupe Google qu'il gère). Laisser vides la page d'accueil, la politique de confidentialité et les domaines autorisés : `supabase.co` et `expo.app` sont des domaines partagés que Google refuse, et il exige un domaine dont on prouve la propriété.
3. *Audience* : **External**, laisser en **Testing** et ajouter ses propres comptes dans *Test users* (100 au maximum). *Data access* : uniquement `openid`, `email` et `profile`.
   - À la bascule : vérifier `wishme.fr` dans [Google Search Console](https://search.google.com/search-console), le mettre en domaine autorisé avec les liens `https://wishme.fr` et `https://wishme.fr/privacy`, puis *Publish app*. Sans vérification Google avec ces seuls accès, mais l'écran de connexion affichera `<ref>.supabase.co` tant que Supabase n'a pas de domaine personnalisé.
4. *Clients → Create client → Web application*, nommé `Wish Me` :
   - Authorized JavaScript origins : `https://wishme.expo.app` et `https://wishme--preprod.expo.app`.
   - Authorized redirect URIs : `https://<ref-preprod>.supabase.co/auth/v1/callback` et `https://<ref-prod>.supabase.co/auth/v1/callback`.
5. Dans chaque projet Supabase, *Authentication → Sign In / Providers → Google* : activer, coller le Client ID et le Client secret.
Le bouton « Continuer avec Google » apparaît de lui-même dans l'environnement où Google est activé, sans nouvelle version de l'app.

Un seul client Web suffit : sur Android et iOS, la connexion Google passe par le navigateur du système, puis revient dans l'app par `wishme://auth/callback` (ou une adresse `exp://` dans Expo Go), d'où les Redirect URLs de Supabase ci-dessus.

### Connexion Apple (à la bascule)
Nécessite l'Apple Developer Program (voir 4), souscrit à la bascule (décision du 2026-10-15) : Google sort d'abord sur le web et Android. Apple l'impose sur iOS dès qu'une connexion Google est proposée.
1. [developer.apple.com](https://developer.apple.com/account) → *Certificates, Identifiers & Profiles → Identifiers* : l'App ID `fr.wishme.app` (créé par EAS au premier build iOS, sinon le créer), cocher **Sign in with Apple**.
2. Nouveau **Services ID** `fr.wishme.web` (pour le web, Android et le navigateur) : cocher Sign in with Apple, *Configure* → Primary App ID `fr.wishme.app`, domaines `<ref-preprod>.supabase.co` et `<ref-prod>.supabase.co`, Return URLs `https://<ref-preprod>.supabase.co/auth/v1/callback` et `https://<ref-prod>.supabase.co/auth/v1/callback`.
3. *Keys* → nouvelle clé avec Sign in with Apple, liée à `fr.wishme.app`. Télécharger le fichier `.p8` (une seule fois possible) et le garder dans le gestionnaire de mots de passe, avec le Key ID et le Team ID.
4. Dans chaque projet Supabase, *Authentication → Sign In / Providers → Apple* : activer ; Client IDs = `fr.wishme.web,fr.wishme.app` ; Secret Key = le secret généré à partir du `.p8` avec l'outil de la page (Team ID, Key ID, Services ID).
5. **Ce secret expire au bout de 6 mois** : le régénérer avant, sinon la connexion Apple s'arrête sur le web et Android (l'app iOS n'est pas touchée). Mettre un rappel.

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
- [ ] Comptes inactifs : voir [ci-dessous](#comptes-inactifs).

### Comptes inactifs
Chaque matin, le workflow GitHub `Inactive accounts` envoie un e-mail aux comptes inutilisés depuis bientôt 3 ans, puis supprime ceux qui ne sont pas revenus 30 jours après. Il lui faut trois valeurs par environnement (preprod et production), à ranger dans GitHub. Tant qu'elles manquent, il ne fait rien et ne supprime rien. Compter 15 minutes.

**Étape 1 : deux clés d'API Brevo**
1. Se connecter sur [app.brevo.com](https://app.brevo.com).
2. En haut à droite, cliquer sur le nom du compte, puis sur **SMTP et API** (*SMTP & API*).
3. Onglet **Clés API** (*API Keys*), bouton **Générer une nouvelle clé API**.
4. Nom : `wishme-preprod`. Valider, puis **copier la clé tout de suite** (Brevo ne la remontre plus) et la coller provisoirement dans un bloc-notes.
5. Recommencer avec le nom `wishme-prod`.

**Étape 2 : l'adresse d'expédition**
1. Toujours dans Brevo, menu du compte → **Expéditeurs, domaines et IP dédiées** (*Senders, Domains & Dedicated IPs*) → onglet **Expéditeurs**.
2. Noter l'adresse qui y figure avec une coche verte : c'est celle qui envoie déjà les codes de connexion (la même que *Sender email* dans Supabase, *Authentication → Emails → SMTP Settings*).

**Étape 3 : deux secrets aléatoires**
Ce secret empêche quiconque d'autre de déclencher le ménage. Dans PowerShell, coller cette ligne et appuyer sur Entrée :
```powershell
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
```
Elle affiche une suite de 44 caractères : la copier dans le bloc-notes. Relancer la ligne pour en obtenir une seconde, différente.

**Étape 4 : tout ranger dans GitHub**
1. Ouvrir le dépôt sur GitHub → **Settings** (onglet en haut) → dans la colonne de gauche, **Environments** → cliquer sur **preprod**.
2. Section **Environment secrets** → **Add environment secret** :
   - Name `CRON_SECRET`, Value : le premier secret aléatoire → **Add secret**.
   - Name `BREVO_API_KEY`, Value : la clé `wishme-preprod` → **Add secret**.
3. Section **Environment variables** → **Add environment variable** : Name `EMAIL_FROM`, Value : l'adresse de l'étape 2 → **Add variable**.
4. Revenir à **Environments**, cliquer sur **production**, et refaire 2 et 3 avec le second secret aléatoire et la clé `wishme-prod` (même adresse `EMAIL_FROM`).
5. Supprimer le bloc-notes : ces valeurs ne servent plus ailleurs.

**Étape 5 : vérifier**
1. Les valeurs partent vers Supabase au prochain déploiement, c'est-à-dire au prochain merge sur `main`. Attendre que le workflow **Deploy** soit vert (onglet **Actions**).
2. Onglet **Actions** → dans la colonne de gauche, **Inactive accounts** → bouton **Run workflow** → **Run workflow**.
3. Après une minute, les deux lignes `clean-up (preprod)` et `clean-up (production)` doivent être vertes. En ouvrant l'une d'elles, la dernière ligne affiche par exemple `{"warned":0,"deleted":0,"failed":0}` : aucun compte n'a encore 3 ans, c'est normal.

Si la ligne `production` reste en attente avec « Waiting for review », c'est que l'environnement `production` exige une validation : le dire à Claude, qui sortira ce workflow de cet environnement.

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
- [x] Mentions légales : éditeur « Raki », à titre non professionnel (identité complète chez l'hébergeur), contact `wishme@raki.dev`. L'adresse n'est pas publiée (LCEN art. 6-III-2) : elle doit figurer dans le compte Expo (*Account settings → Billing*), c'est-à-dire chez l'hébergeur.
- [ ] Dès que Wish Me rapporte de l'argent (étape 4), l'activité devient professionnelle : ajouter dans `publisher.ts` la structure (dénomination, SIREN, adresse, éventuellement une domiciliation).
