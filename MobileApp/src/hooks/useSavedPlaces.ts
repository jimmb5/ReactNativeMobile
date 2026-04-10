import { useCallback } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Place } from '../types/place';

const ASYNC_STORAGE_KEY = '@pulu_saved_place_ids';

export function useSavedPlaces() {
  const { user } = useAuth();

  const savePlace = useCallback(async (place: Place): Promise<void> => {
    if (user) {
      const ref = doc(db, 'users', user.uid, 'savedPlaces', place.id);
      await setDoc(ref, {
        placeId: place.id,
        savedAt: new Date().toISOString(),
      });
    } else {
      try {
        const existing = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        const savedIds: string[] = existing ? JSON.parse(existing) : [];
        if (!savedIds.includes(place.id)) {
          await AsyncStorage.setItem(
            ASYNC_STORAGE_KEY,
            JSON.stringify([...savedIds, place.id]),
          );
        }
      } catch {
        // ohitetaan async virhe, ei vakavaa
      }
    }
  }, [user]);

  return { savePlace };
}
