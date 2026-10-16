import { publisher } from './publisher';
import type { LegalDocument } from './types';

// Conditions générales d'utilisation. A change that affects users is announced by e-mail
// 30 days ahead (last section): update `updatedOn` and plan that e-mail in the same PR.
export const termsFr: LegalDocument = {
  title: 'Conditions d’utilisation',
  updatedOn: '16 octobre 2026',
  sections: [
    {
      heading: 'Le service',
      paragraphs: [
        `Wish Me permet de créer des listes de souhaits, de les partager par un lien et de réserver les cadeaux des listes de ses proches. Il est édité à titre non professionnel par ${publisher.name} et il est gratuit.`,
        'En créant un compte ou en vous connectant, vous acceptez ces conditions. Le traitement de vos données est décrit dans la politique de confidentialité.',
      ],
    },
    {
      heading: 'Votre compte',
      paragraphs: [
        'Il faut avoir au moins 15 ans pour créer un compte. Il est personnel : vous restez responsable de ce qui est fait depuis votre adresse e-mail et, si vous en choisissez un, de votre mot de passe.',
        'Vous pouvez supprimer votre compte à tout moment depuis « Mon compte » : vos listes, vos souhaits et vos réservations disparaissent avec lui.',
      ],
    },
    {
      heading: 'Ce que vous publiez',
      paragraphs: [
        'Vous restez propriétaire de ce que vous écrivez et des photos que vous ajoutez. Vous nous autorisez seulement à les conserver et à les montrer aux personnes qui ont le lien de la liste, le temps que la liste existe.',
        'N’ajoutez rien d’illicite, de blessant ou dont vous n’avez pas les droits, ni d’informations sur d’autres personnes sans leur accord. Un contenu signalé qui enfreint ces règles peut être retiré et le compte suspendu.',
        `Pour signaler un contenu, écrivez à ${publisher.contactEmail} avec le lien de la liste.`,
      ],
    },
    {
      heading: 'Listes partagées et réservations',
      paragraphs: [
        'Toute personne qui a le lien d’une liste peut la consulter : ne le partagez qu’avec qui vous voulez.',
        'Une réservation sert seulement à éviter les doublons entre proches. Elle n’engage à rien : Wish Me ne vend rien, ne prend aucun paiement et n’intervient pas dans vos achats.',
        'Les liens des souhaits mènent vers des sites marchands que nous ne contrôlons pas : leurs prix, leurs stocks et leurs conditions de vente sont les leurs.',
      ],
    },
    {
      heading: 'Disponibilité et responsabilité',
      paragraphs: [
        'Nous faisons de notre mieux pour que Wish Me fonctionne en continu et garde vos données, sans pouvoir le garantir : le service peut être interrompu pour maintenance ou en cas de panne d’un hébergeur. Gardez ailleurs ce qui compte vraiment pour vous, par exemple avec l’export de vos données.',
        'Ces limites ne s’appliquent pas en cas de faute de notre part, ni aux droits que la loi vous garantit.',
      ],
    },
    {
      heading: 'Modifications et fin du service',
      paragraphs: [
        'Quand ces conditions changent, la date en haut de page est mise à jour. Si le changement vous concerne, nous vous prévenons par e-mail 30 jours avant, et vous pouvez supprimer votre compte si vous n’êtes pas d’accord.',
        'Si Wish Me devait fermer, vous seriez prévenu par e-mail au moins 30 jours avant, le temps d’exporter vos données.',
      ],
    },
    {
      heading: 'Droit applicable',
      paragraphs: [
        `Ces conditions relèvent du droit français. En cas de désaccord, écrivez d’abord à ${publisher.contactEmail} : nous cherchons une solution amiable. À défaut, les tribunaux français sont compétents, et vous pouvez saisir celui de votre domicile.`,
      ],
    },
  ],
};
