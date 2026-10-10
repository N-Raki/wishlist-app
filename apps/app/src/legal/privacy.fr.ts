import { hosts, publisher } from './publisher';
import type { LegalDocument } from './types';

// Keep in sync with docs/legal/registre.md: every change of data or provider updates both.
export const privacyFr: LegalDocument = {
  title: 'Politique de confidentialité',
  updatedOn: '10 octobre 2026',
  sections: [
    {
      heading: 'En bref',
      paragraphs: [
        'Wish Me ne collecte que ce qu’il faut pour faire fonctionner l’application. Pas de publicité, pas de revente de données, pas de traceur.',
        'Vous pouvez à tout moment télécharger vos données ou supprimer votre compte depuis la page «\u00A0Mon compte\u00A0».',
      ],
    },
    {
      heading: 'Responsable du traitement',
      paragraphs: [`${publisher.name}, joignable à ${publisher.contactEmail}.`],
    },
    {
      heading: 'Les données que nous traitons',
      paragraphs: [
        'Votre adresse e-mail, pour vous connecter avec un code à usage unique et vous écrire au sujet de votre compte.',
        'Votre nom d’affichage, si vous en choisissez un, pour que vos proches vous reconnaissent.',
        'Les dates de création du compte et de vos dernières connexions, ainsi que les méthodes de connexion que vous utilisez.',
        'Des journaux techniques (adresse IP, date, requête), tenus par nos hébergeurs pour la sécurité du service.',
      ],
    },
    {
      heading: 'Pourquoi, et sur quelle base',
      paragraphs: [
        'Fournir le service que vous demandez en créant un compte\u00A0: c’est l’exécution du contrat qui nous lie (article\u00A06.1.b du RGPD).',
        'Protéger le service contre les abus et les attaques\u00A0: c’est notre intérêt légitime (article\u00A06.1.f du RGPD).',
      ],
    },
    {
      heading: 'Combien de temps',
      paragraphs: [
        'Vos données sont conservées tant que votre compte existe. Quand vous le supprimez, elles sont effacées immédiatement\u00A0; elles disparaissent des sauvegardes au bout de 7\u00A0jours au plus.',
        'Les journaux techniques sont effacés automatiquement par nos hébergeurs après quelques jours (7\u00A0jours au plus chez Supabase).',
      ],
    },
    {
      heading: 'Qui y a accès',
      paragraphs: [
        `${hosts.data.name} héberge la base de données et gère la connexion, dans sa région ${hosts.data.region}.`,
        `${hosts.web.name} héberge le site web et distribue les mises à jour de l’application.`,
        `${hosts.email.name}, société établie en ${hosts.email.region}, envoie les e-mails de connexion.`,
        'Ces prestataires agissent sur nos instructions et ne peuvent pas utiliser vos données pour leur propre compte. Certains sont établis aux États-Unis\u00A0; les transferts éventuels sont encadrés par les clauses contractuelles types de la Commission européenne.',
      ],
    },
    {
      heading: 'Cookies et stockage',
      paragraphs: [
        'Wish Me ne dépose aucun cookie publicitaire ni de mesure d’audience. Votre appareil garde seulement votre session, pour que vous restiez connecté\u00A0: ce stockage est indispensable au service et ne demande pas de consentement.',
      ],
    },
    {
      heading: 'Vos droits',
      paragraphs: [
        'Vous pouvez accéder à vos données, les corriger, les effacer, les récupérer dans un format réutilisable, vous opposer à un traitement ou en demander la limitation.',
        `L’export et la suppression se font directement depuis «\u00A0Mon compte\u00A0». Pour le reste, écrivez à ${publisher.contactEmail}\u00A0: nous répondons sous un mois.`,
        'Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (cnil.fr).',
      ],
    },
    {
      heading: 'Âge minimum',
      paragraphs: ['Il faut avoir au moins 15\u00A0ans pour créer un compte.'],
    },
    {
      heading: 'Modifications',
      paragraphs: [
        'Quand cette politique change, la date en haut de page est mise à jour. Si le changement touche à vos données, nous vous prévenons par e-mail.',
      ],
    },
  ],
};
