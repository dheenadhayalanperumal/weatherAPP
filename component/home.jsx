import React, { useEffect } from "react";

import {  View, ScrollView,Text } from "react-native";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ContentBox from "./ContentBox";
import HourDataCollection from "./HourdataColeection";
import WeeklyData from "./weeklydata";
import Sunset from "./Sunset";
import { setWeatherData} from "../reducers/weatherReducer"; // Import setWeatherData
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector




const Home = () => {
  const dispatch = useDispatch();
  const weatherData = useSelector(state => state.weatherData); 

  const [load, setLoad] = React.useState(true);
  

  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        
        const response = await fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/13.0843,80.2705?key=YDKLNUJLBQLPSZXWKD3MT5XQS");
        const data = await response.json();
        console.log(data.address);
        dispatch(setWeatherData(data));
        dispatch({ type: 'SET_MOVIE_ID', payload: id });
        // console.log(data);
        setLoad(false);

      } catch (error) {
        console.error(error);
        setLoad(false);
      }
    };
  
    fetchWeather();
  }, []);

  console.log(weatherData);

  {
    if (load) {
      return <Text>Loading...</Text>;
  }
  }

  
  return (
    <ScrollView>
      <View style={styles.container}>
        <SearchBar />
        <CurrentWeather />
        <ContentBox />

      
          {/* <View>
            <Text>Location: {weatherData}</Text>
           
          </View> */}
     

        <HourDataCollection />
        <WeeklyData />
        <Sunset />
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
