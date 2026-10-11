import { isPreviewBot, previewPage } from './preview';

const list = {
  name: 'Noël <2026>',
  owner_name: 'Raki',
  wishes: [{ photo_path: null }, { photo_path: 'u/p.jpg' }],
};
const photoUrl = (path: string) => `https://cdn.test/${path}`;

it('recognises the crawlers that draw link previews, not people', () => {
  expect(isPreviewBot('WhatsApp/2.24.1 A')).toBe(true);
  expect(isPreviewBot('facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')).toBe(true);
  expect(isPreviewBot('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Safari/604.1')).toBe(false);
  expect(isPreviewBot(null)).toBe(false);
});

it('describes a list with its owner, its size and its newest photo, escaped', () => {
  const html = previewPage({ list, url: 'https://wishme.test/wishlists/1', language: 'fr', photoUrl });
  expect(html).toContain('<meta property="og:title" content="Noël &#60;2026&#62; · la liste de Raki">');
  expect(html).toContain('Voici la wishlist Noël &#60;2026&#62; de Raki ! 2 idées de cadeaux');
  expect(html).toContain('<meta property="og:image" content="https://cdn.test/u/p.jpg">');
  expect(html).not.toContain('<2026>');
});

it('stays generic without an owner name or a photo', () => {
  const html = previewPage({
    list: { name: 'Anniversaire', owner_name: null, wishes: [] },
    url: 'https://wishme.test/wishlists/2',
    language: 'en',
    photoUrl,
  });
  expect(html).toContain('<meta property="og:title" content="Anniversaire">');
  expect(html).toContain('A wishlist on Wish Me');
  expect(html).not.toContain('og:image');
});
