import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { expectAccessible, signIn } from './helpers';

// docs/design.md, "Grands écrans": from a tablet's width, the navigation moves to the top, the
// grids widen, header buttons say what they do and the main action leaves the bottom edge.
test('a large screen gets a layout of its own', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'large screens only');
  await page.setViewportSize({ width: 1280, height: 800 });
  await signIn(page, `${randomUUID()}@example.test`);

  const navigation = page.getByRole('navigation', { name: 'Navigation principale' });
  expect((await navigation.boundingBox())?.y).toBeLessThan(80);

  // The main action sits beside the heading, not at the bottom of the window.
  const heading = await page.getByRole('heading', { name: 'Mes listes' }).boundingBox();
  const newList = await page.getByRole('link', { name: 'Nouvelle liste' }).boundingBox();
  expect(Math.abs((newList?.y ?? 0) - (heading?.y ?? 0))).toBeLessThan(40);

  await page.getByRole('link', { name: 'Nouvelle liste' }).click();
  await page.getByLabel('Nom de la liste').fill('Noël 2026');
  await page.getByRole('button', { name: 'Créer la liste' }).click();
  for (const wish of ['Casque', 'Plaid', 'Livre', 'Tasse']) {
    await page.getByRole('link', { name: 'Ajouter un souhait' }).click();
    await page.getByLabel('Nom du souhait').fill(wish);
    await page.getByRole('button', { name: 'Ajouter à la liste' }).click();
    await expect(page.getByRole('link', { name: `Modifier ${wish}` })).toBeVisible();
  }

  // Four wishes on one row, and the header's buttons with their label.
  const tops = await Promise.all(
    ['Casque', 'Plaid', 'Livre', 'Tasse'].map(
      async (wish) => (await page.getByRole('link', { name: `Modifier ${wish}` }).boundingBox())?.y,
    ),
  );
  expect(new Set(tops).size).toBe(1);
  await expect(page.getByRole('button', { name: 'Partager la liste' })).toHaveText('Partager');
  await expect(page.getByRole('button', { name: 'Options de la liste' })).toHaveText('Options');
  await expectAccessible(page);

  // Back to a phone's width, the phone's layout comes back.
  await page.setViewportSize({ width: 390, height: 800 });
  expect((await navigation.boundingBox())?.y).toBeGreaterThan(600);
  await expect(page.getByRole('button', { name: 'Options de la liste' })).toHaveText('');
});
