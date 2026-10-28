# HƯỚNG DẪN TỰ TAY LÀM LẠI APP TỪ ĐẦU (VỪA LÀM VỪA HỌC)

> **Dành cho bạn**: Tài liệu này là một lộ trình thực hành từng bước (Step-by-Step Hands-on Tutorial). Bạn chỉ cần làm theo từng bước, sau mỗi bước bạn đều có thể chạy thử để thấy ngay kết quả trực quan trên màn hình.

---

## PHẦN MỞ ĐẦU

### 1. Kết quả cuối cùng bạn sẽ đạt được
Sau khi hoàn thành bài thực hành này, bạn sẽ sở hữu một ứng dụng **Quản lý kế hoạch cá nhân** hoàn chỉnh với:
- 📱 Giao diện tông màu **Vàng Kem** ấm áp, sang trọng, tương phản cao và chuẩn trải nghiệm người dùng (UX).
- 📊 Thanh tiến độ tự động co giãn hiển thị tỷ lệ hoàn thành công việc.
- 🔍 Ô tìm kiếm thông minh không phân biệt dấu tiếng Việt.
- 🏷️ Bộ lọc 4 tab linh hoạt kèm số đếm thời gian thực (*Tất cả*, *Chưa xong*, *Đã xong*, *Quá hạn*).
- 📝 Form nhập liệu có kiểm tra ngày tháng nghiêm ngặt (chống nhập ngày quá khứ, chống ngày ảo như 31/02).
- 💾 Lưu trữ dữ liệu vĩnh viễn trên thiết bị với `AsyncStorage`.

```text
+------------------------------------------+
|  Kế Hoạch Của Tôi                        |
|                                          |
|  TIẾN ĐỘ THỰC HIỆN                 29%   |
|  Đã hoàn thành 2/7 công việc             |
|  [========-----------------------------] |
|                                          |
|  [ 🔍 Tìm kiếm theo tên công việc...   ] |
|                                          |
|  (Tất cả 7) (Chưa xong 5) (Đã xong 2)... |
|                                          |
|  Sắp xếp: [ Hạn gần nhất ⇅ ]             |
|                                          |
|  +------------------------------------+  |
|  | [ ] Nộp báo cáo giữa kỳ môn Mobile |  |
|  |     [Học tập] [Cao] 📅 26/10 [Quá hạn]|
|  +------------------------------------+  |
|  | [✓] Chạy bộ 5km công viên          |  |
|  |     [Sức khoẻ] [Thấp] 📅 29/10     |  |
|  +------------------------------------+  |
|                                     (+)  |
+------------------------------------------+
```

### 2. Kiến thức cần có trước
- Biết cú pháp cơ bản của JavaScript / TypeScript (biến, hàm, mảng, object).
- Biết cách mở cửa sổ dòng lệnh (Terminal / PowerShell).

### 3. Công cụ cần cài đặt
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
1. **Node.js** (Phiên bản khuyến nghị: LTS 18 hoặc 20 trở lên).
2. **Java Development Kit (JDK)**: Phiên bản JDK 17 hoặc 21.
3. **Android Studio**: Đã cài đặt Android SDK và tạo sẵn một máy ảo Android (AVD) hoặc có một chiếc điện thoại thật bật chế độ Gỡ lỗi USB (USB Debugging).

#### Kiểm tra các công cụ trên Terminal:
Mở PowerShell hoặc Command Prompt và gõ các lệnh sau để kiểm tra:
```bash
node -v          # Kết quả mong muốn: v18.x hoặc v20.x trở lên
npm -v           # Kết quả mong muốn: 9.x hoặc 10.x trở lên
javac -version   # Kết quả mong muốn: javac 17.x hoặc 21.x
adb devices      # Phải thấy ít nhất 1 thiết bị "device"
```

---

## BƯỚC 1: KHỞI TẠO DỰ ÁN REACT NATIVE TYPESCRIPT

Mở Terminal tại thư mục bạn muốn chứa dự án và chạy lệnh khởi tạo:

```bash
npx @react-native-community/cli init PlannerApp --template react-native-template-typescript
cd PlannerApp
```

> [!NOTE]
> Dự án sử dụng React Native CLI thuần túy (không sử dụng Expo) để đảm bảo toàn quyền can thiệp vào mã nguồn gốc Android và cấu hình build tối ưu nhất.

---

## BƯỚC 2: CÀI ĐẶT CÁC THƯ VIỆN CẦN THIẾT

Cài đặt hệ thống điều hướng màn hình và thư viện lưu trữ bộ nhớ máy:

```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
```

### Cấu hình bắt buộc cho Android:
Mở file `android/app/src/main/java/com/plannerapp/MainActivity.kt` (hoặc `.java` tùy template) và bổ sung mã cấu hình để tránh lỗi trắng màn hình khi điều hướng:

```kotlin
package com.plannerapp

import android.os.Bundle // Thêm dòng này
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String = "PlannerApp"

    // Thêm phương thức onCreate này:
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }
}
```

---

## BƯỚC 3: TẠO HỆ THỐNG KIỂU DỮ LIỆU & THEME MÀU SẮC

Tạo cấu trúc thư mục trong `src/`:
```bash
mkdir -p src/types src/theme src/utils src/storage src/context src/components src/screens src/navigation
```

### 3.1. Tạo file `src/types/index.ts`
Quy định kiểu dữ liệu cho toàn bộ ứng dụng:

```typescript
export type Category = 'Học tập' | 'Công việc' | 'Sức khoẻ' | 'Cá nhân';
export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
  id: string;
  title: string;
  note: string;
  category: Category;
  priority: Priority;
  dueDate: string; // "dd/mm/yyyy"
  done: boolean;
}

export type FilterType = 'Tất cả' | 'Chưa xong' | 'Đã xong' | 'Quá hạn';
export type SortOption = 'Hạn gần nhất' | 'Ưu tiên Cao → Thấp';

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { mode?: 'create' | 'edit'; task?: Task | null };
  TaskDetail: { taskId: string; title: string };
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
```

### 3.2. Tạo file `src/theme/colors.ts`
Bảng màu Vàng Kem thanh lịch:

```typescript
export const colors = {
  primary: '#A16207',      // Vàng hổ phách
  primaryDark: '#854D0E',
  primaryLight: '#FEF3C7', // Vàng kem nhạt
  background: '#FFFBEB',   // Nền app
  card: '#FFFFFF',
  text: '#422006',          // Nâu đậm
  textPrimary: '#422006',
  textSecondary: '#8A7355',
  textMuted: '#B8A287',
  border: '#F1E3B8',
  borderLight: '#FFFBEB',
  borderDark: '#E3CE9B',
  priorityHighBg: '#FEE2E2',
  priorityLowBg: '#DCFCE7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  warning: '#FACC15',
  warningBg: '#FEF3C7',
  success: '#22C55E',
  overdue: '#DC2626',
  overdueBg: '#FEE2E2',
  disabled: '#C4B59D',
  disabledBg: '#FEF3C7',
  checkboxBorder: '#F1E3B8',
  checkboxActive: '#A16207',
  progressBarBg: '#FEF3C7',
  shadow: '#422006',
  badgeActiveBg: 'rgba(255, 255, 255, 0.25)',
  white: '#FFFFFF',
  transparent: 'transparent',
  categoryStudy: '#A16207',
  categoryStudyBg: '#FEF3C7',
  categoryWork: '#854D0E',
  categoryWorkBg: '#FDE68A',
  categoryHealth: '#C2410C',
  categoryHealthBg: '#FFEDD5',
  categoryPersonal: '#9333EA',
  categoryPersonalBg: '#F3E8FF',
} as const;
```

### 3.3. Tạo file `src/theme/index.ts`
Xuất các quy chuẩn khoảng cách và bóng đổ:

```typescript
import { colors } from './colors';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radius = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, full: 9999 } as const;
export const typography = {
  size: { caption: 11, small: 13, body: 15, title: 17, heading: 22 },
  weight: { regular: '400' as const, medium: '500' as const, semiBold: '600' as const, bold: '700' as const },
};
export const shadows = {
  sm: { elevation: 2, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 },
  md: { elevation: 3, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  lg: { elevation: 6, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8 },
};
export { colors };
```

---

## BƯỚC 4: XÂY DỰNG TIỆN ÍCH THỜI GIAN & HẰNG SỐ

### 4.1. Tạo file `src/utils/constants.ts`
Định nghĩa các danh sách dùng chung:

```typescript
import { colors } from '../theme/colors';
import { Category, Priority, FilterType, SortOption } from '../types';

export const CATEGORIES: Category[] = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];
export const PRIORITIES: Priority[] = ['Cao', 'Trung bình', 'Thấp'];
export const PRIORITY_RANKS: Record<Priority, number> = { Cao: 0, 'Trung bình': 1, Thấp: 2 };

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
  'Học tập': { color: colors.categoryStudy, bgColor: colors.categoryStudyBg },
  'Công việc': { color: colors.categoryWork, bgColor: colors.categoryWorkBg },
  'Sức khoẻ': { color: colors.categoryHealth, bgColor: colors.categoryHealthBg },
  'Cá nhân': { color: colors.categoryPersonal, bgColor: colors.categoryPersonalBg },
};

export const PRIORITY_STYLES: Record<Priority, { color: string; bgColor: string; label: string }> = {
  Cao: { color: colors.danger, bgColor: colors.priorityHighBg, label: 'Cao' },
  'Trung bình': { color: colors.text, bgColor: colors.warning, label: 'Trung bình' },
  Thấp: { color: colors.success, bgColor: colors.priorityLowBg, label: 'Thấp' },
};

export const ASYNC_STORAGE_KEY = '@planner_tasks_v1';
```

### 4.2. Tạo file `src/utils/date.ts`
Các thuật toán xử lý ngày tháng chuẩn xác:

```typescript
import { colors } from '../theme/colors';
import { DueStatusInfo } from '../types';

export const getTodayStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

export const formatDate = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

export const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (typeof dateStr !== 'string') return null;
  const match = dateStr.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return null;

  const dateObj = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
    return null; // Ngày không có thật (vd: 31/02)
  }
  return dateObj;
};

export const isValidDateString = (dateStr: string): boolean => parseDate(dateStr) !== null;

export const diffInDays = (dateStr: string): number | null => {
  const targetDate = parseDate(dateStr);
  if (!targetDate) return null;
  const diffMs = targetDate.getTime() - getTodayStart().getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
};

export const isOverdue = (dueDateStr: string, done: boolean): boolean => {
  if (done) return false;
  const diff = diffInDays(dueDateStr);
  return diff !== null && diff < 0;
};

export const isDateBeforeToday = (dateStr: string): boolean => {
  const diff = diffInDays(dateStr);
  return diff !== null && diff < 0;
};

export const getDueStatusInfo = (dueDateStr: string, done: boolean): DueStatusInfo => {
  if (done) return { isOverdue: false, text: 'Đã hoàn thành', color: colors.primaryDark, badgeBg: colors.primaryLight };
  const diff = diffInDays(dueDateStr);
  if (diff === null) return { isOverdue: false, text: dueDateStr || 'Chưa có', color: colors.textSecondary, badgeBg: colors.borderLight };
  if (diff < 0) return { isOverdue: true, text: `Quá hạn ${Math.abs(diff)} ngày`, color: colors.overdue, badgeBg: colors.overdueBg };
  if (diff === 0) return { isOverdue: false, text: 'Hạn hôm nay', color: colors.primaryDark, badgeBg: colors.primaryLight };
  return { isOverdue: false, text: `Còn ${diff} ngày`, color: colors.primary, badgeBg: colors.primaryLight };
};

export const getRelativeDate = (offsetDays: number = 0): string => {
  const date = getTodayStart();
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
};
```

---

## BƯỚC 5: TẦNG LƯU TRỮ ASYNCSTORAGE & SEED DATA

Tạo file `src/storage/taskStorage.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE_KEY } from '../utils/constants';
import { getRelativeDate, isOverdue } from '../utils/date';
import { Task } from '../types';

export const getInitialSeedTasks = (): Task[] => [
  { id: '1', title: 'Nộp báo cáo giữa kỳ môn Mobile App', note: 'Đóng gói mã nguồn zip nộp lên hệ thống', category: 'Học tập', priority: 'Cao', dueDate: getRelativeDate(-2), done: false },
  { id: '2', title: 'Hoàn thành bài tập lớn React Native', note: 'Viết đầy đủ các chức năng quản lý kế hoạch', category: 'Học tập', priority: 'Cao', dueDate: getRelativeDate(2), done: false },
  { id: '3', title: 'Họp nhóm đồ án tốt nghiệp lúc 14h', note: 'Thảo luận kiến trúc ứng dụng', category: 'Công việc', priority: 'Trung bình', dueDate: getRelativeDate(0), done: false },
  { id: '4', title: 'Chạy bộ 5km công viên', note: 'Duy trì thể lực 3 buổi mỗi tuần', category: 'Sức khoẻ', priority: 'Thấp', dueDate: getRelativeDate(1), done: true },
  { id: '5', title: 'Mua sách Clean Code & Thiết kế hệ thống', note: 'Tham khảo tài liệu chuyên ngành', category: 'Cá nhân', priority: 'Thấp', dueDate: getRelativeDate(5), done: false },
  { id: '6', title: 'Khám sức khỏe tổng quát định kỳ', note: 'Mang theo sổ theo dõi sức khỏe', category: 'Sức khoẻ', priority: 'Trung bình', dueDate: getRelativeDate(7), done: false },
  { id: '7', title: 'Nộp học phí kỳ 2', note: 'Chuyển khoản qua ngân hàng', category: 'Học tập', priority: 'Cao', dueDate: getRelativeDate(-1), done: true },
];

export const loadTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const jsonString = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    if (jsonString === null) {
      const seed = getInitialSeedTasks();
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      const hasOverdue = parsed.some((t) => isOverdue(t.dueDate, t.done));
      if (!hasOverdue) {
        const overdueTask: Task = {
          id: `seed-overdue-${Date.now()}`,
          title: 'Nộp báo cáo giữa kỳ môn Mobile App',
          note: 'Hạn nộp báo cáo quá hạn cần hoàn thành gấp',
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
    return [];
  }
};

export const saveTasksToStorage = async (tasks: Task[]): Promise<boolean> => {
  try {
    if (!Array.isArray(tasks)) return false;
    await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
};
```

---

## BƯỚC 6: XÂY DỰNG TRẠM TRUNG CHUYỂN DỮ LIỆU (TASK CONTEXT)

Tạo file `src/context/TaskContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loadTasksFromStorage, saveTasksToStorage, getInitialSeedTasks } from '../storage/taskStorage';
import { Task } from '../types';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (data: Omit<Task, 'id' | 'done'>) => Promise<Task | null>;
  updateTask: (task: Partial<Task> & { id: string }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleDone: (id: string) => Promise<void>;
  deleteDone: () => Promise<number>;
  resetToSeedData: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    loadTasksFromStorage().then((loaded) => {
      if (isMounted) {
        setTasks(loaded);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const addTask = useCallback(async (data: Omit<Task, 'id' | 'done'>) => {
    if (!data.title) return null;
    const newTask: Task = {
      id: `${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: data.title.trim(),
      note: (data.note || '').trim(),
      category: data.category || 'Học tập',
      priority: data.priority || 'Trung bình',
      dueDate: data.dueDate || '',
      done: false,
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasksToStorage(updated);
      return updated;
    });
    return newTask;
  }, []);

  const updateTask = useCallback(async (taskUpdate: Partial<Task> & { id: string }) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskUpdate.id ? { ...t, ...taskUpdate } : t));
      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  const toggleDone = useCallback(async (id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasksToStorage(updated);
      return updated;
    });
  }, []);

  const deleteDone = useCallback(async () => {
    let count = 0;
    setTasks((prev) => {
      count = prev.filter((t) => t.done).length;
      const updated = prev.filter((t) => !t.done);
      saveTasksToStorage(updated);
      return updated;
    });
    return count;
  }, []);

  const resetToSeedData = useCallback(async () => {
    const seed = getInitialSeedTasks();
    await saveTasksToStorage(seed);
    setTasks(seed);
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, loading, addTask, updateTask, deleteTask, toggleDone, deleteDone, resetToSeedData }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext phải nằm trong TaskProvider');
  return ctx;
};
```

---

## BƯỚC 7: CÁC COMPONENT GIAO DIỆN (COMPONENTS)

Sao chép mã nguồn của các components đã giải thích ở `GIAI_THICH_CODE.md` vào thư mục `src/components/`:
- `AppButton.tsx`: Nút bấm tái sử dụng
- `Checkbox.tsx`: Ô tick tùy chỉnh
- `CategoryBadge.tsx`: Nhãn danh mục
- `PriorityBadge.tsx`: Nhãn mức ưu tiên
- `ProgressBar.tsx`: Thanh tiến độ
- `SearchBox.tsx`: Khung tìm kiếm
- `FilterBar.tsx`: Bộ lọc 4 tab
- `SortToggle.tsx`: Nút đổi sắp xếp
- `TaskItem.tsx`: Thẻ công việc
- `EmptyState.tsx`: Trạng thái rỗng

---

## BƯỚC 8: GHÉP CÁC MÀN HÌNH (SCREENS)

Sao chép mã nguồn của 3 màn hình vào thư mục `src/screens/`:
1. `TaskListScreen.tsx`: Màn hình danh sách công việc.
2. `TaskFormScreen.tsx`: Màn hình form thêm mới và chỉnh sửa.
3. `TaskDetailScreen.tsx`: Màn hình chi tiết công việc.

---

## BƯỚC 9: KẾT NỐI VÀ CHẠY ỨNG DỤNG

### 9.1. Tạo `src/navigation/AppNavigator.tsx`
Cấu hình Stack Navigation kết nối các màn hình:

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { colors, typography } from '../theme';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontSize: typography.size.title, fontWeight: typography.weight.bold },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Kế Hoạch Của Tôi' }} />
      <Stack.Screen name="TaskForm" component={TaskFormScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Chi Tiết Công Việc' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
```

### 9.2. Cập nhật `App.tsx`
Bọc toàn bộ app bên trong `SafeAreaProvider` và `TaskProvider`:

```typescript
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/TaskContext';

const App: React.FC = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" />
    <TaskProvider>
      <AppNavigator />
    </TaskProvider>
  </SafeAreaProvider>
);

export default App;
```

---

## BƯỚC 10: KIỂM TRA LỖI & CHẠY TRÊN THIẾT BỊ

### 10.1. Kiểm tra mã nguồn TypeScript và ESLint:
Chạy hai lệnh sau trong Terminal để đảm bảo code sạch 100% không có lỗi cú pháp hay kiểu dữ liệu:
```bash
npx tsc --noEmit
npx eslint .
```

### 10.2. Chạy ứng dụng trên Android:
Mở máy ảo Android hoặc cắm dây cáp điện thoại thật, sau đó gõ lệnh:
```bash
npx react-native run-android
```

Ứng dụng sẽ tự động biên dịch mã nguồn, cài đặt file APK lên máy và khởi chạy. Hãy tận hưởng thành quả của bạn! 🎉

---

## BƯỚC 11: ĐÓNG GÓI BÀI NỘP (DÀNH CHO KỲ THI)

Trước khi nén nộp bài, bạn cần dọn dẹp các thư mục rác (như `node_modules` và thư mục `build` của Android có dung lượng lên đến vài GB):

Mở PowerShell tại thư mục gốc của dự án và chạy các lệnh:
```powershell
# 1. Dọn dẹp bản build của Gradle
cd android
./gradlew clean
cd ..

# 2. Xóa các thư mục build tạm nếu còn sót
if (Test-Path android\build) { Remove-Item -Recurse -Force android\build }
if (Test-Path android\app\build) { Remove-Item -Recurse -Force android\app\build }

# 3. Nén mã nguồn thành file zip nộp bài (loại trừ node_modules và .git)
cd ..
$source = "PlannerApp"
$zipOut = "HoTen_MaSinhVien_DeX.zip"
Get-ChildItem -Path $source -Exclude "node_modules", "build", ".git" | Compress-Archive -DestinationPath $zipOut -Force
```

File nén tạo ra sẽ cực kỳ nhỏ gọn (chỉ vài trăm KB đến vài MB), đầy đủ toàn bộ mã nguồn sạch đẹp để nộp lên hệ thống chấm thi!
