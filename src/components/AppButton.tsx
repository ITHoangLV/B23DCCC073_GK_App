import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
  disabled?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Nút bấm chuẩn hóa có hiệu ứng pressed và giao diện disabled rõ rệt theo Câu 3 & Câu 7
 */
const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  style,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${variant}`],
          styles[`textSize_${size}`],
          disabled && styles.disabledText,
        ]}
      >
        {icon ? `${icon} ` : ''}
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  secondary: {
    backgroundColor: colors.primaryLight,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  size_sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.borderLight,
    borderWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },
  text_primary: {
    color: colors.white,
  },
  text_danger: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.primary,
  },
  text_outline: {
    color: colors.textPrimary,
  },
  textSize_sm: {
    fontSize: typography.size.small,
  },
  textSize_md: {
    fontSize: typography.size.body,
  },
  disabledText: {
    color: colors.disabled,
  },
});

export default React.memo(AppButton);
