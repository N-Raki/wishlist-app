import { Image } from 'expo-image';
import type { DimensionValue } from 'react-native';

// 3D objects from Microsoft's Fluent Emoji (MIT, assets/illustrations/LICENSE): one family for
// every illustration, so the home page and the empty states look like the same app.
const sources = {
  gift: require('../../assets/illustrations/gift.webp'),
  idea: require('../../assets/illustrations/idea.webp'),
  letter: require('../../assets/illustrations/letter.webp'),
  surprise: require('../../assets/illustrations/surprise.webp'),
  hourglass: require('../../assets/illustrations/hourglass.webp'),
  headphones: require('../../assets/illustrations/headphones.webp'),
  suitcase: require('../../assets/illustrations/suitcase.webp'),
  camera: require('../../assets/illustrations/camera.webp'),
  plant: require('../../assets/illustrations/plant.webp'),
};

export type IllustrationName = keyof typeof sources;

/** Decorative: the text next to it always says the same thing. */
export function Illustration({ name, size }: { name: IllustrationName; size: DimensionValue }) {
  return <Image aria-hidden source={sources[name]} contentFit="contain" style={{ width: size, aspectRatio: 1 }} />;
}
