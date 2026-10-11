import type { Stack } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Platform, View } from 'react-native';
import type { Colors } from '@/theme/palette';
import { fonts, space } from '@/theme/tokens';
import { IconButton } from './IconButton';
import { TextLink } from './TextLink';

type ScreenOptions = Extract<NonNullable<ComponentProps<typeof Stack>['screenOptions']>, (...args: never[]) => unknown>;

/** Header of every stack: the page carries its own heading, so the bar only carries navigation. */
export function stackOptions(colors: Colors): ScreenOptions {
  return ({ navigation }) => ({
    headerTitle: '',
    // A page opened from a link has nothing to go back to: offer the way home instead.
    headerLeft: navigation.canGoBack() ? undefined : () => <HomeLink />,
    headerShadowVisible: false,
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: colors.background },
  });
}

/** Closes a form opened as a modal: top left, where people look for it on every platform. */
export function closeButton(label: string, onPress: () => void) {
  return () => (
    <HeaderItem>
      <IconButton icon="close" label={label} onPress={onPress} />
    </HeaderItem>
  );
}

/** Room around a header button: native headers inset them, the web one leaves them at the edge. */
export function HeaderItem({ children }: { children: ReactNode }) {
  return <View style={{ marginHorizontal: Platform.OS === 'web' ? space.md : 0 }}>{children}</View>;
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
