import { Image } from 'expo-image';
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
import { photoUrl } from './photos';
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

/**
 * A wish as a tile. With `href`, the whole tile opens it: the owner edits it, a relative sees
 * its details. `badge` says who offers it, for relatives only.
 */
export function WishTile({
  wish,
  position,
  href,
  opens = 'form',
  badge,
}: {
  wish: Wish;
  position: number;
  href?: Href;
  /** What `href` leads to, for the tile's accessible name. */
  opens?: 'form' | 'details';
  badge?: string | null;
}) {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const content = (
    <View style={styles.wish}>
      <View>
        <WishArt wish={wish} position={position} size="tile" />
        {badge ? (
          <View style={styles.badgeSlot}>
            <Text variant="caption" style={[styles.badge, { backgroundColor: colors.surface }]}>
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
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
      <Touchable
        aria-label={[t(opens === 'details' ? 'wish.open' : 'wishlist.edit', { name: wish.name }), badge]
          .filter(Boolean)
          .join(', ')}
        pressedLook={styles.pressed}
      >
        {content}
      </Touchable>
    </Link>
  );
}

/**
 * What stands for a wish: its photo, or else its initial on a tint, so a list without photos
 * still has colour and rhythm (docs/design.md, "Photo d'abord").
 */
export function WishArt({
  wish,
  photoUri,
  position,
  size,
}: {
  wish: Pick<Wish, 'name' | 'photo_path'>;
  /** Overrides the wish's own photo, for one just picked and not uploaded yet. */
  photoUri?: string | null;
  /** Rank of the wish in its list, counted from the oldest. */
  position: number;
  size: 'tile' | 'thumb';
}) {
  const colors = useColors();
  const tint = tintAt(position);
  const uri = photoUri !== undefined ? photoUri : wish.photo_path ? photoUrl(wish.photo_path) : null;
  const frame = size === 'tile' ? styles.tile : styles.thumb;
  if (uri) {
    return (
      <Image
        aria-hidden
        source={{ uri }}
        contentFit="cover"
        transition={150}
        style={[frame, { backgroundColor: colors[tint.background] }]}
      />
    );
  }
  return (
    <View aria-hidden style={[frame, { backgroundColor: colors[tint.background] }]}>
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
  tile: {
    aspectRatio: 4 / 5,
    borderRadius: radius.tile,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { flex: 1, borderRadius: radius.field, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  initial: { fontFamily: fonts.extraBold, fontSize: 88, lineHeight: 96, letterSpacing: -2 },
  thumbInitial: { fontFamily: fonts.extraBold, fontSize: 30, lineHeight: 36 },
  caption: { paddingHorizontal: space.xs },
  price: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, fontVariant: ['tabular-nums'] },
  badgeSlot: { position: 'absolute', left: space.md, right: space.md, bottom: space.md, alignItems: 'flex-start' },
  badge: {
    fontFamily: fonts.semiBold,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
