import { Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/auth/SessionProvider';
import { useColors } from '@/theme/useColors';
import { TabBar, type TabItem } from '@/ui/TabBar';
import { TabBarInsetProvider } from '@/ui/tabBarInset';

// Signed in, the app is a set of tabs. Signed out, the home page is a plain landing page
// with no tab bar, and the account tab is out of reach.
export default function TabsLayout() {
  const { t } = useTranslation();
  const colors = useColors();
  const { session, isLoading } = useSession();
  const signedIn = isLoading || session !== null;

  const items: Record<string, TabItem> = {
    index: { label: t('tabs.lists'), icon: 'lists', href: '/' },
    account: { label: t('tabs.account'), icon: 'account', href: '/account' },
  };

  return (
    <TabBarInsetProvider>
      <Tabs
        tabBar={(props) => (session ? <TabBar {...props} items={items} label={t('tabs.label')} /> : null)}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.background } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Protected guard={signedIn}>
          <Tabs.Screen name="account" />
        </Tabs.Protected>
      </Tabs>
    </TabBarInsetProvider>
  );
}
