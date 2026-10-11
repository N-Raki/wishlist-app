import { normalizeLink } from './link';

it('keeps a full address as it is', () => {
  expect(normalizeLink(' https://boutique.fr/article?id=3 ')).toEqual({ url: 'https://boutique.fr/article?id=3' });
});

it('adds https:// to an address typed without it', () => {
  expect(normalizeLink('boutique.fr/article')).toEqual({ url: 'https://boutique.fr/article' });
});

it('treats an empty field as no link', () => {
  expect(normalizeLink('')).toEqual({ url: null });
});

it.each(['javascript:alert(1)', 'data:text/html,hi', 'ftp://boutique.fr', 'pas un lien', 'localhost'])(
  'refuses %s',
  (input) => {
    expect(normalizeLink(input)).toEqual({ error: 'invalid' });
  },
);
