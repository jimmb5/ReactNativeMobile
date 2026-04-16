import React, { useCallback, useRef } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Chip, Divider, Text } from "react-native-paper"

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet | null>
  selectedCategory: string
  onCategorySelect: (category: string) => void
}

const CATEGORIES = [
  "Kaikki",
  "Leikkipuisto",
  "Koirapuisto",
  "Uimapaikka",
  "Reitti",
  "Nuotiopaikka",
  "Laavu",
]

const FilterSheet = ({
  bottomSheetRef,
  selectedCategory,
  onCategorySelect,
}: Props) => {
  const snapPoints = ["96%"]

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={snapPoints}
      index={-1}
      enablePanDownToClose={true}
      style={styles.container}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text variant="titleMedium">Suodata kohteita</Text>
        <Divider style={styles.divider} />
        <Text variant="labelLarge">Kategoriat</Text>
        <View style={styles.typesContainer}>
          {CATEGORIES.map((type) => (
            <Chip
              key={type}
              style={styles.chip}
              compact={true}
              showSelectedCheck={true}
              showSelectedOverlay={true}
              selected={selectedCategory === type}
              onPress={() => onCategorySelect(type)}
            >
              <Text variant="bodySmall">{type}</Text>
            </Chip>
          ))}
        </View>
        <Divider style={styles.divider} />
      </BottomSheetView>
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
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
  },
  divider: {
    marginTop: 16,
    marginBottom: 16,
  },
})

export default FilterSheet
