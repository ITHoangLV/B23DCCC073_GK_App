import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  getInitialSeedTasks,
} from '../storage/taskStorage';
import { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (taskData: Omit<Task, 'id' | 'done'>) => Promise<Task | null>;
  updateTask: (updatedTask: Partial<Task> & { id: string }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  deleteDone: () => Promise<number>;
  resetToSeedData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Nạp dữ liệu khi khởi động app
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      setLoading(true);
      const loaded = await loadTasksFromStorage();
      if (isMounted) {
        setTasks(loaded);
        setLoading(false);
      }
    };
    initData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Thêm một công việc mới
  const addTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'done'>): Promise<Task | null> => {
      if (!taskData || !taskData.title) {
        return null;
      }

      const newTask: Task = {
        id: `${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        title: taskData.title.trim(),
        note: (taskData.note || '').trim(),
        category: taskData.category || 'Học tập',
        priority: taskData.priority || 'Trung bình',
        dueDate: taskData.dueDate || '',
        done: false,
      };

      setTasks((prevTasks) => {
        const updated = [newTask, ...prevTasks];
        saveTasksToStorage(updated);
        return updated;
      });

      return newTask;
    },
    []
  );

  // Cập nhật công việc
  const updateTask = useCallback(
    async (updatedTask: Partial<Task> & { id: string }): Promise<void> => {
      if (!updatedTask || !updatedTask.id) {
        return;
      }

      setTasks((prevTasks) => {
        const updated = prevTasks.map((item) =>
          item.id === updatedTask.id
            ? {
                ...item,
                ...updatedTask,
                title: updatedTask.title?.trim() || item.title,
                note:
                  updatedTask.note !== undefined
                    ? updatedTask.note.trim()
                    : item.note,
              }
            : item
        );
        saveTasksToStorage(updated);
        return updated;
      });
    },
    []
  );

  // Đổi trạng thái hoàn thành (Checkbox)
  const toggleDone = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      return;
    }

    setTasks((prevTasks) => {
      const updated = prevTasks.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      );
      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  // Xoá một công việc theo id
  const deleteTask = useCallback(async (id: string): Promise<void> => {
    if (!id) {
      return;
    }

    setTasks((prevTasks) => {
      const updated = prevTasks.filter((item) => item.id !== id);
      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  // Xoá tất cả việc đã hoàn thành
  const deleteDone = useCallback(async (): Promise<number> => {
    let deletedCount = 0;
    setTasks((prevTasks) => {
      const doneItems = prevTasks.filter((item) => item.done);
      deletedCount = doneItems.length;
      const updated = prevTasks.filter((item) => !item.done);
      saveTasksToStorage(updated);
      return updated;
    });
    return deletedCount;
  }, []);

  // Khôi phục lại dữ liệu mẫu (tiện ích hỗ trợ kiểm thử / demo)
  const resetToSeedData = useCallback(async (): Promise<void> => {
    const seed = getInitialSeedTasks();
    await saveTasksToStorage(seed);
    setTasks(seed);
  }, []);

  const value: TaskContextType = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    deleteDone,
    resetToSeedData,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom Hook để sử dụng context tiện lợi và an toàn
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext phải được sử dụng bên trong TaskProvider');
  }
  return context;
};
