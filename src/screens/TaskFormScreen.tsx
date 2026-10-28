import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTaskContext } from '../context/TaskContext';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import {
  isValidDateString,
  isDateBeforeToday,
  getRelativeDate,
} from '../utils/date';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { RootStackParamList, Category, Priority } from '../types';

type TaskFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TaskForm'
>;

interface FormErrors {
  title?: string;
  dueDate?: string;
}

const TaskFormScreen: React.FC<TaskFormScreenProps> = ({
  navigation,
  route,
}) => {
  const { addTask, updateTask } = useTaskContext();

  const mode = route?.params?.mode || 'create';
  const initialTask = route?.params?.task || null;
  const isEditing = mode === 'edit' && !!initialTask;

  const [title, setTitle] = useState<string>(initialTask?.title || '');
  const [note, setNote] = useState<string>(initialTask?.note || '');
  const [category, setCategory] = useState<Category>(
    initialTask?.category || CATEGORIES[0]
  );
  const [priority, setPriority] = useState<Priority>(
    initialTask?.priority || PRIORITIES[1]
  );
  const [dueDate, setDueDate] = useState<string>(
    initialTask?.dueDate || getRelativeDate(0)
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const currentErrors: FormErrors = {};

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      currentErrors.title = 'Tên công việc không được để trống';
    } else if (cleanTitle.length > 50) {
      currentErrors.title = 'Tên công việc không được vượt quá 50 ký tự';
    }

    const cleanDate = dueDate.trim();
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (!cleanDate) {
      currentErrors.dueDate = 'Hạn hoàn thành không được để trống';
    } else if (!dateRegex.test(cleanDate)) {
      currentErrors.dueDate =
        'Hạn phải đúng định dạng dd/mm/yyyy (ví dụ: 28/10/2026)';
    } else if (!isValidDateString(cleanDate)) {
      currentErrors.dueDate =
        'Ngày không có thật trên lịch (ví dụ: 31/02/2026 là ngày sai)';
    } else if (!isEditing && isDateBeforeToday(cleanDate)) {
      currentErrors.dueDate =
        'Khi thêm mới, hạn hoàn thành không được trước ngày hôm nay';
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && initialTask) {
        await updateTask({
          id: initialTask.id,
          title: title.trim(),
          note: note.trim(),
          category,
          priority,
          dueDate: dueDate.trim(),
          done: initialTask.done,
        });
        Alert.alert('Thành công', 'Đã cập nhật công việc thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addTask({
          title: title.trim(),
          note: note.trim(),
          category,
          priority,
          dueDate: dueDate.trim(),
        });
        navigation.goBack();
      }
    } catch (err) {
      console.error('Lỗi khi lưu công việc:', err);
      Alert.alert('Lỗi', 'Không thể lưu công việc. Vui lòng thử lại!');
    }
  };

  const renderCategoryChip = (cat: Category) => {
    const isSelected = category === cat;
    return (
      <Pressable
        key={cat}
        style={({ pressed }) => [
          styles.categoryChip,
          isSelected
            ? styles.categoryChipSelected
            : styles.categoryChipUnselected,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setCategory(cat)}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <Text
          style={[
            styles.categoryChipText,
            isSelected
              ? styles.categoryChipTextSelected
              : styles.categoryChipTextUnselected,
          ]}
        >
          {cat}
        </Text>
      </Pressable>
    );
  };

  const renderPriorityChip = (prio: Priority) => {
    const isSelected = priority === prio;

    let dotColor: string = colors.success;
    let activeBg: string = colors.priorityLowBg;
    let activeBorder: string = colors.success;
    let activeTextColor: string = colors.success;

    if (prio === 'Cao') {
      dotColor = colors.priorityHigh;
      activeBg = colors.priorityHighBg;
      activeBorder = colors.priorityHigh;
      activeTextColor = colors.priorityHigh;
    } else if (prio === 'Trung bình') {
      dotColor = colors.warning;
      activeBg = colors.warning;
      activeBorder = colors.primaryDark;
      activeTextColor = colors.text;
    }

    return (
      <Pressable
        key={prio}
        style={({ pressed }) => [
          styles.priorityChip,
          isSelected
            ? {
                backgroundColor: activeBg,
                borderColor: activeBorder,
                borderWidth: 1.5,
              }
            : styles.priorityChipUnselected,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setPriority(prio)}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View style={[styles.priorityDot, { backgroundColor: dotColor }]} />
        <Text
          style={[
            styles.priorityChipText,
            isSelected
              ? { color: activeTextColor, fontWeight: typography.weight.bold }
              : styles.priorityChipTextUnselected,
          ]}
        >
          {prio}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Text style={styles.backButtonIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Sửa công việc' : 'Thêm công việc'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Tên công việc <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                !!errors.title && styles.inputError,
              ]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="VD: Ôn tập chương 3"
              placeholderTextColor={colors.textMuted}
              maxLength={50}
            />
            <View style={styles.counterRow}>
              {errors.title ? (
                <Text style={styles.errorText}>⚠️ {errors.title}</Text>
              ) : (
                <View />
              )}
              <Text style={styles.counter}>{title.length}/50</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Ghi chú (không bắt buộc)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={note}
              onChangeText={setNote}
              placeholder="Thêm mô tả, đường dẫn tài liệu..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.categoryGrid}>
              <View style={styles.categoryRow}>
                {renderCategoryChip('Học tập')}
                {renderCategoryChip('Công việc')}
              </View>
              <View style={styles.categoryRow}>
                {renderCategoryChip('Sức khoẻ')}
                {renderCategoryChip('Cá nhân')}
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mức ưu tiên</Text>
            <View style={styles.priorityRow}>
              {renderPriorityChip('Cao')}
              {renderPriorityChip('Trung bình')}
              {renderPriorityChip('Thấp')}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Hạn hoàn thành <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                !!errors.dueDate && styles.inputError,
              ]}
              value={dueDate}
              onChangeText={(text) => {
                setDueDate(text);
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }
              }}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {errors.dueDate ? (
              <Text style={styles.errorText}>⚠️ {errors.dueDate}</Text>
            ) : (
              <Text style={styles.helperText}>
                {isEditing
                  ? 'Định dạng ngày/tháng/năm (dd/mm/yyyy)'
                  : `Không được trước hôm nay (${getRelativeDate(0)})`}
              </Text>
            )}
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Huỷ"
            >
              <Text style={styles.cancelButtonText}>Huỷ</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel={isEditing ? 'Lưu thay đổi' : 'Lưu công việc'}
            >
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Lưu thay đổi' : 'Lưu công việc'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'android' ? spacing.sm : spacing.xs,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  backButtonIcon: {
    fontSize: 24,
    color: colors.text,
    fontWeight: typography.weight.bold,
    marginTop: -2,
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  required: {
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
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 1.5,
    backgroundColor: colors.dangerBg,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  counter: {
    fontSize: typography.size.caption,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
    flex: 1,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: typography.size.caption,
    marginTop: spacing.xs,
  },
  categoryGrid: {
    gap: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryChip: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: typography.size.body,
  },
  categoryChipTextUnselected: {
    color: colors.text,
    fontWeight: typography.weight.medium,
  },
  categoryChipTextSelected: {
    color: colors.white,
    fontWeight: typography.weight.bold,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityChip: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityChipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityChipText: {
    fontSize: typography.size.body,
  },
  priorityChipTextUnselected: {
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: typography.size.body,
    fontWeight: typography.weight.semiBold,
  },
  submitButton: {
    flex: 1.6,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.size.body,
    fontWeight: typography.weight.bold,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default TaskFormScreen;
