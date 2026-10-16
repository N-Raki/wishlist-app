import Head from 'expo-router/head';
import { HeaderShownContext } from 'expo-router/react-navigation';
import { type ReactNode, use, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { BarBackground } from './BarBackground';
import { useTabBarInset } from './tabBarInset';
import { useKeyboardOverlap } from './useKeyboardOverlap';

type Props = {
  children: ReactNode;
  /** Page title for browser tabs and search results; the brand alone when omitted. */
  title?: string;
  description?: string;
  /**
   * The page's main action, kept at the bottom within reach of the thumb whatever the scroll
   * (docs/design.md, "Règles d'interface"). Usually one primary `Button`.
   */
  action?: ReactNode;
};

/**
 * Scrollable page with a readable column on large screens. It keeps clear of the screen's
 * edges by itself: the status bar or Dynamic Island when no header covers them, the tab bar
 * when it is there, and the keyboard.
 */
export function Screen({ children, title, description, action }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const tabBar = useTabBarInset();
  const page = useRef<View>(null);
  const keyboard = useKeyboardOverlap(page);
  const [actionHeight, setActionHeight] = useState(0);
  // Without a header, the page reaches the top of the screen and keeps clear of it itself.
  const top = use(HeaderShownContext) ? 0 : insets.top;
  // The tab bar and the home indicator are hidden under the keyboard: the page then ends at it.
  const bottom = keyboard.overlap > 0 ? 0 : Math.max(insets.bottom, tabBar.height);

  return (
    <View ref={page} onLayout={keyboard.remeasure} style={[styles.page, { backgroundColor: colors.background }]}>
      <Head>
        <title>{title ? `${title} · Wish Me` : 'Wish Me'}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Head>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: top + space.xl,
            paddingBottom: bottom + space.xxl + (action ? actionHeight + space.lg : 0),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        // Dragging the page puts the keyboard away, to reach what it covers.
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        // Keyboard users scroll long pages on the web by focusing them (WCAG 2.1.1).
        focusable={Platform.OS === 'web'}
      >
        <View style={styles.column}>{children}</View>
      </ScrollView>
      {/* The page ends where the keyboard begins, so the focused field scrolls into view above it. */}
      <View style={{ height: keyboard.overlap }} />
      {top > 0 ? (
        // The content scrolls under the status bar as under the tab bar, never behind bare pixels.
        <BarBackground pointerEvents="none" style={[styles.topEdge, { height: top }]} />
      ) : null}
      {action ? (
        <View
          pointerEvents="box-none"
          onLayout={(event) => setActionHeight(event.nativeEvent.layout.height)}
          // The action rides above the keyboard, so a form can be sent without closing it first.
          style={[styles.action, { bottom: keyboard.overlap + bottom + space.lg }]}
        >
          <View
            // Opaque under a secondary (outlined) action, so the page never shows through it.
            style={[styles.actionColumn, { backgroundColor: colors.surface, boxShadow: `0 8px 24px ${colors.shadow}` }]}
          >
            {action}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: space.xl },
  column: {
    flexGrow: 1,
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    gap: space.xl,
  },
  topEdge: { position: 'absolute', top: 0, left: 0, right: 0 },
  action: { position: 'absolute', left: space.xl, right: space.xl },
  actionColumn: { width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center', borderRadius: 999 },
});
