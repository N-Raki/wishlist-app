// Sends an e-mail through Brevo's API in preprod and production (BREVO_API_KEY), or through the
// local Mailpit (MAILPIT_URL) in development and tests, where it can be read at :54324.

import { env } from './account.ts';

export type Email = { to: string; subject: string; text: string; html: string };

export async function sendEmail({ to, subject, text, html }: Email) {
  const from = { email: env('EMAIL_FROM'), name: 'Wish Me' };
  const brevoKey = Deno.env.get('BREVO_API_KEY');
  const response = brevoKey
    ? await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': brevoKey, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ sender: from, to: [{ email: to }], subject, textContent: text, htmlContent: html }),
      })
    : await fetch(`${env('MAILPIT_URL')}/api/v1/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: { Email: from.email, Name: from.name },
          To: [{ Email: to }],
          Subject: subject,
          Text: text,
          HTML: html,
        }),
      });
  if (!response.ok) throw new Error(`sending the e-mail failed: ${response.status} ${await response.text()}`);
}
