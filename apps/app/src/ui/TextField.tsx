import { useId } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Text } from './Text';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
};

export function TextField({ label, error, ...props }: Props) {
  const colors = useColors();
  const errorId = useId();

  return (
    <View style={styles.field}>
      <Text variant="bodyStrong">{label}</Text>
      <TextInput
        aria-label={label}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
        {...props}
      />
      {error ? (
        <Text nativeID={errorId} role="alert" variant="caption" style={{ color: colors.danger }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.sm },
  input: {
    minHeight: minTouchTarget + 8,
    paddingHorizontal: space.lg,
    borderRadius: radius.field,
    borderWidth: 1.5,
    fontFamily: fonts.regular,
    fontSize: 17,
  },
});
