import { useState } from 'react';
import { Platform, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  /** The resting look. Not named `style`: see below. */
  look?: StyleProp<ViewStyle>;
  /** Added while a pointer is over it (a mouse, a trackpad): says it can be clicked. */
  hoveredLook?: StyleProp<ViewStyle>;
  /** Added while pressed: the feedback starts on touch-down, not on release. */
  pressedLook?: StyleProp<ViewStyle>;
  style?: ViewStyle;
};

/**
 * A Pressable that can sit inside `<Link asChild>`. The link merges its own `style` into its
 * child's by spreading objects, which breaks on style arrays and drops style functions on the
 * web; keeping the look in its own props leaves `style` to the link.
 */
export function Touchable({
  look,
  hoveredLook,
  pressedLook,
  style,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  ...props
}: Props) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      style={[transition, look, hovered && hoveredLook, pressed && pressedLook, style]}
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      onHoverIn={(event) => {
        setHovered(true);
        onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        setHovered(false);
        onHoverOut?.(event);
      }}
      {...props}
    />
  );
}

// On the web, the changes ease in rather than jump; +html.tsx turns this off for people who ask
// for reduced motion.
const transition =
  Platform.OS === 'web'
    ? ({
        transitionProperty: 'background-color, box-shadow, opacity, transform',
        transitionDuration: '150ms',
      } as ViewStyle)
    : undefined;
