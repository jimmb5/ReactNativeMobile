import React from 'react';
import { Text, TextInput, StyleSheet, View, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useAddPlace, CATEGORIES } from '../hooks/useAddPlace';
import { useAuth } from '../context/AuthContext';
import Slider from '@react-native-community/slider';

const screenWidth = Dimensions.get('window').width;
const padding = 16;
const numColumns = 4;
const imageSize = (screenWidth - padding * 2) / numColumns;

const AddPlaceScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const {
    name, setName,
    desc, setDesc,
    images,
    type,
    location, setLocation,
    length, setLength,
    pickImage,
    removeImage,
    toggleCategory,
    handleSave,
  } = useAddPlace();

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, styles.guestSafeArea]}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Haluatko lisätä paikan?</Text>
          <Text style={styles.guestSubtitle}>
            Kirjaudu sisään lisätäksesi paikkoja.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
          >
            <Text style={styles.loginButtonText}>Kirjaudu sisään</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelButtonText}>Ei nyt</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
  {CATEGORIES.map((catg: string) => {
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

<Text style={styles.label}>
  Reitin pituus: {length === 0 ? 'Ei reittiä' 
  : length === 5000 ? '5000 m +' 
  : `${length} m`}
</Text>
<Slider
  style={styles.slider}
  minimumValue={0}
  maximumValue={5000}
  step={50}
  value={length}
  onValueChange={setLength}
  minimumTrackTintColor="#2f95dc"
  maximumTrackTintColor="gray"
/>

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
slider: {
  width: '100%',
  height: 40,
  marginBottom: 16,
},
guestSafeArea: {
  backgroundColor: '#FBFBEF',
},
guestContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  gap: 16,
  paddingHorizontal: 32,
},
guestTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  textAlign: 'center',
},
guestSubtitle: {
  fontSize: 15,
  color: '#666',
  textAlign: 'center',
  marginBottom: 8,
},
loginButton: {
  width: '100%',
  height: 56,
  backgroundColor: '#0F8226',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  marginTop: 8,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    android: {
      elevation: 2,
    },
  }),
},
loginButtonPressed: {
  opacity: 0.8,
  ...Platform.select({
    android: { elevation: 1 },
  }),
},
loginButtonText: {
  color: '#000000',
  fontSize: 16,
  fontWeight: '500',
  letterSpacing: 0.1,
},
cancelButton: {
  width: '100%',
  height: 56,
  backgroundColor: '#E8720C',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
    },
    android: {
      elevation: 2,
    },
  }),
},
cancelButtonPressed: {
  opacity: 0.8,
  ...Platform.select({
    android: { elevation: 1 },
  }),
},
cancelButtonText: {
  color: '#000000',
  fontSize: 16,
  fontWeight: '500',
  letterSpacing: 0.1,
},
});