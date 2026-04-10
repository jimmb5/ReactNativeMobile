import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import { Place } from "../src/data/Place"

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
