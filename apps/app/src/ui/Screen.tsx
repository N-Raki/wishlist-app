import Head from 'expo-router/head';
import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';

type Props = {
  children: ReactNode;
  /** Page title for browser tabs and search results; the brand alone when omitted. */
  title?: string;
  description?: string;
  edges?: 'all' | 'bottom';
};

/** Scrollable page with a readable column on large screens. */
export function Screen({ children, title, description, edges = 'bottom' }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <>
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
            paddingBottom: insets.bottom + space.xxl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        // Keyboard users scroll long pages on the web by focusing them (WCAG 2.1.1).
        focusable={Platform.OS === 'web'}
      >
        <View style={styles.column}>{children}</View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: space.xl },
  column: {
    flexGrow: 1,
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    gap: space.xl,
  },
});
