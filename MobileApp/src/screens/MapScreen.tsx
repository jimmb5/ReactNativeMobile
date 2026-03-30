import { Text } from "react-native"
import React, { useEffect, useState }, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import SearchBar from "../components/SearchBar"
import ListSheet from "../components/ListSheet"
import Map from "../components/map";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Region } from "react-native-maps";
import * as Location from "expo-location";


const MapScreen = () => {
  const [location, setLocation] = useState<Region>({
    latitude: 65.08,
    longitude: 25.48,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
    startCompassTracking();
  }, []);

  const [heading, setHeading] = useState<number>(0);

  const startCompassTracking = async (): Promise<void> => {
    try {
      //Check if device has compass
      const hasCompass = await Location.hasServicesEnabledAsync();
      if (!hasCompass) {
        console.log("Compass not availabel");
        return;
      }
      // Watch heading change
      const subscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading || headingData.magHeading);
      });
    } catch (error) {
      console.error("compass error:", error);
    }
  };

  

  const getCurrentLocation = async (): Promise<void> => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log(
          "Permission denied",
          "Location permission is required to show your position",
        );
        return;
      }
      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string>("")
  return (
    <SafeAreaView style={styles.container}>
      <Text>MapScreen</Text>
      <Map region={location} heading={heading} />
      <StatusBar style="auto" />
      <View>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Etsi kohteita tai reittejä..."
          onFilterPress={() => {
            console.log("Avaa suodatus bottom sheet")
          }}
        />
        <ListSheet />
      </View>
    </SafeAreaView>
  )
}

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default MapScreen
