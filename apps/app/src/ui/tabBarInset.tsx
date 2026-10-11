import { createContext, type ReactNode, useContext, useState } from 'react';

// The tab bar floats over the content, which scrolls underneath it (docs/design.md).
// Screens read its height to keep their last element reachable above it.
type TabBarInset = { height: number; setHeight: (height: number) => void };

const TabBarInsetContext = createContext<TabBarInset>({ height: 0, setHeight: () => {} });

export function TabBarInsetProvider({ children }: { children: ReactNode }) {
  const [height, setHeight] = useState(0);
  return <TabBarInsetContext value={{ height, setHeight }}>{children}</TabBarInsetContext>;
}

export function useTabBarInset() {
  return useContext(TabBarInsetContext);
}
