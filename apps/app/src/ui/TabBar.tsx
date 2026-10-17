import { type Href, Link } from 'expo-router';
import type { Tabs } from 'expo-router/js-tabs';
import { type ComponentProps, type MouseEvent as ReactMouseEvent, useEffect } from 'react';
import { type GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, fonts, minTouchTarget, radius, space, wideContentMaxWidth } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { BarBackground } from './BarBackground';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';
import { useTabBarInset } from './tabBarInset';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export type TabItem = { label: string; icon: IconName; href: Href };

type Props = TabBarProps & {
  items: Record<string, TabItem>;
  label: string;
  /** Large screens: a bar along the top, with the brand, instead of the phone's bottom bar. */
  atTop: boolean;
};

/**
 * The app's main navigation (docs/design.md). On a phone, a translucent bar at the bottom that
 * the content scrolls under; on a large screen, a bar along the top, as on a website. Tabs are
 * real links, so they open in a new browser tab and show their address on the web. A tap
 * switches tabs without losing the page each one was on, and tapping the current tab goes back
 * to its start.
 */
export function TabBar({ state, navigation, items, label, atTop }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setHeight } = useTabBarInset();
  useEffect(() => () => setHeight(0), [setHeight]);

  const links = state.routes.map((route, index) => {
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
    const labelStyle = { color, fontFamily: current ? fonts.extraBold : fonts.semiBold };
    return (
      <Link key={route.key} href={item.href} asChild onPress={onPress}>
        {atTop ? (
          <Touchable
            aria-current={current ? 'page' : undefined}
            look={[styles.topItem, current && { backgroundColor: colors.surface }]}
            hoveredLook={current ? undefined : { backgroundColor: colors.surfaceMuted }}
            pressedLook={styles.pressed}
          >
            <Icon name={item.icon} color={color} size={20} strokeWidth={current ? 2.4 : 1.9} />
            <Text style={[styles.topLabel, labelStyle]}>{item.label}</Text>
          </Touchable>
        ) : (
          <Touchable aria-current={current ? 'page' : undefined} look={styles.item} pressedLook={styles.pressed}>
            <Icon name={item.icon} color={color} size={24} strokeWidth={current ? 2.4 : 1.9} />
            <Text style={[styles.label, labelStyle]}>{item.label}</Text>
          </Touchable>
        )}
      </Link>
    );
  });

  if (atTop) {
    return (
      <View
        style={[
          styles.top,
          { backgroundColor: colors.background, borderBottomColor: colors.hairline, paddingTop: insets.top + space.sm },
        ]}
      >
        <View style={styles.topRow}>
          <Link href="/" style={[styles.brand, { color: colors.text }]}>
            Wish Me
          </Link>
          <View role="navigation" aria-label={label} style={styles.topItems}>
            {links}
          </View>
        </View>
      </View>
    );
  }

  return (
    <BarBackground
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      style={[styles.bar, { borderTopColor: colors.hairline, paddingBottom: insets.bottom + space.sm }]}
    >
      <View role="navigation" aria-label={label} style={styles.items}>
        {links}
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
  // Lined up with the pages' widest column, so the brand sits above their left edge.
  top: { borderBottomWidth: StyleSheet.hairlineWidth, paddingBottom: space.sm, paddingHorizontal: space.xl },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
    width: '100%',
    maxWidth: wideContentMaxWidth,
    alignSelf: 'center',
  },
  brand: { fontFamily: fonts.extraBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.5 },
  topItems: { flexDirection: 'row', gap: space.xs },
  topItem: {
    minHeight: minTouchTarget,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  topLabel: { fontSize: 15, lineHeight: 20 },
});
