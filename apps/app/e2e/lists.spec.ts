import { randomUUID } from 'node:crypto';
import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { signIn } from './helpers';

const wcag = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(wcag).analyze();
  expect(results.violations).toEqual([]);
}

test('an owner creates a list, fills it, changes it, then deletes it', async ({ page }) => {
  await signIn(page, `${randomUUID()}@example.test`);
  await expect(page.getByText('Votre première liste')).toBeVisible();
  await expectAccessible(page);

  await page.getByRole('link', { name: 'Nouvelle liste' }).click();
  await page.getByRole('button', { name: 'Créer la liste' }).click();
  await expect(page.getByRole('alert')).toHaveText('Donnez un nom à votre liste.');
  await page.getByLabel('Nom de la liste').fill('Noël 2026');
  await page.getByRole('button', { name: 'Créer la liste' }).click();

  // Straight to the new list, ready for a first wish.
  await expect(page.getByRole('heading', { name: 'Noël 2026' })).toBeVisible();
  await expect(page.getByText('Les réservations restent une surprise')).toBeVisible();
  await expectAccessible(page);

  await page.getByRole('link', { name: 'Ajouter un souhait' }).click();
  await page.getByLabel('Nom du souhait').fill('Casque audio');
  await page.getByLabel('Prix').fill('12,5');
  await page.getByRole('radio', { name: 'CHF' }).click();
  await page.getByLabel('Lien vers le produit').fill('pas un lien');
  await page.getByRole('button', { name: 'Ajouter à la liste' }).click();
  await expect(page.getByRole('alert')).toContainText('adresse web');
  await expectAccessible(page);
  await page.getByLabel('Lien vers le produit').fill('boutique.fr/casque');
  await page.getByRole('button', { name: 'Ajouter à la liste' }).click();

  const wish = page.getByRole('link', { name: 'Modifier Casque audio' });
  await expect(wish).toContainText('12,50 CHF');

  await wish.click();
  await expect(page.getByLabel('Lien vers le produit')).toHaveValue('https://boutique.fr/casque');
  await page.getByLabel('Nom du souhait').fill('Casque sans fil');
  await page.getByLabel('Prix').fill('');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByRole('link', { name: 'Modifier Casque sans fil' })).toContainText('Prix non indiqué');

  await page.getByRole('link', { name: 'Modifier Casque sans fil' }).click();
  await page.getByRole('button', { name: 'Supprimer ce souhait' }).click();
  await page.getByRole('button', { name: 'Supprimer', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Modifier Casque sans fil' })).toHaveCount(0);

  await page.getByRole('button', { name: 'Options de la liste' }).click();
  await page.getByRole('button', { name: 'Renommer' }).click();
  await page.getByLabel('Nom de la liste').fill('Anniversaire');
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByRole('heading', { name: 'Anniversaire' })).toBeVisible();

  await page.getByRole('button', { name: 'Options de la liste' }).click();
  await page.getByRole('button', { name: 'Supprimer la liste' }).click();
  // The dialog takes its role once it has faded in.
  await expect(page.getByRole('dialog', { name: 'Supprimer « Anniversaire » ?' })).toBeVisible();
  await expectAccessible(page);
  await page.getByRole('dialog').getByRole('button', { name: 'Supprimer la liste' }).click();
  await expect(page.getByText('Votre première liste')).toBeVisible();
});

test('a list shows how many wishes it holds on the home page', async ({ page }) => {
  await signIn(page, `${randomUUID()}@example.test`);
  await page.getByRole('link', { name: 'Nouvelle liste' }).click();
  await page.getByLabel('Nom de la liste').fill('Idées en vrac');
  await page.getByRole('button', { name: 'Créer la liste' }).click();
  for (const name of ['Plaid', 'Roman']) {
    await page.getByRole('link', { name: 'Ajouter un souhait' }).click();
    await page.getByLabel('Nom du souhait').fill(name);
    await page.getByRole('button', { name: 'Ajouter à la liste' }).click();
    await expect(page.getByRole('link', { name: `Modifier ${name}` })).toBeVisible();
  }
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Idées en vrac/ })).toContainText('2 souhaits');
});

test('a list that does not exist says so', async ({ page }) => {
  await page.goto('/wishlists/00000000-0000-0000-0000-000000000000');
  await expect(page.getByRole('heading', { name: 'Cette liste n’existe plus' })).toBeVisible();
});
