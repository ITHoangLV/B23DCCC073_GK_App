import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Checkbox from './Checkbox';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { isOverdue } from '../utils/date';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleDone: (id: string) => void;
  onPress: () => void;
  onLongPress: () => void;
}

/**
 * Thẻ công việc (TaskItem dạng Card bo góc, có đổ bóng)
 * - Tên, danh mục, hạn hoàn thành, nhãn mức ưu tiên (đỏ/vàng/xanh)
 * - Checkbox bằng Pressable
 * - Việc đã xong: tên gạch ngang và toàn bộ thẻ mờ đi
 * - Cảnh báo nhãn đỏ "Quá hạn" khi việc chưa xong và qua hạn
 */
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleDone,
  onPress,
  onLongPress,
}) => {
  if (!task) {
    return null;
  }

  const overdue = isOverdue(task.dueDate, task.done);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        task.done && styles.cardDone,
        overdue && !task.done && styles.cardOverdue,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={400}
      android_ripple={{ color: colors.borderLight }}
    >
      <View style={styles.contentRow}>
        {/* Checkbox tự vẽ bằng Pressable */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            checked={!!task.done}
            onToggle={() => onToggleDone(task.id)}
            size={22}
          />
        </View>

        {/* Thông tin chính */}
        <View style={styles.infoContainer}>
          <Text
            style={[styles.title, task.done && styles.titleDone]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Dòng meta: Danh mục, Mức ưu tiên, Ngày hạn, Quá hạn */}
          <View style={styles.badgeRow}>
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />

            <View style={styles.dateWrapper}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text
                style={[
                  styles.dueDateText,
                  overdue && !task.done && styles.dueDateOverdue,
                ]}
              >
                {task.dueDate || 'Chưa có'}
              </Text>
            </View>

            {/* Nhãn Quá hạn màu đỏ khi chưa xong */}
            {overdue && !task.done && (
              <View style={styles.overdueBadge}>
                <Text style={styles.overdueText}>Quá hạn</Text>
              </View>
            )}
          </View>

          {/* Ghi chú phụ nếu có */}
          {!!task.note && (
            <Text
              style={[styles.note, task.done && styles.noteDone]}
              numberOfLines={1}
            >
              {task.note}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardDone: {
    opacity: 0.6,
    backgroundColor: colors.background,
    borderColor: colors.borderLight,
  },
  cardOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: colors.overdue,
  },
  cardPressed: {
    opacity: 0.85,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    paddingTop: 2,
    marginRight: spacing.sm,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
    lineHeight: 21,
    marginBottom: spacing.xs,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  dateIcon: {
    fontSize: 11,
    marginRight: 2,
  },
  dueDateText: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  dueDateOverdue: {
    color: colors.overdue,
    fontWeight: typography.weight.bold,
  },
  overdueBadge: {
    backgroundColor: colors.overdueBg,
    borderColor: colors.overdue,
    borderWidth: 1,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
    borderRadius: radius.xs,
  },
  overdueText: {
    fontSize: typography.size.caption,
    color: colors.overdue,
    fontWeight: typography.weight.bold,
  },
  note: {
    fontSize: typography.size.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  noteDone: {
    color: colors.disabled,
  },
});

export default React.memo(TaskItem);
