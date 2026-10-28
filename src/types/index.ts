export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';

export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string; // dd/mm/yyyy
  done: boolean;
}

export type FilterType = 'Tất cả' | 'Chưa xong' | 'Đã xong' | 'Quá hạn';

export type SortOption = 'Hạn gần nhất' | 'Ưu tiên Cao → Thấp';

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: {
    mode?: 'create' | 'edit';
    task?: Task | null;
  };
  TaskDetail: {
    taskId: string;
    title: string;
  };
};

export interface DueStatusInfo {
  isOverdue: boolean;
  text: string;
  color: string;
  badgeBg: string;
}

export interface TaskCounts {
  all: number;
  pending: number;
  completed: number;
  overdue: number;
}
