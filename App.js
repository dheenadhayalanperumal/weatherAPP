import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,Dimensions } from 'react-native';
import Home from './component/home';

export default function App() {
  return (
    <View style={styles.container}>

    <Home /> 
      <StatusBar style="dark-content" hidden={false}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
});
