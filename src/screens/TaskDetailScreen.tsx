import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTaskContext } from '../context/TaskContext';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import AppButton from '../components/AppButton';
import { getDueStatusInfo, isOverdue } from '../utils/date';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { RootStackParamList } from '../types';

type TaskDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TaskDetail'
>;

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { tasks, toggleDone, deleteTask } = useTaskContext();

  // Kiểm tra route.params an toàn chống crash
  const taskId = route?.params?.taskId;

  // Lấy dữ liệu công việc mới nhất từ context
  const currentTask = tasks.find((t) => t.id === taskId);

  // Xử lý an toàn nếu công việc không tồn tại (đã bị xoá hoặc params sai)
  if (!currentTask) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Không tìm thấy công việc</Text>
          <Text style={styles.errorMessage}>
            Công việc này có thể đã bị xoá hoặc không còn tồn tại trên thiết bị.
          </Text>
          <AppButton
            title="Quay lại danh sách"
            onPress={() => navigation.goBack()}
            variant="primary"
            size="md"
          />
        </View>
      </View>
    );
  }

  // Tính trạng thái hạn: "Còn 3 ngày", "Hạn hôm nay" hoặc "Quá hạn 2 ngày" (Câu 4)
  const dueInfo = getDueStatusInfo(currentTask.dueDate, currentTask.done);
  const taskIsOverdue = isOverdue(currentTask.dueDate, currentTask.done);

  // Xử lý nút Sửa
  const handleEdit = () => {
    navigation.navigate('TaskForm', {
      mode: 'edit',
      task: currentTask,
    });
  };

  // Xử lý đổi trạng thái hoàn thành
  const handleToggle = () => {
    toggleDone(currentTask.id);
  };

  // Xử lý xoá công việc có Alert xác nhận
  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${currentTask.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá ngay',
          style: 'destructive',
          onPress: () => {
            deleteTask(currentTask.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Thẻ nội dung chính */}
      <View style={styles.card}>
        {/* Hàng trạng thái hoàn thành & Cảnh báo quá hạn */}
        <View style={styles.statusHeaderRow}>
          <View
            style={[
              styles.statusPill,
              currentTask.done
                ? styles.statusPillDone
                : styles.statusPillPending,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                currentTask.done
                  ? styles.statusPillTextDone
                  : styles.statusPillTextPending,
              ]}
            >
              {currentTask.done ? '✓ Đã hoàn thành' : '⏳ Chưa hoàn thành'}
            </Text>
          </View>

          {/* Nhãn "Quá hạn" màu đỏ ở chi tiết theo đúng yêu cầu Câu 4 (chỉ khi chưa xong) */}
          {taskIsOverdue && (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueBadgeText}>Quá hạn</Text>
            </View>
          )}
        </View>

        {/* Tiêu đề công việc */}
        <Text
          style={[styles.title, currentTask.done && styles.titleDone]}
        >
          {currentTask.title}
        </Text>

        <View style={styles.divider} />

        {/* Thông tin Danh mục & Mức ưu tiên */}
        <View style={styles.metaSection}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Danh mục</Text>
            <View style={styles.badgeWrapper}>
              <CategoryBadge category={currentTask.category} />
            </View>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Mức độ ưu tiên</Text>
            <View style={styles.badgeWrapper}>
              <PriorityBadge priority={currentTask.priority} />
            </View>
          </View>
        </View>

        {/* Hạn hoàn thành & Số ngày còn lại (Câu 4) */}
        <View style={styles.dateSection}>
          <Text style={styles.metaLabel}>Hạn hoàn thành</Text>
          <View style={styles.dateBox}>
            <Text style={styles.dateValue}>📅 {currentTask.dueDate}</Text>
            {/* Hiển thị: "Còn x ngày", "Hạn hôm nay" hoặc "Quá hạn x ngày" */}
            <View
              style={[
                styles.dueDaysBadge,
                { backgroundColor: dueInfo.badgeBg },
              ]}
            >
              <Text
                style={[
                  styles.dueDaysText,
                  { color: dueInfo.color },
                ]}
              >
                {dueInfo.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Phần Ghi chú */}
        <View style={styles.noteSection}>
          <Text style={styles.metaLabel}>Ghi chú chi tiết</Text>
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              {currentTask.note ? currentTask.note : '(Không có ghi chú thêm)'}
            </Text>
          </View>
        </View>
      </View>

      {/* Các nút hành động (Câu 4) */}
      <View style={styles.actionButtonGroup}>
        {/* Nút Đổi trạng thái hoàn thành: Đổi nhãn theo trạng thái */}
        <AppButton
          title={
            currentTask.done
              ? '↩️ Đánh dấu chưa hoàn thành'
              : '✓ Đánh dấu hoàn thành'
          }
          variant={currentTask.done ? 'outline' : 'primary'}
          size="md"
          onPress={handleToggle}
        />

        {/* Nút Sửa công việc */}
        <AppButton
          title="✏️ Sửa công việc"
          variant="secondary"
          size="md"
          onPress={handleEdit}
        />

        {/* Nút Xoá công việc */}
        <AppButton
          title="🗑️ Xoá công việc này"
          variant="danger"
          size="md"
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  errorTitle: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  errorMessage: {
    fontSize: typography.size.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
    marginBottom: spacing.lg,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  statusPillPending: {
    backgroundColor: colors.primaryLight,
  },
  statusPillDone: {
    backgroundColor: colors.primaryLight,
  },
  statusPillText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
  },
  statusPillTextPending: {
    color: colors.primary,
  },
  statusPillTextDone: {
    color: colors.primaryDark,
  },
  overdueBadge: {
    backgroundColor: colors.overdueBg,
    borderColor: colors.overdue,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  overdueBadgeText: {
    color: colors.overdue,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
  },
  title: {
    fontSize: typography.size.heading,
    fontWeight: typography.weight.bold,
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: spacing.md,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: typography.size.small,
    fontWeight: typography.weight.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
  },
  dateSection: {
    marginBottom: spacing.md,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateValue: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semiBold,
    color: colors.textPrimary,
  },
  dueDaysBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  dueDaysText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
  },
  noteSection: {
    marginBottom: spacing.xs,
  },
  noteBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70,
  },
  noteText: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actionButtonGroup: {
    gap: spacing.sm,
  },
});

export default TaskDetailScreen;
