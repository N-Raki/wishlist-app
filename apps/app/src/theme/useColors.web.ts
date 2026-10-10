// On the web, pages are rendered ahead of time without knowing the visitor's theme.
// Colours are CSS variables (declared in app/+html.tsx) so the browser picks light or
// dark itself: no flash, no hydration mismatch.
import { type ColorName, type Colors, cssVariable, palette } from './palette';

const variables = Object.fromEntries(
  Object.keys(palette.light).map((name) => [name, `var(${cssVariable(name as ColorName)})`]),
) as Colors;

export function useColors(): Colors {
  return variables;
}
