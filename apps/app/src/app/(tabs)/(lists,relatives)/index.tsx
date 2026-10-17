import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/auth/SessionProvider';
import { Welcome } from '@/home/Welcome';
import { MyLists } from '@/lists/MyLists';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

export default function Home() {
  const { t } = useTranslation();
  const { session } = useSession();

  if (session) {
    return (
      <Screen
        title={t('lists.title')}
        width="wide"
        heading={<Text variant="display">{t('lists.title')}</Text>}
        action={
          <Link href="/list-form" asChild>
            <Button role="link" icon="plus" label={t('lists.newList')} />
          </Link>
        }
      >
        <MyLists />
      </Screen>
    );
  }

  return <Welcome />;
}
