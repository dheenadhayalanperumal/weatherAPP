import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ContentBox from "./ContentBox";
import HourDataCollection from "./HourdataColeection";
import WeeklyData from "./weeklydata";
import Sunset from "./Sunset";
import WeatherLoadingAnimation from "./WeatherLoadingAnimation";
import { useSelector } from "react-redux"; // Import useSelector
import { useDispatch } from "react-redux"; // Import useDispatch
import { fetchWeatherData } from "../actions/weatherActions"; // Import fetchWeatherData



const Home = () => {
  const dispatch = useDispatch();
  
  const { data, loading, error } = useSelector((state) => state.weather);

//  console.log(data);
  
if (loading) {
  return <WeatherLoadingAnimation />
}

if (error) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}> {error}</Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={() => dispatch(fetchWeatherData("Chennai"))}
        accessibilityLabel="Retry button"
        accessibilityHint="Tap to retry fetching weather data"
        accessibilityRole="button"
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View> 
    
  );
}

  return (
    <ScrollView>
      <View style={styles.container}>
        <SearchBar />
        <CurrentWeather />
        <ContentBox />
        <Sunset />
        <HourDataCollection />
        <WeeklyData />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = {
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
    color: "white",
    
  },
  subtitle: {
    color: "#3FA2F6",
    fontSize: 20,
    marginTop: 10,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#00C1F6",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 120,
    minHeight: 48, // Ensure minimum 48dp height
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
};
