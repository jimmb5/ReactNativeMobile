export type PlaceLocation = {
  latitude: number;
  longitude: number;
};

export type Place = {
  id: string;
  createdBy: string;
  description: string;
  distance: string;
  imageUrls: string[];
  location: PlaceLocation;
  name: string;
  tags: string[];
  type: string;
  length?: number;
};
