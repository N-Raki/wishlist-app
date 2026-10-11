import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { codeSentTo, expectAccessible, signIn } from './helpers';

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

test('a new account chooses a display name before anything else, and can change it', async ({ page }) => {
  const email = `${randomUUID()}@example.test`;
  await page.goto('/sign-in');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByRole('button', { name: 'Recevoir un code' }).click();
  await page.getByLabel('Code à 6 chiffres').fill(await codeSentTo(email));
  await page.getByRole('button', { name: 'Se connecter' }).click();

  const heading = page.getByRole('heading', { name: 'Comment vos proches vous appellent-ils ?' });
  await expect(heading).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fermer' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('alert')).toHaveText('Choisissez un nom pour continuer.');
  await expectAccessible(page);

  // Coming back later without a name leads back to the same step.
  await page.goto('/');
  await expect(heading).toBeVisible();
  await page.getByLabel('Prénom ou surnom').fill('Léa');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('heading', { name: 'Mes listes' })).toBeVisible();

  await page.getByRole('link', { name: 'Compte' }).click();
  await expect(page.getByText('Léa', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Changer de nom' }).click();
  await page.getByLabel('Prénom ou surnom').fill('Léa M.');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByText('Léa M.', { exact: true })).toBeVisible();
});
