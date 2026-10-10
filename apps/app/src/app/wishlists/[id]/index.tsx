import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { deleteList, type WishlistView } from '@/lists/api';
import { useListMutation, useWishlist } from '@/lists/queries';
import { AddWishTile, WishGrid, WishTile } from '@/lists/WishGrid';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { Icon } from '@/ui/Icon';
import { IconButton } from '@/ui/IconButton';
import { Screen } from '@/ui/Screen';
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
    <Screen title={list.name}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerRight}>
              <IconButton icon="more" label={t('wishlist.options')} onPress={() => setDialog('menu')} />
            </View>
          ),
        }}
      />
      <View style={styles.heading}>
        <Text variant="display">{list.name}</Text>
        <View style={[styles.surprise, { backgroundColor: colors.surfaceMuted }]}>
          <Icon name="lock" color={colors.textSecondary} size={15} />
          <Text variant="caption" tone="secondary">
            {t('wishlist.surprise')}
          </Text>
        </View>
      </View>

      <WishGrid>
        {[
          <AddWishTile key="add" href={{ pathname: '/wishlists/[id]/wish', params: { id: list.id } }} />,
          ...list.wishes.map((wish) => (
            <WishTile
              key={wish.id}
              wish={wish}
              href={{ pathname: '/wishlists/[id]/wish', params: { id: list.id, wish: wish.id } }}
            />
          )),
        ]}
      </WishGrid>

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
function SharedList({ list }: { list: WishlistView }) {
  const { t } = useTranslation();
  return (
    <Screen title={list.name}>
      <View style={styles.heading}>
        <Text variant="bodyStrong" tone="secondary">
          {list.owner_name ? t('wishlist.ownerList', { name: list.owner_name }) : t('wishlist.someone')}
        </Text>
        <Text variant="display">{list.name}</Text>
      </View>
      {list.wishes.length === 0 ? (
        <Text tone="secondary">{t('wishlist.empty')}</Text>
      ) : (
        <WishGrid>
          {list.wishes.map((wish) => (
            <WishTile key={wish.id} wish={wish} />
          ))}
        </WishGrid>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Native headers inset their buttons themselves; the web one leaves them against the edge.
  headerRight: { marginEnd: Platform.OS === 'web' ? space.md : 0 },
  heading: { gap: space.md },
  surprise: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.sm,
    borderRadius: radius.pill,
    paddingVertical: space.xs + 2,
    paddingHorizontal: space.md,
  },
});
