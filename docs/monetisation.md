# Monétisation

Statut : **proposition** (2026-10-10), ouverte à discussion. Rien n'est codé avant l'étape 4 de la [roadmap](roadmap.md).

Objectif de Raki : dégager un peu d'argent sans gêner les utilisateurs, avec une version gratuite qui ne frustre pas.

## Règles
1. **Le gratuit fait tout l'essentiel, sans limite** : listes et souhaits illimités, partage, réservations, cadeaux communs. Aucune fonction de la v1 ne devient payante.
2. **Pas de publicité, pas de revente de données.**
3. **Transparence** : une page « Comment Wish Me gagne de l'argent », et une mention courte là où c'est utile.
4. **Un lien ne change jamais de destination** : le proche arrive sur la page que le propriétaire a choisie, au même prix.

## 1. Liens affiliés (en premier)
Ce sont les proches qui cliquent au moment d'acheter : c'est le meilleur moment pour une commission, et personne ne paie plus cher.

### Fonctionnement proposé
- Le lien est **stocké tel que saisi**. La transformation se fait **au clic**, via une redirection serveur (`wishme.fr/l/<id-du-souhait>`). On peut ainsi changer de réseau, ajouter un marchand ou tout couper sans toucher aux données.
- On passe par un **agrégateur** (Skimlinks, Sovrn Commerce, Awin…) plutôt que programme par programme : un seul contrat, des dizaines de milliers de marchands, la transformation des liens est automatique. Skimlinks cite d'ailleurs les plateformes de wishlist parmi ses cas d'usage. L'agrégateur garde une part de la commission.
- **Amazon Partenaires** en direct peut venir ensuite, si Amazon pèse lourd dans les liens. Ses conditions sont strictes (mention imposée, usages des liens encadrés) : à relire avant de l'intégrer.
- Un lien qui contient **déjà un identifiant d'affiliation** (celui d'un créateur de contenu, par exemple) n'est **jamais remplacé** : ce serait détourner sa commission.
- Les liens vers des sites sans programme partent directement, sans détour.
- On compte les clics par souhait, sans savoir qui a cliqué.

### Points légaux
- **Transparence envers les consommateurs** : une plateforme en ligne doit informer de façon loyale, claire et transparente sur les relations de rémunération qui la concernent (Code de la consommation, art. L.111-7). Mention proposée près des liens : « Wish Me peut toucher une petite commission sur certains achats. Le prix ne change pas. » Plus une ligne dans les CGU et la page dédiée.
- **Traceurs** : l'application elle-même ne pose aucun traceur. En revanche, le réseau d'affiliation en pose généralement lors de la redirection pour attribuer la vente. Il faut vérifier avec le réseau choisi comment le suivi fonctionne et si un consentement est nécessaire. L'objectif reste de ne pas avoir de bandeau cookies.
- **Statut et fiscalité** : les commissions sont un revenu professionnel. Il faut une structure pour les encaisser (micro-entreprise au minimum) et les déclarer.

### Ce qu'il faut attendre
Un revenu modeste au début : les commissions vont de quelques pour cent à environ 10 % du panier selon le marchand, et seulement quand l'achat se fait après le clic. Il grandit avec l'usage, avec de fortes pointes à Noël. C'est le moyen le moins gênant, donc le premier à mettre en place.

## 2. Abonnement premium (plus tard)
Le premium vend du **confort et de la personnalisation**, jamais le droit d'offrir. On ne le lance que lorsque deux ou trois fonctions vraiment désirables existent.

### Idées candidates
| Idée | Pourquoi c'est premium et pas frustrant |
|---|---|
| Couvertures et thèmes de liste, lien personnalisé (`wishme.fr/camille`) | Purement esthétique |
| Suivi des prix et alerte de baisse sur les souhaits | Coûte des ressources serveur ; va bien avec l'affiliation |
| Import depuis une autre liste (Amazon, autre appli) | Gain de temps ponctuel |
| Secret Santa avancé : exclusions, plusieurs groupes, rappels | Le Secret Santa simple reste gratuit |
| Après la fête, voir qui a offert quoi (pour remercier) | **À discuter** : touche au principe de la surprise ; seulement après la date de l'événement et si les proches l'acceptent |

À garder **gratuit** : listes à plusieurs gestionnaires (deux parents pour un enfant, un couple), notifications de réservation, export des données.

### Prix et paiement
- Usage saisonnier (Noël, anniversaires) : un **abonnement annuel** à petit prix, éventuellement un **achat unique** « à vie ». Montants à fixer plus tard.
- Sur iOS et Android, les achats intégrés des stores sont obligatoires pour ce type d'abonnement (commission de 15 % pour les petits développeurs). Sur le web, un prestataire de paiement. Une couche comme RevenueCat unifie les trois.
- Légal : CGV, droit de rétractation de 14 jours (avec renonciation possible pour un service numérique fourni immédiatement), résiliation en quelques clics obligatoire en France, TVA du pays de l'acheteur (gérée par les stores ; sur le web, choisir un prestataire qui la gère).

## 3. Écarté
- **Publicité** : dégrade le design et la confiance, rapporte peu à cette échelle.
- **Limiter le gratuit** (nombre de listes, de souhaits, de proches) : frustrant précisément au moment où l'on partage.

## Plus tard
La cagnotte (voir [spec.md](spec.md)) pourrait prélever des frais de service, à étudier avec son volet légal.

## Avant de commencer
- Statut juridique pour encaisser (Raki).
- Choix du réseau d'affiliation et lecture de ses conditions.
- Page « Comment Wish Me gagne de l'argent », mention près des liens, CGU mises à jour.
