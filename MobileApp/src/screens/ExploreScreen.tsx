import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const ExploreScreen = () => {
  const { user, isGuest } = useAuth(); // isguestilla erilaisia näkymiä

  return (
    <SafeAreaView style={styles.safeArea}>
      {user
        ? <Text style={styles.text}>Tervetuloa, {user.displayName}!</Text>
        : <Text style={styles.text}>Selaat vierailijana</Text>
      }
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFBEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
  },
});
