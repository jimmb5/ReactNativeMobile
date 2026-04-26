import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import { Place } from "../src/types/place"

export const getAllPlaces = async (): Promise<Place[]> => {
  try {
    const placesRef = collection(db, "places")
    const snapshot = await getDocs(placesRef)

    const places: Place[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Place, "id">),
    }))

    return places
  } catch (error) {
    console.error("Virhe haettaessa paikkoja:", error)
    return []
  }
}

export const getPlacesByIds = async (ids: string[]): Promise<Place[]> => {
  if (ids.length === 0) return []
  const allPlaces = await getAllPlaces()
  const idSet = new Set(ids)
  return allPlaces.filter((place) => idSet.has(place.id))
}

export const getSavedPlaces = async (uid: string): Promise<Place[]> => {
  const savedRef = collection(db, "users", uid, "savedPlaces")
  const snapshot = await getDocs(savedRef)
  const savedIds = snapshot.docs.map((doc) => doc.data().placeId as string)
  return getPlacesByIds(savedIds)
}
