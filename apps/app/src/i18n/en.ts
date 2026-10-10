import type { Translations } from './fr';

export const en: Translations = {
  home: {
    tagline: 'Wish lists that keep the surprise.',
    intro: 'Make your list, share the link: your loved ones coordinate without giving anything away.',
    signIn: 'Sign in',
    greeting: 'Hello',
    comingSoonTitle: 'Your lists are coming soon',
    comingSoonBody: 'This version lays the groundwork: sign-in, account and privacy. Lists and wishes come next.',
    account: 'My account',
    showcase: {
      vinyl: 'Record player',
      trip: 'Weekend in Lisbon',
      claimed: '{{name}} is on it',
      shared: 'You and {{name}}',
    },
  },
  footer: {
    privacy: 'Privacy',
    legalNotice: 'Legal notice',
  },
  signIn: {
    title: 'Sign in',
    emailHeading: 'Get a sign-in code',
    emailBody: 'No password to remember: we e-mail you a 6-digit code. No account yet? One is created on the way.',
    emailLabel: 'E-mail address',
    sendCode: 'Get a code',
    codeHeading: 'Enter the code',
    codeSent: 'Sent to {{email}}. It expires in 10 minutes.',
    codeLabel: '6-digit code',
    verify: 'Sign in',
    changeEmail: 'Use another address',
    resend: 'Send a new code',
    resent: 'New code sent.',
    privacyNotice: 'Your data is handled as explained in our',
    privacyLink: 'privacy policy',
    errors: {
      invalidEmail: 'Enter a valid e-mail address, like name@example.com.',
      invalidCode: 'This code is wrong or has expired.',
      tooManyRequests: 'Too many attempts. Wait a minute before trying again.',
    },
  },
  account: {
    title: 'My account',
    signedInAs: 'Signed in with',
    dataHeading: 'Your data',
    dataBody: 'Download a copy of everything Wish Me keeps about you, in a file you can reuse elsewhere (JSON).',
    export: 'Export my data',
    exported: 'Your file is ready.',
    signOut: 'Sign out',
    delete: 'Delete my account',
  },
  deleteAccount: {
    title: 'Delete account',
    heading: 'Delete your account?',
    body: 'Your account and everything attached to it are erased immediately. This cannot be undone.',
    exportFirst: 'To keep a copy, export your data from your account first.',
    confirm: 'Delete for good',
    cancel: 'Cancel',
  },
  legal: {
    updatedOn: 'Updated: {{date}}',
  },
  notFound: {
    title: 'Page not found',
    body: 'This link leads nowhere.',
    home: 'Back to home',
  },
  common: {
    home: 'Home',
    genericError: 'Something went wrong. Check your connection and try again.',
  },
};
