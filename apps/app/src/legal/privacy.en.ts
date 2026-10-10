import { hosts, publisher } from './publisher';
import type { LegalDocument } from './types';

// Translation of privacy.fr.ts, which is the reference text.
export const privacyEn: LegalDocument = {
  title: 'Privacy policy',
  updatedOn: 'October 10, 2026',
  sections: [
    {
      heading: 'In short',
      paragraphs: [
        'Wish Me only collects what the app needs to work. No ads, no selling of data, no trackers.',
        'You can download your data or delete your account at any time from the “My account” page.',
      ],
    },
    {
      heading: 'Data controller',
      paragraphs: [`${publisher.name}, reachable at ${publisher.contactEmail}.`],
    },
    {
      heading: 'The data we process',
      paragraphs: [
        'Your e-mail address, to sign you in with a one-time code and to write to you about your account.',
        'Your display name, if you choose one, so your loved ones recognise you.',
        'When your account was created and when you last signed in, and the sign-in methods you use.',
        'Your lists and wishes, with what you write in them (name, price, link, details).',
        'The wishes you reserve on your loved ones’ lists, and the lists you opened while signed in, so you can find them again later.',
        'Technical logs (IP address, date, request), kept by our hosts to secure the service.',
      ],
    },
    {
      heading: 'Why, and on what basis',
      paragraphs: [
        'Providing the service you ask for by creating an account: performance of our contract (GDPR article 6.1.b).',
        'Protecting the service against abuse and attacks: our legitimate interest (GDPR article 6.1.f).',
      ],
    },
    {
      heading: 'How long',
      paragraphs: [
        'Your data is kept as long as your account exists. When you delete it, the data is erased immediately and leaves our backups within 7 days.',
        'Technical logs are erased automatically by our hosts after a few days (7 days at most at Supabase).',
      ],
    },
    {
      heading: 'Who can access it',
      paragraphs: [
        'People you give a list’s link to see its name, your wishes and your display name.',
        'When you reserve a wish, other signed-in loved ones who open the list see your display name, so nobody gives the same gift twice and you can club together. The list’s owner never sees who reserved what, nor whether a wish is reserved.',
        `${hosts.data.name} hosts the database and handles sign-in, in its ${hosts.data.region} region.`,
        `${hosts.web.name} hosts the website and delivers app updates.`,
        `${hosts.email.name}, a company based in ${hosts.email.region}, sends the sign-in e-mails.`,
        'These providers act on our instructions and cannot use your data for their own purposes. Some are based in the United States; any transfer is covered by the European Commission’s standard contractual clauses.',
      ],
    },
    {
      heading: 'Cookies and storage',
      paragraphs: [
        'Wish Me sets no advertising or analytics cookies. Your device only keeps your session so you stay signed in: this storage is essential to the service and needs no consent.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can access, correct, erase or retrieve your data in a reusable format, object to its processing or ask for it to be restricted.',
        `Export and deletion are available directly in “My account”. For anything else, write to ${publisher.contactEmail}: we answer within a month.`,
        'If you believe your rights are not respected, you can complain to the CNIL, the French data protection authority (cnil.fr).',
      ],
    },
    {
      heading: 'Minimum age',
      paragraphs: ['You must be at least 15 to create an account.'],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'When this policy changes, the date at the top is updated. If the change affects your data, we let you know by e-mail.',
      ],
    },
  ],
};
