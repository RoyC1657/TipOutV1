import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs () {
    return (
        <Tab.Navigator screenOptions = {{ headerShown: false}}initialRouteName="Main">
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    )
}