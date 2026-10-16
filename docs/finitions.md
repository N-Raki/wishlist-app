# Finitions avant la première version

Retours de Raki du 16 octobre 2026, après essai sur iPhone 17, Android et le web. La bascule (roadmap, étape 3) attend qu'il juge ces points réglés.

Chaque retour a été rapproché du code pour trouver la cause commune et tous les écrans touchés. On corrige donc par thème, pas écran par écran. Les causes marquées « à vérifier » sont des hypothèses tirées du code, à confirmer sur l'appareil.

Ordre proposé : 1 et 9 d'abord (ils gênent tous les essais), puis 2, 3, 4, 5, 6, 7, 8.

## 1. Bords de l'écran sur iPhone
Constaté : l'app passe sous la Dynamic Island ; un grand vide sous le pied de page (Conditions, Confidentialité) ; le clavier de la connexion cache les autres options ; une pastille blanche déborde derrière les boutons Fermer, Partager et « … ».

- **Haut.** Les écrans à onglets (Mes listes, Proches, Compte, accueil) n'ont pas de barre : `Screen` les décale de la hauteur de la Dynamic Island au départ, puis le contenu défile dessous sans aucun fond. À vérifier sur l'appareil. Piste : un fond flouté ou dégradé en haut, comme le bas de la barre d'onglets (design.md).
- **Bas.** `Screen` réserve la hauteur de la barre d'onglets même sur les écrans ouverts par-dessus, car elle reste montée en dessous. Écrans touchés : connexion, nom d'affichage, mot de passe, liste, souhait, suppression du compte, pages légales. La réserve doit dépendre de l'écran (dans les onglets ou pas), pas d'une valeur globale.
- **Boutons d'en-tête.** `IconButton` dessine son propre fond, et iOS 26 entoure déjà chaque bouton d'en-tête de son effet « Liquid Glass » : on obtient deux fonds. Touche tous les boutons d'en-tête (Fermer sur chaque fenêtre, Partager, Options). Le bouton Retour natif est correct et sert de modèle.
- **Clavier.** Ne donner le focus d'office qu'à un champ qui est le seul choix de l'écran (le code, le nom d'une liste). Pas à l'e-mail de la connexion, qui a d'autres options sous le clavier. Les autres `autoFocus` sont à revoir avec la même règle : mot de passe, souhait, nom d'affichage.
- Vérification : captures sur iPhone récent (Dynamic Island) et Android, avec et sans clavier, pour chaque écran.

## 2. Hiérarchie des actions
Constaté : « Renommer » et « Supprimer la liste » ont le même aspect, alors que l'une est anodine et l'autre irréversible.

- Règle à écrire dans design.md, puis appliquer partout :
  - une action principale par écran ;
  - les actions secondaires en retrait ;
  - toute action destructive en rouge (`danger`), placée en dernier et séparée des autres ;
  - une confirmation pour ce qui ne se défait pas.
- À passer en revue :
  - les menus (options d'une liste, d'un souhait) ;
  - la page Compte (déconnexion, suppression du compte) ;
  - les fenêtres de confirmation ;
  - l'annulation d'une réservation.

## 3. Web et grands écrans
Constaté : tout est pensé pour le mobile ; sur ordinateur, les boutons ne montrent qu'une icône et la mise en page ne s'adapte pas.

- Aujourd'hui, une seule colonne de 560 px partout (`contentMaxWidth`), et la barre d'onglets du mobile est aussi utilisée sur le web.
- À prévoir :
  - des points de rupture dans `tokens.ts` et un hook partagé ;
  - au-delà d'une tablette, une navigation en haut ou sur le côté à la place de la barre d'onglets ;
  - des grilles de listes et de souhaits sur plusieurs colonnes ;
  - des boutons d'en-tête avec leur libellé (« Partager », « Options ») ;
  - des états de survol.
- Section « Grands écrans » à ajouter dans design.md.

## 4. Accueil sans compte et états vides
Constaté : l'accueil d'un visiteur non connecté manque d'allure, notamment ses exemples de cadeaux sans image.

- Refaire l'accueil (`src/home/Showcase.tsx`) avec la direction « Vitrine » : des exemples visuels (illustrations ou photos libres de droits), comment ça marche en trois temps, un seul appel à l'action.
- Même cause ailleurs : un souhait sans photo doit avoir l'air voulu, pas manquant. À appliquer à la tuile de souhait (`WishGrid`) et aux états vides de Mes listes, d'une liste et de Proches, pour qu'ils restent cohérents avec l'accueil.

## 5. Saisie du code
Demandé : six cases au lieu d'un seul champ.

- Un composant de code partagé :
  - six cases, mais un seul vrai champ dessous, pour l'accessibilité et le collage ;
  - remplissage automatique (`one-time-code` sur iOS et le web) ;
  - envoi dès le sixième chiffre ;
  - erreur annoncée aux lecteurs d'écran.
- La longueur vient de la configuration (`otp_length = 6`).
- À utiliser partout où un code est demandé : la connexion, et la confirmation par code avant de changer de mot de passe.

## 6. Mot de passe
Demandé : demander l'ancien mot de passe s'il y en a déjà un, et adapter les textes.

- Deux cas dans `password.tsx` et sur la page Compte :
  - « Choisir un mot de passe » quand il n'y en a pas ;
  - « Changer de mot de passe » quand il y en a un, avec le mot de passe actuel demandé.
- Celui qui a oublié son mot de passe garde la voie du code par e-mail.
- `has_password` est déjà connu (export). Côté Supabase, `secure_password_change` est actif : vérifier comment le mot de passe actuel s'y combine.

## 7. Proches
Constaté : avec beaucoup de listes, on s'y perd.

- Aujourd'hui, une seule suite de listes.
- Pistes, à arbitrer :
  - regrouper par personne (une ligne par proche, ses listes dessous) ;
  - trier par dernière visite ;
  - « retirer de mes proches » pour une liste qui ne sert plus (la table `wishlist_visits` le permet) ;
  - une recherche au-delà d'un certain nombre de listes.
- La même question se posera pour Mes listes quand elles seront nombreuses.

## 8. Thème clair ou sombre
Demandé : pouvoir choisir.

- Réglage dans Compte : Automatique, Clair ou Sombre.
- Sur mobile, `Appearance.setColorScheme`.
- Sur le web :
  - les couleurs sont des variables CSS (`+html.tsx`) : ajouter un attribut `data-theme` sur la page ;
  - lire le choix avant l'affichage, pour éviter un flash.
- Préférence gardée sur l'appareil seulement : rien de nouveau côté serveur ni dans l'export.

## 9. Essais sur Android (Expo Go)
Constaté : « Failed to download remote update / Not compatible with this version of Expo Go » avec Expo Go 57.0.9.

- À diagnostiquer :
  - le runtime de la mise à jour publiée pour Expo Go (étape « Update for Expo Go » de `deploy.yml`) ;
  - celui du commentaire de prévisualisation des PR.
- Recommandation : passer aux builds de développement d'EAS (un APK interne, et iOS à la bascule) plutôt qu'Expo Go. Ils seront de toute façon nécessaires pour la connexion Apple et pour vérifier le point 1 dans les conditions réelles.

## Hors de portée de Claude
Pas de simulateur iOS dans son environnement : ce qui touche l'iPhone (surtout le point 1) se vérifie sur l'appareil de Raki, à chaque PR concernée.
