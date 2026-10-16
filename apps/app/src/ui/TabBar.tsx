import { type Href, Link } from 'expo-router';
import type { Tabs } from 'expo-router/js-tabs';
import { type ComponentProps, type MouseEvent as ReactMouseEvent, useEffect } from 'react';
import { type GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, fonts, minTouchTarget, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { BarBackground } from './BarBackground';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';
import { useTabBarInset } from './tabBarInset';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export type TabItem = { label: string; icon: IconName; href: Href };

/**
 * Translucent bar that the content scrolls under (docs/design.md). Tabs are real links, so
 * they open in a new browser tab and show their address on the web. A tap switches tabs
 * without losing the page each one was on, and tapping the current tab goes back to its start.
 */
export function TabBar({
  state,
  navigation,
  items,
  label,
}: TabBarProps & { items: Record<string, TabItem>; label: string }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setHeight } = useTabBarInset();
  useEffect(() => () => setHeight(0), [setHeight]);

  return (
    <BarBackground
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      style={[styles.bar, { borderTopColor: colors.hairline, paddingBottom: insets.bottom + space.sm }]}
    >
      <View role="navigation" aria-label={label} style={styles.items}>
        {state.routes.map((route, index) => {
          const item = items[route.name];
          if (!item) return null;
          const current = index === state.index;
          const color = current ? colors.text : colors.textSecondary;
          const onPress = (event: GestureResponderEvent | ReactMouseEvent) => {
            // Modified clicks (new tab, new window) stay the browser's.
            if ('metaKey' in event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
            event.preventDefault();
            const tabPress = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            // On the current tab, its stack hears the press and returns to its first page.
            if (!current && !tabPress.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          return (
            <Link key={route.key} href={item.href} asChild onPress={onPress}>
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
    </BarBackground>
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
