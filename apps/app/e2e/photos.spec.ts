import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { expect, type Page, test } from '@playwright/test';
import { signIn } from './helpers';

const photo = path.join(__dirname, 'fixtures', 'photo.jpg');

async function newList(page: Page, name: string) {
  await page.getByRole('link', { name: 'Nouvelle liste' }).click();
  await page.getByLabel('Nom de la liste').fill(name);
  await page.getByRole('button', { name: 'Créer la liste' }).click();
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

test('a wish gets a photo from the device, without its hidden metadata, and loses it', async ({ page }) => {
  await signIn(page, `${randomUUID()}@example.test`);
  await newList(page, 'Noël 2026');

  await page.getByRole('link', { name: 'Ajouter un souhait' }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Ajouter une photo' }).click();
  await (await chooser).setFiles(photo);
  await expect(page.getByRole('button', { name: 'Changer la photo' })).toBeVisible();
  await page.getByLabel('Nom du souhait').fill('Plaid');
  await page.getByRole('button', { name: 'Ajouter à la liste' }).click();

  const tile = page.getByRole('link', { name: 'Modifier Plaid' });
  const image = tile.locator('img');
  await expect(image).toHaveAttribute('src', /wish-photos/);
  const url = (await image.getAttribute('src')) ?? '';
  // Re-encoded on the device: the camera details of the original are gone.
  const uploaded = await (await page.request.get(url)).body();
  expect(uploaded.includes('SecretCamera')).toBe(false);

  await tile.click();
  await page.getByRole('button', { name: 'Retirer la photo' }).click();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByRole('link', { name: 'Modifier Plaid' }).locator('img')).toHaveCount(0);
  // The file is gone too, not only the link to it.
  await expect.poll(async () => (await page.request.get(url)).ok()).toBe(false);
});

test('a link without a photo to offer says so, and the wish is still added', async ({ page }) => {
  await signIn(page, `${randomUUID()}@example.test`);
  await newList(page, 'Anniversaire');

  await page.getByRole('link', { name: 'Ajouter un souhait' }).click();
  await page.getByLabel('Nom du souhait').fill('Vinyle');
  await page.getByLabel('Lien vers le produit').fill('https://boutique.invalid/vinyle');
  await page.getByLabel('Lien vers le produit').blur();
  await expect(page.getByRole('status')).toHaveText('Pas de photo trouvée sur cette page. Vous pouvez en ajouter une.');
  await page.getByRole('button', { name: 'Ajouter à la liste' }).click();
  await expect(page.getByRole('link', { name: 'Modifier Vinyle' })).toBeVisible();
});
