import { Stack } from 'expo-router';
import { useColors } from '@/theme/useColors';
import { stackOptions } from '@/ui/stackOptions';

// One stack for each of the "My lists" and "Relatives" tabs, sharing the list and wish pages:
// a list opened from a tab stacks in that tab, so the tab bar stays in reach (docs/design.md).
// Forms open above it as modals, from the root stack.
export const unstable_settings = {
  initialRouteName: 'index',
  relatives: { initialRouteName: 'relatives' },
};

export default function ListsLayout({ segment }: { segment: string }) {
  const colors = useColors();
  // The stack starts on its first screen, so each tab lists its own home first.
  const homes = segment === '(relatives)' ? ['relatives', 'index'] : ['index', 'relatives'];
  return (
    <Stack screenOptions={stackOptions(colors)}>
      {homes.map((name) => (
        <Stack.Screen key={name} name={name} options={{ headerShown: false }} />
      ))}
    </Stack>
  );
}
