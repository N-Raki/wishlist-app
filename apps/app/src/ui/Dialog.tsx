import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Text } from './Text';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  /** The choices, as buttons; the last one is closest to the thumb. */
  children: ReactNode;
};

/**
 * A short choice that interrupts the flow: a menu of actions, or the confirmation of something
 * that cannot be undone. Rises from the bottom over a dimmed page; tapping outside or the
 * system back gesture closes it.
 */
export function Dialog({ visible, onClose, title, body, children }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    // On the web the modal itself is the dialog (role, aria-modal, focus trap, Escape): it takes the name.
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      aria-label={title}
    >
      <View style={styles.root}>
        <Pressable
          aria-hidden
          tabIndex={-1}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
        />
        <View style={[styles.card, { backgroundColor: colors.surface, marginBottom: insets.bottom + space.lg }]}>
          <View style={styles.text}>
            <Text variant="heading">{title}</Text>
            {body ? <Text tone="secondary">{body}</Text> : null}
          </View>
          <View style={styles.actions}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', padding: space.lg },
  card: {
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    borderRadius: radius.card,
    padding: space.xl,
    gap: space.xl,
  },
  text: { gap: space.sm },
  actions: { gap: space.md },
});
