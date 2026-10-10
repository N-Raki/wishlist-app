import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import type { ColorName } from '@/theme/palette';
import { fonts, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Text } from '@/ui/Text';

type Wish = {
  name: 'vinyl' | 'trip';
  price: number;
  tint: ColorName;
  badge?: 'claimed' | 'shared';
};

const wishes: Wish[] = [
  { name: 'vinyl', price: 189, tint: 'tintPeach', badge: 'claimed' },
  { name: 'trip', price: 320, tint: 'tintSage', badge: 'shared' },
];

/**
 * A sample list as a guest sees it: who is on which gift, which the owner never sees.
 * Decorative: the tagline already says it, so it is hidden from assistive technologies.
 */
export function Showcase() {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const price = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  return (
    <View aria-hidden style={styles.grid}>
      {wishes.map((wish) => (
        <View key={wish.name} style={styles.item}>
          <View style={[styles.tile, { backgroundColor: colors[wish.tint] }]}>
            {wish.badge ? (
              <Text variant="caption" style={[styles.badge, { backgroundColor: colors.surface }]}>
                {t(`home.showcase.${wish.badge}`, {
                  name: wish.badge === 'claimed' ? 'Léa' : 'Hugo',
                })}
              </Text>
            ) : null}
          </View>
          <Text variant="bodyStrong" numberOfLines={1}>
            {t(`home.showcase.${wish.name}`)}
          </Text>
          <Text variant="caption" tone="secondary">
            {price.format(wish.price)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: space.lg },
  item: { flex: 1, gap: space.xs },
  tile: {
    aspectRatio: 4 / 5,
    borderRadius: radius.tile,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: space.md,
    marginBottom: space.xs,
  },
  badge: {
    fontFamily: fonts.semiBold,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
