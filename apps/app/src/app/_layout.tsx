import '@/i18n';
import {
  Gabarito_400Regular,
  Gabarito_500Medium,
  Gabarito_600SemiBold,
  Gabarito_700Bold,
  Gabarito_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/gabarito';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SessionProvider, useSession } from '@/auth/SessionProvider';
import { useDeviceLanguage } from '@/i18n/useDeviceLanguage';
import { fonts, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { TextLink } from '@/ui/TextLink';

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
      <StatusBar style="auto" />
      <Navigation />
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

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        // Each page starts with its own heading, so the bar only carries navigation.
        headerTitle: '',
        // A page opened from a link has nothing to go back to: offer the way home instead.
        headerLeft: navigation.canGoBack() ? undefined : () => <HomeLink />,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Protected guard={signedOut}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="account" />
        <Stack.Screen name="delete-account" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}

function HomeLink() {
  return (
    <TextLink
      href="/"
      style={{
        textDecorationLine: 'none',
        fontFamily: fonts.extraBold,
        fontSize: 18,
        padding: space.md,
      }}
    >
      Wish Me
    </TextLink>
  );
}
