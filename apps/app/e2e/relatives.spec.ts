import { randomUUID } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { expectAccessible, expectReflow, signIn } from './helpers';

test('lists opened from a link gather in the Relatives tab, where they open', async ({ browser }) => {
  const owner = await (await browser.newContext()).newPage();
  await signIn(owner, `${randomUUID()}@example.test`);
  await owner.getByRole('link', { name: 'Nouvelle liste' }).click();
  await owner.getByLabel('Nom de la liste').fill('Crémaillère');
  await owner.getByRole('button', { name: 'Créer la liste' }).click();
  await expect(owner.getByRole('heading', { name: 'Crémaillère' })).toBeVisible();
  const listUrl = owner.url();

  const relative = await (await browser.newContext()).newPage();
  await signIn(relative, `${randomUUID()}@example.test`);
  const tabs = relative.getByRole('navigation', { name: 'Navigation principale' });
  await tabs.getByRole('link', { name: 'Proches' }).click();
  await expect(relative.getByText('Les listes de vos proches arriveront ici')).toBeVisible();
  await expectAccessible(relative);

  await relative.goto(listUrl);
  await expect(relative.getByRole('heading', { name: 'Crémaillère' })).toBeVisible();
  await tabs.getByRole('link', { name: 'Proches' }).click();
  await relative.getByRole('link', { name: /Crémaillère/ }).click();
  // The list stacks in the Relatives tab, which stays the current one.
  await expect(relative.getByRole('heading', { name: 'Crémaillère' }).filter({ visible: true })).toBeVisible();
  await expect(tabs.getByRole('link', { name: 'Proches' })).toHaveAttribute('aria-current', 'page');
  await expectReflow(relative);
});

test('an owner shares a list, reminded that the surprise is kept', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const owner = await context.newPage();
  await signIn(owner, `${randomUUID()}@example.test`);
  await owner.getByRole('link', { name: 'Nouvelle liste' }).click();
  await owner.getByLabel('Nom de la liste').fill('Noël 2026');
  await owner.getByRole('button', { name: 'Créer la liste' }).click();
  await owner.getByRole('button', { name: 'Partager la liste' }).click();
  const dialog = owner.getByRole('dialog', { name: 'Partager « Noël 2026 »' });
  await expect(dialog).toContainText('Vous ne saurez jamais qui offre quoi.');
  await expectAccessible(owner);
  await dialog.getByRole('button', { name: 'Copier le lien' }).click();
  await expect(dialog.getByRole('status')).toHaveText('Lien copié. Collez-le dans un message.');
  expect(await owner.evaluate(() => navigator.clipboard.readText())).toBe(owner.url());
});

test('messaging apps get a preview of a shared list; people get the app', async ({ page, request }) => {
  await signIn(page, `${randomUUID()}@example.test`);
  await page.getByRole('link', { name: 'Nouvelle liste' }).click();
  await page.getByLabel('Nom de la liste').fill('Anniversaire');
  await page.getByRole('button', { name: 'Créer la liste' }).click();
  await expect(page.getByRole('heading', { name: 'Anniversaire' })).toBeVisible();

  const preview = await (await request.get(page.url(), { headers: { 'User-Agent': 'WhatsApp/2.24.1 A' } })).text();
  expect(preview).toContain('<meta property="og:title" content="Anniversaire">');
  const app = await (await request.get(page.url())).text();
  expect(app).not.toContain('og:title');
});
