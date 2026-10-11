import { initialOf, tintAt } from './tint';

it('never gives two neighbouring tiles the same tint, in a row or a column of two', () => {
  for (let position = 0; position < 20; position++) {
    expect(tintAt(position)).not.toEqual(tintAt(position + 1));
    expect(tintAt(position)).not.toEqual(tintAt(position + 2));
  }
});

it('pairs each tint with its ink', () => {
  const { background, ink } = tintAt(5);
  expect(ink).toBe(`${background}Ink`);
});

it('puts the first letter of a name on its tile', () => {
  expect(initialOf('  écharpe en laine')).toBe('É');
  expect(initialOf('3 romans')).toBe('3');
  expect(initialOf('🎧 casque')).toBe('🎧');
});
