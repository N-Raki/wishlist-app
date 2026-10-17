import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { fonts, space } from '@/theme/tokens';
import { Button } from '@/ui/Button';
import { Illustration, type IllustrationName } from '@/ui/Illustration';
import { LegalFooter } from '@/ui/LegalFooter';
import { useLargeScreen, useWindowWidth } from '@/ui/layout';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { Showcase } from './Showcase';

const steps: { key: 'add' | 'share' | 'surprise'; illustration: IllustrationName }[] = [
  { key: 'add', illustration: 'idea' },
  { key: 'share', illustration: 'letter' },
  { key: 'surprise', illustration: 'surprise' },
];

/**
 * The home page of a visitor without an account: what Wish Me is, a sample list, how it works,
 * and one way in. Signing in and signing up are the same code by e-mail, so the main action
 * speaks to newcomers and the header keeps a way back for those who have an account.
 */
export function Welcome() {
  const { t } = useTranslation();
  const large = useLargeScreen();
  // On a tablet the headline shares the width with the sample list: a step smaller.
  const roomy = useWindowWidth() >= 1024;
  const start = (
    <Link href="/sign-in" asChild>
      <Button role="link" label={t('home.start')} />
    </Link>
  );

  return (
    <Screen description={t('home.tagline')} width="wide" action={large ? undefined : start}>
      <View style={styles.bar}>
        <Text style={styles.brand}>Wish Me</Text>
        <Link href="/sign-in" asChild>
          <Button role="link" variant="secondary" size="compact" label={t('home.signIn')} />
        </Link>
      </View>

      <View style={[styles.hero, large && styles.heroLarge]}>
        <View style={[styles.pitch, large && styles.pitchLarge]}>
          <Text variant="display" style={large && (roomy ? styles.headlineLarge : styles.headlineMedium)}>
            {t('home.tagline')}
          </Text>
          <Text tone="secondary" style={styles.intro}>
            {t('home.intro')}
          </Text>
          {large ? <View style={styles.start}>{start}</View> : null}
        </View>
        <View style={large ? styles.showcaseLarge : undefined}>
          <Showcase />
        </View>
      </View>

      <View style={styles.steps}>
        <Text variant="heading">{t('home.steps.title')}</Text>
        <View style={[styles.stepList, large && styles.stepListLarge]}>
          {steps.map((step) => (
            <View key={step.key} style={[styles.step, large && styles.stepLarge]}>
              <Illustration name={step.illustration} size={large ? 72 : 56} />
              <View style={styles.stepText}>
                <Text variant="bodyStrong" role="heading" aria-level={3}>
                  {t(`home.steps.${step.key}.title`)}
                </Text>
                <Text tone="secondary">{t(`home.steps.${step.key}.body`)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.spacer} />
      <LegalFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  // The name, not the page's heading: that is what the page says about it.
  brand: { fontFamily: fonts.extraBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.5 },
  hero: { gap: space.xxl, marginTop: space.lg },
  heroLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xxxl,
    marginTop: space.xxl,
  },
  pitch: { gap: space.lg },
  pitchLarge: { flex: 1, maxWidth: 500 },
  headlineMedium: { fontSize: 46, lineHeight: 50, letterSpacing: -1.3 },
  headlineLarge: { fontSize: 56, lineHeight: 60, letterSpacing: -1.6 },
  intro: { fontSize: 18, lineHeight: 27 },
  start: { alignSelf: 'flex-start', marginTop: space.sm },
  // Tiles about as large as in a real list on a computer, so the hero fits in the window.
  showcaseLarge: { flex: 1, maxWidth: 460 },
  steps: { gap: space.xl, marginTop: space.xxxl },
  stepList: { gap: space.xl },
  stepListLarge: { flexDirection: 'row', gap: space.xxl },
  step: { flexDirection: 'row', gap: space.lg, alignItems: 'flex-start' },
  stepLarge: { flex: 1, flexDirection: 'column', gap: space.md },
  stepText: { flex: 1, gap: space.xs },
  spacer: { flexGrow: 1, minHeight: space.xxl },
});
