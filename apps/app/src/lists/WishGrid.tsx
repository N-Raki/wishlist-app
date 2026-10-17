import { Image } from 'expo-image';
import { type Href, Link } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { fonts, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Grid } from '@/ui/Grid';
import { Text } from '@/ui/Text';
import { Touchable } from '@/ui/Touchable';
import type { Wish } from './api';
import { formatPrice } from './money';
import { photoUrl } from './photos';
import { initialOf, tintAt } from './tint';

/**
 * 4:5 tiles, two columns on a phone and more on a large screen: the photos carry the page
 * (docs/design.md, "Photo d'abord").
 */
export function WishGrid({ children }: { children: ReactNode[] }) {
  return (
    <Grid minCellWidth={220} minColumns={2} rowGap={space.lg}>
      {children}
    </Grid>
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
        hoveredLook={styles.hovered}
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
  if (size === 'thumb') {
    return (
      <View aria-hidden style={[frame, { backgroundColor: colors[tint.background] }]}>
        <Text style={[styles.thumbInitial, { color: colors[tint.ink] }]}>{initialOf(wish.name)}</Text>
      </View>
    );
  }
  return <Monogram initial={initialOf(wish.name)} background={colors[tint.background]} ink={colors[tint.ink]} />;
}

/**
 * A tile without a photo: its initial set very large and cropped by the tile's corner, like a
 * printed label, so it reads as chosen rather than as a missing picture or an avatar. The size
 * follows the tile's width, which only layout knows; until then the tile shows its tint alone.
 */
function Monogram({ initial, background, ink }: { initial: string; background: string; ink: string }) {
  const [width, setWidth] = useState(0);
  const fontSize = width * 1.2;
  return (
    <View
      aria-hidden
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[styles.tile, { backgroundColor: background }]}
    >
      {width > 0 ? (
        <Text
          numberOfLines={1}
          style={[
            styles.monogram,
            {
              color: ink,
              fontSize,
              lineHeight: fontSize,
              letterSpacing: -fontSize * 0.04,
              right: -fontSize * 0.1,
              bottom: -fontSize * 0.2,
            },
          ]}
        >
          {initial}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wish: { gap: space.sm },
  tile: {
    aspectRatio: 4 / 5,
    borderRadius: radius.tile,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { flex: 1, borderRadius: radius.field, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  monogram: { position: 'absolute', fontFamily: fonts.extraBold },
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
  hovered: { transform: [{ translateY: -3 }] },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
