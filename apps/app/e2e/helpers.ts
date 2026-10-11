import AxeBuilder from '@axe-core/playwright';
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

/**
 * WCAG 1.4.10 (Reflow): at 320 CSS pixels wide, nothing sticks out sideways, so no page asks
 * for horizontal scrolling on the smallest phones.
 */
export async function expectReflow(page: Page) {
  const size = page.viewportSize();
  await page.setViewportSize({ width: 320, height: 640 });
  const overflowing = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((element) => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && (box.right > window.innerWidth + 1 || box.left < -1);
      })
      .map((element) => `${element.tagName.toLowerCase()} “${element.textContent?.slice(0, 40) ?? ''}”`),
  );
  if (size) await page.setViewportSize(size);
  expect(overflowing).toEqual([]);
}

/** No WCAG 2.2 AA violation that axe can detect on the page as it is now. */
export async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
}
