import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useDisplayName } from '@/account/queries';
import { useDisplayNameForm } from '@/account/useDisplayNameForm';
import { goBack } from '@/lib/navigation';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { closeButton } from '@/ui/stackOptions';
import { Text } from '@/ui/Text';

// Changes the display name, from the account page.
export default function DisplayName() {
  const name = useDisplayName();
  if (name.isPending) return null;
  return <EditName initialName={name.data ?? ''} />;
}

function EditName({ initialName }: { initialName: string }) {
  const { t } = useTranslation();
  const form = useDisplayNameForm(initialName, () => goBack('/account'));
  return (
    <Screen
      title={t('profile.editTitle')}
      action={<Button label={t('profile.save')} loading={form.busy} onPress={form.submit} />}
    >
      <Stack.Screen options={{ headerLeft: closeButton(t('common.close'), () => goBack('/account')) }} />
      <Text variant="title">{t('profile.editTitle')}</Text>
      <Text tone="secondary">{t('profile.editBody')}</Text>
      {form.field}
    </Screen>
  );
}
