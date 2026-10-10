import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useSession } from '@/auth/SessionProvider';
import { Showcase } from '@/home/Showcase';
import { MyLists } from '@/lists/MyLists';
import { Button } from '@/ui/Button';
import { LegalFooter } from '@/ui/LegalFooter';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

export default function Home() {
  const { t } = useTranslation();
  const { session } = useSession();

  if (session) {
    return (
      <Screen edges="all" title={t('lists.title')}>
        <MyLists />
      </Screen>
    );
  }

  return (
    <Screen edges="all" description={t('home.tagline')}>
      <Text variant="display">Wish Me</Text>
      <Text variant="title">{t('home.tagline')}</Text>
      <Showcase />
      <Text tone="secondary">{t('home.intro')}</Text>
      <Button label={t('home.signIn')} onPress={() => router.push('/sign-in')} />
      <View style={styles.spacer} />
      <LegalFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  spacer: { flexGrow: 1 },
});
