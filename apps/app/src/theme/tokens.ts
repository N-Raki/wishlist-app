import { Platform, type TextStyle } from 'react-native';

export const radius = { tile: 22, card: 26, field: 14, pill: 999 } as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Smallest touch target on every platform (WCAG 2.5.8, Apple HIG). */
export const minTouchTarget = 44;

/**
 * From this window width, the layout is for large screens: tablets and computers
 * (docs/design.md, "Grands écrans"). Below it, a phone: one column and the thumb's reach.
 */
export const largeScreenMinWidth = 768;

/** Readable column width: forms, text, settings. */
export const contentMaxWidth = 560;

/** Column of the pages that are grids (lists, wishes), on large screens. */
export const wideContentMaxWidth = 1080;

// Custom fonts need one family per weight: Android does not synthesise bold from fontWeight.
// On the web, pages show before the font arrives, so a system fallback is named too.
const family = (name: string) => (Platform.OS === 'web' ? `${name}, system-ui, sans-serif` : name);

export const fonts = {
  regular: family('Gabarito_400Regular'),
  medium: family('Gabarito_500Medium'),
  semiBold: family('Gabarito_600SemiBold'),
  bold: family('Gabarito_700Bold'),
  extraBold: family('Gabarito_800ExtraBold'),
};

export const typography = {
  display: {
    fontFamily: fonts.extraBold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.75,
  },
  heading: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
