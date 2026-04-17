import { Text, View, TouchableOpacity } from "react-native"
import React, { useRef } from "react"
import { colors } from "../theme/colors"
import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
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
  } = usePlaceSearch()
  const filterSheetRef = useRef<BottomSheet>(null)

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [location, setLocation] = useState<Region>({
    latitude: 65.08,
    longitude: 25.48,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useEffect(() => {
    getCurrentLocation()
    startCompassTracking()
  }, [])

  const openFilterSheet = () => {
    filterSheetRef.current?.snapToIndex(1)
  }

  const [heading, setHeading] = useState<number>(0)

  const startCompassTracking = async (): Promise<void> => {
    try {
      //Check if device has compass
      const hasCompass = await Location.hasServicesEnabledAsync()
      if (!hasCompass) {
        console.log("Compass not availabel")
        return
      }
      // Watch heading change
      const subscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading || headingData.magHeading)
      })
    } catch (error) {
      console.error("compass error:", error)
    }
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

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text>MapScreen</Text>
      <Map region={location} heading={heading} />
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
    bottom: "27%",
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
