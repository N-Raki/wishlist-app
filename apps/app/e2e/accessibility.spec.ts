import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { expectReflow } from './helpers';

const pages = ['/', '/sign-in', '/terms', '/privacy', '/legal-notice'];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const path of pages) {
    test(`${path} meets WCAG 2.2 AA (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
      await expectReflow(page);
    });
  }
}

test('the home page shows a visitor how it works and lets them in', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Des listes de souhaits qui gardent la surprise.');
  await expect(page.getByRole('heading', { name: 'Comment ça marche' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 3 })).toHaveText([
    'Notez vos idées',
    'Partagez le lien',
    'Gardez la surprise',
  ]);
  // Signing up and signing in are the same e-mail code: both lead to it.
  await page.getByRole('link', { name: 'Créer ma liste' }).click();
  await expect(page).toHaveURL(/\/sign-in/);
  await page.goBack();
  await page.getByRole('link', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL(/\/sign-in/);
});

test('pages are in the visitor’s language', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});
