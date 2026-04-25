export type PlaceLocation = {
  latitude: number
  longitude: number
}

export type Place = {
  id: string
  createdBy: string
  description: string
  distance?: number | null
  imageUrls: string[]
  location: PlaceLocation
  name: string
  tags: string[]
  type: string
  length?: number
}
