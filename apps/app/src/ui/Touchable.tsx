import { useState } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  /** The resting look. Not named `style`: see below. */
  look?: StyleProp<ViewStyle>;
  /** Added while pressed: the feedback starts on touch-down, not on release. */
  pressedLook?: StyleProp<ViewStyle>;
  style?: ViewStyle;
};

/**
 * A Pressable that can sit inside `<Link asChild>`. The link merges its own `style` into its
 * child's by spreading objects, which breaks on style arrays and drops style functions on the
 * web; keeping the look in its own props leaves `style` to the link.
 */
export function Touchable({ look, pressedLook, style, onPressIn, onPressOut, ...props }: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      style={[look, pressed && pressedLook, style]}
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      {...props}
    />
  );
}
