# 0002 — Environnements et déploiement

Statut : **accepté** (2026-10-10). Raki a choisi les deux projets Supabase plutôt que Branching ; en place depuis le premier déploiement automatique du 2026-10-10.

## Contexte
Une seule personne livre sur trois plateformes. Chaque changement doit être vérifié automatiquement, visible avant d'être fusionné, et partir en production sans manipulation. La v1 reste en ligne sur wishme.fr jusqu'à la bascule (étape 3).

## Décision

| Environnement | Base de données | Site web | App mobile | Quand |
|---|---|---|---|---|
| Local | Supabase CLI (Docker) | `npm run dev` | Expo Go | En développant |
| Preview | Base preprod | EAS Hosting, alias `pr-<n>` | — | À chaque push sur une PR |
| Preprod | Projet Supabase `wishme-preprod` | EAS Hosting, alias `preprod` | Canal EAS Update `preprod` | À chaque merge sur `main` |
| Production | Projet Supabase `wishme-prod` (offre Pro) | EAS Hosting, déploiement `--prod` | Canal EAS Update `production` | Juste après la preprod, si elle a réussi |

- **CI** (`ci.yml`), deux jobs en parallèle : lint, types et tests unitaires ; puis base (pgTAP), API, tests de bout en bout et audit d'accessibilité contre un Supabase local.
- **Déploiement** (`deploy.yml`) : CI → preprod (migrations, fonctions, site, mise à jour OTA, test de fumée) → production, même suite d'étapes. Pour valider chaque mise en production à la main, il suffit d'ajouter un relecteur obligatoire à l'environnement GitHub `production`.
- **Builds natifs** (`mobile.yml`) : à la demande (profil `preview` pour les testeurs) ou sur un tag `v*` (build et envoi aux stores). Le code JavaScript arrive dans les apps installées par mise à jour OTA ; un nouveau build n'est nécessaire que si le code natif change (`runtimeVersion` calculée par empreinte).
- **Configuration** : les valeurs publiques (URL et clé publiable Supabase) sont versionnées dans `apps/app/src/config.ts`, l'environnement est choisi par `EXPO_PUBLIC_APP_ENV`. Les secrets (jetons Expo et Supabase, mot de passe de base) ne vivent que dans GitHub.
- **Interrupteur** : tant que la variable `DEPLOY_ENABLED` n'est pas à `true`, les workflows de déploiement ne font rien ; la CI tourne déjà.

### Hébergement web : EAS Hosting
Même compte que les builds et les mises à jour (un fournisseur de moins), une adresse par PR, et il exécute aussi le rendu serveur d'Expo Router, dont on aura besoin pour les aperçus riches des listes partagées (titre, propriétaire, image).

Écartés : Vercel, Netlify (un compte de plus, rien de plus utile ici) ; Cloudflare Pages reste le plan B si le domaine personnalisé chez Expo demande une offre trop chère.

## Conséquences
- La preview d'une PR utilise la base preprod : une PR qui change le schéma n'y est visible qu'après le merge. Avec l'offre Pro, Supabase Branching donnera une base par PR ; à brancher quand ça gênera.
- La v1 reste dans `Client/` et `Server/` ; son workflow ne se déclenche plus que si ces dossiers changent, pour qu'aucun merge de la v2 ne republie ses images.
- Coûts : Supabase Pro (~25 $/mois) pour la production dès qu'elle reçoit de vrais utilisateurs ; offre gratuite d'Expo tant que les quotas de builds suffisent ; comptes développeur Apple (99 $/an) et Google (25 $ une fois) pour publier.
