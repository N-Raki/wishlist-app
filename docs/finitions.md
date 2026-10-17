# Finitions avant la première version

Retours de Raki du 16 octobre 2026, après essai sur iPhone 17, Android et le web. La bascule (roadmap, étape 3) attend qu'il juge ces points réglés.

Chaque retour a été rapproché du code pour trouver la cause commune et tous les écrans touchés. On corrige donc par thème, pas écran par écran. Les causes marquées « à vérifier » sont des hypothèses tirées du code, à confirmer sur l'appareil.

Ordre proposé : 1 et 9 d'abord (ils gênent tous les essais), puis 2, 3, 4, 5, 6, 7, 8.

## 1. Bords de l'écran sur iPhone — corrigé, à vérifier sur l'appareil
Constaté : l'app passe sous la Dynamic Island ; un grand vide sous le pied de page (Conditions, Confidentialité) ; le clavier de la connexion cache les autres options ; une pastille blanche déborde derrière les boutons Fermer, Partager et « … ».

Corrigé dans `Screen`, qui s'écarte seul des bords :
- **Haut.** Un écran sans en-tête se décale de la barre d'état (déduit de la navigation, plus de prop `edges` : Compte l'avait oubliée) et le contenu défile sous une bande translucide, la matière de la barre d'onglets.
- **Clavier.** `KeyboardAvoidingView` mesurait sa position dans son parent au lieu de l'écran : il ratait la hauteur de l'en-tête, davantage dans une feuille, et le clavier couvrait le bas des formulaires. `useKeyboardOverlap` mesure par rapport à l’écran (sur iOS, une feuille fausse la position dans la fenêtre), et suit la barre de suggestions d'iOS quand elle s'ajoute au clavier. Glisser la page range le clavier. Focus d'office retiré de l'e-mail et du mot de passe de la connexion, et du souhait (règle 9 de design.md).
- **Boutons d'en-tête.** Sur iOS, des boutons natifs (`headerActions`) : une vue à nous donnait une gélule au lieu d'un rond. Ailleurs, `HeaderButton` (ex-`IconButton`) sans fond.
- **Bas.** L'hypothèse de départ était fausse : la réserve de la barre d'onglets ne s'applique déjà qu'aux écrans des onglets. Si le vide persiste après cette PR, une capture de l'écran concerné dira d'où il vient.

## 2. Hiérarchie des actions — corrigé
Constaté : « Renommer » et « Supprimer la liste » ont le même aspect, alors que l'une est anodine et l'autre irréversible.

Règle 10 de design.md, portée par `Button` (`variant` primary, secondary ou plain ; `destructive`) et `Dialog` (le bouton pour sortir est intégré) :
- **Menu d'une liste.** « Supprimer la liste » en rouge, sous un filet, après « Renommer » ; « Annuler » en texte seul.
- **Formulaire d'un souhait.** « Supprimer ce souhait » en rouge, sous un filet en fin de formulaire. Il n'y a pas de menu de souhait : le formulaire en tient lieu.
- **Compte.** « Supprimer mon compte » en rouge, en dernier, sous un filet ; « Se déconnecter » reste neutre (on se reconnecte).
- **Confirmations** (liste, souhait, compte) : bouton rouge plein, « Annuler » en texte seul ; ni toucher dehors ni Retour ne ferment pendant la suppression.
- **Connexion.** Les autres voies (mot de passe, code, renvoyer le code, changer d'adresse) passent en texte seul ; Google reste à bord, c'est une vraie alternative.
- **Annuler une réservation** : inchangé, sans confirmation ni rouge. Elle se défait : juste après, l'action redevient « Réserver » (ou « Participer »).

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

- La mise à jour publiée a le bon runtime (`exposdk:57.0.0`, journal du déploiement du 16 octobre). La cause est donc côté Expo Go ou du serveur de mises à jour, que Claude ne peut pas joindre depuis son environnement.
- Expo présente désormais Expo Go comme un outil d'apprentissage : le Play Store n'a que la version SDK 54, l'App Store s'arrête aussi à SDK 54.
- Voie retenue : le build `preview` existant (APK interne, canal `preprod`), lancé à la main par `mobile.yml` (profil `preview`, plateforme `android`). Il reçoit chaque merge par mise à jour OTA, sans Expo Go. Pour l'iPhone, le même build demande l'Apple Developer Program (bascule).
- Les aperçus par PR restent sur le web ; un build de développement (`expo-dev-client`) ne vaudra la peine que si l'on doit tester une PR sur téléphone avant merge.

## Hors de portée de Claude
Pas de simulateur iOS dans son environnement : ce qui touche l'iPhone (surtout le point 1) se vérifie sur l'appareil de Raki, à chaque PR concernée.
