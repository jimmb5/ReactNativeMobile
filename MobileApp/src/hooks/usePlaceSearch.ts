import { useEffect, useState } from "react"
import { Place } from "../types/place"
import { getAllPlaces } from "../../services/placeService"

export const usePlaceSearch = () => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([])
  const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("Kaikki")

  useEffect(() => {
    loadPlaces()
  }, [])

  useEffect(() => {
    const filtered = filterPlaces(allPlaces, searchQuery, selectedCategory)

    setVisiblePlaces(filtered)
  }, [searchQuery, selectedCategory, allPlaces])

  const loadPlaces = async (): Promise<void> => {
    setLoading(true)

    try {
      const places = await getAllPlaces()

      setAllPlaces(places)
    } catch (error) {
      console.error("Virhe paikkojen haussa:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPlaces = (
    places: Place[],
    query: string,
    category: string,
  ): Place[] => {
    return places.filter((place) => {
      const matchesSearch =
        !query.trim() ||
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.type.toLowerCase().includes(query.toLowerCase()) ||
        place.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        )

      const matchesCategory = category === "Kaikki" || place.type === category

      return matchesSearch && matchesCategory
    })
  }

  const searchPlaces = (query: string): void => {
    setSearchQuery(query)
  }

  const selectCategory = (category: string): void => {
    setSelectedCategory(category)
  }

  return {
    visiblePlaces,
    searchQuery,
    loading,
    searchPlaces,
    selectCategory,
    selectedCategory,
    reloadPlaces: loadPlaces,
  }
}
