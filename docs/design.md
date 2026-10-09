# Direction visuelle : Vitrine

Retenue par Raki le 2026-10-09 parmi six pistes. Maquettes : [canevas Wish Me](https://claude.ai/artifact/KS9TF9ehEWbhpF1PvdnCuG), page « Vitrine (retenue) ».

## L'idée
Une liste de souhaits est d'abord une vitrine de cadeaux : les photos portent l'interface, le reste s'efface. La joie vient des images et d'une seule couleur vive, pas de la décoration.

## Principes
1. **Photo d'abord.** Grille en 2 colonnes, vignettes 4:5, coins arrondis 22 px. Un souhait sans photo garde une vignette teintée, jamais d'icône générique.
2. **Une seule couleur d'accent**, toujours avec du texte encre dessus (jamais blanc sur corail).
3. **Le secret est visible.** Côté propriétaire, un rappel « Les réservations restent une surprise » ; aucun état de réservation n'apparaît.
4. **Un vocabulaire de réservation unique** : « Réserver », « Léa s’en occupe » + « Participer », « Vous et Hugo » (ou « Vous l’offrez avec Hugo » quand la place le permet).
5. **Actions principales en pilule pleine**, secondaires en pilule à bord.

## Tokens

| Rôle | Clair | Sombre |
|---|---|---|
| Fond | `#F3F2F5` | `#131217` |
| Surface | `#FFFFFF` | `#24232A` |
| Texte | `#1D1C22` | `#F4F3F6` |
| Texte secondaire | `#5F5C68` | `#A9A6B2` |
| Bord des champs et éléments d'interface | `#8A8792` | à définir à l'étape 3 |
| Accent (texte `#1D1C22` dessus) | `#FF7A59` | `#FF7A59` |
| Coup de cœur | `#E8432E` | `#E8432E` |
| Succès | `#1D6B44` | à définir à l'étape 3 |

- **Typo** : Gabarito (400 à 800). Titres 36 à 40 px, graisse 800, interlettrage −0,025 em ; corps 15 à 17 px.
- **Rayons** : vignettes et cartes 22 à 26 px, champs 14 à 16 px, boutons en pilule.
- **Cibles tactiles** : 44 px minimum.
- **Barre d'onglets** translucide (flou + saturation), le contenu défile dessous.

## Accessibilité vérifiée sur les maquettes
- Contrastes texte ≥ 4,5:1 (texte secondaire 5,85:1 sur le fond, placeholder 4,64:1).
- Bords de champs, pointillés et interrupteur ≥ 3:1 (corrigés après audit).
- Vrais `button`, `a`, `label` + `input`, `aria-label` sur les boutons à icône seule, `aria-pressed` sur le coup de cœur.
- Typographie française : espace insécable avant `€` et `!`, apostrophe typographique.

## Reste à faire avant l'étape 3
- Vraies photos dans les maquettes (aucune banque d'images accessible depuis l'environnement de travail).
- Animations (ouverture des feuilles, réservation) avec ressorts interruptibles, et variante « mouvement réduit ».
- Logos officiels Apple et Google selon leurs chartes.
