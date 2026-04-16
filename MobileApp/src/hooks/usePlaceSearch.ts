import { useEffect, useState } from "react"
import { Place } from "../types/place"
import { getAllPlaces } from "../../services/placeService"

export const usePlaceSearch = () => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([])
  const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    loadPlaces()
  }, [])

  useEffect(() => {
    const filtered = filterPlaces(allPlaces, searchQuery, selectedCategories)

    setVisiblePlaces(filtered)
  }, [searchQuery, selectedCategories, allPlaces])

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
    categories: string[],
  ): Place[] => {
    return places.filter((place) => {
      const matchesSearch =
        !query.trim() ||
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.type.toLowerCase().includes(query.toLowerCase()) ||
        place.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase()),
        )

      const matchesCategory =
        categories.length === 0 || categories.includes(place.type)

      return matchesSearch && matchesCategory
    })
  }

  const searchPlaces = (query: string): void => {
    setSearchQuery(query)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(category)

      if (isSelected) {
        return prev.filter((c) => c !== category)
      }

      return [...prev, category]
    })
  }

  return {
    visiblePlaces,
    searchQuery,
    loading,
    searchPlaces,
    toggleCategory,
    selectedCategories,
    reloadPlaces: loadPlaces,
  }
}
