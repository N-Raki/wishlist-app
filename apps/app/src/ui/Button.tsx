import type { ReactElement } from 'react';
import { ActivityIndicator, type PressableProps, StyleSheet, Text } from 'react-native';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  /** How much the action stands out: one primary per screen at most (docs/design.md). */
  variant?: 'primary' | 'secondary' | 'plain';
  /** Loses something: drawn in red. Filled only to confirm what cannot be undone. */
  destructive?: boolean;
  loading?: boolean;
  /** Compact buttons sit in headers and toolbars, next to other controls. */
  size?: 'regular' | 'compact';
  /** One of our icons, or a brand's own mark (Google's). */
  icon?: IconName | ReactElement;
};

/**
 * Three levels of emphasis (docs/design.md): the main action is a filled pill, the others are
 * outlined, and the way out (cancel, another way in) is plain text.
 */
export function Button({
  label,
  variant = 'primary',
  destructive = false,
  loading = false,
  size = 'regular',
  icon,
  disabled,
  ...props
}: Props) {
  const colors = useColors();
  const ink = destructive ? colors.danger : colors.text;
  const look = {
    primary: destructive
      ? { background: colors.danger, text: colors.onDanger, border: colors.danger }
      : { background: colors.accent, text: colors.onAccent, border: colors.accent },
    secondary: { background: 'transparent', text: ink, border: destructive ? colors.danger : colors.border },
    plain: { background: 'transparent', text: ink, border: 'transparent' },
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
      pressedLook={variant === 'plain' ? styles.plainPressed : styles.pressed}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={look.text} accessibilityElementsHidden />
      ) : typeof icon === 'string' ? (
        <Icon name={icon} color={look.text} size={18} strokeWidth={2.4} />
      ) : (
        (icon ?? null)
      )}
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
  // Nothing to shrink: the text dims, like the header buttons.
  plainPressed: { opacity: 0.5 },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22 },
  compactLabel: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20 },
});
