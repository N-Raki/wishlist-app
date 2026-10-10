import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, Text } from 'react-native';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
};

/** Main actions are filled pills, secondary ones outlined (docs/design.md). */
export function Button({ label, variant = 'primary', loading = false, disabled, ...props }: Props) {
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
    <Pressable
      role="button"
      aria-disabled={inactive}
      aria-busy={loading}
      disabled={inactive}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: look.background, borderColor: look.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={look.text} accessibilityElementsHidden /> : null}
      <Text style={[styles.label, { color: look.text }]}>{label}</Text>
    </Pressable>
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
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22 },
});
