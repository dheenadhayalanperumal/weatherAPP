import React from "react";
import { Text, View, Image } from "react-native";

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
          source={{
            uri: `../Image/icon/${image}.svg`,
          }}
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
  },
  image: {
    width: 30,
    height: 30,
  },
  subtitle: {
    color: "white",
    fontSize: 12,
  },
};
