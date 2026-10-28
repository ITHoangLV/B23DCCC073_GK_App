import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  helperText?: string;
}

/**
 * Ô nhập liệu chuẩn hóa có hiển thị lỗi bên dưới và đổi viền đỏ khi sai theo Câu 2
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  helperText,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const showCounter = typeof maxLength === 'number';
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <View style={styles.container}>
      {/* Tiêu đề ô nhập và bộ đếm ký tự */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
        {showCounter && (
          <Text
            style={[
              styles.counter,
              currentLength >= (maxLength ?? 0) && styles.counterLimit,
            ]}
          >
            {currentLength}/{maxLength}
          </Text>
        )}
      </View>

      {/* Khung ô nhập */}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Lỗi hiển thị ngay dưới ô nhập */}
      {error ? (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.size.small,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  required: {
    color: colors.danger,
    fontWeight: typography.weight.bold,
  },
  counter: {
    fontSize: typography.size.caption,
    color: colors.textMuted,
  },
  counterLimit: {
    color: colors.danger,
    fontWeight: typography.weight.bold,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
    backgroundColor: colors.dangerBg,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.size.caption,
    marginTop: spacing.xs,
    fontWeight: typography.weight.medium,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: typography.size.caption,
    marginTop: spacing.xs,
  },
});

export default React.memo(FormField);
