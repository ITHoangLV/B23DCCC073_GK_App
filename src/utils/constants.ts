import { colors } from '../theme/colors';
import { Category, Priority, FilterType, SortOption } from '../types';

export const CATEGORIES: Category[] = [
  'Học tập',
  'Công việc',
  'Sức khoẻ',
  'Cá nhân',
];

export const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];

export const PRIORITY_RANKS: Record<Priority, number> = {
  Cao: 0,
  'Trung bình': 1,
  Thấp: 2,
};

export const FILTERS: Record<'ALL' | 'PENDING' | 'COMPLETED' | 'OVERDUE', FilterType> = {
  ALL: 'Tất cả',
  PENDING: 'Chưa xong',
  COMPLETED: 'Đã xong',
  OVERDUE: 'Quá hạn',
};

export const SORT_OPTIONS: Record<'DUE_DATE' | 'PRIORITY', SortOption> = {
  DUE_DATE: 'Hạn gần nhất',
  PRIORITY: 'Ưu tiên Cao → Thấp',
};

export const CATEGORY_STYLES: Record<Category, { color: string; bgColor: string }> = {
  'Học tập': {
    color: colors.categoryStudy,
    bgColor: colors.categoryStudyBg,
  },
  'Công việc': {
    color: colors.categoryWork,
    bgColor: colors.categoryWorkBg,
  },
  'Sức khoẻ': {
    color: colors.categoryHealth,
    bgColor: colors.categoryHealthBg,
  },
  'Cá nhân': {
    color: colors.categoryPersonal,
    bgColor: colors.categoryPersonalBg,
  },
};

export const PRIORITY_STYLES: Record<
  Priority,
  { color: string; bgColor: string; label: string }
> = {
  Cao: {
    color: colors.danger,
    bgColor: colors.priorityHighBg,
    label: 'Cao',
  },
  'Trung bình': {
    color: colors.text, // Chữ nâu đậm theo Yêu cầu 4
    bgColor: colors.warning, // Nền vàng warning theo Yêu cầu 4
    label: 'Trung bình',
  },
  Thấp: {
    color: colors.success, // Màu xanh theo đề bài
    bgColor: colors.priorityLowBg,
    label: 'Thấp',
  },
};

export const ASYNC_STORAGE_KEY = '@planner_tasks_v1';
