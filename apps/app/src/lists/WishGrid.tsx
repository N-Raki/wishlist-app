import { type Href, Link } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { fonts, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Text } from '@/ui/Text';
import { Touchable } from '@/ui/Touchable';
import type { Wish } from './api';
import { formatPrice } from './money';
import { initialOf, tintAt } from './tint';

/** Two columns of 4:5 tiles: the photos carry the page (docs/design.md, "Photo d'abord"). */
export function WishGrid({ children }: { children: ReactNode[] }) {
  const rows: ReactNode[][] = [];
  children.forEach((child, index) => {
    if (index % 2 === 0) rows.push([child]);
    else rows.at(-1)?.push(child);
  });
  return (
    <View role="list" style={styles.grid}>
      {rows.map((row, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: rows are positions, not items
        <View key={index} style={styles.row}>
          {row.map((cell, cellIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the cell's content carries its own key
            <View key={cellIndex} role="listitem" style={styles.cell}>
              {cell}
            </View>
          ))}
          {row.length === 1 ? <View style={styles.cell} /> : null}
        </View>
      ))}
    </View>
  );
}

/** A wish as a tile. With `href`, the whole tile opens it (the owner editing it). */
export function WishTile({ wish, position, href }: { wish: Wish; position: number; href?: Href }) {
  const { t, i18n } = useTranslation();
  const content = (
    <View style={styles.wish}>
      <WishArt wish={wish} position={position} size="tile" />
      <View style={styles.caption}>
        <Text variant="bodyStrong" numberOfLines={2}>
          {wish.name}
        </Text>
        {wish.price_cents === null ? (
          <Text variant="caption" tone="secondary">
            {t('wishlist.noPrice')}
          </Text>
        ) : (
          <Text style={styles.price}>{formatPrice(wish.price_cents, wish.currency, i18n.language)}</Text>
        )}
      </View>
    </View>
  );

  if (!href) return content;
  return (
    <Link href={href} asChild>
      <Touchable aria-label={t('wishlist.edit', { name: wish.name })} pressedLook={styles.pressed}>
        {content}
      </Touchable>
    </Link>
  );
}

/**
 * What stands for a wish: its photo once photos arrive, until then its initial on a tint, so a
 * list without photos still has colour and rhythm (docs/design.md, "Photo d'abord").
 */
export function WishArt({
  wish,
  position,
  size,
}: {
  wish: Pick<Wish, 'name'>;
  /** Rank of the wish in its list, counted from the oldest. */
  position: number;
  size: 'tile' | 'thumb';
}) {
  const colors = useColors();
  const tint = tintAt(position);
  return (
    <View
      aria-hidden
      style={[size === 'tile' ? styles.tile : styles.thumb, { backgroundColor: colors[tint.background] }]}
    >
      <Text style={[size === 'tile' ? styles.initial : styles.thumbInitial, { color: colors[tint.ink] }]}>
        {initialOf(wish.name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.lg },
  row: { flexDirection: 'row', gap: space.md },
  cell: { flex: 1 },
  wish: { gap: space.sm },
  tile: { aspectRatio: 4 / 5, borderRadius: radius.tile, alignItems: 'center', justifyContent: 'center' },
  thumb: { flex: 1, borderRadius: radius.field, alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.extraBold, fontSize: 88, lineHeight: 96, letterSpacing: -2 },
  thumbInitial: { fontFamily: fonts.extraBold, fontSize: 30, lineHeight: 36 },
  caption: { paddingHorizontal: space.xs },
  price: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, fontVariant: ['tabular-nums'] },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
