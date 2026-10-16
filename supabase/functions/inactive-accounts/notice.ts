// The e-mail sent 30 days before an unused account is deleted, in the account's language.

import type { Email } from '../_shared/email.ts';

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function layout(lang: string, heading: string, paragraphs: string[], link: { href: string; label: string }) {
  const body = paragraphs
    .map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:#5F5C68">${p}</p>`)
    .join('');
  return `<!doctype html>
<html lang="${lang}">
  <body style="margin:0;padding:32px 16px;background:#F3F2F5;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1D1C22">
    <div style="max-width:420px;margin:0 auto;background:#FFFFFF;border-radius:24px;padding:32px">
      <h1 style="margin:0 0 16px;font-size:24px">${heading}</h1>
      ${body}
      <a href="${escapeHtml(link.href)}" style="display:inline-block;margin-top:8px;padding:14px 24px;border-radius:999px;background:#FF7A59;color:#1D1C22;font-weight:700;text-decoration:none">${link.label}</a>
    </div>
  </body>
</html>`;
}

export function inactivityNotice(to: string, locale: string | null, deletionOn: Date, siteUrl: string): Email {
  const signIn = `${siteUrl}/sign-in`;
  if (locale === 'en') {
    const date = deletionOn.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Paris',
    });
    const paragraphs = [
      'You have not used Wish Me for almost 3 years.',
      `As our privacy policy explains, your account, your lists and your reservations will be deleted on ${date}.`,
      'To keep them, just sign in before then. If you no longer need your account, you have nothing to do.',
    ];
    return {
      to,
      subject: 'Your Wish Me account will be deleted in 30 days',
      text: `${paragraphs.join('\n\n')}\n\n${signIn}`,
      html: layout('en', 'Keep your Wish Me account?', paragraphs, { href: signIn, label: 'Sign in' }),
    };
  }
  const date = deletionOn.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });
  const paragraphs = [
    'Vous n’avez pas utilisé Wish Me depuis bientôt 3 ans.',
    `Comme l’explique notre politique de confidentialité, votre compte, vos listes et vos réservations seront supprimés le ${date}.`,
    'Pour les garder, il suffit de vous connecter d’ici là. Si vous n’avez plus besoin de votre compte, vous n’avez rien à faire.',
  ];
  return {
    to,
    subject: 'Votre compte Wish Me sera supprimé dans 30 jours',
    text: `${paragraphs.join('\n\n')}\n\n${signIn}`,
    html: layout('fr', 'Garder votre compte Wish Me ?', paragraphs, { href: signIn, label: 'Me connecter' }),
  };
}
