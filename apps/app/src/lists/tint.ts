import type { ColorName } from '@/theme/palette';

const tints = ['tintPeach', 'tintSage', 'tintLilac', 'tintSand'] as const satisfies readonly ColorName[];

type Tint = (typeof tints)[number];

/**
 * A wish without a photo keeps a tinted tile (docs/design.md). Tints follow the order in which
 * wishes were added, counted from the oldest: neighbours in the grid never share a tint, and a
 * new wish leaves the others' tints as they were.
 */
export function tintAt(position: number): { background: Tint; ink: `${Tint}Ink` } {
  const background = tints[position % tints.length] ?? tints[0];
  return { background, ink: `${background}Ink` };
}

/** The first letter of a wish's name, for its tile: "écharpe" gives "É", "  3 livres" gives "3". */
export function initialOf(name: string): string {
  const [first = ''] = name.trim();
  return first.toLocaleUpperCase('fr');
}
