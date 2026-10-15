import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform } from 'react-native';
import { completeRedirect } from '@/auth/oauthRedirect';
import { type ReturnTo, returnTo } from '@/auth/returnTo';
import { goBack } from '@/lib/navigation';
import { pendingReservation } from '@/lists/pendingReservation';
import { useColors } from '@/theme/useColors';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

// Where Google sends the user back. On the web the page left for Google, so this route signs
// in and returns to where the user was (src/auth/returnTo.ts); a failure reopens the sign-in
// sheet there, with the reason. In the apps the browser session already did the work.
export default function AuthCallback() {
  const { t } = useTranslation();
  const colors = useColors();
  const { code, error } = useLocalSearchParams<{ code?: string; error?: string }>();

  useEffect(() => {
    let active = true;
    const after = Platform.OS === 'web' ? returnTo.read() : {};
    completeRedirect({ code, error }).then((result) => {
      if (!active) return;
      if (Platform.OS !== 'web') return goBack();
      returnTo.clear();
      if (!result) pendingReservation.set(after.wish ?? null);
      router.replace(pageOf(after));
      if (result) {
        const failed = result === 'cancelled' ? {} : { failed: '1' };
        router.push({ pathname: '/sign-in', params: { ...after, ...failed } });
      }
    });
    return () => {
      active = false;
    };
  }, [code, error]);

  return (
    <Screen title={t('signIn.title')}>
      <ActivityIndicator color={colors.textSecondary} />
      <Text role="status" tone="secondary" style={{ textAlign: 'center' }}>
        {t('signIn.completing')}
      </Text>
    </Screen>
  );
}

function pageOf({ list, wish }: ReturnTo): Href {
  if (list && wish) return { pathname: '/wishlists/[id]/[wishId]', params: { id: list, wishId: wish } };
  if (list) return { pathname: '/wishlists/[id]', params: { id: list } };
  return '/';
}
