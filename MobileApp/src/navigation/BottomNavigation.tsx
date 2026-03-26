import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ExploreScreen from '../screens/ExploreScreen';
import MapScreen from '../screens/MapScreen';
import AddPlaceScreen from '../screens/AddPlaceScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Explore') iconName = 'compass';
          else if (route.name === 'Map') iconName = 'map';
          else if (route.name === 'AddPlace') iconName = 'add-circle';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="AddPlace" component={AddPlaceScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;