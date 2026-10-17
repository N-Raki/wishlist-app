import { StyleSheet, View } from 'react-native';
import { contentMaxWidth, space } from '@/theme/tokens';
import { Illustration, type IllustrationName } from './Illustration';
import { Text } from './Text';

/**
 * What a page says before it has anything to show: the first impression (docs/design.md,
 * rule 6). Text on the background with an illustration, never a frame, since nothing here is
 * tapped: the way on is the page's action.
 */
export function EmptyState({
  illustration,
  title,
  body,
}: {
  illustration: IllustrationName;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.art}>
        <Illustration name={illustration} size={88} />
      </View>
      <Text variant="heading">{title}</Text>
      <Text tone="secondary">{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { gap: space.sm, maxWidth: contentMaxWidth },
  // The objects have some air around them in their square: pulled left to line up with the text.
  art: { marginLeft: -space.xs, marginBottom: space.sm },
});
