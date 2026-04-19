import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyPlaces } from '../hooks/useMyPlaces';
import PoiCard from '../components/PoiCard';
import { colors } from '../theme/colors';

const MyPlacesScreen = () => {
  const { places, loading, error } = useMyPlaces();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Omat paikat</Text>
            {loading && <ActivityIndicator color={colors.primary} style={styles.loader} />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {!loading && !error && places.length === 0 && (
              <Text style={styles.emptyText}>Et ole vielä lisännyt yhtään paikkaa.</Text>
            )}
          </>
        }
        renderItem={({ item }) => <PoiCard poi={item} onPress={() => {}} />}
      />
    </SafeAreaView>
  );
};

export default MyPlacesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  loader: {
    marginTop: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyText: {
    color: colors.gray,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});