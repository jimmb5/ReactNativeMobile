import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface MapProps {
  region: Region;
  heading?: number;
}

const Map = ({ region, heading }: MapProps) => {
  return (
    <MapView
      style={styles.map}
      region={region}
      camera={
        heading !== undefined
          ? {
              center: {
                latitude: region.latitude,
                longitude: region.longitude,
              },
              pitch: 0,
              heading: heading,
              zoom: 15,
            }
          : undefined
      }
    >
      <Marker
        coordinate={{
          latitude: region.latitude,
          longitude: region.longitude,
        }}
        title="Your Location"
        description="You are here"
        pinColor="red"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default Map;
