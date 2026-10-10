# Roadmap de la refonte

Validée par Raki le 2026-10-09. Chaque chantier se fait dans son propre fil de projet ; ce fichier fait le lien.

## 1. Cadrage — terminé
- [x] Inventaire de la v1 → [v1.md](v1.md)
- [x] Spec unifiée (v1 + idées Notion) → [spec.md](spec.md)
- [x] Choix de la stack : Expo + Supabase → [decisions/0001-stack.md](decisions/0001-stack.md)
- [x] Direction visuelle et maquettes des écrans clés → [design.md](design.md)

Questions ouvertes de la spec : Q1 validée ; Q2 et Q3, les propositions s'appliquent tant que Raki ne les corrige pas. Monétisation proposée → [monetisation.md](monetisation.md).

## 2. Socle et automatisation — prochaine étape
Repo restructuré, tests, CI rapide, preview par PR, preprod, déploiement auto en prod, builds iOS/Android, doc de démarrage courte, base RGPD (politique de confidentialité, export et suppression des données).

## 3. Parité et migration
Reconstruire les features v1 avec le nouveau design (périmètre « v2.0 » de la spec). Migration des données testée sur une copie de la prod en preprod, bascule de wishme.fr, publication sur les stores.

## 4. Nouvelles features, une par une
Coups de cœur, connexions supplémentaires, liens affiliés, Secret Santa, puis cagnotte (après validation du cadre légal) et premium quand il aura de quoi se vendre.
