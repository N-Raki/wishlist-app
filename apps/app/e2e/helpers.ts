import { expect, type Page } from '@playwright/test';

// Mailpit catches the e-mails of the local Supabase stack.
const mailpit = 'http://127.0.0.1:54324/api/v1';

export async function codeSentTo(email: string) {
  await expect
    .poll(async () => (await (await fetch(`${mailpit}/search?query=to:${email}`)).json()).messages_count)
    .toBe(1);
  const { messages } = await (await fetch(`${mailpit}/search?query=to:${email}`)).json();
  const message = await (await fetch(`${mailpit}/message/${messages[0].ID}`)).json();
  return message.Text.match(/\b\d{6}\b/)[0] as string;
}

export async function signIn(page: Page, email: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByRole('button', { name: 'Recevoir un code' }).click();
  await page.getByLabel('Code à 6 chiffres').fill(await codeSentTo(email));
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('heading', { name: 'Mes listes' })).toBeVisible();
}
