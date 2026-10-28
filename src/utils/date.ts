import { colors } from '../theme/colors';
import { DueStatusInfo } from '../types';

/**
 * Lấy đối tượng Date của ngày hôm nay lúc 00:00:00.000 để so sánh chuẩn xác
 */
export const getTodayStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
};

/**
 * Format một Date object thành chuỗi dd/mm/yyyy
 * @param date
 * @returns string ví dụ "28/10/2026"
 */
export const formatDate = (date: Date | null | undefined): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Parse chuỗi dd/mm/yyyy thành Date object lúc 00:00:00.000
 * Kiểm tra tính hợp lệ thật sự của ngày (ví dụ 31/02/2026 là không hợp lệ)
 * @param dateStr
 * @returns Date hợp lệ hoặc null nếu sai
 */
export const parseDate = (dateStr: string | null | undefined): Date | null => {
  if (typeof dateStr !== 'string') {
    return null;
  }

  const trimmed = dateStr.trim();
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = trimmed.match(regex);

  if (!match) {
    return null;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Năm giới hạn hợp lý
  if (year < 1900 || year > 2100) {
    return null;
  }

  if (month < 1 || month > 12) {
    return null;
  }

  // Tạo date object và đối chiếu ngược lại để bắt lỗi như 31/02 hay 31/04
  const dateObj = new Date(year, month - 1, day, 0, 0, 0, 0);
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return null;
  }

  return dateObj;
};

/**
 * Kiểm tra chuỗi có phải dd/mm/yyyy có thật hay không
 */
export const isValidDateString = (dateStr: string): boolean => {
  return parseDate(dateStr) !== null;
};

/**
 * Tính số ngày chênh lệch giữa ngày hạn và ngày hôm nay
 * @returns > 0: còn n ngày, 0: hôm nay, < 0: quá hạn n ngày
 */
export const diffInDays = (dateStr: string): number | null => {
  const targetDate = parseDate(dateStr);
  if (!targetDate) {
    return null;
  }

  const today = getTodayStart();
  const diffMs = targetDate.getTime() - today.getTime();
  const ONE_DAY_MS = 1000 * 60 * 60 * 24;

  return Math.round(diffMs / ONE_DAY_MS);
};

/**
 * Kiểm tra công việc có bị quá hạn không:
 * Chỉ quá hạn khi CHƯA HOÀN THÀNH và hạn trước hôm nay (diff < 0)
 * Lưu ý: Hạn hôm nay (diff == 0) KHÔNG phải quá hạn!
 */
export const isOverdue = (dueDateStr: string, done: boolean): boolean => {
  if (done) {
    return false;
  }
  const diff = diffInDays(dueDateStr);
  if (diff === null) {
    return false;
  }
  return diff < 0;
};

/**
 * Kiểm tra xem ngày có trước hôm nay không (dùng để validate khi THÊM MỚI công việc)
 */
export const isDateBeforeToday = (dateStr: string): boolean => {
  const diff = diffInDays(dateStr);
  if (diff === null) {
    return false;
  }
  return diff < 0;
};

/**
 * Lấy thông tin trạng thái hạn hiển thị trên giao diện
 * "Còn 3 ngày", "Hạn hôm nay" hoặc "Quá hạn 2 ngày"
 */
export const getDueStatusInfo = (dueDateStr: string, done: boolean): DueStatusInfo => {
  if (done) {
    return {
      isOverdue: false,
      text: 'Đã hoàn thành',
      color: colors.primaryDark,
      badgeBg: colors.primaryLight,
    };
  }

  const diff = diffInDays(dueDateStr);
  if (diff === null) {
    return {
      isOverdue: false,
      text: dueDateStr || 'Chưa có hạn',
      color: colors.textSecondary,
      badgeBg: colors.borderLight,
    };
  }

  if (diff < 0) {
    return {
      isOverdue: true,
      text: `Quá hạn ${Math.abs(diff)} ngày`,
      color: colors.overdue,
      badgeBg: colors.overdueBg,
    };
  }

  if (diff === 0) {
    return {
      isOverdue: false,
      text: 'Hạn hôm nay',
      color: colors.primaryDark,
      badgeBg: colors.primaryLight,
    };
  }

  return {
    isOverdue: false,
    text: `Còn ${diff} ngày`,
    color: colors.primary,
    badgeBg: colors.primaryLight,
  };
};

/**
 * Tạo chuỗi ngày dd/mm/yyyy tương đối so với hôm nay (hôm nay + offsetDays)
 * Dùng cho sinh dữ liệu mẫu linh hoạt luôn chuẩn khi chấm thi
 */
export const getRelativeDate = (offsetDays: number = 0): string => {
  const date = getTodayStart();
  date.setDate(date.getDate() + offsetDays);
  return formatDate(date);
};
