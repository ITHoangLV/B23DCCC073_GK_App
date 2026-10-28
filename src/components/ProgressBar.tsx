import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../theme';

interface ProgressBarProps {
  total?: number;
  completed?: number;
}

/**
 * Thanh tiến độ tự vẽ bằng View lồng nhau theo đúng yêu cầu đề bài
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  total = 0,
  completed = 0,
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Tiến độ thực hiện</Text>
          <Text style={styles.progressText}>
            Đã hoàn thành <Text style={styles.highlight}>{completed}</Text>/
            {total} công việc
          </Text>
        </View>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{percentage}%</Text>
        </View>
      </View>

      {/* Thanh tiến độ vẽ bằng View lồng nhau */}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.small,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  progressText: {
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  highlight: {
    fontWeight: typography.weight.bold,
    color: colors.primary,
  },
  percentBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginLeft: spacing.sm,
  },
  percentText: {
    color: colors.primary,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
  },
  track: {
    height: 10,
    backgroundColor: colors.progressBarBg,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
});

export default React.memo(ProgressBar);
