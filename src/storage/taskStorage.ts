import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEY } from '../utils/constants';
import { getRelativeDate, isOverdue } from '../utils/date';
import { Task } from '../types';

export const getInitialSeedTasks = (): Task[] => [
  {
    id: 'seed-task-1',
    title: 'Nộp báo cáo giữa kỳ môn Mobile App',
    note: 'Đóng gói mã nguồn zip nộp lên hệ thống trước hạn chót',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: getRelativeDate(-2),
    done: false,
  },
  {
    id: 'seed-task-2',
    title: 'Hoàn thành bài tập lớn React Native',
    note: 'Viết đầy đủ các chức năng quản lý kế hoạch cá nhân',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: getRelativeDate(2),
    done: false,
  },
  {
    id: 'seed-task-3',
    title: 'Họp nhóm đồ án tốt nghiệp lúc 14h',
    note: 'Thảo luận kiến trúc ứng dụng và phân chia công việc',
    category: 'Công việc',
    priority: 'Trung bình',
    dueDate: getRelativeDate(0),
    done: false,
  },
  {
    id: 'seed-task-4',
    title: 'Chạy bộ 5km công viên',
    note: 'Duy trì thể lực 3 buổi mỗi tuần',
    category: 'Sức khoẻ',
    priority: 'Thấp',
    dueDate: getRelativeDate(1),
    done: true,
  },
  {
    id: 'seed-task-5',
    title: 'Mua sách Clean Code & Thiết kế hệ thống',
    note: 'Tham khảo tài liệu chuyên ngành lập trình di động',
    category: 'Cá nhân',
    priority: 'Thấp',
    dueDate: getRelativeDate(5),
    done: false,
  },
  {
    id: 'seed-task-6',
    title: 'Khám sức khỏe tổng quát định kỳ',
    note: 'Mang theo sổ theo dõi sức khỏe và bảo hiểm y tế',
    category: 'Sức khoẻ',
    priority: 'Trung bình',
    dueDate: getRelativeDate(7),
    done: false,
  },
  {
    id: 'seed-task-7',
    title: 'Nộp học phí kỳ 2',
    note: 'Chuyển khoản qua tài khoản ngân hàng của trường',
    category: 'Học tập',
    priority: 'Cao',
    dueDate: getRelativeDate(-1),
    done: true,
  },
];

export const loadTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const jsonString = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (jsonString === null) {
      const seedTasks = getInitialSeedTasks();
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(seedTasks));
      return seedTasks;
    }

    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      const hasOverdue = parsed.some((t) => isOverdue(t.dueDate, t.done));
      if (!hasOverdue) {
        const overdueTask: Task = {
          id: `seed-overdue-${Date.now()}`,
          title: 'Nộp báo cáo giữa kỳ môn Mobile App',
          note: 'Đóng gói mã nguồn zip nộp lên hệ thống trước hạn chót',
          category: 'Học tập',
          priority: 'Cao',
          dueDate: getRelativeDate(-2),
          done: false,
        };
        const updated = [overdueTask, ...parsed];
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return parsed as Task[];
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu từ AsyncStorage:', error);
    return [];
  }
};

export const saveTasksToStorage = async (tasks: Task[]): Promise<boolean> => {
  try {
    if (!Array.isArray(tasks)) {
      return false;
    }
    const jsonString = JSON.stringify(tasks);
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    console.error('Lỗi khi ghi dữ liệu vào AsyncStorage:', error);
    return false;
  }
};

export const clearTasksStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(ASYNC_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Lỗi khi xoá AsyncStorage:', error);
    return false;
  }
};
