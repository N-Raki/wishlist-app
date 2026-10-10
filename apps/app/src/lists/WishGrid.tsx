import { type Href, Link } from 'expo-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { fonts, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Icon } from '@/ui/Icon';
import { Text } from '@/ui/Text';
import { Touchable } from '@/ui/Touchable';
import type { Wish } from './api';
import { formatPrice } from './money';
import { tintFor } from './tint';

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
export function WishTile({ wish, href }: { wish: Wish; href?: Href }) {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const content = (
    <View style={styles.wish}>
      <View aria-hidden style={[styles.tile, { backgroundColor: colors[tintFor(wish.id)] }]} />
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

/** The first tile of the owner's grid: where a new wish starts. */
export function AddWishTile({ href }: { href: Href }) {
  const { t } = useTranslation();
  const colors = useColors();
  return (
    <Link href={href} asChild>
      <Touchable look={[styles.tile, styles.add, { borderColor: colors.border }]} pressedLook={styles.pressed}>
        <View style={[styles.addIcon, { backgroundColor: colors.accent }]}>
          <Icon name="plus" color={colors.onAccent} size={24} strokeWidth={2.4} />
        </View>
        <Text variant="bodyStrong" style={styles.addLabel}>
          {t('wishlist.addWish')}
        </Text>
      </Touchable>
    </Link>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.lg },
  row: { flexDirection: 'row', gap: space.md },
  cell: { flex: 1 },
  wish: { gap: space.sm },
  tile: { aspectRatio: 4 / 5, borderRadius: radius.tile },
  caption: { paddingHorizontal: space.xs },
  price: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, fontVariant: ['tabular-nums'] },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  add: {
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.md,
    padding: space.md,
  },
  addIcon: { width: 52, height: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  addLabel: { fontFamily: fonts.bold, textAlign: 'center' },
});
