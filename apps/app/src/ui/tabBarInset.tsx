import { createContext, type ReactNode, useContext, useState } from 'react';

// On a phone, the tab bar floats over the bottom of the content, which scrolls underneath it
// (docs/design.md): screens read its height to keep their last element reachable above it.
// On a large screen, it sits above the screens instead, clear of the status bar.
type TabBarInset = {
  /** Height covering the bottom of the screens: 0 when the bar is at the top or absent. */
  height: number;
  setHeight: (height: number) => void;
  /** The bar is at the top: it keeps clear of the status bar, so the screens below need not. */
  atTop: boolean;
};

const TabBarInsetContext = createContext<TabBarInset>({ height: 0, setHeight: () => {}, atTop: false });

export function TabBarInsetProvider({ atTop, children }: { atTop: boolean; children: ReactNode }) {
  const [height, setHeight] = useState(0);
  return <TabBarInsetContext value={{ height: atTop ? 0 : height, setHeight, atTop }}>{children}</TabBarInsetContext>;
}

export function useTabBarInset() {
  return useContext(TabBarInsetContext);
}
