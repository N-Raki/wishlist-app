import '@/i18n';
import {
  Gabarito_400Regular,
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
  Gabarito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/gabarito';
import { QueryClientProvider } from '@tanstack/react-query';
import { router, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNameRequirement } from '@/account/queries';
import { SessionProvider, useSession } from '@/auth/SessionProvider';
import { useDeviceLanguage } from '@/i18n/useDeviceLanguage';
import { queryClient } from '@/lib/queryClient';
import { useColors } from '@/theme/useColors';
import { stackOptions } from '@/ui/stackOptions';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Gabarito_400Regular,
    Gabarito_500Medium,
    Gabarito_600SemiBold,
    Gabarito_700Bold,
    Gabarito_800ExtraBold,
  });
  useDeviceLanguage();
  // The web renders right away with a fallback font, so pre-rendered pages are never blank.
  if (!fontsLoaded && Platform.OS !== 'web') return null;

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Navigation />
      </QueryClientProvider>
    </SessionProvider>
  );
}

function Navigation() {
  const colors = useColors();
  const { session, isLoading } = useSession();
  // While the stored session is being read, keep every screen reachable rather than
  // bouncing a signed-in user off the page they opened.
  const signedIn = isLoading || session !== null;
  const signedOut = isLoading || session === null;
  // A new account names itself on the sign-in sheet before going anywhere (docs/spec.md).
  const nameRequirement = useNameRequirement();
  const pathname = usePathname();

  // Nothing of an account stays in memory once it signs out, even on a shared device.
  useEffect(() => {
    if (!session) queryClient.clear();
  }, [session]);

  // Signed in on another visit without having chosen a name: back to the sheet to choose one.
  useEffect(() => {
    if (nameRequirement === 'required' && pathname !== '/sign-in') router.push('/sign-in');
  }, [nameRequirement, pathname]);

  return (
    <Stack screenOptions={stackOptions(colors)}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Protected guard={signedOut || nameRequirement !== 'none'}>
        <Stack.Screen name="sign-in" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="list-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="wishlists/[id]/wish" options={{ presentation: 'modal' }} />
        <Stack.Screen name="delete-account" options={{ presentation: 'modal' }} />
        <Stack.Screen name="display-name" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}
