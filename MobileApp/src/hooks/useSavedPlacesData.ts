import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlacesByIds, getSavedPlaces } from '../../services/placeService';
import { useAuth } from '../context/AuthContext';
import { Place } from '../types/place';

const GUEST_SAVED_IDS_KEY = '@pulu_saved_place_ids';

export function useSavedPlacesData() {
  const { user } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const load = async () => {
      if (user) return getSavedPlaces(user.uid);
      const raw = await AsyncStorage.getItem(GUEST_SAVED_IDS_KEY);
      return getPlacesByIds(raw ? JSON.parse(raw) : []);
    };

    load()
      .then(setPlaces)
      .catch(() => setError('Tallennettujen paikkojen haku epäonnistui.'))
      .finally(() => setLoading(false));
  }, [user]);

  return { places, loading, error };
}
