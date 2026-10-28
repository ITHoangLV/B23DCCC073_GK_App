import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { FILTERS } from '../utils/constants';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { FilterType, TaskCounts } from '../types';

interface FilterBarProps {
  selectedFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  counts?: Partial<TaskCounts>;
}

/**
 * Thanh nút bấm lọc: Tất cả / Chưa xong / Đã xong / Quá hạn (Câu 5)
 * Nút đang chọn được làm nổi bật với màu sắc và bóng đổ
 */
const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  onSelectFilter,
  counts = {},
}) => {
  const filterList: { key: FilterType; label: string; count?: number }[] = [
    { key: FILTERS.ALL, label: 'Tất cả', count: counts.all },
    { key: FILTERS.PENDING, label: 'Chưa xong', count: counts.pending },
    { key: FILTERS.COMPLETED, label: 'Đã xong', count: counts.completed },
    { key: FILTERS.OVERDUE, label: 'Quá hạn', count: counts.overdue },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterList.map((item) => {
          const isSelected = selectedFilter === item.key;
          const isOverdueTab = item.key === FILTERS.OVERDUE;

          return (
            <Pressable
              key={item.key}
              style={({ pressed }) => [
                styles.tab,
                isSelected
                  ? isOverdueTab
                    ? styles.tabActiveOverdue
                    : styles.tabActive
                  : styles.tabInactive,
                pressed && styles.tabPressed,
              ]}
              onPress={() => onSelectFilter(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {item.label}
              </Text>

              {typeof item.count === 'number' && (
                <View
                  style={[
                    styles.countBadge,
                    isSelected
                      ? styles.countBadgeActive
                      : isOverdueTab && item.count > 0
                      ? styles.countBadgeOverdueInactive
                      : styles.countBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected
                        ? styles.countTextActive
                        : isOverdueTab && item.count > 0
                        ? styles.countTextOverdue
                        : styles.countTextInactive,
                    ]}
                  >
                    {item.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    paddingVertical: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  tabActiveOverdue: {
    backgroundColor: colors.overdue,
    borderColor: colors.overdue,
    ...shadows.sm,
  },
  tabInactive: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  tabPressed: {
    opacity: 0.8,
  },
  tabText: {
    fontSize: typography.size.small,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: typography.weight.bold,
  },
  tabTextInactive: {
    color: colors.textSecondary,
    fontWeight: typography.weight.medium,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  countBadgeActive: {
    backgroundColor: colors.badgeActiveBg,
  },
  countBadgeInactive: {
    backgroundColor: colors.borderLight,
  },
  countBadgeOverdueInactive: {
    backgroundColor: colors.overdueBg,
  },
  countText: {
    fontSize: 11,
    fontWeight: typography.weight.bold,
  },
  countTextActive: {
    color: colors.white,
  },
  countTextInactive: {
    color: colors.textSecondary,
  },
  countTextOverdue: {
    color: colors.overdue,
  },
});

export default React.memo(FilterBar);
