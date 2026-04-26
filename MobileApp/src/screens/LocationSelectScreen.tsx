import React, { useState } from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import MapView, { Marker, Region } from "react-native-maps"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "../navigation/navTypes"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors } from "../theme/colors"

const LocationSelectScreen = () => {
  // kaikki staten ja hookien määrittelyt tänne
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, "LocationSelect">>()
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const insets = useSafeAreaInsets()

  // funktiot tänne
  const handleConfirm = () => {
    if (!selectedLocation) return
    route.params.onLocationSelected(
      selectedLocation.latitude,
      selectedLocation.longitude,
    )
    navigation.goBack()
  }

  // return tänne
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate
          setSelectedLocation({ latitude, longitude })
        }}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <TouchableOpacity
        style={[
          styles.confirmButton,
          {
            position: "absolute",
            bottom: insets.bottom + 16,
            left: 16,
            right: 16,
          },
          !selectedLocation && styles.confirmButtonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!selectedLocation}
      >
        <Text style={styles.confirmButtonText}>Vahvista sijainti</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: "gray",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
})

export default LocationSelectScreen
