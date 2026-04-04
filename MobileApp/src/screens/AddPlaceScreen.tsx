import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const padding = 16;
const numColumns = 4;
const imageSize = (screenWidth - padding * 2) / numColumns;
const CATEGORIES = ['Leikkipuisto', 'Koirapuisto', 'Nuotiopaikka', 'Reitti', 'Uimapaikka'];
const AddPlaceScreen = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [Category, setCategory] = useState<string[]>([]);
  const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Tarvitaan lupa galleriaan');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true, 
    mediaTypes: ['images'],
  });

  if (!result.canceled) {
    const uris = result.assets.map(asset => asset.uri);
    setImages([...images, ...uris]);
  }
};
const removeImage = (index: number) => {
  setImages(images.filter((_, i) => i !== index));
};
const toggleCategory = (catg: string) => {
  if (Category.includes(catg)) {
    // jos kategoria on jo valittu, poistetaan se
    setCategory(Category.filter(c => c !== catg));
  } else {
    // muuten lisätään se listaan
    setCategory([...Category, catg]);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
  data={images}
  numColumns={4}
  keyExtractor={(item, index) => index.toString()}
  ListHeaderComponent={
    <View>
        <Text style={styles.label}>Nimi</Text>
        <TextInput
          style={styles.input}
          placeholder="Laita paikan nimi"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Kategoriat</Text>
<View style={styles.categoriesContainer}>
  {CATEGORIES.map(catg => {
    const isSelected = Category.includes(catg);
    return (
      <TouchableOpacity
        key={catg}
        style={[styles.chip, isSelected && styles.chipSelect]}
        onPress={() => toggleCategory(catg)}
      >
        <Text style={[styles.chipText, isSelected && styles.chipTextSelect]}>
          {catg}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>
        <Text style={styles.label}>Paikan kuvaus</Text>
        <TextInput
          style={styles.input}
          placeholder="Laita paikan kuvaus"
          value={desc}
          onChangeText={setDesc}
          multiline
        />
        <Text style={styles.label}>Kuvat</Text>
<TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
  <Text>LISÄÄ KUVIA</Text>
</TouchableOpacity>
      </View>
  }
  renderItem={({ item, index }) => (
  <TouchableOpacity onPress={() => removeImage(index)}>
    <Image source={{ uri: item }} style={styles.image} />
  </TouchableOpacity>
)}
/>

      
    </SafeAreaView> 
  );
};
// TODO: teksti paikan nimelle
// TODO: teksti kuvaukselle
// TODO: lisää kuvan valitsin ja näytä lisäämät kuvat
// TODO: lisää kategorian valinta
// TODO: lisää sijainnin valinta
// TODO: lisää tallennus nappi
// TODO: tallenna tiedot db
// TODO: tallenna kuvat db

export default AddPlaceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addImageButton: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 8,
  padding: 12,
  alignItems: 'center', 
  marginBottom: 16,
},
image: {
  width: imageSize,
  height: imageSize,
  padding: 2,
},
categoriesContainer: {
  flexDirection: 'row', // chipit vierekkäin
  flexWrap: 'wrap',     // rivittyy jos ei mahdu
  marginBottom: 16,
  gap: 8,               // väli chippien välillä
},
chip: {
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 16,     // pyöreät reunat
  paddingHorizontal: 12,
  paddingVertical: 6,
},
chipSelect: {
  backgroundColor: '#2f95dc',
  borderColor: '#2f95dc',
},
chipText: {
  color: 'gray',
},
chipTextSelect: {
  color: 'white',
},
});