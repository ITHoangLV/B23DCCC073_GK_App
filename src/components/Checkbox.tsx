import React from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import { colors, radius } from '../theme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
}

/**
 * Checkbox tùy biến bằng Pressable theo đúng yêu cầu đề thi (CẤM thư viện ngoài)
 */
const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 22,
  disabled = false,
}) => {
  return (
    <Pressable
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        { width: size, height: size },
        checked ? styles.checkedContainer : styles.uncheckedContainer,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      {checked && (
        <Text style={[styles.checkmark, { fontSize: size * 0.65 }]}>✓</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xs + 2,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedContainer: {
    borderColor: colors.checkboxBorder,
    backgroundColor: colors.white,
  },
  checkedContainer: {
    borderColor: colors.checkboxActive,
    backgroundColor: colors.checkboxActive,
  },
  checkmark: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export default React.memo(Checkbox);
