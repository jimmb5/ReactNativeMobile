export type Place = {
  id: string
  name: string
  type: string
  description: string
  distance: string
  tags: string[]
  imageUrls: string[]
  location: {
    latitude: number
    longitude: number
  }
  createdBy: string
}
