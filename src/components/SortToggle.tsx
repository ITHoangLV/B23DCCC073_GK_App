import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { SortOption } from '../types';

interface SortToggleProps {
  sortBy: SortOption;
  onToggleSort: () => void;
}

const SortToggle: React.FC<SortToggleProps> = ({ sortBy, onToggleSort }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sắp xếp:</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={onToggleSort}
        accessibilityRole="button"
        accessibilityLabel={`Đổi sắp xếp, hiện tại: ${sortBy}`}
      >
        <Text style={styles.buttonText}>{sortBy}</Text>
        <Text style={styles.arrowIcon}>⇅</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.size.small,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
    marginRight: spacing.xs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    fontSize: typography.size.caption,
    color: colors.primary,
    fontWeight: typography.weight.bold,
  },
  arrowIcon: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default React.memo(SortToggle);
