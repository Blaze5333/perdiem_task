/*eslint-disable*/
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/Login';
import HomeScreen from '../screens/home/Home';
import ProfileScreen from '../screens/profile/Profile';


// Ignore specific warnings that might be causing issues

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{headerShown: false}} 
        initialRouteName='Login'>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Profile" 
          component={ProfileScreen} 
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
