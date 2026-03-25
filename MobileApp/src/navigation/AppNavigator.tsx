import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navTypes';
import { useAuth } from '../context/AuthContext';
import InitializationScreen from '../screens/InitializationScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ExploreScreen from '../screens/ExploreScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, isGuest, loading } = useAuth();


  // tämä on vain lataus indikaattori 
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user || isGuest ? (
        <>
        {/* <Stack.Screen name="Explore" component={ExploreScreen} /> */}
        <Stack.Screen name="Map" component={MapScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Initialization" component={InitializationScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
