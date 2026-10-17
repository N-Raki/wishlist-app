import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { exportMyData } from '@/account/account';
import { useDisplayName } from '@/account/queries';
import { useSession } from '@/auth/SessionProvider';
import { supabase } from '@/lib/supabase';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Divider } from '@/ui/Divider';
import { LegalFooter } from '@/ui/LegalFooter';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

export default function Account() {
  const { t } = useTranslation();
  const colors = useColors();
  const { session } = useSession();
  const name = useDisplayName();
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
    <Screen title={t('account.title')} heading={<Text variant="display">{t('account.title')}</Text>}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.field}>
          <Text variant="caption" tone="secondary">
            {t('account.nameLabel')}
          </Text>
          <Text variant="bodyStrong">{name.data ?? ' '}</Text>
        </View>
        <View style={styles.field}>
          <Text variant="caption" tone="secondary">
            {t('account.signedInAs')}
          </Text>
          <Text variant="bodyStrong">{session?.user.email}</Text>
        </View>
        <Button variant="secondary" label={t('account.editName')} onPress={() => router.push('/display-name')} />
      </View>

      <View style={styles.section}>
        <Text variant="heading">{t('account.passwordHeading')}</Text>
        <Text tone="secondary">{t('account.passwordBody')}</Text>
        <Button variant="secondary" label={t('account.setPassword')} onPress={() => router.push('/password')} />
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

      <Button variant="secondary" label={t('account.signOut')} onPress={() => supabase.auth.signOut()} />

      {/* Last and set apart: the one thing on this page that cannot be undone. */}
      <Divider />
      <Button
        variant="secondary"
        destructive
        label={t('account.delete')}
        onPress={() => router.push('/delete-account')}
      />

      <View style={styles.spacer} />
      <LegalFooter />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: space.xl, gap: space.lg },
  field: { gap: space.xs },
  section: { gap: space.md },
  spacer: { flexGrow: 1 },
});
