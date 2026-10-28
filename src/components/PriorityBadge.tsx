import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PRIORITY_STYLES } from '../utils/constants';
import { radius, spacing, typography } from '../theme';
import { Priority } from '../types';

interface PriorityBadgeProps {
  priority: Priority;
}

/**
 * Nhãn mức ưu tiên: Đỏ (Cao), Vàng (Trung bình), Xanh (Thấp) theo đúng Câu 1
 */
const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const styleConfig =
    PRIORITY_STYLES[priority] || PRIORITY_STYLES['Trung bình'];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: styleConfig.bgColor, borderColor: styleConfig.color },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: styleConfig.color }]} />
      <Text style={[styles.label, { color: styleConfig.color }]}>
        {styleConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
  },
});

export default React.memo(PriorityBadge);
