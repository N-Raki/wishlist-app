# Wish Me

Listes de souhaits partagées par lien. Refonte en cours : la v2 (Expo + Supabase) remplace la v1 encore en ligne sur wishme.fr.
Avant toute tâche : [docs/README.md](docs/README.md) dit quel document lire, et seulement celui-là.

## Structure
- `apps/app/` : l'application (Expo SDK 57, Expo Router, TypeScript) pour web, Android et iOS.
  - `src/app/` : une route par fichier. Le reste de `src/` est rangé par sujet (`auth/`, `account/`, `legal/`), plus `ui/` (composants partagés) et `theme/` (tokens).
  - `e2e/` : tests Playwright du site, contre la base locale.
- `supabase/` : migrations SQL, règles d'accès (RLS), fonctions serveur, tests (`tests/database` en pgTAP, `tests/api` en Node).
- `Client/`, `Server/` : la v1. Ne pas y toucher sauf correctif de production ; supprimés à la bascule.

## Commandes (depuis la racine)
| | |
|---|---|
| `npm install` | Dépendances |
| `npm run db:start` | Supabase en local (Docker requis) |
| `npm run dev` | L'app (web : `w`, Expo Go : QR code) |
| `npm run check` | Lint, format, types, tests unitaires |
| `npm run db:test` / `npm run test:api` | Tests de la base / de l'API (base locale démarrée) |
| `npm run e2e` | Build web + tests de bout en bout et d'accessibilité |
| `npx supabase migration new <nom>` puis `npm run db:reset` | Nouvelle migration |
| `npm run db:types` | Régénère `src/lib/database.types.ts` après une migration |

Ajouter une dépendance à l'app : `npx expo install <paquet>` dans `apps/app` (versions compatibles avec le SDK).

## Règles
- Sécurité dans la base : toute table a la RLS et des `grant` explicites ; un test pgTAP par règle d'accès.
- Données personnelles : toute nouvelle donnée met à jour, dans la même PR, `export_my_data`, son test, la politique de confidentialité (`src/legal/privacy.*.ts`) et le registre (`docs/legal/registre.md`).
- Interface : direction « Vitrine » ([docs/design.md](docs/design.md)), couleurs via `useColors()`, jamais en dur. WCAG 2.2 AA vérifié par axe dans les tests e2e.
- Textes : aucun texte en dur dans les écrans, tout passe par `src/i18n/fr.ts` (référence) et `en.ts`. Typographie française (`’`, espace insécable avant `: ; ! ?`).
- Code et commentaires en anglais, documentation en français.
- Déploiement : merge sur `main` → preprod → production, automatiquement ([ADR 0002](docs/decisions/0002-environnements.md)).
