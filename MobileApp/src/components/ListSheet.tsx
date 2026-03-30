import React, { useCallback, useMemo, useRef } from "react"
import { View, Text, StyleSheet } from "react-native"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"

const ListSheet = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null)

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index)
  }, [])

  // renders
  return (
    <BottomSheet ref={bottomSheetRef} onChange={handleSheetChanges}>
      <BottomSheetView style={styles.contentContainer}>
        <Text>Tähän tulee lista hakutuloksista</Text>
      </BottomSheetView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
})

export default ListSheet
