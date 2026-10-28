import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onPressButton?: () => void;
}

/**
 * Trạng thái rỗng khi danh sách không có dữ liệu
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Chưa có công việc nào',
  message = 'Hãy thêm công việc mới để bắt đầu theo dõi kế hoạch của bạn.',
  buttonText,
  onPressButton,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>📝</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {buttonText && onPressButton && (
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={onPressButton}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.size.small,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.size.small,
    fontWeight: typography.weight.bold,
  },
});

export default React.memo(EmptyState);
