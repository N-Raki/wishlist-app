import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, type KeyboardEvent, LayoutAnimation, Platform, type View } from 'react-native';

/**
 * How much of `ref`'s view the keyboard covers.
 *
 * React Native's KeyboardAvoidingView compares its position within its parent with the
 * keyboard's position on screen, so it misses by the height of the header, and by more in a
 * sheet: the keyboard covered the bottom of every form. Call `remeasure` from the view's
 * `onLayout`, so a window that resizes for the keyboard itself (some Android setups) counts too.
 */
export function useKeyboardOverlap(ref: RefObject<View | null>) {
  const [overlap, setOverlap] = useState(0);
  const keyboardTop = useRef<number | null>(null);

  const remeasure = useCallback(() => {
    const top = keyboardTop.current;
    if (top === null) {
      setOverlap(0);
      return;
    }
    // On iOS, a page's position in the window misses the offset of the sheet it is in (the
    // sheet is placed natively). Every page reaches the bottom of the screen, though, so the
    // keyboard covers all of its own height there.
    if (Platform.OS === 'ios') {
      setOverlap(Math.max(0, Dimensions.get('window').height - top));
      return;
    }
    ref.current?.measureInWindow((_x, y, _width, height) => setOverlap(Math.max(0, y + height - top)));
  }, [ref]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const follow = (event: KeyboardEvent, visible: boolean) => {
      // Move with the keyboard rather than jump once it has settled.
      if (event.duration) {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(event.duration, LayoutAnimation.Types.keyboard, LayoutAnimation.Properties.opacity),
        );
      }
      keyboardTop.current = visible ? event.endCoordinates.screenY : null;
      remeasure();
    };
    // iOS announces the keyboard before it moves, Android once it is there. On iOS, the
    // suggestion bar can grow the keyboard after it has shown: its every frame counts.
    const ios = Platform.OS === 'ios';
    const subscriptions = [
      Keyboard.addListener(ios ? 'keyboardWillChangeFrame' : 'keyboardDidShow', (event) => follow(event, true)),
      Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', (event) => follow(event, false)),
    ];
    return () => {
      for (const subscription of subscriptions) subscription.remove();
    };
  }, [remeasure]);

  return { overlap, remeasure };
}
