import React from 'react';
import { StyleSheet, View, Text, Image, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Initialization'>;

const InitializationScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { continueAsGuest } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/PuluTextLogo.png')}
          style={styles.textLogo}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/PuluLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Pressable
          onPress={() => navigation.replace('Login')}
          style={({ pressed }) => [
            styles.button,
            styles.buttonPrimary, // tämä määrittelee vain napin värin
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Kirjaudu sisään</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.replace('Register')}
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Rekisteröidy</Text>
        </Pressable>

        <Pressable
          onPress={continueAsGuest}
          style={({ pressed }) => [
            styles.textButton,
            pressed && styles.textButtonPressed
          ]}
        >
          <Text style={styles.textButtonText}>Jatka ilman käyttäjää</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default InitializationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '85%',
    flex: 1,
    maxHeight: 450,
  },
  textLogo: {
    width: '60%',
    height: 100,
    marginTop: 20,
    marginBottom: -10,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 16,
    paddingBottom: 20,
  },
  button: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
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
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonPressed: {
    opacity: 0.8,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  textButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  textButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  textButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
});
