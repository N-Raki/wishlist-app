// Colours of the "Vitrine" direction (docs/design.md). Every pair used for text is ≥ 4.5:1,
// every interface border ≥ 3:1; check new pairs before adding them.
export const palette = {
  light: {
    background: '#F3F2F5',
    surface: '#FFFFFF',
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
