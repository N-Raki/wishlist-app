// Colours of the "Vitrine" direction (docs/design.md). Every pair used for text is ≥ 4.5:1,
// every interface border ≥ 3:1; check new pairs before adding them.
export const palette = {
  light: {
    background: '#F3F2F5',
    surface: '#FFFFFF',
    // Quiet chips on the background, like "Reservations stay a surprise" (secondary text 5.3:1).
    surfaceMuted: '#E9E7EE',
    // Translucent bars that content scrolls under, with the hairline on their edge.
    chrome: 'rgba(243, 242, 245, 0.82)',
    hairline: 'rgba(29, 28, 34, 0.08)',
    scrim: 'rgba(19, 18, 23, 0.45)',
    text: '#1D1C22',
    textSecondary: '#5F5C68',
    border: '#8A8792',
    accent: '#FF7A59',
    onAccent: '#1D1C22',
    danger: '#B42318',
    onDanger: '#FFFFFF',
    success: '#1D6B44',
    tintPeach: '#FFE3D9',
    tintLilac: '#E7E2F5',
    tintSage: '#DDEDE3',
    tintSand: '#F5EBD8',
  },
  dark: {
    background: '#131217',
    surface: '#24232A',
    surfaceMuted: '#2E2D35',
    chrome: 'rgba(19, 18, 23, 0.82)',
    hairline: 'rgba(244, 243, 246, 0.1)',
    scrim: 'rgba(0, 0, 0, 0.6)',
    text: '#F4F3F6',
    textSecondary: '#A9A6B2',
    border: '#8A8792',
    accent: '#FF7A59',
    onAccent: '#1D1C22',
    danger: '#FDA29B',
    onDanger: '#1D1C22',
    success: '#4CC38A',
    tintPeach: '#3A2A27',
    tintLilac: '#2E2A3A',
    tintSage: '#23302A',
    tintSand: '#35302A',
  },
} as const;

export type ColorName = keyof typeof palette.light;
export type Colors = Record<ColorName, string>;

/** Name of the CSS variable holding a colour on the web. */
export const cssVariable = (name: ColorName) => `--color-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;
