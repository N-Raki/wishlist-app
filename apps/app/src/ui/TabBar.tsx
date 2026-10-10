import { BlurView } from 'expo-blur';
import { type Href, Link } from 'expo-router';
import type { Tabs } from 'expo-router/js-tabs';
import { type ComponentProps, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, fonts, minTouchTarget, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';
import { useTabBarInset } from './tabBarInset';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export type TabItem = { label: string; icon: IconName; href: Href };

/**
 * Translucent bar that the content scrolls under (docs/design.md). Tabs are real links, so
 * they open in a new browser tab, show their address and work without JavaScript on the web.
 */
export function TabBar({ state, items, label }: TabBarProps & { items: Record<string, TabItem>; label: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setHeight } = useTabBarInset();
  useEffect(() => () => setHeight(0), [setHeight]);

  return (
    <BlurView
      // Android blurs poorly and slowly: the translucent colour alone does the job there.
      intensity={Platform.OS === 'android' ? 0 : 40}
      tint="default"
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      style={[
        styles.bar,
        { backgroundColor: colors.chrome, borderTopColor: colors.hairline, paddingBottom: insets.bottom + space.sm },
      ]}
    >
      <View role="navigation" aria-label={label} style={styles.items}>
        {state.routes.map((route, index) => {
          const item = items[route.name];
          if (!item) return null;
          const current = index === state.index;
          const color = current ? colors.text : colors.textSecondary;
          return (
            <Link key={route.key} href={item.href} asChild>
              <Touchable aria-current={current ? 'page' : undefined} look={styles.item} pressedLook={styles.pressed}>
                <Icon name={item.icon} color={color} size={24} strokeWidth={current ? 2.4 : 1.9} />
                <Text style={[styles.label, { color, fontFamily: current ? fonts.extraBold : fonts.semiBold }]}>
                  {item.label}
                </Text>
              </Touchable>
            </Link>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: space.sm,
  },
  items: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    minHeight: minTouchTarget + 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pressed: { opacity: 0.6 },
  label: { fontSize: 12, lineHeight: 16 },
});
