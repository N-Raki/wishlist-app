import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { minTouchTarget, space, typography } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { TextLink } from './TextLink';

export function LegalFooter() {
  const { t } = useTranslation();
  const colors = useColors();
  const linkStyle = [styles.link, { color: colors.textSecondary }];
  return (
    <View role="contentinfo" style={styles.footer}>
      <TextLink href="/privacy" style={linkStyle}>
        {t('footer.privacy')}
      </TextLink>
      <TextLink href="/legal-notice" style={linkStyle}>
        {t('footer.legalNotice')}
      </TextLink>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: space.xl,
  },
  link: {
    ...typography.caption,
    minHeight: minTouchTarget,
    paddingVertical: space.md,
  },
});
