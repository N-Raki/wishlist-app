import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { contentMaxWidth, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Button } from './Button';
import { useLargeScreen } from './layout';
import { Text } from './Text';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  /** The way out, under the choices and closest to the thumb: "Cancel", "Close". */
  dismissLabel: string;
  /** While a choice is being carried out, the dialog stays open. */
  busy?: boolean;
  /** The choices, as buttons. */
  children: ReactNode;
};

/**
 * A short choice that interrupts the flow: a menu of actions, or the confirmation of something
 * that cannot be undone. Over a dimmed page, it sits at the bottom on a phone, near the thumb,
 * and in the middle of a large screen; tapping outside or the system back gesture closes it.
 */
export function Dialog({ visible, onClose, title, body, dismissLabel, busy = false, children }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const large = useLargeScreen();
  const dismiss = () => {
    if (!busy) onClose();
  };
  return (
    // On the web the modal itself is the dialog (role, aria-modal, focus trap, Escape): it takes the name.
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={dismiss}
      statusBarTranslucent
      aria-label={title}
    >
      <View style={[styles.root, large && styles.centred]}>
        <Pressable
          aria-hidden
          tabIndex={-1}
          onPress={dismiss}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
        />
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, marginBottom: insets.bottom + space.lg },
            large && styles.largeCard,
          ]}
        >
          <View style={styles.text}>
            <Text variant="heading">{title}</Text>
            {body ? <Text tone="secondary">{body}</Text> : null}
          </View>
          <View style={styles.actions}>
            {children}
            <Button variant="plain" label={dismissLabel} disabled={busy} onPress={dismiss} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', padding: space.lg },
  centred: { justifyContent: 'center' },
  card: {
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center',
    borderRadius: radius.card,
    padding: space.xl,
    gap: space.xl,
  },
  // Narrower than a page's column: a few buttons and a sentence or two.
  largeCard: { maxWidth: 440 },
  text: { gap: space.sm },
  actions: { gap: space.md },
});
