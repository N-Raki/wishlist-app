import { StyleSheet, View } from 'react-native';
import { useColors } from '@/theme/useColors';

/** A hairline that sets a group apart, such as destructive actions below the others. */
export function Divider() {
  const colors = useColors();
  return <View aria-hidden style={[styles.line, { backgroundColor: colors.hairline }]} />;
}

const styles = StyleSheet.create({
  line: { height: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
});
