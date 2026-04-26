import { Text, View, TouchableOpacity } from "react-native"
import React, { useRef } from "react"
import { colors } from "../theme/colors"
import { useEffect, useState } from "react"
import SearchBar from "../components/SearchBar"
import ListSheet from "../components/ListSheet"
import Map from "../components/map"
import { StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Region } from "react-native-maps"
import * as Location from "expo-location"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/navTypes"
import { usePlaceSearch } from "../hooks/usePlaceSearch"
import BottomSheet from "@gorhom/bottom-sheet"
import FilterSheet from "../components/FilterSheet"

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  const {
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
    reloadPlaces,
  } = usePlaceSearch(userLocation)
  const filterSheetRef = useRef<BottomSheet>(null)

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const initialRegion: Region = {
    latitude: 65.08,
    longitude: 25.48,
    latitudeDelta: 3,
    longitudeDelta: 3,
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      reloadPlaces()
      console.log("Reload places")
    })

    return unsubscribe
  }, [navigation])

  const openFilterSheet = () => {
    filterSheetRef.current?.expand()
  }
  const closeFilterSheet = () => {
    filterSheetRef.current?.close()
  }

  const getCurrentLocation = async (): Promise<void> => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== "granted") {
        console.log(
          "Permission denied",
          "Location permission is required to show your position",
        )
        return
      }
      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      setUserLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text>MapScreen</Text>
      <Map
        initialRegion={initialRegion}
        userLocation={userLocation}
        places={visiblePlaces}
        onMarkerPress={(place) => navigation.navigate("PlaceDetail", { place })}
      />
      <StatusBar style="auto" />
      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChange={searchPlaces}
          placeholder="Etsi kohteita tai reittejä..."
          onFilterPress={openFilterSheet}
          style={{
            position: "absolute",
            top: "5%",
            left: 16,
            right: 16,
          }}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddPlace")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <ListSheet places={visiblePlaces} isLoading={loading} />
        <FilterSheet
          bottomSheetRef={filterSheetRef}
          selectedCategories={selectedCategories}
          onCategoryToggle={toggleCategory}
          onDistanceChange={setDistance}
          onRouteLengthChange={setRouteLength}
          maxDistance={maxDistance}
          maxRouteLength={maxRouteLength}
          onCloseButtonPress={closeFilterSheet}
        />
      </View>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  addButton: {
    position: "absolute",
    bottom: "22%",
    right: "6%",
    backgroundColor: colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "400",
  },
})
