import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSession } from '@/auth/SessionProvider';
import { deleteList, type WishlistView } from '@/lists/api';
import { useListMutation, useWishlist } from '@/lists/queries';
import { WishGrid, WishTile } from '@/lists/WishGrid';
import { space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { IconButton } from '@/ui/IconButton';
import { LegalFooter } from '@/ui/LegalFooter';
import { Screen } from '@/ui/Screen';
import { HeaderItem } from '@/ui/stackOptions';
import { Text } from '@/ui/Text';
import { TextLink } from '@/ui/TextLink';

// One address for everyone, as in the v1 (/wishlists/<id>), so links already shared keep working.
// What each person sees is decided by the database (wishlist_view).
export default function Wishlist() {
  const { t } = useTranslation();
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const list = useWishlist(id);

  if (list.isPending) {
    return (
      <Screen>
        <ActivityIndicator color={colors.textSecondary} />
      </Screen>
    );
  }
  if (list.isError) {
    return (
      <Screen>
        <Text role="alert" tone="secondary">
          {t('common.genericError')}
        </Text>
        <Button variant="secondary" label={t('wishlist.retry')} onPress={() => list.refetch()} />
      </Screen>
    );
  }
  if (!list.data) {
    return (
      <Screen title={t('wishlist.notFoundTitle')}>
        <Text variant="title">{t('wishlist.notFoundTitle')}</Text>
        <Text tone="secondary">{t('wishlist.notFoundBody')}</Text>
        <TextLink href="/">{t('notFound.home')}</TextLink>
      </Screen>
    );
  }
  return list.data.is_owner ? <OwnerList list={list.data} /> : <SharedList list={list.data} />;
}

function OwnerList({ list }: { list: WishlistView }) {
  const { t } = useTranslation();
  const colors = useColors();
  const [dialog, setDialog] = useState<'menu' | 'delete' | null>(null);
  const remove = useListMutation(list.id, deleteList);

  return (
    <Screen
      title={list.name}
      action={
        <Link href={{ pathname: '/wishlists/[id]/wish', params: { id: list.id } }} asChild>
          <Button role="link" icon="plus" label={t('wishlist.addWish')} />
        </Link>
      }
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderItem>
              <IconButton icon="more" label={t('wishlist.options')} onPress={() => setDialog('menu')} />
            </HeaderItem>
          ),
        }}
      />
      <Text variant="title">{list.name}</Text>

      {list.wishes.length === 0 ? (
        // What a new list is for, and the promise that makes it safe to share: said once, here,
        // rather than as a permanent badge (docs/design.md).
        <View style={styles.empty}>
          <Text variant="heading">{t('wishlist.ownerEmptyTitle')}</Text>
          <Text tone="secondary">{t('wishlist.ownerEmptyBody')}</Text>
        </View>
      ) : (
        <WishGrid>
          {list.wishes.map((wish, index) => (
            <WishTile
              key={wish.id}
              wish={wish}
              position={list.wishes.length - 1 - index}
              href={{ pathname: '/wishlists/[id]/wish', params: { id: list.id, wish: wish.id } }}
            />
          ))}
        </WishGrid>
      )}

      {/* One dialog whose content changes, so the menu never fades out under the confirmation. */}
      <Dialog
        visible={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog === 'delete' ? t('wishlist.deleteTitle', { name: list.name }) : t('wishlist.options')}
        body={dialog === 'delete' ? t('wishlist.deleteBody') : undefined}
      >
        {dialog === 'delete' ? (
          <>
            {remove.isError ? (
              <Text role="alert" style={{ color: colors.danger }}>
                {t('common.genericError')}
              </Text>
            ) : null}
            <Button
              variant="danger"
              label={t('wishlist.deleteConfirm')}
              loading={remove.isPending}
              onPress={() => remove.mutate([list.id], { onSuccess: () => router.dismissTo('/') })}
            />
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              label={t('wishlist.rename')}
              onPress={() => {
                setDialog(null);
                router.push({ pathname: '/list-form', params: { id: list.id } });
              }}
            />
            <Button variant="secondary" label={t('wishlist.delete')} onPress={() => setDialog('delete')} />
          </>
        )}
        <Button
          variant="secondary"
          label={t('wishlist.cancel')}
          disabled={remove.isPending}
          onPress={() => setDialog(null)}
        />
      </Dialog>
    </Screen>
  );
}

// Someone else's list. Reserving arrives with the next step of the roadmap; until then it reads only.
// Visitors who are not signed in have no account tab, so the legal links are at the bottom.
function SharedList({ list }: { list: WishlistView }) {
  const { t } = useTranslation();
  const { session } = useSession();
  return (
    <Screen title={list.name}>
      <View style={styles.heading}>
        <Text variant="bodyStrong" tone="secondary">
          {list.owner_name ? t('wishlist.ownerList', { name: list.owner_name }) : t('wishlist.someone')}
        </Text>
        <Text variant="title">{list.name}</Text>
      </View>
      {list.wishes.length === 0 ? (
        <Text tone="secondary">{t('wishlist.empty')}</Text>
      ) : (
        <WishGrid>
          {list.wishes.map((wish, index) => (
            <WishTile key={wish.id} wish={wish} position={list.wishes.length - 1 - index} />
          ))}
        </WishGrid>
      )}
      {session ? null : (
        <>
          <View style={styles.spacer} />
          <LegalFooter />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { gap: space.md },
  empty: { gap: space.sm },
  spacer: { flexGrow: 1 },
});
