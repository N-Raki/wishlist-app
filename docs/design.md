# Direction visuelle : Vitrine

Retenue par Raki le 2026-10-09 parmi six pistes. Maquettes : [canevas Wish Me](https://claude.ai/artifact/KS9TF9ehEWbhpF1PvdnCuG), page « Vitrine (retenue) ».

## L'idée
Une liste de souhaits est d'abord une vitrine de cadeaux : les photos portent l'interface, le reste s'efface. La joie vient des images et d'une seule couleur vive, pas de la décoration.

## Principes
1. **Photo d'abord.** Grille en 2 colonnes, vignettes 4:5, coins arrondis 22 px. Un souhait sans photo garde une vignette teintée avec son initiale, jamais d'icône générique ; les teintes suivent l'ordre d'ajout, pour que deux voisines ne se ressemblent jamais.
2. **Une seule couleur d'accent**, toujours avec du texte encre dessus (jamais blanc sur corail).
3. **Le secret est expliqué au bon moment.** Côté propriétaire, aucun état de réservation n'apparaît. La promesse de surprise est dite là où elle rassure : sur une liste encore vide et au moment de partager, pas en pastille permanente.
4. **Un vocabulaire de réservation unique** : « Réserver », « Léa s’en occupe » + « Participer », « Vous et Hugo » (ou « Vous l’offrez avec Hugo » quand la place le permet).
5. **Actions principales en pilule pleine**, secondaires en pilule à bord.
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
- **Barre d'onglets** translucide (flou + saturation), le contenu défile dessous.

## Règles d'interface
Tirées des premiers retours de Raki sur l'app (2026-10-11). À vérifier sur chaque écran touché, avant d'ouvrir la PR.

1. **L'action principale est en bas, à portée du pouce.** Une seule par écran, en pilule pleine au-dessus de la barre d'onglets (`Screen action=`), visible quel que soit le défilement. Les actions rares ou destructrices vont dans le menu « ⋯ » en haut ; fermer un formulaire, c'est la croix en haut à gauche.
2. **Ce qui a l'air touchable l'est, et l'inverse.** Carte, pointillés, `+`, chevron : uniquement sur un élément qui réagit au toucher. Un état vide ou une explication est du texte posé sur le fond, sans cadre.
3. **La barre d'onglets reste là.** On ne la quitte que pour un formulaire ouvert en modale ; une page ouverte depuis un onglet s'empile dans cet onglet. Toucher l'onglet courant ramène à son début.
4. **Les champs facultatifs le disent.** « (facultatif) » à côté du libellé ; les autres sont obligatoires (`aria-required`). Une erreur s'affiche à l'envoi, sous le champ, et s'efface quand on le corrige.
5. **Une info se dit au moment où elle sert**, pas en badge permanent.
6. **Les états vides sont la première impression.** Chaque écran est relu vide, avec un élément et avec beaucoup, et sans photo.
7. **Rien ne déborde à 320 px** (WCAG 1.4.10, testé par `expectReflow` dans les tests e2e) ; un titre ne partage pas sa ligne avec un bouton.
8. **Mentions légales et confidentialité** : en pied des pages publiques (accueil, liste vue par un visiteur), à côté de toute collecte de données (connexion), et dans l'onglet Compte une fois connecté.

## Accessibilité vérifiée sur les maquettes
- Contrastes texte ≥ 4,5:1 (texte secondaire 5,85:1 sur le fond, placeholder 4,64:1).
- Bords de champs, pointillés et interrupteur ≥ 3:1 (corrigés après audit).
- Vrais `button`, `a`, `label` + `input`, `aria-label` sur les boutons à icône seule, `aria-pressed` sur le coup de cœur.
- Typographie française : espace insécable avant `€` et `!`, apostrophe typographique.

## Reste à faire avant l'étape 3
- Vraies photos dans les maquettes (aucune banque d'images accessible depuis l'environnement de travail).
- Animations (ouverture des feuilles, réservation) avec ressorts interruptibles, et variante « mouvement réduit ».
- Logos officiels Apple et Google selon leurs chartes.
