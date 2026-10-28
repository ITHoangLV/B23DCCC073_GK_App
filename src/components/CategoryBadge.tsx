import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORY_STYLES } from '../utils/constants';
import { radius, spacing, typography, colors } from '../theme';
import { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
}

/**
 * Nhãn danh mục công việc: Học tập, Công việc, Sức khoẻ, Cá nhân
 */
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const styleConfig = CATEGORY_STYLES[category] || {
    color: colors.primary,
    bgColor: colors.primaryLight,
  };

  return (
    <View style={[styles.badge, { backgroundColor: styleConfig.bgColor }]}>
      <Text style={[styles.label, { color: styleConfig.color }]}>
        {category || 'Khác'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs + 2,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
  },
});

export default React.memo(CategoryBadge);
