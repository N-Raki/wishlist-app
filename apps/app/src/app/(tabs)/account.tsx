import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { exportMyData } from '@/account/account';
import { useSession } from '@/auth/SessionProvider';
import { supabase } from '@/lib/supabase';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { LegalFooter } from '@/ui/LegalFooter';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

export default function Account() {
  const { t } = useTranslation();
  const colors = useColors();
  const { session } = useSession();
  const [exportState, setExportState] = useState<'idle' | 'busy' | 'done' | 'failed'>('idle');

  async function exportData() {
    setExportState('busy');
    try {
      await exportMyData();
      setExportState('done');
    } catch {
      setExportState('failed');
    }
  }

  return (
    <Screen title={t('account.title')}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text variant="caption" tone="secondary">
          {t('account.signedInAs')}
        </Text>
        <Text variant="bodyStrong">{session?.user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text variant="heading">{t('account.dataHeading')}</Text>
        <Text tone="secondary">{t('account.dataBody')}</Text>
        <Button variant="secondary" label={t('account.export')} loading={exportState === 'busy'} onPress={exportData} />
        {exportState === 'done' || exportState === 'failed' ? (
          <Text role={exportState === 'failed' ? 'alert' : 'status'} tone="secondary">
            {exportState === 'done' ? t('account.exported') : t('common.genericError')}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Button variant="secondary" label={t('account.signOut')} onPress={() => supabase.auth.signOut()} />
        <Button variant="secondary" label={t('account.delete')} onPress={() => router.push('/delete-account')} />
      </View>

      <View style={styles.spacer} />
      <LegalFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: space.xl, gap: space.xs },
  section: { gap: space.md },
  spacer: { flexGrow: 1 },
});
