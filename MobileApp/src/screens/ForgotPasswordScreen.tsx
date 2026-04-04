import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useForgotPassword } from '../hooks/useForgotPassword';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { email, setEmail, loading, error, success, sendResetEmail, reset } = useForgotPassword();

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

          {success ? (
            <>
              <Text style={styles.title}>Tarkista sähköpostisi</Text>
              <Text style={styles.subtitle}>
                Lähetimme palautuslinkin osoitteeseen{' '}
                <Text style={styles.boldText}>{email}</Text>
                {'. '}Tarkista myös roskaposti.
              </Text>

              <View style={[styles.formContainer, { marginTop: 48 }]}>
                <Pressable
                  onPress={() => navigation.navigate('Login')}
                  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.buttonText}>Kirjaudu sisään</Text>
                </Pressable>

                <Pressable
                  onPress={reset}
                  style={({ pressed }) => [styles.buttonSecondary, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.buttonText}>Pyydä uudelleen</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Unohtuiko salasana?</Text>
              <Text style={styles.subtitle}>
                Syötä sähköpostiosoitteesi, niin lähetämme sinulle linkin salasanan vaihtamiseen.
              </Text>

              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Sähköpostiosoite"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Pressable
                  onPress={sendResetEmail}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    loading && styles.buttonDisabled,
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.buttonText}>Lähetä palautuslinkki</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.footerContainer}>
                <Pressable onPress={() => navigation.goBack()}>
                  <Text style={styles.footerText}>
                    Muistitko sittenkin salasanasi?{' '}
                    <Text style={styles.boldText}>Kirjaudu sisään</Text>
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

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
    marginTop: '45%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: '60%',
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
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
  buttonSecondary: {
    width: '100%',
    height: 56,
    backgroundColor: '#E87722',
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
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
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
