export const colors = {
  // Brand colors (Theme Vàng Kem - Ấm áp, thanh lịch & sang trọng)
  primary: '#A16207', // Vàng hổ phách đậm chủ đạo
  primaryDark: '#854D0E', // Nâu vàng đậm
  primaryLight: '#FEF3C7', // Vàng kem nhạt
  accent: '#A855F7', // Tím hoa cà điểm xuyết

  // Background & Surface
  background: '#FFFBEB', // Nền vàng kem ấm
  card: '#FFFFFF', // Thẻ card trắng
  surface: '#FFFFFF',

  // Text colors (Tông nâu cà phê đậm đà, tương phản tuyệt vời trên nền kem)
  text: '#422006', // Chữ nâu đậm
  textPrimary: '#422006', // Giữ nguyên key cũ tương thích toàn bộ screens
  textSecondary: '#8A7355', // Chữ phụ nâu be
  textMuted: '#B8A287', // Chữ làm mờ / placeholder
  textLight: '#FFFFFF', // Chữ trắng trên nền primary đậm

  // Borders
  border: '#F1E3B8', // Viền vàng kem
  borderLight: '#FFFBEB',
  borderDark: '#E3CE9B',

  // Priority Colors (Theo đúng yêu cầu: Cao = đỏ, Trung bình = vàng, Thấp = xanh)
  priorityHigh: '#DC2626', // Đỏ - Cao
  priorityHighBg: '#FEE2E2',
  priorityMedium: '#422006', // Chữ nâu đậm trên nền vàng warning theo Yêu cầu 4
  priorityMediumBg: '#FACC15', // Nền vàng tươi warning theo Yêu cầu 4
  priorityLow: '#22C55E', // Xanh lục - Thấp (DUY NHẤT được dùng màu xanh)
  priorityLowBg: '#DCFCE7',

  // Categories (KHÔNG dùng màu xanh dương hoặc xanh lá theo Yêu cầu 3)
  categoryStudy: '#A16207', // Học tập - Vàng hổ phách
  categoryStudyBg: '#FEF3C7',
  categoryWork: '#854D0E', // Công việc - Nâu vàng ấm
  categoryWorkBg: '#FDE68A',
  categoryHealth: '#C2410C', // Sức khoẻ - Cam đất ấm
  categoryHealthBg: '#FFEDD5',
  categoryPersonal: '#9333EA', // Cá nhân - Tím ấm
  categoryPersonalBg: '#F3E8FF',

  // Status & Utility (Màu Quá hạn đỏ theo đúng yêu cầu đề bài)
  danger: '#DC2626', // Đỏ cảnh báo / validate sai
  dangerBg: '#FEE2E2', // Nền đỏ nhạt khi ô nhập lỗi
  success: '#22C55E', // Chỉ dùng cho nhãn ưu tiên Thấp
  successBg: '#DCFCE7',
  warning: '#FACC15', // Chỉ dùng cho nhãn ưu tiên Trung bình
  warningBg: '#FEF3C7',
  overdue: '#DC2626', // Đỏ cảnh báo Quá hạn (GIỮ NGUYÊN)
  overdueBg: '#FEE2E2',

  // Controls & States (Đồng bộ theo tông vàng kem)
  disabled: '#C4B59D',
  disabledBg: '#FEF3C7',
  checkboxBorder: '#F1E3B8',
  checkboxActive: '#A16207', // Checkbox đã tick dùng colors.primary
  progressBarBg: '#FEF3C7', // Nền thanh tiến độ vàng kem nhạt
  progressBarFill: '#A16207', // Phần hoàn thành dùng colors.primary
  shadow: '#422006', // Màu bóng đổ cùng tông nâu ấm
  badgeActiveBg: 'rgba(255, 255, 255, 0.25)', // Nền badge mờ trên nền primary
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;
