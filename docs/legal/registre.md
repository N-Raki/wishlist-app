# Registre des traitements

Tenu au titre de l'article 30 du RGPD. Document interne, mis à jour dans la même PR que tout changement de données ou de prestataire, avec la politique de confidentialité (`apps/app/src/legal/privacy.*.ts`) et `export_my_data`.

Responsable : l'éditeur de Wish Me (coordonnées dans `apps/app/src/legal/publisher.ts`).

## 1. Comptes et connexion
| | |
|---|---|
| Finalité | Créer un compte, se connecter, gérer son compte |
| Base légale | Exécution du contrat (art. 6.1.b) |
| Personnes | Utilisateurs inscrits, 15 ans et plus |
| Données | E-mail ; nom d'affichage (facultatif) ; dates de création et de dernière connexion ; méthodes de connexion liées |
| Destinataires | Supabase (base et authentification, région Paris) ; prestataire d'e-mails (à choisir, voir [setup.md](../setup.md)) |
| Transferts hors UE | Supabase Inc. (États-Unis) en tant que sous-traitant : clauses contractuelles types de son DPA |
| Durée | Tant que le compte existe ; effacement immédiat à la suppression, sauvegardes purgées sous 7 jours |
| Sécurité | Connexion sans mot de passe par code à usage unique (10 min) ; RLS testée en CI ; secrets hors du code |
| Droits | Export (JSON) et suppression dans l'app ; le reste par e-mail |

## 2. Journaux techniques
| | |
|---|---|
| Finalité | Sécurité du service, diagnostic |
| Base légale | Intérêt légitime (art. 6.1.f) |
| Données | Adresse IP, date, requête |
| Destinataires | Supabase ; Expo (hébergement du site et des mises à jour) |
| Durée | 7 jours au plus chez Supabase ; durée chez Expo à confirmer |

## À faire avant la bascule (étape 3)
- Ajouter les traitements des listes, souhaits, réservations et « proches ».
- Fixer une durée pour les comptes inactifs (proposition : suppression après 3 ans sans connexion, avec un e-mail de prévenance un mois avant).
