import { View, StyleSheet } from "react-native"
import React from "react"
import { Avatar, Card, Chip, Text } from "react-native-paper"
import { Place } from "../types/place"
import { colors } from "../theme/colors"
import SaveButton from './SaveButton';
import { useAuth } from '../context/AuthContext';

type Props = {
  poi: Place
  onPress: () => void
}

const PoiCard = ({ poi, onPress }: Props) => {

  const { user } = useAuth();
  const isOwner = user?.uid === poi.createdBy;

  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Title
        title={poi.name}
        subtitle={poi.type}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="map-marker"
            color={colors.white}
            style={{ backgroundColor: colors.primary }}
          />
        )}
      />
      <Card.Content>
        {poi.type === "Reitti" ? (
          <Text variant="bodySmall">Pituus: {poi.length} m</Text>
        ) : null}
        <Text variant="bodySmall">
          {typeof poi.distance === "number"
            ? `Etäisyys: ${poi.distance.toFixed(1)} km`
            : ""}
        </Text>
        <Text variant="bodySmall">{poi.description}</Text>
        <View style={styles.tagsContainer}>
          {poi.tags.map((tag) => (
            <Chip key={tag} style={styles.chip} compact>
              <Text variant="bodySmall">{tag}</Text>
            </Chip>
          ))}
        </View>
        {!isOwner && (
          <View style={styles.saveButtonContainer}>
            <SaveButton place={poi} />
          </View>
        )}
      </Card.Content>
    </Card>
  )
}

export default PoiCard

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    backgroundColor: "#f3f3e7",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  chip: {
    backgroundColor: colors.tertiary,
    marginVertical: 2,
  },
  saveButtonContainer: {
  alignItems: 'flex-end',
  marginTop: 8,
},
})
