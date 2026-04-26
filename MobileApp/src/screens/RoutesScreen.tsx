import React, { useEffect, useMemo, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from "react-native"
import { getAllPlaces } from "../../services/placeService"
import { Place } from "../types/place"
import { colors } from "../theme/colors"

type GraphType = "palkki" | "pylväs" | "pisteet" | "tilasto"

const RoutesScreen = () => {
  const [graphType, setGraphType] = useState<GraphType>("palkki")
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPlaces()
        setPlaces(data)
      } catch (error) {
        console.error("Error fetching places:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const routes = useMemo(() => {
    return places.filter(
      (p) => p.type?.toLowerCase() === "reitti"
    )
  }, [places])

  const maxLength = useMemo(() => {
    return routes.length
      ? Math.max(...routes.map((r) => r.length || 0))
      : 1
  }, [routes])

  const screenWidth = Dimensions.get("window").width
  const maxBarWidth = screenWidth * 0.6

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Ladataan reittejä...</Text>
      </View>
    )
  }

  if (routes.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Ei reittejä löytynyt</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reitit</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {[
          { key: "palkki", label: "Palkki" },
          { key: "pylväs", label: "Pylväs" },
          { key: "pisteet", label: "Pisteet" },
          { key: "tilasto", label: "Tilasto" },
        ].map((item) => (
          <Text
            key={item.key}
            style={[
              styles.button,
              graphType === item.key && styles.buttonActive,
            ]}
            onPress={() =>
              setGraphType(item.key as GraphType)
            }
          >
            {item.label}
          </Text>
        ))}
      </View>

      <View style={styles.chartContainer}>
        {/* PALKKI */}
        {graphType === "palkki" &&
          routes.map((route) => {
            const value = route.length || 0
            const width =
              (value / maxLength) * maxBarWidth

            return (
              <View key={route.id} style={styles.barRow}>
                <View
                  style={[styles.bar, { width }]}
                />
                <Text style={styles.label}>
                  {route.name}
                </Text>
                <Text style={styles.value}>
                  {value ? `${value} km` : "N/A"}
                </Text>
              </View>
            )
          })}

        {/* PYLVÄS */}
        {graphType === "pylväs" && (
          <View style={styles.verticalWrapper}>
            {routes.map((route) => {
              const value = route.length || 0
              const height =
                (value / maxLength) * 160

              return (
                <View
                  key={route.id}
                  style={styles.verticalItem}
                >
                  <View
                    style={[
                      styles.verticalBar,
                      { height },
                    ]}
                  />
                  <Text
                    style={styles.smallLabel}
                    numberOfLines={1}
                  >
                    {route.name}
                  </Text>
                </View>
              )
            })}
          </View>
        )}

        {/* PISTEET */}
        {graphType === "pisteet" &&
          routes.map((route) => {
            const value = route.length || 0
            const count = Math.round(
              (value / maxLength) * 10
            )

            return (
              <Text
                key={route.id}
                style={styles.dotRow}
              >
                {route.name}: {"●".repeat(count)}
              </Text>
            )
          })}

        {/* TILASTO */}
        {graphType === "tilasto" &&
          routes
            .slice()
            .sort(
              (a, b) =>
                (b.length || 0) - (a.length || 0)
            )
            .map((route, index) => {
              const value = route.length || 0

              return (
                <View
                  key={route.id}
                  style={styles.card}
                >
                  <View style={styles.cardTop}>
                    <Text style={styles.rank}>
                      #{index + 1}
                    </Text>
                    <Text style={styles.cardTitle}>
                      {route.name}
                    </Text>
                    <Text style={styles.cardValue}>
                      {value ? `${value} km` : "N/A"}
                    </Text>
                  </View>

                  <View
                    style={styles.simpleBarBg}
                  >
                    <View
                      style={[
                        styles.simpleBarFill,
                        {
                          width:
                            (value / maxLength) *
                            maxBarWidth,
                        },
                      ]}
                    />
                  </View>
                </View>
              )
            })}
      </View>
    </ScrollView>
  )
}

export default RoutesScreen

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: colors.background,
    flexGrow: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
  },

  buttonActive: {
    backgroundColor: colors.primary,
    color: "#fff",
  },

  chartContainer: {
    width: "100%",
  },

  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  bar: {
    height: 22,
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginRight: 10,
  },

  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },

  value: {
    fontSize: 12,
    color: colors.gray,
  },

  verticalWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 200,
  },

  verticalItem: {
    alignItems: "center",
    marginRight: 12,
    width: 50,
  },

  verticalBar: {
    width: 18,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  smallLabel: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },

  dotRow: {
    marginBottom: 10,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  rank: {
    fontWeight: "bold",
    marginRight: 8,
    color: colors.primary,
  },

  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },

  cardValue: {
    fontSize: 12,
    color: colors.gray,
  },

  simpleBarBg: {
    height: 6,
    backgroundColor: "#e6e6e6",
    borderRadius: 4,
    overflow: "hidden",
  },

  simpleBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
})