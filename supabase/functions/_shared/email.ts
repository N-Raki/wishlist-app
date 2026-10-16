// Sends an e-mail through Brevo's API in preprod and production (BREVO_API_KEY), or through the
// local Mailpit (MAILPIT_URL) in development and tests, where it can be read at :54324.

import { env } from './account.ts';

const brevo = 'https://api.brevo.com/v3';

export type Email = { to: string; subject: string; text: string; html: string };

export async function sendEmail({ to, subject, text, html }: Email) {
  const from = { email: env('EMAIL_FROM'), name: 'Wish Me' };
  const brevoKey = Deno.env.get('BREVO_API_KEY');
  const response = brevoKey
    ? await fetch(`${brevo}/smtp/email`, {
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

// Brevo switches off a key after 90 days without a successful call, and a daily job may send
// nothing for months: a read within the key's only scope (transactional e-mail) each run keeps the key alive and surfaces a revoked
// key the same day rather than when a notice is due.
export async function checkEmail() {
  const brevoKey = Deno.env.get('BREVO_API_KEY');
  if (!brevoKey) return;
  const response = await fetch(`${brevo}/smtp/statistics/aggregatedReport?days=1`, {
    headers: { 'api-key': brevoKey, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`the Brevo key was refused: ${response.status} ${await response.text()}`);
}
