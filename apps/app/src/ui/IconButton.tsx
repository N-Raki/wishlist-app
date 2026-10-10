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

/** Round button holding a single icon, on a surface so it stays visible over any content. */
export function IconButton({ icon, label, ...props }: Props) {
  const colors = useColors();
  return (
    <Touchable
      role="button"
      aria-label={label}
      look={[styles.button, { backgroundColor: colors.surface }]}
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
  pressed: { opacity: 0.7, transform: [{ scale: 0.94 }] },
});
