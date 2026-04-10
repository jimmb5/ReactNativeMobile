import { useCallback, useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import { useSavedPlaces } from './useSavedPlaces';
import { SwipeDirection } from '../components/SwipeCard';
import { usePlaces } from './usePlaces';

const PREFETCH_AHEAD = 10;

export function useExplore() {
  const { savePlace } = useSavedPlaces();
  const { places, loading, error } = usePlaces();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isHandling = useRef(false);
  const prefetchedUrls = useRef(new Set<string>());

  const finished = !loading && currentIndex >= places.length;
  const currentPoi = finished ? null : places[currentIndex];
  const nextPoi = places[currentIndex + 1] ?? null;

  // ladataan kuvia etukäteen
  useEffect(() => {
    if (loading || places.length === 0) return;

    const upcoming = places.slice(currentIndex, currentIndex + PREFETCH_AHEAD);

    upcoming.forEach(place => {
      place.imageUrls.forEach(url => {
        if (!url || prefetchedUrls.current.has(url)) return;

        prefetchedUrls.current.add(url);
        Image.prefetch(url).catch(() => {
          // poistetaan setistä jotta voidaan yrittää myöhemmin
          prefetchedUrls.current.delete(url);
        });
      });
    });
  }, [currentIndex, places, loading]);

    // kutsutaan kun kortin animaatio on päättynyt, tallentaa paikan jos swipattiin oikealle, sitten siirtyy seuraavaan
  const completeSwipe = useCallback(async (direction: SwipeDirection) => {
    const swipedPlace = places[currentIndex];

    if (direction === 'right' && swipedPlace) {
      try {
        await savePlace(swipedPlace);
      } catch {
        // tässäkin ohitetaan vain virhe, ei vakavaa
      }
    }

    setCurrentIndex(i => i + 1);
    isHandling.current = false;
  }, [currentIndex, places, savePlace]);

  // kutsutaan kun swipe alkaa, palauttaa suunnan
  const startSwipe = useCallback((direction: SwipeDirection) => {
    if (loading || finished || isHandling.current) return false;

    isHandling.current = true;
    return direction;
  }, [finished, loading]);

  const reset = useCallback(() => {
    isHandling.current = false;
    setCurrentIndex(0);
  }, []);

  return {
    currentPoi,
    nextPoi,
    currentIndex,
    total: places.length,
    finished,
    loading,
    error,
    startSwipe,
    completeSwipe,
    reset,
  };
}
