import React, { useEffect } from "react";
import { View, ScrollView, Text,ActivityIndicator, Button } from "react-native";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ContentBox from "./ContentBox";
import HourDataCollection from "./HourdataColeection";
import WeeklyData from "./weeklydata";
import Sunset from "./Sunset";
import { useSelector } from "react-redux"; // Import useSelector
import { useDispatch } from "react-redux"; // Import useDispatch
import { fetchWeatherData } from "../actions/weatherActions"; // Import fetchWeatherData



const Home = () => {
  const dispatch = useDispatch();
  
  const { data, loading, error } = useSelector((state) => state.weather);

//  console.log(data);
  
if (loading) {
  return  <ActivityIndicator size="large" />
}

if (error) {
  return (
    <View style={styles.container}>
      <Text> {error}</Text>
      <Button title="Retry" onPress={() => dispatch(fetchWeatherData("Chennai"))} />
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
};
