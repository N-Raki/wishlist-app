# Direction visuelle : Vitrine

Retenue par Raki le 2026-10-09 parmi six pistes. Maquettes : [canevas Wish Me](https://claude.ai/artifact/KS9TF9ehEWbhpF1PvdnCuG), page « Vitrine (retenue) ».

## L'idée
Une liste de souhaits est d'abord une vitrine de cadeaux : les photos portent l'interface, le reste s'efface. La joie vient des images et d'une seule couleur vive, pas de la décoration.

## Principes
1. **Photo d'abord.** Grille en 2 colonnes, vignettes 4:5, coins arrondis 22 px. Un souhait sans photo garde une vignette teintée avec son initiale, jamais d'icône générique ; les teintes suivent l'ordre d'ajout, pour que deux voisines ne se ressemblent jamais.
2. **Une seule couleur d'accent**, toujours avec du texte encre dessus (jamais blanc sur corail).
3. **Le secret est expliqué au bon moment.** Côté propriétaire, aucun état de réservation n'apparaît. La promesse de surprise est dite là où elle rassure : sur une liste encore vide et au moment de partager, pas en pastille permanente.
4. **Un vocabulaire de réservation unique** : « Réserver », « Léa s’en occupe » + « Participer », « Vous et Hugo » (ou « Vous l’offrez avec Hugo » quand la place le permet).
5. **Actions principales en pilule pleine**, secondaires en pilule à bord, et la sortie (« Annuler », une autre façon de faire) en texte seul (règle 10).
6. **L'invité comprend pourquoi se connecter.** Sur la liste, un encart dit ce que la connexion apporte (voir ce qui est pris, pas de doublon, surprise gardée) ; « Réserver » ouvre une feuille de connexion qui rappelle le souhait choisi, et la réservation se fait dès la connexion.

## Tokens

| Rôle | Clair | Sombre |
|---|---|---|
| Fond | `#F3F2F5` | `#131217` |
| Surface | `#FFFFFF` | `#24232A` |
| Surface atténuée (emplacements vides) | `#E9E7EE` | `#2E2D35` |
| Texte | `#1D1C22` | `#F4F3F6` |
| Texte secondaire | `#5F5C68` | `#A9A6B2` |
| Bord des champs et éléments d'interface | `#8A8792` | `#8A8792` (4,42:1 sur la surface) |
| Accent (texte `#1D1C22` dessus) | `#FF7A59` | `#FF7A59` |
| Coup de cœur | `#E8432E` | `#E8432E` |
| Succès | `#1D6B44` | `#4CC38A` |
| Action destructrice (fond, texte dessus) | `#B42318`, texte blanc (6,57:1) | `#FDA29B`, texte `#1D1C22` (8,71:1) |
| Barre d'onglets (sous le flou) et son filet | fond à 82 %, filet encre à 8 % | fond à 82 %, filet texte à 10 % |
| Voile derrière les feuilles | `#131217` à 45 % | noir à 60 % |
| Ombre des actions flottantes | encre à 22 % | noir à 60 % |
| Vignettes sans photo | `#FFE3D9` `#E7E2F5` `#DDEDE3` `#F5EBD8` | `#3A2A27` `#2E2A3A` `#23302A` `#35302A` |
| Initiale sur ces vignettes (≥ 4,4:1) | `#B4472A` `#5E4BA8` `#2F6E4A` `#8A5A12` | `#FFA184` `#B9A8F2` `#86CFA4` `#E5BD72` |

Source unique dans le code : `apps/app/src/theme/palette.ts`. Sur le web, les couleurs passent par des variables CSS pour que le navigateur choisisse le thème clair ou sombre sans flash.

- **Typo** : Gabarito (400 à 800). Titres d'écran courts et fixes (« Mes listes ») en 40 px, noms choisis par l'utilisateur (une liste) en 30 px ; graisse 800, interlettrage −0,025 em ; corps 15 à 17 px.
- **Rayons** : vignettes et cartes 22 à 26 px, champs 14 à 16 px, boutons en pilule.
- **Cibles tactiles** : 44 px minimum.

## Icône et écran de lancement
Un « w » encre en Gabarito ExtraBold, avec une étincelle, sur fond corail (choisi par Raki le 2026-10-16). Source : `apps/app/assets/icon.svg`. Les fichiers PNG en sont tirés : icône 1024 px, Android adaptative (le w seul sur fond corail, et version monochrome), favicon, et écran de lancement (l'icône arrondie, au centre, sur le fond du thème clair ou sombre).
- **Barre d'onglets** translucide (flou + saturation), le contenu défile dessous. Le haut des écrans sans en-tête (barre d'état, Dynamic Island) a la même matière (`BarBackground`).
- **Boutons d'en-tête** (`headerActions`) : sur iOS, les boutons du système (symboles SF sur « Liquid Glass » rond, comme Retour) ; ailleurs, l'icône seule, sans fond (avec son libellé sur grand écran, voir « Grands écrans »). Couleur encre partout : le corail n'atteint pas 3:1 sur le fond clair.

## Règles d'interface
Tirées des premiers retours de Raki sur l'app (2026-10-11). À vérifier sur chaque écran touché, avant d'ouvrir la PR.

1. **L'action principale est en bas, à portée du pouce** (sur téléphone ; voir « Grands écrans »). Une seule par écran, en pilule pleine au-dessus de la barre d'onglets (`Screen action=`), visible quel que soit le défilement. Les actions rares ou destructrices vont dans le menu « ⋯ » en haut ; fermer un formulaire, c'est la croix en haut à gauche.
2. **Ce qui a l'air touchable l'est, et l'inverse.** Carte, pointillés, `+`, chevron : uniquement sur un élément qui réagit au toucher. Un état vide ou une explication est du texte posé sur le fond, sans cadre.
3. **La barre d'onglets reste là.** On ne la quitte que pour un formulaire ouvert en modale ; une page ouverte depuis un onglet s'empile dans cet onglet. Toucher l'onglet courant ramène à son début.
4. **Les champs facultatifs le disent.** « (facultatif) » à côté du libellé ; les autres sont obligatoires (`aria-required`). Une erreur s'affiche à l'envoi, sous le champ, et s'efface quand on le corrige.
5. **Une info se dit au moment où elle sert**, pas en badge permanent.
6. **Les états vides sont la première impression.** Chaque écran est relu vide, avec un élément et avec beaucoup, et sans photo.
7. **Rien ne déborde à 320 px** (WCAG 1.4.10, testé par `expectReflow` dans les tests e2e) ; un titre ne partage pas sa ligne avec un bouton.
8. **Mentions légales et confidentialité** : en pied des pages publiques (accueil, liste vue par un visiteur), à côté de toute collecte de données (connexion), et dans l'onglet Compte une fois connecté.
9. **Le clavier ne s'ouvre d'office que sur le seul choix de l'écran** (un code, le nom d'une liste). Pas quand d'autres options attendent dessous (connexion, souhait). `Screen` garde la page et son action au-dessus du clavier, et le glisser de la page le range.
10. **Les actions se hiérarchisent, la destruction se voit** (`Button`). Trois niveaux : pilule pleine pour l'action principale (une au plus par écran), pilule à bord pour les autres, texte seul pour sortir (« Annuler », « Fermer ») ou prendre une autre voie, et seulement sous d'autres boutons, pour qu'il se lise comme un bouton. Ce qui fait perdre quelque chose est rouge (`destructive`), en dernier et sous un filet (`Divider`) ; s'il ne se défait pas, une confirmation suit, avec le seul bouton rouge plein de l'app. Ce qui se défait aussitôt (annuler une réservation, se déconnecter) n'est ni rouge ni confirmé.

## Grands écrans
À partir de 768 px de large (`largeScreenMinWidth`, une tablette ou un ordinateur), la mise en page change. Un seul point de rupture suffit : en dessous, on tient un téléphone ; au-dessus, il y a de la place et souvent une souris. Le nombre de colonnes des grilles suit la largeur réelle, sans palier. `useLargeScreen()` le dit au code (`src/ui/layout.ts`). Sur le web, la page sort du serveur en version téléphone et s’adapte dans le navigateur, sans écart d’hydratation.

1. **Navigation en haut.** La barre d’onglets devient une barre en haut : « Wish Me » à gauche, les onglets à droite, l’onglet courant en pilule claire, le survol en simple teinte (il ne doit jamais avoir l’air plus choisi que l’onglet courant, en sombre surtout). Elle est alignée sur la colonne large des pages. Elle est opaque : la matière translucide ne sert que là où le contenu défile dessous, ce qui n’est pas le cas ici puisque l’en-tête des pages est juste en dessous.
2. **Deux largeurs de colonne.** 560 px pour lire et remplir (formulaires, compte, textes légaux), 1080 px pour les grilles (`Screen width="wide"`). Les textes posés dans une page large restent à 560 px.
3. **Grilles.** `Grid` met autant de cellules par ligne qu’il en tient : souhaits de 220 px minimum (2 colonnes au moins, 4 sur ordinateur), listes et proches de 320 px minimum (3 sur ordinateur).
4. **L’action principale quitte le bas.** Le pouce n’est plus là. Elle se place à côté du titre (`Screen heading=`), ou en fin de page pour un formulaire. Sur la fiche d’un souhait, la photo et le détail sont côte à côte, et l’action suit l’état de réservation.
5. **Boutons d’en-tête avec libellé.** Une pilule à bord avec l’icône et un mot (« Partager », « Options ») ; le nom accessible garde la forme longue, qui contient le mot visible (WCAG 2.5.3). La croix de fermeture reste une icône. Sur le web, l’en-tête s’aligne sur la colonne de la page, pas sur les bords de la fenêtre.
6. **Survol.** Ce qui se clique réagit sous la souris : les cartes et les vignettes se soulèvent, les boutons à bord et les icônes prennent un fond atténué, le bouton plein fonce légèrement. Transitions de 120 ms en décélération, pour que l’appui reste instantané, coupées si le système demande moins d’animations. Si le système demande moins de transparence, les barres translucides deviennent opaques.
7. **Fenêtres.** Menus et confirmations s’ouvrent au centre (440 px), plus au bas de l’écran.

Sur iPad, l’app suit les points 1 à 4 et 7 ; les boutons d’en-tête restent ceux du système.

## Accessibilité vérifiée sur les maquettes
- Contrastes texte ≥ 4,5:1 (texte secondaire 5,85:1 sur le fond, placeholder 4,64:1).
- Bords de champs, pointillés et interrupteur ≥ 3:1 (corrigés après audit).
- Vrais `button`, `a`, `label` + `input`, `aria-label` sur les boutons à icône seule, `aria-pressed` sur le coup de cœur.
- Typographie française : espace insécable avant `€` et `!`, apostrophe typographique.

## Reste à faire avant l'étape 3
- Vraies photos dans les maquettes (aucune banque d'images accessible depuis l'environnement de travail).
- Animations (ouverture des feuilles, réservation) avec ressorts interruptibles, et variante « mouvement réduit ».
- Logos officiels Apple et Google selon leurs chartes.
