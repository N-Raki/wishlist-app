import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { Touchable } from '@/ui/Touchable';
import type { MyList } from './api';
import { useMyLists } from './queries';
import { tintFor } from './tint';

/** "My lists": the signed-in home. */
export function MyLists() {
  const { t } = useTranslation();
  const colors = useColors();
  const lists = useMyLists();

  return (
    <>
      <View style={styles.header}>
        <Text variant="display" style={styles.title}>
          {t('lists.title')}
        </Text>
        <Link href="/list-form" asChild>
          <Button role="link" size="compact" icon="plus" label={t('lists.newList')} />
        </Link>
      </View>

      {lists.isPending ? (
        <ActivityIndicator color={colors.textSecondary} />
      ) : lists.isError ? (
        <View style={styles.message}>
          <Text role="alert" tone="secondary">
            {t('common.genericError')}
          </Text>
          <Button variant="secondary" label={t('wishlist.retry')} onPress={() => lists.refetch()} />
        </View>
      ) : lists.data.length === 0 ? (
        <View style={[styles.card, styles.message, { backgroundColor: colors.surface }]}>
          <Text variant="heading">{t('lists.noListsTitle')}</Text>
          <Text tone="secondary">{t('lists.noListsBody')}</Text>
        </View>
      ) : (
        <View role="list" style={styles.lists}>
          {lists.data.map((list) => (
            <View key={list.id} role="listitem">
              <ListCard list={list} />
            </View>
          ))}
        </View>
      )}
    </>
  );
}

/** A list, with a strip of tiles hinting at what is inside. The whole card opens it. */
function ListCard({ list }: { list: MyList }) {
  const { t } = useTranslation();
  const colors = useColors();
  const shown = Math.min(list.wishCount, 4);
  const more = list.wishCount - 3;

  return (
    <Link href={`/wishlists/${list.id}`} asChild>
      <Touchable look={[styles.card, { backgroundColor: colors.surface }]} pressedLook={styles.pressed}>
        <View aria-hidden style={styles.strip}>
          {list.wishCount === 0 ? (
            <View style={[styles.stripEmpty, { borderColor: colors.border }]}>
              <Icon name="plus" color={colors.textSecondary} size={18} />
              <Text tone="secondary" variant="bodyStrong">
                {t('lists.firstWish')}
              </Text>
            </View>
          ) : (
            Array.from({ length: shown }, (_, index) =>
              index === 3 && list.wishCount > 4 ? (
                <View key="more" style={[styles.stripTile, { backgroundColor: colors.text }]}>
                  <Text variant="bodyStrong" style={{ color: colors.background }}>
                    +{more}
                  </Text>
                </View>
              ) : (
                <View
                  // biome-ignore lint/suspicious/noArrayIndexKey: decorative tiles, identified by position
                  key={index}
                  style={[styles.stripTile, { backgroundColor: colors[tintFor(`${list.id}${index}`)] }]}
                />
              ),
            )
          )}
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.cardText}>
            <Text variant="heading" numberOfLines={2}>
              {list.name}
            </Text>
            <Text tone="secondary">
              {list.wishCount === 0 ? t('lists.empty') : t('lists.wishCount', { count: list.wishCount })}
            </Text>
          </View>
          <Icon name="chevronRight" color={colors.textSecondary} />
        </View>
      </Touchable>
    </Link>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.md },
  title: { flexShrink: 1 },
  lists: { gap: space.md },
  message: { gap: space.md },
  card: { borderRadius: radius.card, padding: space.md, gap: space.md },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  strip: { flexDirection: 'row', gap: space.sm, height: 78 },
  stripTile: { flex: 1, borderRadius: radius.field, alignItems: 'center', justifyContent: 'center' },
  stripEmpty: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radius.field,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.sm },
  cardText: { flex: 1, gap: 2 },
});
