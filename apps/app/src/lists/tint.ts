import type { ColorName } from '@/theme/palette';

const tints = ['tintPeach', 'tintLilac', 'tintSage', 'tintSand'] as const satisfies readonly ColorName[];

/** A wish without a photo keeps a tinted tile (docs/design.md), always the same for a given wish. */
export function tintFor(id: string): (typeof tints)[number] {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return tints[Math.abs(hash) % tints.length] ?? tints[0];
}
