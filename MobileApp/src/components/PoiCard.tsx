import { View, StyleSheet } from "react-native"
import React from "react"
import { Avatar, Card, Chip, Text } from "react-native-paper"
import { Place } from "../types/place"
import { colors } from "../theme/colors"

type Props = {
  poi: Place
  onPress: () => void
}

const PoiCard = ({ poi, onPress }: Props) => {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Title
        title={poi.name}
        subtitle={poi.type}
        left={(props) => <Avatar.Icon {...props} icon="map-marker" color={colors.white} style={{ backgroundColor: colors.primary }} />}
      />
      <Card.Content>
        {poi.type === "Reitti" ? (
          <Text variant="bodySmall">Pituus: {poi.length} km</Text>
        ) : null}
        <Text variant="bodySmall">Etäisyys: {poi.distance} km</Text>
        <Text variant="bodySmall">{poi.description}</Text>
        <View style={styles.tagsContainer}>
          {poi.tags.map((tag) => (
            <Chip key={tag} style={styles.chip} compact>
              <Text variant="bodySmall">{tag}</Text>
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  )
}

export default PoiCard

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    backgroundColor: colors.background,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
  },
})
