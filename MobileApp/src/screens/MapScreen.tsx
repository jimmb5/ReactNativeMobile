import { Text, View, TouchableOpacity } from "react-native"
import React from "react"
import { useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import SearchBar from "../components/SearchBar"
import ListSheet from "../components/ListSheet"
import Map from "../components/map"
import { StyleSheet } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Region } from "react-native-maps"
import * as Location from "expo-location"
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';



const MapScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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

  const [searchQuery, setSearchQuery] = useState<string>("")
  return (
    <View style={styles.container}>
      <Text>MapScreen</Text>
      <Map region={location} heading={heading} />
      <StatusBar style="auto" />
      <View style={styles.content}>
        
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Etsi kohteita tai reittejä..."
          onFilterPress={() => {
            console.log("Avaa suodatus bottom sheet")
          }}
          style={{
            position: "absolute",
            top: 30,
            left: 16,
            right: 16,
          }}
        />
        <TouchableOpacity
  style={styles.addButton}
  onPress={() => navigation.navigate('AddPlace')}
>
  <Text style={styles.addButtonText}>+ Lisää paikka</Text>
</TouchableOpacity>
        <ListSheet />
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
  position: 'absolute',
  bottom: 200,
  right: 16,
  backgroundColor: '#2f95dc',
  borderRadius: 24,
  paddingHorizontal: 16,
  paddingVertical: 10,
},
addButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
})
