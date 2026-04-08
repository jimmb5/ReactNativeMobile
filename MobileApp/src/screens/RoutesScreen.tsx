import React, { useMemo } from "react"
import { View, StyleSheet, Text, ScrollView } from "react-native"
import { pois, Poi } from "../data/pois"

const RoutesScreen = () => {
  const routes: Poi[] = useMemo(
    () => pois.filter((poi) => poi.type === "Reitti"),
    []
  )

  // Find max length for scaling bars
  const maxLength = Math.max(...routes.map((r) => r.length || 0), 1)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Move title down a bit */}
      <Text style={styles.title}>Reitit</Text>

      {/* Horizontal chart */}
      <ScrollView horizontal style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {routes.map((route) => {
            // Scale bar width based on route length
            const barWidth = ((route.length || 0) / maxLength) * 200 // max 200px
            return (
              <View key={route.id} style={styles.barWrapper}>
                <View style={[styles.bar, { width: barWidth }]} />
                <Text style={styles.barLabel} numberOfLines={1}>
                  {route.name}
                </Text>
                <Text style={styles.barLength}>{route.length || "N/A"} km</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </ScrollView>
  )
}

export default RoutesScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  chartScroll: {
    paddingBottom: 16,
  },
  chartContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  barWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bar: {
    height: 24,
    backgroundColor: "#2f95dc",
    borderRadius: 4,
    marginRight: 12,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  barLength: {
    fontSize: 12,
    color: "gray",
    marginLeft: 6,
  },
})