import { type PressableProps, StyleSheet } from 'react-native';
import { minTouchTarget, radius } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { useLargeScreen } from './layout';
import { Touchable } from './Touchable';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  icon: IconName;
  /** The button's name, read by assistive technologies: an icon alone says nothing. */
  label: string;
  /** Shown next to the icon on large screens (docs/design.md, "Grands écrans"), within `label`. */
  visibleLabel?: string;
};

/**
 * Button in a header. On a phone, the icon alone, with no background of its own, like the
 * native back button: iOS 26 already sets each header button on its "Liquid Glass", and a
 * second surface showed through it. On a large screen, there is room to say what it does.
 */
export function HeaderButton({ icon, label, visibleLabel, ...props }: Props) {
  const colors = useColors();
  const large = useLargeScreen();
  if (visibleLabel && large) {
    return <Button variant="secondary" size="compact" icon={icon} label={visibleLabel} aria-label={label} {...props} />;
  }
  return (
    <Touchable
      role="button"
      aria-label={label}
      look={styles.button}
      hoveredLook={{ backgroundColor: colors.surfaceMuted }}
      pressedLook={styles.pressed}
      {...props}
    >
      <Icon name={icon} color={colors.text} />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: minTouchTarget,
    height: minTouchTarget,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.5 },
});
