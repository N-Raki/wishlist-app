import { useNavigation } from 'expo-router';
import Head from 'expo-router/head';
import { HeaderShownContext } from 'expo-router/react-navigation';
import { type ReactNode, use, useLayoutEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, space, wideContentMaxWidth } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { BarBackground } from './BarBackground';
import { ColumnMaxWidth, useLargeScreen, useWindowWidth } from './layout';
import { useTabBarInset } from './tabBarInset';
import { useKeyboardOverlap } from './useKeyboardOverlap';

type Props = {
  children: ReactNode;
  /** Page title for browser tabs and search results; the brand alone when omitted. */
  title?: string;
  description?: string;
  /** The page's heading. On a large screen, the action sits next to it. */
  heading?: ReactNode;
  /**
   * The page's main action (docs/design.md, "Règles d'interface"). Usually one primary
   * `Button`. On a phone, kept at the bottom within reach of the thumb whatever the scroll; on
   * a large screen, next to the heading, or else at the end of the page, as a form's last step.
   */
  action?: ReactNode;
  /** `wide` for the pages that are grids, which use the room of a large screen. */
  width?: 'readable' | 'wide';
};

/**
 * Scrollable page with a column centred on large screens. It keeps clear of the screen's edges
 * by itself: the status bar or Dynamic Island when no header covers them, the tab bar when it
 * is there, and the keyboard.
 */
export function Screen({ children, title, description, heading, action, width = 'readable' }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const tabBar = useTabBarInset();
  const large = useLargeScreen();
  const page = useRef<View>(null);
  const keyboard = useKeyboardOverlap(page);
  const [actionHeight, setActionHeight] = useState(0);
  const maxWidth = width === 'wide' && large ? wideContentMaxWidth : contentMaxWidth;
  const headerShown = use(HeaderShownContext);
  useHeaderAlignedWith(maxWidth, headerShown);
  // Without a header or a tab bar above it, the page reaches the top of the screen and keeps
  // clear of it itself.
  const top = headerShown || tabBar.atTop ? 0 : insets.top;
  // The tab bar and the home indicator are hidden under the keyboard: the page then ends at it.
  const bottom = keyboard.overlap > 0 ? 0 : Math.max(insets.bottom, tabBar.height);
  const floating = action && !large;

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
            paddingTop: top + (large ? space.xxl : space.xl),
            paddingBottom: bottom + (large ? space.xxxl : space.xxl) + (floating ? actionHeight + space.lg : 0),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        // Dragging the page puts the keyboard away, to reach what it covers.
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        // Keyboard users scroll long pages on the web by focusing them (WCAG 2.1.1).
        focusable={Platform.OS === 'web'}
      >
        <View style={[styles.column, { maxWidth }]}>
          <ColumnMaxWidth value={maxWidth}>
            {heading && action && large ? (
              <View style={styles.headingRow}>
                <View style={styles.heading}>{heading}</View>
                {action}
              </View>
            ) : (
              heading
            )}
            {children}
            {action && large && !heading ? <View style={styles.inlineAction}>{action}</View> : null}
          </ColumnMaxWidth>
        </View>
      </ScrollView>
      {/* The page ends where the keyboard begins, so the focused field scrolls into view above it. */}
      <View style={{ height: keyboard.overlap }} />
      {top > 0 ? (
        // The content scrolls under the status bar as under the tab bar, never behind bare pixels.
        <BarBackground pointerEvents="none" style={[styles.topEdge, { height: top }]} />
      ) : null}
      {floating ? (
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

/**
 * On a large web page, the header's buttons line up with the page's column instead of the
 * window's edges, where they were far from what they act on. The icons on the left and the
 * buttons on the right are set 24 and 12 px inside the header's edges (stackOptions.tsx).
 */
function useHeaderAlignedWith(maxWidth: number, headerShown: boolean) {
  const navigation = useNavigation();
  const windowWidth = useWindowWidth();
  const large = useLargeScreen();
  const columnStart = Math.max(space.xl, (windowWidth - maxWidth) / 2);
  useLayoutEffect(() => {
    if (Platform.OS !== 'web' || !headerShown) return;
    // Not in the types of the native stack, but passed on to the header it draws on the web.
    navigation.setOptions({
      headerLeftContainerStyle: large ? { paddingStart: columnStart - space.xl } : undefined,
      headerRightContainerStyle: large ? { paddingEnd: columnStart - space.md } : undefined,
    } as object);
  }, [navigation, headerShown, large, columnStart]);
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: { flexGrow: 1, paddingHorizontal: space.xl },
  column: { flexGrow: 1, width: '100%', alignSelf: 'center', gap: space.xl },
  headingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
  },
  heading: { flexShrink: 1 },
  inlineAction: { marginTop: space.sm },
  topEdge: { position: 'absolute', top: 0, left: 0, right: 0 },
  action: { position: 'absolute', left: space.xl, right: space.xl },
  actionColumn: { width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center', borderRadius: 999 },
});
