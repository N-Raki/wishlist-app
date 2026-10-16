import { publisher } from './publisher';
import type { LegalDocument } from './types';

// English version of terms.fr.ts, which is the reference.
export const termsEn: LegalDocument = {
  title: 'Terms of use',
  updatedOn: 'October 16, 2026',
  sections: [
    {
      heading: 'The service',
      paragraphs: [
        `Wish Me lets you create wish lists, share them with a link and reserve gifts on your relatives’ lists. It is published on a non-professional basis by ${publisher.name} and it is free.`,
        'By creating an account or signing in, you accept these terms. How your data is handled is described in the privacy policy.',
      ],
    },
    {
      heading: 'Your account',
      paragraphs: [
        'You must be at least 15 to create an account. It is personal: you remain responsible for what is done from your e-mail address and, if you choose one, your password.',
        'You can delete your account at any time from “My account”: your lists, wishes and reservations go with it.',
      ],
    },
    {
      heading: 'What you publish',
      paragraphs: [
        'You remain the owner of what you write and of the photos you add. You only allow us to keep them and show them to the people who have the list’s link, for as long as the list exists.',
        'Do not add anything unlawful, hurtful or that you do not have the rights to, nor information about other people without their consent. Reported content that breaks these rules may be removed and the account suspended.',
        `To report content, write to ${publisher.contactEmail} with the list’s link.`,
      ],
    },
    {
      heading: 'Shared lists and reservations',
      paragraphs: [
        'Anyone with a list’s link can view it: only share it with the people you want.',
        'A reservation only avoids duplicate gifts between relatives. It commits no one: Wish Me sells nothing, takes no payment and plays no part in your purchases.',
        'Wish links lead to shops we do not control: their prices, stock and terms of sale are their own.',
      ],
    },
    {
      heading: 'Availability and liability',
      paragraphs: [
        'We do our best to keep Wish Me running and your data safe, without being able to guarantee it: the service may stop for maintenance or when a host fails. Keep what really matters to you elsewhere too, for example with the data export.',
        'These limits do not apply where we are at fault, nor to the rights the law guarantees you.',
      ],
    },
    {
      heading: 'Changes and end of the service',
      paragraphs: [
        'When these terms change, the date at the top of the page is updated. If the change affects you, we tell you by e-mail 30 days ahead, and you can delete your account if you disagree.',
        'Should Wish Me close, you would be told by e-mail at least 30 days ahead, leaving time to export your data.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        `These terms are governed by French law. In case of disagreement, first write to ${publisher.contactEmail}: we look for an amicable solution. Failing that, the French courts have jurisdiction, and you may go to the court of your place of residence.`,
      ],
    },
  ],
};
