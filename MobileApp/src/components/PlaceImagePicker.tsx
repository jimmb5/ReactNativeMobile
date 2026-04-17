import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const padding = 16;
const numColumns = 4;
const imageSize = (screenWidth - padding * 2) / numColumns;

type Props = {
  images: string[];
  onAdd: () => void;
  onRemove: (index: number) => void;
};

const PlaceImagePicker = ({ images, onAdd, onRemove }: Props) => {
  return (
    <View>
      <TouchableOpacity style={styles.addButton} onPress={onAdd}>
        <Text>LISÄÄ KUVIA</Text>
      </TouchableOpacity>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <TouchableOpacity key={uri} onPress={() => onRemove(index)}>
            <Image source={{ uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PlaceImagePicker;

const styles = StyleSheet.create({
  addButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: imageSize,
    height: imageSize,
    padding: 2,
  },
});