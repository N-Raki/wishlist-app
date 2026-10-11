import { randomUUID } from 'node:crypto';
import { type Browser, expect, type Page, test } from '@playwright/test';
import { codeSentTo, expectAccessible, expectReflow, signIn } from './helpers';

async function newPage(browser: Browser) {
  const context = await browser.newContext();
  return context.newPage();
}

/** An owner's list with one wish, and its address. */
async function listWithWish(page: Page, wish: string) {
  await signIn(page, `${randomUUID()}@example.test`);
  await page.getByRole('link', { name: 'Nouvelle liste' }).click();
  await page.getByLabel('Nom de la liste').fill('Noël 2026');
  await page.getByRole('button', { name: 'Créer la liste' }).click();
  await page.getByRole('link', { name: 'Ajouter un souhait' }).click();
  await page.getByLabel('Nom du souhait').fill(wish);
  await page.getByLabel('Lien vers le produit').fill('https://www.boutique.test/plaid');
  await page.getByRole('button', { name: 'Ajouter à la liste' }).click();
  await expect(page.getByRole('link', { name: `Modifier ${wish}` })).toBeVisible();
  return page.url();
}

test('a visitor signs in to reserve, a relative joins in, and the owner sees none of it', async ({ browser }) => {
  const owner = await newPage(browser);
  const listUrl = await listWithWish(owner, 'Plaid');

  // A visitor sees the list, learns why to sign in, and opens the wish.
  const guest = await newPage(browser);
  await guest.goto(listUrl);
  await expect(guest.getByRole('heading', { name: 'Connectez-vous pour réserver' })).toBeVisible();
  await expectAccessible(guest);
  await expectReflow(guest);
  await guest.getByRole('link', { name: 'Voir Plaid' }).click();
  await expect(guest.getByRole('link', { name: 'Voir sur boutique.test' })).toBeVisible();

  // "Reserve" opens the sign-in sheet about that wish; the reservation is made on sign-in.
  await guest.getByRole('button', { name: 'Réserver' }).click();
  await expect(guest.getByRole('heading', { name: 'Connectez-vous pour réserver « Plaid »' })).toBeVisible();
  const guestEmail = `${randomUUID()}@example.test`;
  await guest.getByLabel('Adresse e-mail').fill(guestEmail);
  await guest.getByRole('button', { name: 'Recevoir un code' }).click();
  await guest.getByLabel('Code à 6 chiffres').fill(await codeSentTo(guestEmail));
  await guest.getByRole('button', { name: 'Se connecter' }).click();
  await expect(guest.getByRole('status')).toContainText('C’est réservé');
  // The list stays mounted under the wish page: only what is on screen counts.
  await expect(guest.getByText('Vous l’offrez', { exact: true }).filter({ visible: true })).toBeVisible();
  await expectAccessible(guest);

  // Another relative sees it is taken and joins in: a shared gift.
  const relative = await newPage(browser);
  await signIn(relative, `${randomUUID()}@example.test`);
  await relative.goto(listUrl);
  await relative.getByRole('link', { name: 'Voir Plaid, Un proche s’en occupe' }).click();
  await relative.getByRole('button', { name: 'Participer' }).click();
  await expect(relative.getByText('Vous l’offrez avec un autre proche').filter({ visible: true })).toBeVisible();

  // The owner's list says nothing about it, even after a refresh.
  await owner.reload();
  await expect(owner.getByRole('link', { name: 'Modifier Plaid' })).toBeVisible();
  await expect(owner.getByText(/s’en occupe|Vous l’offrez|Vous et/)).toHaveCount(0);

  // The first relative changes their mind.
  await guest.getByRole('button', { name: 'Annuler ma réservation' }).click();
  await expect(guest.getByRole('status')).toHaveText('Votre réservation est annulée.');
  await expect(guest.getByText('Un proche s’en occupe').filter({ visible: true })).toBeVisible();
});

test('a visitor who signs in to reserve a wish already taken is offered to join in', async ({ browser }) => {
  const owner = await newPage(browser);
  const listUrl = await listWithWish(owner, 'Théière');

  const guest = await newPage(browser);
  await guest.goto(listUrl);
  await guest.getByRole('link', { name: 'Voir Théière' }).click();
  await guest.getByRole('button', { name: 'Réserver' }).click();
  const guestEmail = `${randomUUID()}@example.test`;
  await guest.getByLabel('Adresse e-mail').fill(guestEmail);
  await guest.getByRole('button', { name: 'Recevoir un code' }).click();

  // Meanwhile, someone else reserves it.
  const relative = await newPage(browser);
  await signIn(relative, `${randomUUID()}@example.test`);
  await relative.goto(listUrl);
  await relative.getByRole('link', { name: 'Voir Théière' }).click();
  await relative.getByRole('button', { name: 'Réserver' }).click();
  await expect(relative.getByRole('status')).toContainText('C’est réservé');

  await guest.getByLabel('Code à 6 chiffres').fill(await codeSentTo(guestEmail));
  await guest.getByRole('button', { name: 'Se connecter' }).click();
  await expect(guest.getByRole('status')).toHaveText(
    'Quelqu’un s’en occupe déjà. Vous pouvez participer pour l’offrir ensemble.',
  );
  await expect(guest.getByRole('button', { name: 'Participer' })).toBeVisible();
});
