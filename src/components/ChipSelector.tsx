import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface ChipSelectorProps<T extends string> {
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  getColorConfig?: (value: T) => { color: string; bgColor: string } | undefined;
}

/**
 * Bộ nút bấm chọn (ChipSelector) dùng cho Danh mục & Mức ưu tiên theo đúng Câu 2
 */
function ChipSelector<T extends string>({
  options = [],
  selectedValue,
  onSelect,
  getColorConfig,
}: ChipSelectorProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedValue === option;
        const colorConfig = getColorConfig ? getColorConfig(option) : null;

        const activeBgColor = colorConfig?.bgColor || colors.primaryLight;
        const activeTextColor = colorConfig?.color || colors.primary;
        const activeBorderColor = colorConfig?.color || colors.primary;

        return (
          <Pressable
            key={option}
            style={({ pressed }) => [
              styles.chip,
              isSelected
                ? {
                    backgroundColor: activeBgColor,
                    borderColor: activeBorderColor,
                    borderWidth: 1.5,
                  }
                : styles.chipInactive,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onSelect(option)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              style={[
                styles.chipText,
                isSelected
                  ? { color: activeTextColor, fontWeight: typography.weight.bold }
                  : styles.chipTextInactive,
              ]}
            >
              {isSelected ? `✓ ${option}` : option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  chipPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    fontSize: typography.size.small,
  },
  chipTextInactive: {
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
});

export default React.memo(ChipSelector) as typeof ChipSelector;
