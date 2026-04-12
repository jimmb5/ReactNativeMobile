import { useEffect, useState } from "react"
import { Place } from "../types/place"
import { getAllPlaces } from "../../services/placeService"

export const usePlaceSearch = () => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([])
  const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    loadPlaces()
  }, [])

  const loadPlaces = async (): Promise<void> => {
    setLoading(true)

    try {
      const places = await getAllPlaces()

      setAllPlaces(places)
      setVisiblePlaces(places)
    } catch (error) {
      console.error("Virhe paikkojen haussa:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchPlaces = (query: string): void => {
    setSearchQuery(query)

    // jos hakukenttä tyhjä -> näytä kaikki
    if (!query.trim()) {
      setVisiblePlaces(allPlaces)
      return
    }

    const lowerCaseQuery = query.toLowerCase()

    const filtered = allPlaces.filter((place) => {
      const matchesType = place.type.toLowerCase().includes(lowerCaseQuery)

      const matchesName = place.name.toLowerCase().includes(lowerCaseQuery)

      const matchesTags = place.tags.some((tag) =>
        tag.toLowerCase().includes(lowerCaseQuery),
      )

      return matchesType || matchesName || matchesTags
    })

    setVisiblePlaces(filtered)
  }

  return {
    visiblePlaces,
    searchQuery,
    loading,
    searchPlaces,
    reloadPlaces: loadPlaces,
  }
}
