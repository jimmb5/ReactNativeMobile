import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const screenWidth = Dimensions.get('window').width;
const padding = 16;
const numColumns = 4;
const imageSize = (screenWidth - padding * 2) / numColumns;
const CATEGORIES = ['Leikkipuisto', 'Koirapuisto', 'Nuotiopaikka', 'Reitti', 'Uimapaikka', 'Laavu'];

const AddPlaceScreen = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [type, setType] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const [location, setLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);

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
  if (type === catg) {
    setType('');
  } else {
    setType(catg);
  }
};

const handleSave = async () => {
  if (!name || !location || !type) {
    alert('Täytä nimi, sijainti ja kategoria');
    return;
  }

  try {
    const imageUrls = await uploadImages();

    const docRef = await addDoc(collection(db, 'places'), {
      name,
      type,
      description: desc,
      location,
      tags: [],
      distance: '',
      imageUrls,
      createdBy: user?.uid ?? 'guest',
    });
    console.log('Tallennettu ID:llä:', docRef.id);
    alert('Paikka lisätty!');
  } catch (error) {
    console.error('Virhe:', error);
    alert('Tallennus epäonnistui');
  }
};

const uploadImages = async (): Promise<string[]> => {
  const urls: string[] = [];

  for (const uri of images) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `places/${user?.uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
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


        <Text style={styles.label}>Sijainti</Text>
<TouchableOpacity
  style={styles.addImageButton}
  onPress={() => navigation.navigate('LocationSelect', {
    onLocationSelected: (lat, lng) => {
      setLocation({ latitude: lat, longitude: lng });
    }
  })}
>


  <Text>
    {location
      ? `📍 ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
      : 'Valitse sijainti kartalta'}
  </Text>
</TouchableOpacity>
        <Text style={styles.label}>Kategoriat</Text>
<View style={styles.categoriesContainer}>
  {CATEGORIES.map(catg => {
    const isSelected = type === catg;
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
ListFooterComponent={
  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
    <Text style={styles.saveButtonText}>Tallenna paikka</Text>
  </TouchableOpacity>
}
/>

      
    </SafeAreaView> 
  );
};


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
saveButton: {
  backgroundColor: '#2f95dc',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 16,
},
saveButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
});