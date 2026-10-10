# Roadmap de la refonte

Validée par Raki le 2026-10-09. Chaque chantier se fait dans son propre fil de projet ; ce fichier fait le lien.

## 1. Cadrage — terminé
- [x] Inventaire de la v1 → [v1.md](v1.md)
- [x] Spec unifiée (v1 + idées Notion) → [spec.md](spec.md)
- [x] Choix de la stack : Expo + Supabase → [decisions/0001-stack.md](decisions/0001-stack.md)
- [x] Direction visuelle et maquettes des écrans clés → [design.md](design.md)

Questions ouvertes de la spec : Q1 et Q2 validées ; Q3, la proposition s'appliquent tant que Raki ne les corrige pas. Monétisation proposée → [monetisation.md](monetisation.md).

## 2. Socle et automatisation — terminé
- [x] App Expo (web, Android, iOS) et Supabase dans le même dépôt, à côté de la v1 → [CLAUDE.md](../CLAUDE.md)
- [x] Tests : unitaires (Jest), base et règles d'accès (pgTAP), API, bout en bout et accessibilité (Playwright + axe)
- [x] CI, preview par PR, preprod, déploiement auto en prod, builds iOS/Android → [decisions/0002-environnements.md](decisions/0002-environnements.md)
- [x] Connexion par code e-mail, page compte, export et suppression des données, politique de confidentialité, mentions légales, registre → [legal/registre.md](legal/registre.md)
- [x] Comptes Supabase, Expo et GitHub créés et branchés → [setup.md](setup.md) (Raki)
- [x] Premier déploiement preprod et production vérifiés (déployés automatiquement le 2026-10-10, connexion et export vérifiés en prod)

## 3. Parité et migration — en cours
Reconstruire les features v1 avec le nouveau design (périmètre « 2.0 » de la spec), migrer les données, basculer wishme.fr et publier sur les stores. Une PR par ligne, dans cet ordre :

- [x] Données : listes, souhaits, réservations, listes ouvertes ; règles d'accès dans la base, export, registre
- [x] Mes listes et ma liste : créer, renommer, supprimer, souhaits sans photo ; barre d'onglets
- [ ] Photos des souhaits (stockage Supabase)
- [ ] Liste d'un proche : réserver, cadeau commun, invité et feuille de connexion ; onglet Proches ; partage et aperçu riche du lien
- [ ] Compte complet : nom d'affichage à la première connexion, Google, Apple, mot de passe
- [ ] Légal et finitions : CGU, durée des comptes inactifs, icône et écran de lancement, adresse de l'éditeur dans le compte Expo
- [ ] Migration v1 → v2, répétée en preprod sur une copie de la prod
- [ ] Bascule : domaine wishme.fr (offre Expo payante), publication sur les stores, information des utilisateurs

## 4. Nouvelles features, une par une
Coups de cœur, connexions supplémentaires, liens affiliés, Secret Santa, puis cagnotte (après validation du cadre légal) et premium quand il aura de quoi se vendre.
