import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWeatherData } from './actions/weatherActions';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Home from './component/home';

export default function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchWeatherData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Home />
      <StatusBar style="dark-content" hidden={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#CAF4FF",
    paddingTop: 40, // Corrected typo here
  },
});