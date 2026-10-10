import { Text as NativeText, type TextProps } from 'react-native';
import { type TypographyVariant, typography } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';

type Props = TextProps & {
  variant?: TypographyVariant;
  tone?: 'default' | 'secondary';
};

export function Text({ variant = 'body', tone = 'default', style, ...props }: Props) {
  const colors = useColors();
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <NativeText
      role={isHeading ? 'heading' : undefined}
      aria-level={variant === 'heading' ? 2 : isHeading ? 1 : undefined}
      style={[typography[variant], { color: tone === 'secondary' ? colors.textSecondary : colors.text }, style]}
      {...props}
    />
  );
}
