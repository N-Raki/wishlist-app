# Registre des traitements

Tenu au titre de l'article 30 du RGPD. Document interne, mis à jour dans la même PR que tout changement de données ou de prestataire, avec la politique de confidentialité (`apps/app/src/legal/privacy.*.ts`) et `export_my_data`.

Responsable : l'éditeur de Wish Me (coordonnées dans `apps/app/src/legal/publisher.ts`).

## 1. Comptes et connexion
| | |
|---|---|
| Finalité | Créer un compte, se connecter, gérer son compte |
| Base légale | Exécution du contrat (art. 6.1.b) |
| Personnes | Utilisateurs inscrits, 15 ans et plus |
| Données | E-mail ; nom d'affichage (obligatoire, choisi à la première connexion) ; dates de création et de dernière connexion ; méthodes de connexion liées ; mot de passe s'il en choisit un (facultatif, conservé uniquement sous forme d'empreinte hachée) ; s'il se connecte avec Google : e-mail, nom, photo de profil et identifiant Google transmis par Google (le prénom sert à proposer le nom d'affichage, l'ensemble figure dans l'export) |
| Destinataires | Supabase (base et authentification, région Paris) ; Brevo (envoi des e-mails de connexion et d'avertissement d'inactivité, France) ; Google, responsable de sa propre connexion, seulement pour qui la choisit |
| Transferts hors UE | Supabase Inc. et Expo (650 Industries, Inc.), États-Unis, en tant que sous-traitants : clauses contractuelles types de leurs DPA ; Expo est aussi certifié Data Privacy Framework |
| Durée | Tant que le compte existe, et au plus 3 ans sans utilisation : un e-mail prévient 30 jours avant la suppression, une connexion l'annule (date de l'avertissement conservée et incluse dans l'export) ; effacement immédiat à la suppression, sauvegardes purgées sous 7 jours |
| Sécurité | Connexion par code à usage unique (10 min), ou par mot de passe facultatif : 8 caractères minimum, haché, choisi ou changé après une connexion récente ou un nouveau code, chaque changement signalé par e-mail ; ou par Google (flux OAuth avec PKCE, adresses de retour limitées à celles de l'app) ; RLS testée en CI ; secrets hors du code |
| Droits | Export (JSON) et suppression dans l'app ; le reste par e-mail |

## 2. Listes, souhaits et réservations
| | |
|---|---|
| Finalité | Créer et partager des listes de souhaits ; réserver un cadeau sur la liste d'un proche sans doublon ; retrouver les listes déjà ouvertes (onglet « Proches ») |
| Base légale | Exécution du contrat (art. 6.1.b) |
| Personnes | Utilisateurs inscrits ; leurs proches qui ouvrent une liste |
| Données | Listes (nom, date) ; souhaits (nom, prix et devise, lien, précisions, photo, date) ; réservations (qui, quel souhait, date) ; listes ouvertes par un utilisateur connecté (date de la dernière visite) |
| Destinataires | Toute personne qui a le lien d'une liste voit son nom, ses souhaits, leurs photos et le nom d'affichage du propriétaire. Les messageries où ce lien est envoyé lisent un aperçu public (nom de la liste, nom d'affichage du propriétaire, nombre de souhaits, une photo) ; aucune réservation n'y figure. Les sites des produits dont un lien est collé voient la requête de notre serveur (fonction `link-photo`), jamais l'utilisateur. Les autres proches connectés voient le nom d'affichage de ceux qui ont réservé ; le propriétaire jamais (règle appliquée par la base, testée en CI). Prestataires : comme au 1 |
| Transferts hors UE | Comme au 1 |
| Durée | Tant que la liste et le compte existent ; supprimer une liste efface ses souhaits, leurs réservations et les visites ; supprimer son compte efface ses listes, ses réservations et ses visites. Les photos sont supprimées par l'app avec leur souhait ou leur liste, et toutes ensemble avec le compte (fonction `delete-account`) ; un envoi interrompu peut laisser un fichier orphelin, effacé avec le compte |
| Sécurité | Les tables ne sont lisibles que par le propriétaire ; les autres passent par une fonction qui exige l'identifiant de la liste, impossible à énumérer ; liens limités à http(s). Photos : stockage public sous des noms aléatoires, chaque utilisateur n'écrit que dans son dossier, aucune liste du contenu possible ; photos de l'appareil réencodées (métadonnées EXIF et position retirées) ; la lecture des pages produit ne joint que des serveurs publics (adresses privées refusées, redirections vérifiées, taille et durée bornées) |
| Droits | Listes, souhaits (avec le chemin de leur photo), réservations et listes ouvertes inclus dans l'export ; le reste par e-mail |

## 3. Journaux techniques
| | |
|---|---|
| Finalité | Sécurité du service, diagnostic |
| Base légale | Intérêt légitime (art. 6.1.f) |
| Données | Adresse IP, date, requête |
| Destinataires | Supabase ; Expo (hébergement du site et des mises à jour) ; Brevo (journaux d'envoi des e-mails) |
| Durée | 7 jours au plus chez Supabase ; 7 jours chez Expo sur l'offre gratuite (3 mois sur l'offre payante prévue à la bascule) ; durée chez Brevo à confirmer |

## 4. Reprise des comptes de la v1
| | |
|---|---|
| Finalité | Continuer le service pour les utilisateurs de wishme.fr dans la nouvelle version, liens déjà partagés compris |
| Base légale | Exécution du contrat (art. 6.1.b) |
| Données | Celles du 1 et du 2 déjà détenues par la v1 : e-mail, nom d'affichage, identifiant Google, listes, souhaits, réservations, listes ouvertes. Pas les mots de passe, qui ne sont pas repris |
| Déroulé | Export depuis le serveur de la v1, import direct dans la base (connexion chiffrée, certificat vérifié). Une répétition en préproduction, effacée juste après (`--undo`), puis la migration à la bascule. Le fichier d'export reste sur le poste de l'éditeur et est supprimé après usage |
| Information | Les utilisateurs sont prévenus par e-mail avant la bascule (à préparer avec la bascule) |
