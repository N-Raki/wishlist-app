import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSession } from '@/auth/SessionProvider';
import { Showcase } from '@/home/Showcase';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { LegalFooter } from '@/ui/LegalFooter';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

export default function Home() {
  const { t } = useTranslation();
  const { session } = useSession();
  return (
    <Screen edges="all" description={t('home.tagline')}>
      <Text variant="display">Wish Me</Text>
      {session ? <SignedIn /> : <SignedOut />}
      <View style={styles.spacer} />
      <LegalFooter />
    </Screen>
  );
}

function SignedOut() {
  const { t } = useTranslation();
  return (
    <>
      <Text variant="title">{t('home.tagline')}</Text>
      <Showcase />
      <Text tone="secondary">{t('home.intro')}</Text>
      <Button label={t('home.signIn')} onPress={() => router.push('/sign-in')} />
    </>
  );
}

function SignedIn() {
  const { t } = useTranslation();
  const colors = useColors();
  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text variant="heading">{t('home.comingSoonTitle')}</Text>
        <Text tone="secondary">{t('home.comingSoonBody')}</Text>
      </View>
      <Button variant="secondary" label={t('home.account')} onPress={() => router.push('/account')} />
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: space.xl, gap: space.sm },
  spacer: { flexGrow: 1 },
});
