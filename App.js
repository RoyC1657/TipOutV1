import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from './src/screens/WelcomeScreen';
import MainScreen from './src/screens/MainScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HomeTabs from './src/navigation/HomeTabs';


const Stack = createStackNavigator();
const Tap = createBottomTabNavigator();

export default function App() {
  return(
    <PaperProvider>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false}}>
              <Stack.Screen name="Welcome" component = {WelcomeScreen} />
              <Stack.Screen name="HomeTabs" component = {HomeTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    </PaperProvider>
  )
}
