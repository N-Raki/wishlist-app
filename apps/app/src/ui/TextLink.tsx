import { Link, type LinkProps } from 'expo-router';
import { StyleSheet } from 'react-native';
import { fonts } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';

/** Inline link, underlined so it never relies on colour alone (WCAG 1.4.1). */
export function TextLink({ style, ...props }: LinkProps) {
  const colors = useColors();
  return <Link style={[styles.link, { color: colors.text }, style]} {...props} />;
}

const styles = StyleSheet.create({
  link: { fontFamily: fonts.semiBold, textDecorationLine: 'underline' },
});
