import { hosts, publisher } from './publisher';
import type { LegalDocument } from './types';

// Mentions required by the French LCEN (article 6-III).
export const legalNoticeFr: LegalDocument = {
  title: 'Mentions légales',
  updatedOn: '10 octobre 2026',
  sections: [
    {
      heading: 'Éditeur',
      paragraphs: [
        `Wish Me est édité par ${publisher.name}, ${publisher.postalAddress}.`,
        `Contact\u00A0: ${publisher.contactEmail}. Directeur de la publication\u00A0: ${publisher.name}.`,
      ],
    },
    {
      heading: 'Hébergement',
      paragraphs: [
        `Site web\u00A0: ${hosts.web.name}, ${hosts.web.address} (${hosts.web.website}).`,
        `Données\u00A0: ${hosts.data.name} (${hosts.data.website}), région ${hosts.data.region}.`,
      ],
    },
    {
      heading: 'Données personnelles',
      paragraphs: ['Leur traitement est décrit dans la politique de confidentialité.'],
    },
  ],
};
