import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import { Place } from '../types/place';

type Props = {
  place: Place;
};

const SaveButton = ({ place }: Props) => {
  const { savePlace } = useSavedPlaces();

  const handleSave = async () => {
    try {
      await savePlace(place);
    } catch (error) {
      console.error('Tallennus epäonnistui:', error);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={handleSave}
    >
      <Ionicons name="heart" size={20} color="#0F8226" />
    </Pressable>
  );
};

export default SaveButton;

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0F8226',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: { elevation: 3 },
    }),
  },
  buttonPressed: {
    opacity: 0.75,
    ...Platform.select({ android: { elevation: 1 } }),
  },
});