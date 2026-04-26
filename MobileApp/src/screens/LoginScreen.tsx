import React from 'react';
import { StyleSheet, View, Text, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
type Navigation = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { email, setEmail, password, setPassword, loading, error, login } = useLogin();
  const { continueAsGuest } = useAuth();

  function handleLogin() {
    login();
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

          <Pressable
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Unohtuiko salasana?</Text>
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.buttonText}>Kirjaudu sisään</Text>
            }
          </Pressable>
        </View>

        <View style={styles.guestContainer}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Tai</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={continueAsGuest}
            style={({ pressed }) => [
              styles.guestButton,
              pressed && styles.guestButtonPressed,
            ]}
          >
            <Text style={styles.guestButtonText}>Jatka vierailijana</Text>
          </Pressable>
        </View>

        <View style={styles.footerContainer}>
          <Pressable onPress={() => navigation.replace('Register')}>
            <Text style={styles.footerText}>
              Ei vielä käyttäjää? <Text style={styles.boldText}>Rekisteröidy</Text>
            </Text>
          </Pressable>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 32,
    marginTop: '55%',
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
    backgroundColor: colors.white,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: '#000000',
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
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
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  guestContainer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grayLight,
  },
  dividerText: {
    fontSize: 14,
    color: colors.gray,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.secondary,
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
  guestButtonPressed: {
    opacity: 0.8,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  guestButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  footerContainer: {
    marginTop: 'auto',    paddingTop: 40,
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
