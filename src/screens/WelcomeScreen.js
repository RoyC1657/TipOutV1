import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';


export default function WelcomeScreen({ navigation }) {

  useEffect( () => {
    const timer = setTimeout(() => {
      navigation.replace('Main'); //Moves to MainScreen 
    }, 3000);                     //Sets delay for above function. Set to 3 seconds by default
    
    return () => clearTimeout(timer);
  }, []);
  


return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome screen</Text>
    </View>
  );
}
