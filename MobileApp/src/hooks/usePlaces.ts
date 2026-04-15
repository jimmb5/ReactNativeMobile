import { useEffect, useState } from 'react';
import { getAllPlaces } from '../../services/placeService';
import { Place } from '../types/place';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllPlaces()
      .then(setPlaces)
      .catch(() => setError('Paikkojen haku epäonnistui.'))
      .finally(() => setLoading(false));
  }, []);

  return { places, loading, error };
}
