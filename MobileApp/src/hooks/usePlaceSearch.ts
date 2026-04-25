import { useEffect, useState } from "react"
import { Place } from "../types/place"
import { getAllPlaces } from "../../services/placeService"

export const usePlaceSearch = (
  userLocation: {
    latitude: number
    longitude: number
  } | null,
) => {
  const [allPlaces, setAllPlaces] = useState<Place[]>([])
  const [visiblePlaces, setVisiblePlaces] = useState<Place[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [maxDistance, setMaxDistance] = useState<number>(15)
  const [maxRouteLength, setMaxRouteLength] = useState<number>(15)

  useEffect(() => {
    loadPlaces()
  }, [])

  useEffect(() => {
    const filtered = filterPlaces(
      placesWithDistance,
      searchQuery,
      selectedCategories,
    )

    setVisiblePlaces(filtered)
  }, [
    searchQuery,
    selectedCategories,
    allPlaces,
    maxDistance,
    maxRouteLength,
    userLocation,
  ])

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

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const placesWithDistance = allPlaces.map((place) => {
    const lat = place.location?.latitude
    const lon = place.location?.longitude

    if (!userLocation || lat == null || lon == null) {
      return { ...place, distance: null }
    }

    const distance = getDistance(
      userLocation.latitude,
      userLocation.longitude,
      lat,
      lon,
    )

    return { ...place, distance }
  })

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

      const matchesDistance = !place.distance || place.distance <= maxDistance
      const matchesLength = !place.length || place.length <= maxRouteLength

      return (
        matchesSearch && matchesCategory && matchesDistance && matchesLength
      )
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

  const setDistance = (distance: number): void => {
    setMaxDistance(distance)
  }
  const setRouteLength = (length: number): void => {
    setMaxRouteLength(length)
  }

  return {
    visiblePlaces,
    searchQuery,
    loading,
    searchPlaces,
    toggleCategory,
    selectedCategories,
    setDistance,
    setRouteLength,
    maxDistance,
    maxRouteLength,
    reloadPlaces: loadPlaces,
  }
}
