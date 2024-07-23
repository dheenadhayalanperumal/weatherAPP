import React from "react";
import { Platform } from 'react-native';
import { useSelector } from "react-redux";

import { Text, View, Dimensions, Image } from "react-native";

const { width, height } = Dimensions.get("window");

const image = require("../Image/cloud.png");

const CurrentWeather = () => {
  const { data, loading, error } = useSelector((state) => state.weather);

  if (!data) {
    return <Text>No weather data available</Text>;
  }

  // console.log(weather);
  return (
    <View style={styles.container}>
      <View style={styles.weatherContainer}>
        <View style={styles.inner}>
          <View style={styles.weatherBox}>
            <Image source={image} style={styles.image} />
          </View>

          <View style={styles.weatherBox}>
            <Text style={styles.temp}>{data.days[0].temp}°C</Text>

            <Text style={styles.title}>FEEL LIKE</Text>

            <Text style={styles.subtitle}>{data.days[0].feelslike}°C</Text>
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
    alignItems: "left",
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
    fontFamily: "Poppins", // Set font to Poppins
  },
  subtitle: {
    fontSize: 16,
    fontWeight: Platform.OS === 'android' ? 'normal' : '500',
    color: "white", // Set font color to white
    fontFamily: "Poppins", // Set font to Poppins
  },
  temp: {
    fontSize: 36,
    fontWeight: Platform.OS === 'android' ? 'bold' : '700',
    color: "white", // Set font color to white
    fontFamily: "Poppins", // Set font to Poppins
  },
  subtitle1: {
    fontSize: 12,
    fontWeight: Platform.OS === 'android' ? 'normal' : '500',
    color: "white", // Set font color to white
    fontFamily: "Poppins", // Set font to Poppins
  },
    image: {
        width: 150,
        height: 150,
    },
};
