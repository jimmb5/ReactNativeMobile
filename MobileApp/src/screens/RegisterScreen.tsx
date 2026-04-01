import React from 'react';
import { StyleSheet, View, Text, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useRegister } from '../hooks/useRegister';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { username, setUsername, email, setEmail, password, setPassword, loading, error, register } = useRegister();

  function handleRegister() {
    register();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/PuluTextLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Käyttäjänimi"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Sähköpostiosoite"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Salasana"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.buttonText}>Rekisteröidy</Text>
            }
          </Pressable>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Tai rekisteröidy käyttämällä</Text>

          <View style={styles.socialButtonsRow}>
            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
            >
              <Image source={require('../../assets/google.png')} style={styles.socialLogo} resizeMode="contain" />
              <Text style={styles.socialButtonLabel}>Google</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
            >
              <Image source={require('../../assets/facebook.png')} style={styles.socialLogo} resizeMode="contain" />
              <Text style={styles.socialButtonLabel}>Facebook</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Pressable onPress={() => navigation.replace('Login')}>
            <Text style={styles.footerText}>
              Oletko jo käyttäjä? <Text style={styles.boldText}>Kirjaudu sisään</Text>
            </Text>
          </Pressable>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFBEF',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 32,
    marginTop: '40%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: '60%',
    height: 100,
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 4,
    fontSize: 16,
    color: '#000000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#0F8226',
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
  buttonPressed: {
    opacity: 0.8,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  socialContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  socialText: {
    color: '#000000',
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 10,
  },
  socialButtonPressed: {
    opacity: 0.85,
  },
  socialLogo: {
    width: 22,
    height: 22,
  },
  socialButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#000000',
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
