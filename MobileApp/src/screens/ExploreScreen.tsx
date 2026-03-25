import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ExploreScreen = () => {
  const { user, isGuest } = useAuth(); // isguestilla erilaisia näkymiä

  return (
    <View style={styles.container}>
      {user
        ? <Text style={styles.text}>Tervetuloa, {user.displayName}!</Text>
        : <Text style={styles.text}>Selaat vierailijana</Text>
      }
    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
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
