# 0003 — Aperçu des liens de liste

Statut : **accepté** (2026-10-11).

## Contexte
Une liste se partage surtout par messagerie (WhatsApp, iMessage, Messenger…). Ces services affichent un aperçu à partir des balises Open Graph de la page, sans exécuter de JavaScript. L'app web est rendue dans le navigateur : sans rien faire, chaque lien affiche le même aperçu générique.

## Options
- **Rendu serveur de la page** (`generateMetadata`, loaders d'Expo Router) : encore instable dans le SDK 57, et ferait passer tout le site en rendu serveur pour un besoin limité aux robots.
- **Pages statiques** : impossible, les listes sont créées à la volée.
- **Middleware réservé aux robots d'aperçu (choisi)** : `src/app/+middleware.ts` reconnaît les robots des messageries à leur user-agent sur `/wishlists/[id]`, lit la liste comme un visiteur anonyme (`wishlist_view`) et renvoie une petite page avec ses balises Open Graph. Tout le reste continue vers l'app.

## Conséquences
- L'aperçu ne montre que ce que le lien montre déjà à un visiteur : nom de la liste, nom d'affichage du propriétaire, nombre de souhaits, une photo. Jamais de réservation.
- Un robot inconnu reçoit l'aperçu générique ; la liste des robots est dans `src/lists/preview.ts`.
- Base injoignable ou lente (plus de 3 s) : le robot reçoit la page de l'app, sans aperçu détaillé. L'aperçu est mis en cache 5 minutes.
- Le middleware est activé par `unstable_useServerMiddleware` (plugin `expo-router` dans `app.json`), stable à partir du SDK 58 : retirer le préfixe à la mise à jour.
