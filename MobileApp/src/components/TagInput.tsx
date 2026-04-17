import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  tagInput: string;
  onTagInputChange: (text: string) => void;
  tags: string[];
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
};

const TagInput = ({ tagInput, onTagInputChange, tags, onAddTag, onRemoveTag }: Props) => {
  return (
    <View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Lisää tagi"
          value={tagInput}
          onChangeText={onTagInputChange}
          onSubmitEditing={onAddTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAddTag}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagsContainer}>
        {tags.map(tag => (
          <TouchableOpacity
            key={tag}
            style={styles.tag}
            onPress={() => onRemoveTag(tag)}
          >
            <Text style={styles.tagText}>{tag} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TagInput;

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: 'white',
  },
});