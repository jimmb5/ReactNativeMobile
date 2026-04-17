import React, { useCallback, useMemo, useRef } from "react"
import { View, StyleSheet, ListRenderItem } from "react-native"
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import PoiCard from "./PoiCard"
import { Place } from "../types/place"
import { ActivityIndicator } from "react-native"
import { Text } from "react-native-paper"
import { colors } from "../theme/colors"

type Props = {
  places: Place[]
  isLoading: boolean
}

const ListSheet = ({ places, isLoading }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  const snapPoints = ["20%", "60%", "96%"]

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  const handlePoiPress = (poiId: string) => {
    console.log("Pressed poi:", poiId)
  }

  const renderItem: ListRenderItem<Place> = useCallback(
    ({ item }) => (
      <PoiCard poi={item} onPress={() => handlePoiPress(item.id)} />
    ),
    [],
  )
  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBackground}
    >
      <View style={styles.contentContainer}>
        <Text variant="titleMedium">Löydetyt kohteet</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text>Ladataan kohteita...</Text>
          </View>
        ) : (
          <BottomSheetFlatList
            data={places}
            keyExtractor={(item: Place) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingTop: 12,
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetBackground: {
    backgroundColor: colors.background,
  },
})

export default ListSheet
