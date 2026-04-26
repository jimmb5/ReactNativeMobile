import React, { useEffect, useRef } from "react"
import { StyleSheet } from "react-native"
import MapView, { Marker, Region } from "react-native-maps"
import { Place } from "../types/place"

interface MapProps {
  initialRegion: Region
  userLocation?: { latitude: number; longitude: number } | null
  places?: Place[]
  onMarkerPress?: (place: Place) => void
}

const Map = ({
  initialRegion,
  userLocation,
  places = [],
  onMarkerPress,
}: MapProps) => {
  const mapRef = useRef<MapView>(null)
  const hasCenteredOnUser = useRef(false)

  useEffect(() => {
    if (userLocation && mapRef.current && !hasCenteredOnUser.current) {
      hasCenteredOnUser.current = true
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.15,
          longitudeDelta: 0.15,
        },
        800,
      )
    }
  }, [userLocation])

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFillObject}
      initialRegion={initialRegion}
      showsUserLocation
      rotateEnabled={false}
    >
      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="Olet tässä"
          pinColor="green"
        />
      )}
      {places.map((place) => {
        const lat = place.location?.latitude
        const lon = place.location?.longitude
        if (lat == null || lon == null) return null
        return (
          <Marker
            key={place.id}
            coordinate={{ latitude: lat, longitude: lon }}
            title={place.name}
            description={place.type}
            onPress={() => onMarkerPress?.(place)}
          />
        )
      })}
    </MapView>
  )
}

export default Map
