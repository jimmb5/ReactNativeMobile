import React, { useCallback, useRef } from "react"
import { StyleSheet, View } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Chip, Divider, Text } from "react-native-paper"
import Slider from "@react-native-community/slider"

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet | null>
  selectedCategories: string[]
  onCategoryToggle: (category: string) => void
  onDistanceChange: (distance: number) => void
  onRouteLengthChange: (length: number) => void
  maxDistance: number
  maxRouteLength: number
}

const CATEGORIES = [
  "Leikkipuisto",
  "Koirapuisto",
  "Uimapaikka",
  "Reitti",
  "Nuotiopaikka",
  "Laavu",
]

const FilterSheet = ({
  bottomSheetRef,
  selectedCategories,
  onCategoryToggle,
  onDistanceChange,
  onRouteLengthChange,
  maxDistance,
  maxRouteLength,
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
      enableContentPanningGesture={false}
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
              compact
              selected={selectedCategories.includes(type)}
              selectedColor="white"
              style={[
                styles.chip,
                selectedCategories.includes(type) && styles.selectedChip,
              ]}
              textStyle={
                selectedCategories.includes(type)
                  ? styles.selectedChipText
                  : styles.chipText
              }
              onPress={() => onCategoryToggle(type)}
            >
              {type}
            </Chip>
          ))}
        </View>
        <Divider style={styles.divider} />
        <Text>Etäisyys: {maxDistance} km</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={50}
          step={1}
          value={maxDistance}
          onSlidingComplete={onDistanceChange}
        />
        <Text>Reitin pituus: {maxRouteLength} km</Text>
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={50}
          step={1}
          value={maxRouteLength}
          onSlidingComplete={onRouteLengthChange}
        />
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

  selectedChip: {
    backgroundColor: "#2f95dc",
  },

  chipText: {
    color: "black",
  },

  selectedChipText: {
    color: "white",
  },
  divider: {
    marginTop: 16,
    marginBottom: 16,
  },
})

export default FilterSheet
