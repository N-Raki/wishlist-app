import { Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/auth/SessionProvider';
import { useColors } from '@/theme/useColors';
import { useLargeScreen } from '@/ui/layout';
import { TabBar, type TabItem } from '@/ui/TabBar';
import { TabBarInsetProvider } from '@/ui/tabBarInset';

// Signed in, the app is a set of tabs: at the bottom on a phone, along the top on a large
// screen (docs/design.md, "Grands écrans"). Signed out, the home page is a plain landing page
// with no tab bar, and the account tab is out of reach.
export default function TabsLayout() {
  const { t } = useTranslation();
  const colors = useColors();
  const { session, isLoading } = useSession();
  const signedIn = isLoading || session !== null;
  const atTop = useLargeScreen() && session !== null;

  const items: Record<string, TabItem> = {
    '(lists)': { label: t('tabs.lists'), icon: 'lists', href: '/' },
    '(relatives)': { label: t('tabs.relatives'), icon: 'relatives', href: '/relatives' },
    account: { label: t('tabs.account'), icon: 'account', href: '/account' },
  };

  return (
    <TabBarInsetProvider atTop={atTop}>
      <Tabs
        tabBar={(props) => (session ? <TabBar {...props} items={items} label={t('tabs.label')} atTop={atTop} /> : null)}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
          tabBarPosition: atTop ? 'top' : 'bottom',
        }}
      >
        <Tabs.Screen name="(lists)" />
        <Tabs.Protected guard={signedIn}>
          <Tabs.Screen name="(relatives)" />
          <Tabs.Screen name="account" />
        </Tabs.Protected>
      </Tabs>
    </TabBarInsetProvider>
  );
}
