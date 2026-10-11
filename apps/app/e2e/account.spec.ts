import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { codeSentTo, signIn } from './helpers';

test('a visitor signs in with a code, exports their data, then deletes their account', async ({ page }) => {
  const email = `${randomUUID()}@example.test`;
  await signIn(page, email);

  await page.getByRole('link', { name: 'Compte' }).click();
  await expect(page.getByText(email)).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Exporter mes données' }).click();
  const exported = JSON.parse(await readFile(await (await download).path(), 'utf8'));
  expect(exported.account.email).toBe(email);

  await page.getByRole('button', { name: 'Supprimer mon compte' }).click();
  await page.getByRole('button', { name: 'Supprimer définitivement' }).click();
  await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();

  // Signed out and gone: the account page is out of reach.
  await page.goto('/account');
  await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
});

test('a wrong code is refused with an explanation', async ({ page }) => {
  const email = `${randomUUID()}@example.test`;
  await page.goto('/sign-in');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByRole('button', { name: 'Recevoir un code' }).click();
  await codeSentTo(email);
  await page.getByLabel('Code à 6 chiffres').fill('000000');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('alert')).toHaveText('Ce code est incorrect ou a expiré.');
});

test('an invalid address is caught before anything is sent', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Adresse e-mail').fill('pas-une-adresse');
  await page.getByRole('button', { name: 'Recevoir un code' }).click();
  await expect(page.getByRole('alert')).toContainText('adresse e-mail valide');
});
