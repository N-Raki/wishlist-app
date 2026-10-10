import { tintFor } from './tint';

it('gives a wish the same tint every time', () => {
  expect(tintFor('bbbbbbbb-0000-0000-0000-000000000001')).toBe(tintFor('bbbbbbbb-0000-0000-0000-000000000001'));
});

it('spreads tints across wishes', () => {
  const ids = Array.from({ length: 40 }, (_, i) => `wish-${i}`);
  expect(new Set(ids.map(tintFor)).size).toBe(4);
});
