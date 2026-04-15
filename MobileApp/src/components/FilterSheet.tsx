import React, { useCallback, useRef } from "react"
import { StyleSheet } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Chip, Text } from "react-native-paper"

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet | null>
}

const FilterSheet = ({ bottomSheetRef }: Props) => {
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
})

export default FilterSheet
