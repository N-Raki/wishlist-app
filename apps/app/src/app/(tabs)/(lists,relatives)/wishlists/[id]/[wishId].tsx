import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useNameRequirement } from '@/account/queries';
import { useSession } from '@/auth/SessionProvider';
import { cancelReservation, reserve, type Wish, type WishlistView } from '@/lists/api';
import { formatPrice } from '@/lists/money';
import { pendingReservation } from '@/lists/pendingReservation';
import { useListMutation, useWishlist } from '@/lists/queries';
import { describeReservation, reservationState } from '@/lists/reservations';
import { WishArt } from '@/lists/WishGrid';
import { fonts, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';
import { TextLink } from '@/ui/TextLink';

type Notice = 'reserved' | 'joined' | 'cancelled' | 'takenAfterSignIn';

// A wish of someone else's list, with what a relative needs to choose it: photo, price, details,
// the shop's page, who is already on it, and the one action that fits.
export default function WishDetails() {
  const { t } = useTranslation();
  const colors = useColors();
  const { id, wishId } = useLocalSearchParams<{ id: string; wishId: string }>();
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
  const index = list.data?.wishes.findIndex((wish) => wish.id === wishId) ?? -1;
  const wish = list.data?.wishes[index];
  if (!list.data || !wish) {
    return (
      <Screen>
        <Text tone="secondary">{list.data ? t('wish.notFound') : t('wishlist.notFoundTitle')}</Text>
        <TextLink href={list.data ? { pathname: '/wishlists/[id]', params: { id } } : '/'}>
          {list.data ? t('wish.backToList') : t('notFound.home')}
        </TextLink>
      </Screen>
    );
  }
  // Positions count from the oldest wish, as on the list, so the tile keeps its tint.
  return <Details list={list.data} wish={wish} position={list.data.wishes.length - 1 - index} />;
}

function Details({ list, wish, position }: { list: WishlistView; wish: Wish; position: number }) {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const { session } = useSession();
  // A new account first chooses its name on the sign-in sheet, above this page.
  const named = useNameRequirement() === 'none';
  const [notice, setNotice] = useState<Notice | null>(null);
  const reserveIt = useListMutation(list.id, reserve);
  const cancel = useListMutation(list.id, cancelReservation);
  const state = reservationState(wish.reservations);
  // Relatives get reservations, possibly empty; anyone else gets none (wishlist_view).
  const isRelative = wish.reservations !== undefined;

  // Back from signing in to reserve this wish: reserve it, unless someone already is on it.
  useEffect(() => {
    if (!session || !named || !(isRelative || list.is_owner) || !pendingReservation.take(wish.id)) return;
    // Signed in as the owner of the list: nothing to reserve, the page shows the owner's view.
    if (list.is_owner) return;
    if (state.kind === 'free') reserveIt.mutate([wish.id], { onSuccess: () => setNotice('reserved') });
    else if (state.kind === 'others') setNotice('takenAfterSignIn');
  }, [session, named, isRelative, list.is_owner, wish.id, state.kind, reserveIt.mutate]);

  const status = describeReservation(state, t, 'long');
  const busy = reserveIt.isPending || cancel.isPending;
  const failed = reserveIt.isError || cancel.isError;

  let action: React.ReactNode;
  if (list.is_owner) {
    action = (
      <Link href={{ pathname: '/wishlists/[id]/wish', params: { id: list.id, wish: wish.id } }} asChild>
        <Button role="link" label={t('wish.edit')} />
      </Link>
    );
  } else if (!session) {
    action = (
      <Button
        label={t('reservation.reserve')}
        onPress={() => router.push({ pathname: '/sign-in', params: { list: list.id, wish: wish.id } })}
      />
    );
  } else if (state.kind === 'mine') {
    action = (
      <Button
        variant="secondary"
        label={t('reservation.cancel')}
        loading={cancel.isPending}
        disabled={busy}
        onPress={() => cancel.mutate([wish.id], { onSuccess: () => setNotice('cancelled') })}
      />
    );
  } else {
    action = (
      <Button
        label={t(state.kind === 'others' ? 'reservation.join' : 'reservation.reserve')}
        loading={reserveIt.isPending}
        disabled={busy}
        onPress={() =>
          reserveIt.mutate([wish.id], { onSuccess: () => setNotice(state.kind === 'others' ? 'joined' : 'reserved') })
        }
      />
    );
  }

  return (
    <Screen title={`${wish.name} · ${list.name}`} action={action}>
      {router.canGoBack() ? null : (
        // Opened from a link: the way to the whole list, which the header's back button can't offer.
        <TextLink href={{ pathname: '/wishlists/[id]', params: { id: list.id } }} style={styles.listLink}>
          {list.name}
        </TextLink>
      )}
      <View style={styles.art}>
        <WishArt wish={wish} position={position} size="tile" />
      </View>
      <View style={styles.heading}>
        <Text variant="title">{wish.name}</Text>
        {wish.price_cents === null ? (
          <Text tone="secondary">{t('wishlist.noPrice')}</Text>
        ) : (
          <Text style={[styles.price, { color: colors.text }]}>
            {formatPrice(wish.price_cents, wish.currency, i18n.language)}
          </Text>
        )}
      </View>

      {isRelative ? (
        <Text variant="bodyStrong" style={status ? { color: colors.success } : undefined} tone="secondary">
          {status ?? t('reservation.freeHint')}
        </Text>
      ) : null}
      {list.is_owner ? <Text tone="secondary">{t('reservation.ownWish')}</Text> : null}
      {notice || failed ? (
        <Text role={failed ? 'alert' : 'status'} style={failed ? { color: colors.danger } : undefined}>
          {failed ? t('common.genericError') : notice ? t(`reservation.${notice}`) : null}
        </Text>
      ) : null}

      {wish.description ? (
        <View style={styles.section}>
          <Text variant="heading">{t('wish.details')}</Text>
          <Text>{wish.description}</Text>
        </View>
      ) : null}
      {wish.url ? (
        <Link href={wish.url as `https://${string}`} target="_blank" rel="noopener noreferrer" asChild>
          <Button
            role="link"
            variant="secondary"
            icon="link"
            label={t('wish.viewProduct', { host: hostOf(wish.url) })}
          />
        </Link>
      ) : null}
    </Screen>
  );
}

/** "www.boutique.fr/article" → "boutique.fr": what people recognise. */
function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const styles = StyleSheet.create({
  listLink: { alignSelf: 'flex-start' },
  // Smaller than on the list: who is on it and the action stay in view on a phone.
  art: { width: '72%', maxWidth: 320, alignSelf: 'center' },
  heading: { gap: space.xs },
  price: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, fontVariant: ['tabular-nums'] },
  section: { gap: space.sm },
});
