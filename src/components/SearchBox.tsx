import React from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

/**
 * Ô tìm kiếm công việc không phân biệt hoa/thường kèm nút xoá nhanh (Câu 5)
 */
const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Tìm kiếm theo tên công việc...',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        clearButtonMode="never"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!!value && (
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearIcon: {
    fontSize: 11,
    color: colors.white,
    fontWeight: 'bold',
    marginTop: -1,
  },
});

export default React.memo(SearchBox);
