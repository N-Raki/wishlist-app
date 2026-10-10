import { hosts, publisher } from './publisher';
import type { LegalDocument } from './types';

export const legalNoticeEn: LegalDocument = {
  title: 'Legal notice',
  updatedOn: 'October 10, 2026',
  sections: [
    {
      heading: 'Publisher',
      paragraphs: [
        `Wish Me is published on a non-professional basis by ${publisher.name}.`,
        'As allowed by article 6-III-2 of the French law on confidence in the digital economy (LCEN), the publisher’s postal details have been given to the host and are not published.',
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
