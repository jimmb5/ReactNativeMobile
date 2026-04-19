import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Place } from '../types/place';

export function useMyPlaces() {
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

    const q = query(
      collection(db, 'places'),
      where('createdBy', '==', user.uid)
    );

    getDocs(q)
      .then(snapshot => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Place));
        setPlaces(docs);
      })
      .catch(() => setError('Omien paikkojen haku epäonnistui.'))
      .finally(() => setLoading(false));
  }, [user]);

  return { places, loading, error };
}