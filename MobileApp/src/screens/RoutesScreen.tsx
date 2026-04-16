import React, { useMemo, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from "react-native"
import { pois, Poi } from "../data/pois"
import { colors } from "../theme/colors"

const RoutesScreen = () => {
  const [graphType, setGraphType] = useState<
    "bar" | "vertical" | "dots" | "stats"
  >("bar")

  const routes: Poi[] = useMemo(
    () => pois.filter((poi) => poi.type === "Reitti"),
    []
  )

  const maxLength = routes.length
    ? Math.max(...routes.map((r) => r.length || 0))
    : 1

  const screenWidth = Dimensions.get("window").width
  const maxBarWidth = screenWidth * 0.6

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reitit</Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Text
          style={[
            styles.button,
            graphType === "bar" && styles.buttonActive,
          ]}
          onPress={() => setGraphType("bar")}
        >
          Bar
        </Text>

        <Text
          style={[
            styles.button,
            graphType === "vertical" && styles.buttonActive,
          ]}
          onPress={() => setGraphType("vertical")}
        >
          Vertical
        </Text>

        <Text
          style={[
            styles.button,
            graphType === "dots" && styles.buttonActive,
          ]}
          onPress={() => setGraphType("dots")}
        >
          Dots
        </Text>

        <Text
          style={[
            styles.button,
            graphType === "stats" && styles.buttonActive,
          ]}
          onPress={() => setGraphType("stats")}
        >
          Stats
        </Text>
      </View>

      <View style={styles.chartContainer}>
        {/* BAR */}
        {graphType === "bar" &&
          routes.map((route) => {
            const width =
              ((route.length || 0) / maxLength) * maxBarWidth

            return (
              <View key={route.id} style={styles.barRow}>
                <View style={[styles.bar, { width }]} />
                <Text style={styles.label}>{route.name}</Text>
                <Text style={styles.value}>
                  {route.length ? `${route.length} km` : "N/A"}
                </Text>
              </View>
            )
          })}

        {/* VERTICAL */}
        {graphType === "vertical" && (
          <View style={styles.verticalWrapper}>
            {routes.map((route) => {
              const height =
                ((route.length || 0) / maxLength) * 160

              return (
                <View key={route.id} style={styles.verticalItem}>
                  <View style={[styles.verticalBar, { height }]} />
                  <Text style={styles.smallLabel} numberOfLines={1}>
                    {route.name}
                  </Text>
                </View>
              )
            })}
          </View>
        )}

        {/* DOTS */}
        {graphType === "dots" &&
          routes.map((route) => {
            const count = Math.round(
              ((route.length || 0) / maxLength) * 10
            )

            return (
              <Text key={route.id} style={styles.dotRow}>
                {route.name}: {"●".repeat(count)}
              </Text>
            )
          })}

        {/* CLEAN STATS (NO PERCENTAGES) */}
        {graphType === "stats" &&
          routes
            .slice()
            .sort((a, b) => (b.length || 0) - (a.length || 0))
            .map((route, index) => {
              const value = route.length || 0

              return (
                <View key={route.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.rank}>#{index + 1}</Text>
                    <Text style={styles.cardTitle}>
                      {route.name}
                    </Text>
                    <Text style={styles.cardValue}>
                      {value ? `${value} km` : "N/A"}
                    </Text>
                  </View>

                  <View style={styles.simpleBarBg}>
                    <View
                      style={[
                        styles.simpleBarFill,
                        {
                          width:
                            (value / maxLength) * maxBarWidth,
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
    fontSize: 12,
  },

  buttonActive: {
    backgroundColor: colors.primary,
    color: "#fff",
  },

  chartContainer: {
    width: "100%",
  },

  /* BAR */
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

  /* VERTICAL */
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

  /* DOTS */
  dotRow: {
    marginBottom: 10,
    fontSize: 14,
  },

  /* STATS (clean version) */
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