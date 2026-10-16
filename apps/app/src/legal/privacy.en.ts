import { hosts, publisher } from './publisher';
import type { LegalDocument } from './types';

// Translation of privacy.fr.ts, which is the reference text.
export const privacyEn: LegalDocument = {
  title: 'Privacy policy',
  updatedOn: 'October 16, 2026',
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
        'Your display name, chosen when you first sign in and changeable at any time, so your loved ones recognise you.',
        'When your account was created and when you last signed in, and the sign-in methods you use. If you choose a password, we only keep a hashed fingerprint of it, from which it cannot be recovered.',
        'If you sign in with Google, Google sends us your e-mail address, your name, your profile photo and your Google account ID. We use the address to sign you in and your first name to suggest a display name, which you confirm or change. The rest is kept with your sign-in methods and is part of the export.',
        'Your lists and wishes, with what you write in them (name, price, link, details) and their photos. A photo from your device is saved again before it is sent, which removes its hidden information (place, date, device). When you paste a link, our server reads the product page to reuse its photo: the site sees our server, not you.',
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
        'Your data is kept as long as your account exists. An account unused for 3 years is deleted, after a warning e-mail 30 days before: signing in is enough to keep it. When you delete it, the data is erased immediately and leaves our backups within 7 days.',
        'Technical logs are erased automatically by our hosts after a few days (7 days at most at Supabase).',
      ],
    },
    {
      heading: 'Who can access it',
      paragraphs: [
        'People you give a list’s link to see its name, your wishes, their photos and your display name. If the link is sent in a messaging app (WhatsApp, iMessage…), the app reads the list’s public preview to show it in the conversation: its name, your display name, the number of wishes and one photo.',
        'When you reserve a wish, other signed-in loved ones who open the list see your display name, so nobody gives the same gift twice and you can club together. The list’s owner never sees who reserved what, nor whether a wish is reserved.',
        `${hosts.data.name} hosts the database and handles sign-in, in its ${hosts.data.region} region.`,
        `${hosts.web.name} hosts the website and delivers app updates.`,
        `${hosts.email.name}, a company based in ${hosts.email.region}, sends the sign-in e-mails.`,
        'If you choose “Continue with Google”, Google knows that you sign in to Wish Me: that sign-in is covered by its own privacy policy.',
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
