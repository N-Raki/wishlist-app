import Head from 'expo-router/head';
import { type ReactNode, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { useTabBarInset } from './tabBarInset';

type Props = {
  children: ReactNode;
  /** Page title for browser tabs and search results; the brand alone when omitted. */
  title?: string;
  description?: string;
  edges?: 'all' | 'bottom';
  /**
   * The page's main action, kept at the bottom within reach of the thumb whatever the scroll
   * (docs/design.md, "Règles d'interface"). Usually one primary `Button`.
   */
  action?: ReactNode;
};

/** Scrollable page with a readable column on large screens. */
export function Screen({ children, title, description, edges = 'bottom', action }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const tabBar = useTabBarInset();
  const [actionHeight, setActionHeight] = useState(0);
  const bottom = Math.max(insets.bottom, tabBar.height);
  return (
    <KeyboardAvoidingView
      // The action rides above the keyboard, so a form can be sent without closing it first.
      behavior={Platform.OS === 'web' ? undefined : 'padding'}
      style={[styles.page, { backgroundColor: colors.background }]}
    >
      <Head>
        <title>{title ? `${title} · Wish Me` : 'Wish Me'}</title>
        {description ? <meta name="description" content={description} /> : null}
      </Head>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: (edges === 'all' ? insets.top : 0) + space.xl,
            paddingBottom: bottom + space.xxl + (action ? actionHeight + space.lg : 0),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        // Keyboard users scroll long pages on the web by focusing them (WCAG 2.1.1).
        focusable={Platform.OS === 'web'}
      >
        <View style={styles.column}>{children}</View>
      </ScrollView>
      {action ? (
        <View
          pointerEvents="box-none"
          onLayout={(event) => setActionHeight(event.nativeEvent.layout.height)}
          style={[styles.action, { bottom: bottom + space.lg }]}
        >
          <View
            // Opaque under a secondary (outlined) action, so the page never shows through it.
            style={[styles.actionColumn, { backgroundColor: colors.surface, boxShadow: `0 8px 24px ${colors.shadow}` }]}
          >
            {action}
          </View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
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
  action: { position: 'absolute', left: space.xl, right: space.xl },
  actionColumn: { width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center', borderRadius: 999 },
});
