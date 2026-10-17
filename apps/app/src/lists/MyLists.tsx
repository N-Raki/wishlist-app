import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { contentMaxWidth, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Grid } from '@/ui/Grid';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { type MyList, previewSize } from './api';
import { useMyLists } from './queries';
import { WishArt } from './WishGrid';

/** "My lists": the signed-in home, under its heading. */
export function MyLists() {
  const { t } = useTranslation();
  const colors = useColors();
  const lists = useMyLists();

  return (
    <>
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
        // Plain text, not a card: only what can be tapped looks tappable. The way on is the
        // "New list" action at the bottom of the screen.
        <View style={styles.empty}>
          <Text variant="heading">{t('lists.noListsTitle')}</Text>
          <Text tone="secondary">{t('lists.noListsBody')}</Text>
        </View>
      ) : (
        <Grid minCellWidth={320}>
          {lists.data.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </Grid>
      )}
    </>
  );
}

/** A list, with a strip of tiles hinting at what is inside. The whole card opens it. */
function ListCard({ list }: { list: MyList }) {
  const { t } = useTranslation();
  const colors = useColors();

  return (
    <Link href={`/wishlists/${list.id}`} asChild>
      <Card look={styles.card}>
        <View aria-hidden style={styles.strip}>
          {Array.from({ length: previewSize }, (_, index) => {
            const wish = list.preview[index];
            const isLast = index === previewSize - 1;
            if (isLast && list.wishCount > previewSize) {
              return (
                <View key="more" style={[styles.more, { backgroundColor: colors.text }]}>
                  <Text variant="bodyStrong" style={{ color: colors.background }}>
                    +{list.wishCount - (previewSize - 1)}
                  </Text>
                </View>
              );
            }
            return wish ? (
              <WishArt key={wish.id} wish={wish} position={list.wishCount - 1 - index} size="thumb" />
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: empty slots, identified by position
              <View key={index} style={[styles.more, { backgroundColor: colors.surfaceMuted }]} />
            );
          })}
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
      </Card>
    </Link>
  );
}

const styles = StyleSheet.create({
  message: { gap: space.md },
  empty: { gap: space.sm, maxWidth: contentMaxWidth },
  card: { flexGrow: 1, padding: space.md, gap: space.md },
  strip: { flexDirection: 'row', gap: space.sm, height: 78 },
  more: { flex: 1, borderRadius: radius.field, alignItems: 'center', justifyContent: 'center' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.sm },
  cardText: { flex: 1, gap: 2 },
});
