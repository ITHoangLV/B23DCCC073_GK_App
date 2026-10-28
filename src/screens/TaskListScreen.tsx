import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import AppButton from '../components/AppButton';
import SearchBox from '../components/SearchBox';
import FilterBar from '../components/FilterBar';
import SortToggle from '../components/SortToggle';
import { FILTERS, SORT_OPTIONS, PRIORITY_RANKS } from '../utils/constants';
import { parseDate, isOverdue } from '../utils/date';
import { colors, spacing, typography, shadows } from '../theme';
import { FilterType, SortOption, Task, RootStackParamList } from '../types';

type TaskListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskList'
>;

interface TaskListScreenProps {
  navigation: TaskListNavigationProp;
}

/**
 * Hàm chuẩn hoá chuỗi tiếng Việt để tìm kiếm không dấu
 */
const normalizeVietnamese = (str: string): string => {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
};

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const {
    tasks,
    loading,
    toggleDone,
    deleteTask,
    deleteDone,
    resetToSeedData,
  } = useTaskContext();

  // State cho Lọc, Tìm kiếm, Sắp xếp (Câu 5)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(FILTERS.ALL);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS.DUE_DATE);

  // Đếm số lượng công việc cho từng tab lọc
  const counts = useMemo(() => {
    const all = tasks.length;
    const pending = tasks.filter((t) => !t.done).length;
    const completed = tasks.filter((t) => t.done).length;
    const overdue = tasks.filter(
      (t) => !t.done && isOverdue(t.dueDate, t.done)
    ).length;
    return { all, pending, completed, overdue };
  }, [tasks]);

  // Thanh tiến độ LUÔN tính trên TOÀN BỘ danh sách theo đúng yêu cầu đề bài
  const totalTasks = tasks.length;
  const totalCompleted = counts.completed;

  // Xử lý Lọc + Tìm kiếm + Sắp xếp HOẠT ĐỘNG ĐỒNG THỜI bằng useMemo
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // 1. Lọc theo trạng thái
    if (selectedFilter === FILTERS.PENDING) {
      result = result.filter((t) => !t.done);
    } else if (selectedFilter === FILTERS.COMPLETED) {
      result = result.filter((t) => t.done);
    } else if (selectedFilter === FILTERS.OVERDUE) {
      result = result.filter((t) => !t.done && isOverdue(t.dueDate, t.done));
    }

    // 2. Tìm kiếm theo tên (không phân biệt hoa/thường, hỗ trợ cả có dấu và không dấu)
    const cleanQuery = searchQuery.trim();
    if (cleanQuery) {
      const normalizedQuery = normalizeVietnamese(cleanQuery);
      result = result.filter((t) => {
        const normalizedTitle = normalizeVietnamese(t.title);
        return (
          normalizedTitle.includes(normalizedQuery) ||
          t.title.toLowerCase().includes(cleanQuery.toLowerCase())
        );
      });
    }

    // 3. Sắp xếp: theo hạn (gần nhất lên đầu) hoặc theo ưu tiên (Cao → Thấp)
    result.sort((a, b) => {
      if (sortBy === SORT_OPTIONS.DUE_DATE) {
        // Sắp xếp theo hạn gần nhất
        const dateA = parseDate(a.dueDate)?.getTime() ?? Infinity;
        const dateB = parseDate(b.dueDate)?.getTime() ?? Infinity;
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        // Khi hạn bằng nhau: xếp tiếp theo ưu tiên (Cao -> Thấp)
        const rankA = PRIORITY_RANKS[a.priority] ?? 1;
        const rankB = PRIORITY_RANKS[b.priority] ?? 1;
        return rankA - rankB;
      } else {
        // Sắp xếp theo ưu tiên: Cao = 0, Trung bình = 1, Thấp = 2
        const rankA = PRIORITY_RANKS[a.priority] ?? 1;
        const rankB = PRIORITY_RANKS[b.priority] ?? 1;
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        // Khi mức ưu tiên bằng nhau: xếp tiếp theo hạn gần nhất
        const dateA = parseDate(a.dueDate)?.getTime() ?? Infinity;
        const dateB = parseDate(b.dueDate)?.getTime() ?? Infinity;
        return dateA - dateB;
      }
    });

    return result;
  }, [tasks, selectedFilter, searchQuery, sortBy]);

  // Chuyển đổi giữa 2 chế độ sắp xếp
  const handleToggleSort = () => {
    setSortBy((prev) =>
      prev === SORT_OPTIONS.DUE_DATE
        ? SORT_OPTIONS.PRIORITY
        : SORT_OPTIONS.DUE_DATE
    );
  };

  const handlePressTask = (task: Task) => {
    navigation.navigate('TaskDetail', {
      taskId: task.id,
      title: task.title,
    });
  };

  const handleAddNewTask = () => {
    navigation.navigate('TaskForm', { mode: 'create' });
  };

  const handleLongPressTask = (task: Task) => {
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá công việc "${task.title}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá ngay',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  const handleDeleteCompleted = () => {
    if (totalCompleted === 0) {
      return;
    }

    Alert.alert(
      'Xoá việc đã hoàn thành',
      `Bạn có chắc chắn muốn xoá toàn bộ ${totalCompleted} công việc đã hoàn thành không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: `Xoá ${totalCompleted} việc`,
          style: 'destructive',
          onPress: async () => {
            const count = await deleteDone();
            Alert.alert(
              'Thành công',
              `Đã xoá ${count} công việc đã hoàn thành!`
            );
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndSortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleDone={toggleDone}
            onPress={() => handlePressTask(item)}
            onLongPress={() => handleLongPressTask(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            {/* Thanh tiến độ Câu 1 (tính trên TOÀN BỘ danh sách) */}
            <ProgressBar total={totalTasks} completed={totalCompleted} />

            {/* Ô tìm kiếm không phân biệt hoa/thường (Câu 5) */}
            <SearchBox
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />

            {/* Hàng nút lọc: Tất cả / Chưa xong / Đã xong / Quá hạn (Câu 5) */}
            <FilterBar
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
              counts={counts}
            />

            {/* Hàng điều khiển Sắp xếp & Nút xoá hoàn thành (Câu 3 & Câu 5) */}
            <View style={styles.sortAndActionBar}>
              <SortToggle sortBy={sortBy} onToggleSort={handleToggleSort} />

              <AppButton
                title={
                  totalCompleted > 0
                    ? `Xoá đã xong (${totalCompleted})`
                    : 'Xoá đã xong'
                }
                icon="🗑️"
                variant="danger"
                size="sm"
                disabled={totalCompleted === 0}
                onPress={handleDeleteCompleted}
              />
            </View>

            {/* Tiêu đề danh sách & số lượng kết quả */}
            <View style={styles.resultsCountRow}>
              <Text style={styles.resultsCountText}>
                Hiển thị {filteredAndSortedTasks.length} / {tasks.length} công việc
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          tasks.length === 0 ? (
            <EmptyState
              title="Chưa có công việc nào"
              message="Hãy bắt đầu tạo kế hoạch mới hoặc khôi phục dữ liệu mẫu."
              buttonText="Khôi phục dữ liệu mẫu"
              onPressButton={resetToSeedData}
            />
          ) : (
            <EmptyState
              title="Không tìm thấy kết quả"
              message="Không có công việc nào khớp với bộ lọc hoặc từ khoá tìm kiếm của bạn."
            />
          )
        }
      />

      {/* Nút bấm nổi FAB "+ Thêm việc" */}
      <Pressable
        style={({ pressed }) => [
          styles.fabButton,
          pressed && styles.fabPressed,
        ]}
        onPress={handleAddNewTask}
        accessibilityLabel="Thêm công việc mới"
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.size.body,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 90,
  },
  headerContainer: {
    marginBottom: spacing.xs,
  },
  sortAndActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  resultsCountRow: {
    marginBottom: spacing.xs + 2,
    marginTop: 2,
  },
  resultsCountText: {
    fontSize: typography.size.caption,
    color: colors.textMuted,
    fontWeight: typography.weight.medium,
  },
  fabButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  fabIcon: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '300',
    marginTop: -2,
  },
});

export default TaskListScreen;
