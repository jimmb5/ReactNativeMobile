import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navTypes';


const LocationSelectScreen = () => {
  // kaikki staten ja hookien määrittelyt tänne
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'LocationSelect'>>();
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // funktiot tänne
  const handleConfirm = () => {
    if (!selectedLocation) return;
    route.params.onLocationSelected(
      selectedLocation.latitude,
      selectedLocation.longitude
    );
    navigation.goBack();
  };

  // return tänne
  return (
    <View style={styles.container}>
      <MapView
  style={styles.map}
  onPress={(e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  }}
>
  {selectedLocation && (
    <Marker coordinate={selectedLocation} />
  )}
</MapView>
<TouchableOpacity
  style={[styles.confirmButton, !selectedLocation && styles.confirmButtonDisabled]}
  onPress={handleConfirm}
  disabled={!selectedLocation}
>
  <Text style={styles.confirmButtonText}>Vahvista sijainti</Text>
</TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  confirmButton: {
    backgroundColor: '#2f95dc',
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: 'gray',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LocationSelectScreen;