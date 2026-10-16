import { BlurView } from 'expo-blur';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';
import { useColors } from '@/theme/useColors';

/** The translucent material of the bars the content scrolls under (docs/design.md). */
export function BarBackground({ style, ...props }: ComponentProps<typeof BlurView>) {
  const colors = useColors();
  return (
    <BlurView
      // Android blurs poorly and slowly: the translucent colour alone does the job there.
      intensity={Platform.OS === 'android' ? 0 : 40}
      tint="default"
      style={[{ backgroundColor: colors.chrome }, style]}
      {...props}
    />
  );
}
