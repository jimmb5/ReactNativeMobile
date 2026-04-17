import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { useAuth } from '../context/AuthContext';
import { PlaceLocation } from '../types/place';
import Slider from '@react-native-community/slider';

export const CATEGORIES = ['Leikkipuisto', 'Koirapuisto', 'Nuotiopaikka', 'Reitti', 'Uimapaikka', 'Laavu'];

export const useAddPlace = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [type, setType] = useState<string>('');
  const [location, setLocation] = useState<PlaceLocation | null>(null);
  const [length, setLength] = useState<number>(0);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { user } = useAuth();

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
      setImages(prev => [...prev, ...uris]);

    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (catg: string) => {
    setType(prev => prev === catg ? '' : catg);
  };

  const addTag = () => {
  const trimmed = tagInput.trim();
  if (trimmed === '') return;
  if (tags.includes(trimmed)) return;
  setTags(prev => [...prev, trimmed]);
  setTagInput('');
};

const removeTag = (tag: string) => {
  setTags(prev => prev.filter(t => t !== tag));
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

  const handleSave = async () => {
    if (!user) {
      alert('Kirjaudu sisään lisätäksesi paikkoja');
      return;
    }
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
        tags,
        distance: '',
        length,
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


  return {
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
  };
};