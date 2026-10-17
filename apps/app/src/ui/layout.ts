import { createContext, use, useSyncExternalStore } from 'react';
import { Dimensions } from 'react-native';
import { contentMaxWidth, largeScreenMinWidth, space } from '@/theme/tokens';

// What the window size changes in the layout (docs/design.md, "Grands écrans"). On the web,
// pages are rendered on the server without knowing the window: they start as a phone's and
// adapt once in the browser, so the first render matches the server's.

function subscribe(onChange: () => void) {
  const subscription = Dimensions.addEventListener('change', onChange);
  return () => subscription.remove();
}

const windowWidth = () => Dimensions.get('window').width;

export function useWindowWidth() {
  return useSyncExternalStore(subscribe, windowWidth, () => 0);
}

/** A tablet's or a computer's window, rather than a phone's. */
export function useLargeScreen() {
  return useWindowWidth() >= largeScreenMinWidth;
}

/** Widest the page's column can be: set by `Screen`, read by what lays itself out in it. */
export const ColumnMaxWidth = createContext(contentMaxWidth);

/** Width of the page's column in this window, gutters excluded. */
export function useColumnWidth() {
  const maxWidth = use(ColumnMaxWidth);
  const width = useWindowWidth();
  return Math.min(width - 2 * space.xl, maxWidth);
}
