import type { Stack } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform, View } from 'react-native';
import type { Colors } from '@/theme/palette';
import { fonts, space } from '@/theme/tokens';
import { HeaderButton } from './HeaderButton';
import type { IconName } from './Icon';
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

type Options = Exclude<NonNullable<ComponentProps<typeof Stack.Screen>['options']>, (...args: never[]) => unknown>;

// Header icons, and the same drawn by the system on iOS.
const sfSymbols = { close: 'xmark', share: 'square.and.arrow.up', more: 'ellipsis' } as const satisfies Partial<
  Record<IconName, string>
>;
type HeaderAction = { icon: keyof typeof sfSymbols; label: string; onPress: () => void };

/**
 * Buttons on one side of the header. On iOS they are native bar button items, so they sit on
 * the system's round "Liquid Glass" like the back button: a view of ours came out as a capsule.
 */
export function headerActions(side: 'left' | 'right', actions: HeaderAction[]): Options {
  if (Platform.OS === 'ios') {
    const items = () =>
      actions.map(({ icon, label, onPress }) => ({
        type: 'button' as const,
        label,
        icon: { type: 'sfSymbol' as const, name: sfSymbols[icon] },
        onPress,
      }));
    return side === 'left' ? { unstable_headerLeftItems: items } : { unstable_headerRightItems: items };
  }
  const element = () => (
    <View style={{ flexDirection: 'row', marginHorizontal: Platform.OS === 'web' ? space.md : 0 }}>
      {actions.map(({ icon, label, onPress }) => (
        <HeaderButton key={icon} icon={icon} label={label} onPress={onPress} />
      ))}
    </View>
  );
  return side === 'left' ? { headerLeft: element } : { headerRight: element };
}

/** Closes a form opened as a modal: top left, where people look for it on every platform. */
export function closeButton(label: string, onPress: () => void) {
  return headerActions('left', [{ icon: 'close', label, onPress }]);
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
