import React from 'react';
import { Text, TextInput, StyleSheet, View, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useAddPlace, CATEGORIES } from '../hooks/useAddPlace';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import Slider from '@react-native-community/slider';
import CategoryPicker from '../components/CategoryPicker';
import TagInput from '../components/TagInput';
import PlaceImagePicker from '../components/PlaceImagePicker';
import { ScrollView } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const padding = 16;
const numColumns = 4;
const imageSize = (screenWidth - padding * 2) / numColumns;

const AddPlaceScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut } = useAuth();
  const {
    name, setName,
    desc, setDesc,
    images,
    type,
    location, setLocation,
    length, setLength,
    tagInput, setTagInput,
    tags,
    addTag,
    removeTag,
    pickImage,
    removeImage,
    toggleCategory,
    handleSave,
  } = useAddPlace();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Haluatko lisätä paikan?</Text>
          <Text style={styles.guestSubtitle}>
            Kirjaudu sisään lisätäksesi paikkoja.
          </Text>
          <Pressable
            onPress={signOut}
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
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
      
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

      <CategoryPicker categories={CATEGORIES} selected={type} onSelect={toggleCategory} />

      <TagInput 
        tagInput={tagInput} 
        onTagInputChange={setTagInput} 
        tags={tags} 
        onAddTag={addTag} 
        onRemoveTag={removeTag} 
      />

      <Text style={styles.label}>
        Reitin pituus: {length === 0 ? 'Ei reittiä' : length === 5000 ? '5000 m +' : `${length} m`}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5000}
        step={50}
        value={length}
        onValueChange={setLength}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor="gray"
        thumbTintColor={colors.primary}
      />

      <Text style={styles.label}>Paikan kuvaus</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholder="Laita paikan kuvaus"
        value={desc}
        onChangeText={setDesc}
        multiline
      />

      <Text style={styles.label}>Kuvat</Text>
      <PlaceImagePicker images={images} onAdd={pickImage} onRemove={removeImage} />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Tallenna paikka</Text>
      </TouchableOpacity>

    </ScrollView>
  </SafeAreaView>
);
};


export default AddPlaceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
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
  

  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 16,
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
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
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
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  cancelButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.secondaryPressed,
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
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});