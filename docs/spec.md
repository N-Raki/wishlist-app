# Spécification produit — Wish Me v2

Sources : la v1 en production ([v1.md](v1.md)) et les pages Notion « Wish Me » de Raki (janv. 2026). Ce document fait foi ; Notion n'est plus mis à jour.

## Le produit
Wish Me sert à créer et partager des listes de souhaits pour faciliter les cadeaux lors d'événements familiaux ou amicaux. Il doit rester simple, accessible, et demander le moins de gestes possible pour chaque action.

Disponible sur le web, Android et iOS, en français et en anglais.

## Principes non négociables
1. **La surprise est protégée par le serveur, pas par l'interface.** Le propriétaire d'une liste ne peut jamais savoir, par aucun moyen, qui a réservé quoi ni si quelque chose est réservé.
2. **Pas de hiérarchie entre les souhaits.** Les « coups de cœur » remplacent un ordre de priorité, pour ne pas laisser penser aux proches qu'un cadeau vaut moins qu'un autre.
3. **Le lien suffit pour partager.** Pas d'invitation, pas de compte nécessaire pour regarder.
4. **Accessibilité WCAG 2.2 AA** sur toutes les plateformes.
5. **Données minimales** (RGPD) : on ne collecte que ce dont une fonctionnalité a besoin.

## Rôles
| Rôle | Qui | Peut |
|---|---|---|
| Visiteur anonyme | A le lien, pas connecté | Lire la liste (sans l'état des réservations, voir Q1) |
| Proche | Connecté, n'est pas le propriétaire | Lire, voir les réservations des autres, réserver, partager |
| Propriétaire | A créé la liste | Tout modifier, partager ; ne voit jamais les réservations |

## Périmètre

Légende : **2.0** = livré à la bascule de wishme.fr (étape 3 de la roadmap) · **2.x** = ajouté ensuite, une feature à la fois (étape 4).

### Compte et connexion
| Fonction | Version |
|---|---|
| Connexion par code à usage unique envoyé par e-mail (méthode par défaut, sans mot de passe) | 2.0 |
| Connexion Google | 2.0 |
| Connexion Apple (obligatoire sur iOS dès qu'une connexion tierce est proposée) | 2.0 |
| Connexion e-mail + mot de passe (optionnel, défini depuis le compte) | 2.0 |
| Nom d'affichage demandé juste après la première connexion | 2.0 |
| Page compte : nom d'affichage, méthodes de connexion liées, mot de passe | 2.0 |
| Supprimer son compte (immédiat, avec confirmation) | 2.0 |
| Exporter ses données | 2.0 |
| Connexion par SMS | 2.x, à reconsidérer : coût par SMS et peu de gain face au code e-mail |

### Wishlists
| Fonction | Version |
|---|---|
| Mes listes : nom et nombre de souhaits, triées par date | 2.0 |
| Créer une liste (nom seul, puis on arrive directement dessus pour ajouter des souhaits) | 2.0 |
| Renommer une liste | 2.0 |
| Supprimer une liste, avec confirmation | 2.0 |
| Prévenir les proches qui avaient réservé quand une liste est supprimée (e-mail, puis push) | 2.x |
| Recherche dans mes listes | 2.x, quand quelqu'un en a assez pour en avoir besoin |

### Souhaits
| Fonction | Version |
|---|---|
| Nom (obligatoire), prix + devise, lien, description, image | 2.0 |
| Modifier, supprimer avec confirmation | 2.0 |
| Coup de cœur | 2.x (première feature après la bascule) |
| Image récupérée automatiquement depuis le lien | 2.x |
| Prévenir les proches qui avaient réservé quand un souhait est modifié ou supprimé | 2.x |

### Consulter et réserver
| Fonction | Version |
|---|---|
| Voir la liste : nom, propriétaire, souhaits avec prix, image, description, lien | 2.0 |
| Réserver / annuler sa réservation ; plusieurs proches peuvent se positionner sur un même souhait (cadeau commun) et se voient | 2.0 |
| Un proche ne peut réserver qu'une fois le même souhait | 2.0 |
| « Proches » : les personnes dont j'ai déjà consulté une liste, puis leurs listes, de la plus récente à la plus ancienne (remplace la page « récentes ») | 2.0 |
| Demander au propriétaire d'ajouter des idées à sa liste | 2.x |

### Partage
| Fonction | Version |
|---|---|
| Copier le lien | 2.0 |
| Feuille de partage native du système (WhatsApp, Messenger, mail… sans intégrer chaque service), avec un texte prérempli : « Voici ma wishlist Noël 2026 ! » / « Voici la wishlist Noël 2026 de Raki ! » | 2.0 |
| Aperçu riche du lien dans les messageries (titre, propriétaire, image) | 2.0 |

### Plus tard (étape 4)
- **Secret Santa** : un utilisateur crée un événement et saisit des noms. Chaque participant, connecté, choisit son nom parmi ceux non pris (avec confirmation), découvre son tirage via une animation, puis rattache une de ses listes ou en crée une.
- **Cagnotte par liste** : les proches y versent de l'argent, le propriétaire y accède à une date choisie. Nécessite une étude légale avant tout code (voir plus bas).

## Notifications
E-mail d'abord (transactionnel uniquement : codes de connexion, alertes de réservation). Push mobile en 2.x. Aucune notification marketing sans consentement explicite.

## Légal
- **Avant la bascule (2.0)** : politique de confidentialité, mentions légales, CGU, registre des traitements, suppression et export de compte, hébergement des données dans l'UE, information des utilisateurs actuels de la migration.
- **Mineurs** : en France, un mineur de moins de 15 ans a besoin de l'accord d'un parent pour qu'on traite ses données. Les listes d'enfants sont un vrai usage : à trancher (Q2).
- **Cagnotte** : encaisser de l'argent pour le reverser à un tiers relève de la réglementation des services de paiement. On ne le fera qu'à travers un prestataire agréé qui porte cette responsabilité (Stripe Connect ou équivalent), avec vérification d'identité du bénéficiaire. Fiscalité et frais à étudier avant de s'engager.

## Questions ouvertes
| # | Question | Proposition |
|---|---|---|
| Q1 | Un visiteur anonyme voit-il quels souhaits sont réservés ? | Non. Sinon le propriétaire n'a qu'à se déconnecter pour le voir. Il voit la liste et un bouton « Réserver » qui demande de se connecter. |
| Q2 | Comment gérer une liste pour un enfant ? | Le parent crée la liste sous son compte (le nom de la liste dit pour qui). Pas de compte enfant. |
| Q3 | Une liste a-t-elle une date d'événement ? | À discuter : permettrait d'archiver la liste après la fête et de fixer la date d'ouverture d'une cagnotte. Hors 2.0. |
