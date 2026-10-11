import { Stack } from 'expo-router';
import { useColors } from '@/theme/useColors';
import { stackOptions } from '@/ui/stackOptions';

// Lists open inside the "My lists" tab, so the tab bar stays in reach (docs/design.md).
// Forms open above it as modals, from the root stack.
export default function ListsLayout() {
  const colors = useColors();
  return (
    <Stack screenOptions={stackOptions(colors)}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
