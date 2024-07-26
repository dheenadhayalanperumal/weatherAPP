import React from "react";
import { Text, View, Image } from "react-native";

// Object to map image names to their respective require statements
const imageSources = {
  'clear-day': require('../Image/icon/clear-day.gif'),
  'clear-night': require('../Image/icon/clear-night.gif'),
  'cloudy': require('../Image/icon/cloudy.png'),
  'fog': require('../Image/icon/fog.gif'),
  'hail': require('../Image/icon/hail.png'),
  'partly-cloudy-day': require('../Image/icon/partly-cloudy-day.gif'),
  'partly-cloudy-night': require('../Image/icon/partly-cloudy-night.gif'),
  'rain-snow-showers-day': require('../Image/icon/rain-snow-showers-day.png'),
  'rain-snow-showers-night': require('../Image/icon/rain-snow-showers-night.png'),
  'rain-snow': require('../Image/icon/rain-snow.png'),
  'rain': require('../Image/icon/rain.gif'),
  'showers-day': require('../Image/icon/showers-day.gif'),
  'showers-night': require('../Image/icon/showers-night.gif'),
  'sleet': require('../Image/icon/sleet.png'),
  'snow-showers-day': require('../Image/icon/snow-showers-day.gif'),
  'snow-showers-night': require('../Image/icon/snow-showers-night.gif'),
  'snow': require('../Image/icon/snow.gif'),
  'thunder-rain': require('../Image/icon/thunder-rain.gif'),
  'thunder-showers-day': require('../Image/icon/thunder-showers-day.gif'),
  'thunder-showers-night': require('../Image/icon/thunder-showers-night.png'),
  'thunder': require('../Image/icon/thunder.png'),
  'wind': require('../Image/icon/wind.png'),
};

const HourData = ({ time, temperature, image, isLastItem }) => {
  return (
    <View
      style={[
        styles.container,
        isLastItem ? styles.noMargin : styles.marginRight,
      ]}
    >
      <View style={styles.smallbox}>
        <Text style={styles.subtitle}>{time}</Text>

        <Image
          source={imageSources[image] || imageSources['cloudy']}
          style={styles.image}
        />
        <Text style={styles.subtitle}>{temperature}°C</Text>
      </View>
    </View>
  );
};

export default HourData;

const styles = {
  container: {
    flex: 1,
    
  },
  marginRight: {
    marginRight: 10, // This handles the spacing between items
  },
  noMargin: {
    marginRight: 0,
  },
  smallbox: {
    height: 96,
    width: 80,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#00C1F6",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.36,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 10
    ,
    
  },
  image: {
    width: 30,
    height: 30,
resizeMode: "contain",
  },
  subtitle: {
    color: "white",
    fontSize: 12,
  },
};
