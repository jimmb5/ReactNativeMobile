import { View, Text } from "react-native"
import React, { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import SearchBar from "../components/SearchBar"

const MapScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  return (
    <SafeAreaView>
      <View>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Etsi kohteita tai reittejä..."
          onFilterPress={() => {
            console.log("Avaa suodatus bottom sheet")
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default MapScreen
