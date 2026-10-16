import { type PressableProps, StyleSheet } from 'react-native';
import { minTouchTarget, radius } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Icon, type IconName } from './Icon';
import { Touchable } from './Touchable';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  icon: IconName;
  /** Read by assistive technologies: an icon alone says nothing. */
  label: string;
};

/**
 * Button holding a single icon, in a header. It draws no background of its own, like the
 * native back button: iOS 26 already sets each header button on its "Liquid Glass", and a
 * second surface showed through it.
 */
export function HeaderButton({ icon, label, ...props }: Props) {
  const colors = useColors();
  return (
    <Touchable role="button" aria-label={label} look={styles.button} pressedLook={styles.pressed} {...props}>
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
