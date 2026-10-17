import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSession } from '@/auth/SessionProvider';
import { deleteList, type WishlistView } from '@/lists/api';
import { useListMutation, useWishlist } from '@/lists/queries';
import { describeReservation, reservationState } from '@/lists/reservations';
import { ShareDialog } from '@/lists/ShareDialog';
import { WishGrid, WishTile } from '@/lists/WishGrid';
import { space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { Divider } from '@/ui/Divider';
import { LegalFooter } from '@/ui/LegalFooter';
import { Screen } from '@/ui/Screen';
import { headerActions } from '@/ui/stackOptions';
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
  const [sharing, setSharing] = useState(false);
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
        options={headerActions('right', [
          { icon: 'share', label: t('share.open'), onPress: () => setSharing(true) },
          { icon: 'more', label: t('wishlist.options'), onPress: () => setDialog('menu') },
        ])}
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

      <ShareDialog list={list} visible={sharing} onClose={() => setSharing(false)} />
      {/* One dialog whose content changes, so the menu never fades out under the confirmation. */}
      <Dialog
        visible={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog === 'delete' ? t('wishlist.deleteTitle', { name: list.name }) : t('wishlist.options')}
        body={dialog === 'delete' ? t('wishlist.deleteBody') : undefined}
        dismissLabel={t('wishlist.cancel')}
        busy={remove.isPending}
      >
        {dialog === 'delete' ? (
          <>
            {remove.isError ? (
              <Text role="alert" style={{ color: colors.danger }}>
                {t('common.genericError')}
              </Text>
            ) : null}
            <Button
              destructive
              label={t('wishlist.deleteConfirm')}
              loading={remove.isPending}
              onPress={() => remove.mutate([list], { onSuccess: () => router.dismissTo('/') })}
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
            <Divider />
            <Button variant="secondary" destructive label={t('wishlist.delete')} onPress={() => setDialog('delete')} />
          </>
        )}
      </Dialog>
    </Screen>
  );
}

// Someone else's list. Signed-in relatives see who is on what; visitors learn why signing in
// helps, and have no account tab, so the legal links are at the bottom.
function SharedList({ list }: { list: WishlistView }) {
  const { t } = useTranslation();
  const { session } = useSession();
  const isGuest = !session && list.wishes.length > 0;
  const [sharing, setSharing] = useState(false);
  return (
    <Screen
      title={list.name}
      action={
        isGuest ? (
          <Link href="/sign-in" asChild>
            <Button role="link" label={t('reservation.signInToReserve')} />
          </Link>
        ) : undefined
      }
    >
      <Stack.Screen
        options={headerActions('right', [{ icon: 'share', label: t('share.open'), onPress: () => setSharing(true) }])}
      />
      <ShareDialog list={list} visible={sharing} onClose={() => setSharing(false)} />
      <View style={styles.heading}>
        <Text variant="bodyStrong" tone="secondary">
          {list.owner_name ? t('wishlist.ownerList', { name: list.owner_name }) : t('wishlist.someone')}
        </Text>
        <Text variant="title">{list.name}</Text>
      </View>
      {isGuest ? (
        // Why signing in is worth it, said where the wish to reserve is born (docs/design.md).
        <View style={styles.empty}>
          <Text variant="heading">{t('reservation.guestHeading')}</Text>
          <Text tone="secondary">
            {t('reservation.guestBody', { owner: list.owner_name ?? t('reservation.guestOwnerFallback') })}
          </Text>
        </View>
      ) : null}
      {list.wishes.length === 0 ? (
        <Text tone="secondary">{t('wishlist.empty')}</Text>
      ) : (
        <WishGrid>
          {list.wishes.map((wish, index) => (
            <WishTile
              key={wish.id}
              wish={wish}
              position={list.wishes.length - 1 - index}
              href={{ pathname: '/wishlists/[id]/[wishId]', params: { id: list.id, wishId: wish.id } }}
              opens="details"
              badge={describeReservation(reservationState(wish.reservations), t, 'short')}
            />
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
