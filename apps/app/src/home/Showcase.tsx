import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import type { ColorName } from '@/theme/palette';
import { fonts, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Illustration, type IllustrationName } from '@/ui/Illustration';
import { Text } from '@/ui/Text';

type Wish = {
  name: Extract<IllustrationName, 'headphones' | 'suitcase' | 'camera' | 'plant'>;
  price: number;
  tint: ColorName;
  badge?: 'claimed' | 'shared';
};

// Tints in the order real lists use (src/lists/tint.ts).
const wishes: Wish[] = [
  { name: 'headphones', price: 249, tint: 'tintPeach', badge: 'claimed' },
  { name: 'suitcase', price: 320, tint: 'tintSage', badge: 'shared' },
  { name: 'camera', price: 119, tint: 'tintLilac' },
  { name: 'plant', price: 35, tint: 'tintSand' },
];

/**
 * A sample list as a relative sees it: who is on which gift, which the owner never sees. The
 * second column sits lower, so the four tiles read as a page being browsed, not a table.
 * Decorative: the text of the home page already says it, so it is hidden from assistive
 * technologies.
 */
export function Showcase() {
  const columns = [wishes.filter((_, index) => index % 2 === 0), wishes.filter((_, index) => index % 2 === 1)];
  return (
    <View aria-hidden style={styles.columns}>
      {columns.map((column, index) => (
        <View key={column[0]?.name} style={[styles.column, index === 1 && styles.lower]}>
          {column.map((wish) => (
            <SampleWish key={wish.name} wish={wish} />
          ))}
        </View>
      ))}
    </View>
  );
}

function SampleWish({ wish }: { wish: Wish }) {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const price = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  return (
    <View style={styles.wish}>
      <View style={[styles.tile, wish.badge && styles.badged, { backgroundColor: colors[wish.tint] }]}>
        <Illustration name={wish.name} size="62%" />
        {wish.badge ? (
          <Text variant="caption" style={[styles.badge, { backgroundColor: colors.surface }]}>
            {t(`home.showcase.${wish.badge}`, { name: wish.badge === 'claimed' ? 'Léa' : 'Hugo' })}
          </Text>
        ) : null}
      </View>
      <View style={styles.caption}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {t(`home.showcase.${wish.name}`)}
        </Text>
        <Text style={styles.price}>{price.format(wish.price)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: { flexDirection: 'row', gap: space.md },
  column: { flex: 1, gap: space.lg },
  lower: { paddingTop: space.xxxl },
  wish: { gap: space.sm },
  tile: { aspectRatio: 4 / 5, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  // The object moves up to leave room for the badge.
  badged: { paddingBottom: space.xxl },
  badge: {
    position: 'absolute',
    left: space.md,
    bottom: space.md,
    fontFamily: fonts.semiBold,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  caption: { paddingHorizontal: space.xs },
  // As on a real wish tile (src/lists/WishGrid.tsx).
  price: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, fontVariant: ['tabular-nums'] },
});
