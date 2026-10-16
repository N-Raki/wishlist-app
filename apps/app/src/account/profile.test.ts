import { suggestedName } from './profile';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

test.each([
  [{ full_name: 'Léa Martin' }, 'Léa'],
  [{ name: '  Hugo  ' }, 'Hugo'],
  [{ full_name: 'A'.repeat(40) }, 'A'.repeat(30)],
  [{ locale: 'fr' }, ''],
  [undefined, ''],
])('suggests a first name from %p', (metadata, expected) => {
  expect(suggestedName(metadata)).toBe(expected);
});
