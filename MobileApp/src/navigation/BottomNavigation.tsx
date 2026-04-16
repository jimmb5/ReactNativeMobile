import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import LocationSelectScreen from '../screens/LocationSelectScreen';
import { colors } from '../theme/colors';

import ExploreScreen from '../screens/ExploreScreen';
import MapScreen from '../screens/MapScreen';
import AddPlaceScreen from '../screens/AddPlaceScreen';
import RoutesScreen from '../screens/RoutesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';

          if (route.name === 'Explore') iconName = 'compass';
          else if (route.name === 'Map') iconName = 'map';
          else if (route.name === 'Routes') iconName = 'list';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Routes" component={RoutesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={BottomNavigation} />
      <Stack.Screen name="AddPlace" component={AddPlaceScreen} />
      <Stack.Screen name="LocationSelect" component={LocationSelectScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;