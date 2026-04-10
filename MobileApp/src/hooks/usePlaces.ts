import { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Place } from '../types/place';

// muuntaa documentin place olioksi 
function docToPlace(doc: QueryDocumentSnapshot): Place {
  const d = doc.data() as Partial<Place>;
  return {
    id: doc.id,
    createdBy: d.createdBy ?? 'guest',
    description: d.description ?? '',
    distance: d.distance ?? '',
    imageUrls: d.imageUrls ?? [],
    location: d.location ?? { latitude: 0, longitude: 0 },
    name: d.name ?? 'Nimetön paikka',
    tags: d.tags ?? [],
    type: d.type ?? 'Muu',
    length: d.length ?? 0,
  };
}

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDocs(collection(db, 'places'))
      .then(snapshot => setPlaces(snapshot.docs.map(docToPlace)))
      .catch(() => setError('Paikkojen haku epäonnistui.'))
      .finally(() => setLoading(false));
  }, []);

  return { places, loading, error };
}
