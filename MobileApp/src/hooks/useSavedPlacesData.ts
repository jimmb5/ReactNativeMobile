import { useEffect, useState } from 'react';
import { getSavedPlaces } from '../../services/placeService';
import { useAuth } from '../context/AuthContext';
import { Place } from '../types/place';

export function useSavedPlacesData() {
  const { user } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    getSavedPlaces(user.uid)
      .then(setPlaces)
      .catch(() => setError('Tallennettujen paikkojen haku epäonnistui.'))
      .finally(() => setLoading(false));
  }, [user]);

  return { places, loading, error };
}
