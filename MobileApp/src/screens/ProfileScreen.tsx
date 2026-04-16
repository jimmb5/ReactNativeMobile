import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useSavedPlacesData } from '../hooks/useSavedPlacesData';
import { colors } from '../theme/colors';
import PoiCard from '../components/PoiCard';

const ProfileScreen = () => {
  const { user, isGuest, signOut } = useAuth();
  const { places, loading, error } = useSavedPlacesData();

  if (isGuest && !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>Ei käyttäjää</Text>
          <Text style={styles.guestText}>
            Kirjaudu sisään nähdäksesi profiilisi ja tallennetut paikat.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.profileHeader}>
              <Text style={styles.displayName}>
                {user?.displayName ?? 'Käyttäjä'}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>

            <Text style={styles.sectionTitle}>Tallennetut paikat</Text>

            {loading && (
              <ActivityIndicator
                color={colors.primary}
                style={styles.loader}
              />
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            {!loading && !error && places.length === 0 && (
              <Text style={styles.emptyText}>
                Et ole vielä tallentanut yhtään paikkaa.
              </Text>
            )}
          </>
        }
        renderItem={({ item }) => <PoiCard poi={item} onPress={() => {}} />}
        ListFooterComponent={
          <Pressable
            onPress={signOut}
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutButtonPressed,
            ]}
          >
            <Text style={styles.signOutText}>Kirjaudu ulos</Text>
          </Pressable>
        }
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;

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
  profileHeader: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  displayName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.gray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    paddingHorizontal: 16,
    marginTop: 8,
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
  signOutButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  signOutButtonPressed: {
    opacity: 0.8,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  signOutText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  guestContainer: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  guestTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
  },
  guestText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
});
