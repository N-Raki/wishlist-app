import { hosts, publisher } from './publisher';
import type { LegalDocument } from './types';

export const legalNoticeEn: LegalDocument = {
  title: 'Legal notice',
  updatedOn: 'October 10, 2026',
  sections: [
    {
      heading: 'Publisher',
      paragraphs: [
        `Wish Me is published by ${publisher.name}, ${publisher.postalAddress}.`,
        `Contact: ${publisher.contactEmail}. Publication director: ${publisher.name}.`,
      ],
    },
    {
      heading: 'Hosting',
      paragraphs: [
        `Website: ${hosts.web.name}, ${hosts.web.address} (${hosts.web.website}).`,
        `Data: ${hosts.data.name} (${hosts.data.website}), ${hosts.data.region} region.`,
      ],
    },
    {
      heading: 'Personal data',
      paragraphs: ['How it is processed is described in the privacy policy.'],
    },
  ],
};
