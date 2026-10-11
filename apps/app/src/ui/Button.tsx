import { ActivityIndicator, type PressableProps, StyleSheet, Text } from 'react-native';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  /** Compact buttons sit in headers and toolbars, next to other controls. */
  size?: 'regular' | 'compact';
  icon?: IconName;
};

/** Main actions are filled pills, secondary ones outlined (docs/design.md). */
export function Button({
  label,
  variant = 'primary',
  loading = false,
  size = 'regular',
  icon,
  disabled,
  ...props
}: Props) {
  const colors = useColors();
  const look = {
    primary: {
      background: colors.accent,
      text: colors.onAccent,
      border: colors.accent,
    },
    secondary: {
      background: 'transparent',
      text: colors.text,
      border: colors.border,
    },
    danger: {
      background: colors.danger,
      text: colors.onDanger,
      border: colors.danger,
    },
  }[variant];
  const inactive = disabled || loading;

  return (
    <Touchable
      role="button"
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      look={[
        styles.button,
        size === 'compact' && styles.compact,
        { backgroundColor: look.background, borderColor: look.border },
        disabled && styles.disabled,
      ]}
      pressedLook={styles.pressed}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={look.text} accessibilityElementsHidden />
      ) : icon ? (
        <Icon name={icon} color={look.text} size={18} strokeWidth={2.4} />
      ) : null}
      <Text style={[styles.label, size === 'compact' && styles.compactLabel, { color: look.text }]}>{label}</Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: minTouchTarget + 8,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  compact: { minHeight: minTouchTarget, paddingHorizontal: space.lg, gap: space.xs },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22 },
  compactLabel: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
});
