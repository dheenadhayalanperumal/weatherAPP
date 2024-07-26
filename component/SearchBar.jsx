import React, { useState } from "react";
import { Platform } from "react-native";
import { fetchWeatherData } from '../actions/weatherActions';
import { useDispatch } from "react-redux";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
const { width, height } = Dimensions.get("window");
const Home = () => {
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();
  const handleChange = (text) => {
    setLocation(text);
  };

  const handleSearch = () => {
    console.log(location);
    // alert(location);

      dispatch(fetchWeatherData("{location}"));
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.Search}>
        <TextInput
          style={styles.input}
          placeholder="Enter City Name..."
          onChangeText={handleChange}
          value={Text}
        />

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = {
  container: {
    flex: 1,
    // padding: 10,
  },

  Search: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },

  input: {
    alignItems: "center",
    color: "#FFFFFF",
    backgroundColor: "#00C1F6",
    width: width - 120,
    height: height / 20,
    justifyContent: "center",
    paddingLeft: 25,
    borderRadius: 8,
    
    fontWeight: Platform.OS === "android" ? "medium" : "500",
    fontSize: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#00C1F6",
    width: width - (width - 80),
    height: height / 20,
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: Platform.OS === "android" ? "normal" : "500",
    fontSize: 14,
  },
};
