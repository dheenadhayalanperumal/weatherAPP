import React from "react";
import { Platform } from 'react-native';
import { useSelector } from "react-redux";

import { Text, View, Dimensions, Image } from "react-native";

const { width, height } = Dimensions.get("window");



const imageSources = {
  'clear-day': require('../Image/icon/clear-day.png'),
  'clear-night': require('../Image/icon/clear-night.png'),
  'cloudy': require('../Image/icon/cloudy.png'),
  'fog': require('../Image/icon/fog.png'),
  'hail': require('../Image/icon/hail.png'),
  'partly-cloudy-day': require('../Image/icon/partly-cloudy-day.png'),
  'partly-cloudy-night': require('../Image/icon/partly-cloudy-night.png'),
  'rain-snow-showers-day': require('../Image/icon/rain-snow-showers-day.png'),
  'rain-snow-showers-night': require('../Image/icon/rain-snow-showers-night.png'),
  'rain-snow': require('../Image/icon/rain-snow.png'),
  'rain': require('../Image/icon/rain.png'),
  'showers-day': require('../Image/icon/showers-day.png'),
  'showers-night': require('../Image/icon/showers-night.png'),
  'sleet': require('../Image/icon/sleet.png'),
  'snow-showers-day': require('../Image/icon/snow-showers-day.png'),
  'snow-showers-night': require('../Image/icon/snow-showers-night.png'),
  'snow': require('../Image/icon/snow.png'),
  'thunder-rain': require('../Image/icon/thunder-rain.png'),
  'thunder-showers-day': require('../Image/icon/thunder-showers-day.png'),
  'thunder-showers-night': require('../Image/icon/thunder-showers-night.png'),
  'thunder': require('../Image/icon/thunder.png'),
  'wind': require('../Image/icon/wind.png'),
  // 'default': require('../Image/icon/default.png'), // Default image
};

const CurrentWeather = () => {
  const { data, loading, error } = useSelector((state) => state.weather);

  // console.log(data.currentConditions.icon);

  if (!data) {
    return <Text>No weather data available</Text>;
  }

  // console.log(weather);
  return (
    <View style={styles.container}>
      <View style={styles.weatherContainer}>
        
        <View style={styles.inner}>
          <View style={styles.weatherBox}>

            <Image source={imageSources[data.currentConditions.icon]} style={styles.image} />
            <Text style={styles.title2}>{data.currentConditions.conditions}</Text>
            {
              data.currentConditions.precipprob ? <Text style={styles.subtitle2}>{data.currentConditions.precipprob}%</Text> : null
            }
            
          </View>

          <View style={styles.weatherBox}>
          <Text style={styles.title}>{data.address}</Text>
            <Text style={styles.temp}>{data.currentConditions.temp}°C</Text>

            <Text style={styles.title}>FEEL LIKE</Text>

            <Text style={styles.subtitle}>{data.currentConditions.feelslike}°C</Text>
          </View>
        </View>
        <View style={styles.weatherBox1}>
          <Text style={styles.subtitle1}>Min Temp {data.days[0].tempmin}°C</Text>

          <Text style={styles.subtitle1}>Max Temp {data.days[0].tempmax}°C</Text>
        </View>
      </View>
    </View>
  );
};

export default CurrentWeather;
const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
paddingLeft: 15,
paddingRight: 15,
     // This sets the color for the container, but not for text elements inside it
  },

  
  weatherContainer: {
    // padding: 10,
    width: width - 30,
    height: 210,
    backgroundColor: "#00C1F6",
    borderRadius: 10,
    marginTop: 15,
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 3,
    elevation: 3,
    
  },
  inner: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  weatherBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  weatherBox1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 20,

   
  },
  title: {
    fontSize: 18,
    fontWeight: "medium",
    color: "white", // Set font color to white
    // fontFamily: "Poppins", // Set font to Poppins
  },
  subtitle: {
    fontSize: 16,
    fontWeight: Platform.OS === 'android' ? 'normal' : '500',
    color: "white", // Set font color to white
    // fontFamily: "Poppins", // Set font to Poppins
  },
  temp: {
    fontSize: 36,
    fontWeight: Platform.OS === 'android' ? 'bold' : '700',
    color: "white", // Set font color to white
    // fontFamily: "Poppins", // Set font to Poppins
  },
  subtitle1: {
    fontSize: 12,
    fontWeight: Platform.OS === 'android' ? 'normal' : '500',
    color: "white", // Set font color to white
    // fontFamily: "Poppins", // Set font to Poppins
  },
    image: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        
    },
    title2: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white", // Set font color to white
      // fontFamily: "Poppins", // Set font to Poppins
    },
    subtitle2: {
      fontSize: 10,
      fontWeight: Platform.OS === 'android' ? 'normal' : '500',
      color: "yellow", // Set font color to white
      // fontFamily: "Poppins", // Set font to Poppins
    },
};
