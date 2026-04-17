import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

const CategoryPicker = ({ categories, selected, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      {categories.map((catg: string) => (
        <TouchableOpacity
          key={catg}
          style={[styles.chip, selected === catg && styles.chipSelected]}
          onPress={() => onSelect(catg)}
        >
          <Text style={[styles.chipText, selected === catg && styles.chipTextSelected]}>
            {catg}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategoryPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: 'gray',
  },
  chipTextSelected: {
    color: 'white',
  },
});