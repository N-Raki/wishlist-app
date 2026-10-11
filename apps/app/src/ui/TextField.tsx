import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { fonts, minTouchTarget, radius, space } from '@/theme/tokens';
import { useColors } from '@/theme/useColors';
import { Text } from './Text';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
  /**
   * Fields are required unless marked optional. Forms here have one or two required fields
   * and the rest optional, so the optional ones carry the mark (docs/design.md).
   */
  optional?: boolean;
};

export function TextField({ label, error, optional = false, ...props }: Props) {
  const { t } = useTranslation();
  const colors = useColors();
  const errorId = useId();
  const fullLabel = optional ? `${label} (${t('common.optional')})` : label;

  return (
    <View style={styles.field}>
      <Text variant="bodyStrong">
        {label}
        {optional ? (
          <Text variant="body" tone="secondary">
            {' '}
            ({t('common.optional')})
          </Text>
        ) : null}
      </Text>
      <TextInput
        aria-label={fullLabel}
        aria-required={!optional}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholderTextColor={colors.textSecondary}
        style={[
          styles.input,
          props.multiline && styles.multiline,
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
  multiline: { minHeight: 104, paddingVertical: space.md, textAlignVertical: 'top' },
});
