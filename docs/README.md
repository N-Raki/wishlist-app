# Documentation Wish Me

Point d'entrée pour toute session de travail. Lire ce fichier, puis seulement ce dont la tâche a besoin.

| Fichier | Contenu | À lire quand |
|---|---|---|
| [roadmap.md](roadmap.md) | Les étapes de la refonte et où on en est | Toujours |
| [spec.md](spec.md) | Ce que l'application doit faire (v2) | Travail sur une feature |
| [design.md](design.md) | Direction visuelle, tokens, règles d'accessibilité | Tout travail d'interface |
| [v1.md](v1.md) | État de l'app actuelle (wishme.fr) : modèle de données, failles, contraintes de migration | Migration, ou question sur l'existant |
| [decisions/](decisions/) | Décisions d'architecture (ADR), une par fichier | Avant de remettre un choix en cause |

Règles de la doc :
- Un fichier = un sujet. Court, à jour, sans répétition entre fichiers.
- Une décision structurante = un ADR dans `decisions/` (contexte, options, choix, conséquences).
- Quand une étape avance, mettre à jour `roadmap.md` dans la même PR.
