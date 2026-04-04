import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const LocationSelectScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}


      />
    </View>
  );
};