# 0001 — Stack de la v2

Statut : **accepté** (2026-10-09) : Expo + Supabase (option A).

## Contexte
- Une seule personne développe et maintient l'application.
- Cibles : web, Android, iOS.
- Connexions voulues : code e-mail (défaut), Google, Apple (imposé par l'App Store dès qu'il y a Google), mot de passe, éventuellement SMS.
- Données personnelles d'utilisateurs européens aujourd'hui, de l'argent demain.
- Il faut migrer une base PostgreSQL existante en gardant ses identifiants.

## Client : Expo (React Native + web), TypeScript
Une seule base de code pour les trois plateformes, avec Expo Router (routes par fichiers, liens profonds, rendu statique des pages publiques pour le SEO et les aperçus de liens). Les builds et mises à jour des stores passent par EAS, pilotable depuis la CI.

Écartés :
- **Web React + Capacitor** : on garde un site web emballé dans une webview ; les gestes, transitions et la sensation native sont nettement en dessous, ce qui va contre l'objectif design.
- **Deux clients séparés** (web + natif) : double travail d'interface pour une personne seule.
- **Flutter** : rendu web médiocre (canvas, accessibilité et SEO faibles), et aucun code partagé avec l'écosystème JS.

## Backend : Supabase (choisi)

| | A. Supabase | B. API .NET retravaillée | C. API TypeScript |
|---|---|---|---|
| Ce que c'est | Postgres managé (région UE) + Auth + stockage d'images + fonctions serveur | ASP.NET Core 8 actuel, nettoyé | Hono ou équivalent + Postgres + bibliothèque d'auth (Better Auth) |
| Connexions e-mail OTP, Google, Apple, SMS | Incluses | À coder | Fournies par la bibliothèque, à intégrer |
| Sécurité des données | Règles d'accès dans la base (RLS), testables en SQL | Dans le code de l'API | Dans le code de l'API |
| Langages | TypeScript + SQL | TypeScript + C# | TypeScript partout, types partagés client/serveur |
| Exploitation | Rien à héberger ; une base de preview par PR possible | Serveur + base à opérer (comme aujourd'hui) | Serveur + base à opérer |
| Migration v1 | Postgres → Postgres ; les comptes passent dans le système d'auth de Supabase | Aucune | Postgres → Postgres |
| Coût | Gratuit au début ; ~25 $/mois en offre Pro (sans mise en veille, sauvegardes) | Serveur actuel | Serveur actuel |
| Risque | Dépendance au fournisseur, atténuée : open source, auto-hébergeable, c'est du Postgres | Le moins de changement, mais la v1 montre que c'est là que la dette s'est accumulée | Le plus de code à écrire soi-même |

**Recommandation : A (Supabase).** C'est l'option qui retire le plus de code et d'exploitation à une personne seule, tout en gardant Postgres. La règle la plus sensible du produit (le propriétaire ne voit jamais les réservations) se pose au niveau de la base, donc aucune route d'API oubliée ne peut la contourner, ce qui est exactement la faille de la v1.

## Conséquences
- Monorepo TypeScript : `apps/app` (Expo), `supabase/` (migrations SQL, règles d'accès, fonctions), `packages/` si du code partagé apparaît.
- Les règles d'accès sont couvertes par des tests SQL (pgTAP) en CI.
- La v1 (.NET) reste en ligne jusqu'à la bascule, puis est archivée.
