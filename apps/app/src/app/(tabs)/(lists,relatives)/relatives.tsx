import { Link, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { groupByOwner, type VisitedList } from '@/lists/api';
import { useVisitedLists } from '@/lists/queries';
import { space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { EmptyState } from '@/ui/EmptyState';
import { Grid } from '@/ui/Grid';
import { Icon } from '@/ui/Icon';
import { Screen } from '@/ui/Screen';
import { Text } from '@/ui/Text';

// "Relatives": the lists of others the user opened from a link while signed in, by person,
// most recent first (docs/spec.md). Opening a list adds it, so the tab refreshes when shown.
export default function Relatives() {
  const { t } = useTranslation();
  const colors = useColors();
  const lists = useVisitedLists();
  const { refetch } = lists;
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <Screen title={t('relatives.title')} width="wide" heading={<Text variant="display">{t('relatives.title')}</Text>}>
      {lists.isPending ? (
        <ActivityIndicator color={colors.textSecondary} />
      ) : lists.isError ? (
        <View style={styles.group}>
          <Text role="alert" tone="secondary">
            {t('common.genericError')}
          </Text>
          <Button variant="secondary" label={t('wishlist.retry')} onPress={() => lists.refetch()} />
        </View>
      ) : lists.data.length === 0 ? (
        <EmptyState illustration="letter" title={t('relatives.emptyTitle')} body={t('relatives.emptyBody')} />
      ) : (
        groupByOwner(lists.data).map((group) => (
          <View key={group.ownerId} style={styles.group}>
            <Text variant="heading">{group.ownerName ?? t('reservation.relatives', { count: 1 })}</Text>
            <Grid minCellWidth={320} rowGap={space.sm}>
              {group.lists.map((list) => (
                <VisitedCard key={list.wishlist_id} list={list} />
              ))}
            </Grid>
          </View>
        ))
      )}
    </Screen>
  );
}

function VisitedCard({ list }: { list: VisitedList }) {
  const { t } = useTranslation();
  const colors = useColors();
  return (
    <Link href={{ pathname: '/wishlists/[id]', params: { id: list.wishlist_id } }} asChild>
      <Card look={styles.card}>
        <View style={styles.cardText}>
          <Text variant="bodyStrong" numberOfLines={2}>
            {list.name}
          </Text>
          <Text tone="secondary">
            {list.wish_count === 0 ? t('lists.empty') : t('lists.wishCount', { count: list.wish_count })}
          </Text>
        </View>
        <Icon name="chevronRight" color={colors.textSecondary} />
      </Card>
    </Link>
  );
}

const styles = StyleSheet.create({
  group: { gap: space.md },
  card: {
    flexGrow: 1,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  cardText: { flex: 1, gap: 2 },
});
