import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { radius } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Touchable } from './Touchable';

/**
 * A surface that opens something as a whole, usually inside `<Link asChild>`. It lifts under
 * the pointer, so what can be clicked says so before the click.
 */
export function Card({ look, ...props }: Omit<ComponentProps<typeof Touchable>, 'hoveredLook' | 'pressedLook'>) {
  const colors = useColors();
  return (
    <Touchable
      look={[styles.card, { backgroundColor: colors.surface }, look]}
      hoveredLook={[styles.hovered, { boxShadow: `0 12px 28px -14px ${colors.shadow}` }]}
      pressedLook={styles.pressed}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card },
  hovered: { transform: [{ translateY: -2 }] },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
