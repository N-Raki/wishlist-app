import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { deleteMyAccount } from '@/account/account';
import { space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

// Deletion is immediate (docs/spec.md): this screen is the confirmation step.
// Once the session is gone, the root layout's guards take the user home.
export default function DeleteAccount() {
  const { t } = useTranslation();
  const colors = useColors();
  const [state, setState] = useState<'idle' | 'busy' | 'failed'>('idle');

  async function confirm() {
    setState('busy');
    try {
      await deleteMyAccount();
    } catch {
      setState('failed');
    }
  }

  return (
    <Screen title={t('deleteAccount.title')}>
      <View style={{ gap: space.md }}>
        <Text variant="title">{t('deleteAccount.heading')}</Text>
        <Text>{t('deleteAccount.body')}</Text>
        <Text tone="secondary">{t('deleteAccount.exportFirst')}</Text>
      </View>
      {state === 'failed' ? (
        <Text role="alert" style={{ color: colors.danger }}>
          {t('common.genericError')}
        </Text>
      ) : null}
      <View style={{ gap: space.md }}>
        <Button variant="danger" label={t('deleteAccount.confirm')} loading={state === 'busy'} onPress={confirm} />
        <Button
          variant="secondary"
          label={t('deleteAccount.cancel')}
          disabled={state === 'busy'}
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}
