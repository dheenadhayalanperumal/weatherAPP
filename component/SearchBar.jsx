import React, { useState, useRef } from "react";
import { Platform, Keyboard } from "react-native";
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
  const inputRef = useRef(null);

  const handleChange = (text) => {
    setLocation(text);
  };

  const handleSearch = () => {
    if (location.trim()) {
      // console.log(location);
      dispatch(fetchWeatherData(location.trim()));
      // Dismiss keyboard after search
      Keyboard.dismiss();
      // Blur the input to remove focus
      inputRef.current?.blur();
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Enter') {
      handleSearch();
    }
    // Handle right arrow key for search
    if (event.nativeEvent.key === 'ArrowRight' && location.trim()) {
      handleSearch();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Search}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Enter City Name..."
          onChangeText={handleChange}
          value={location}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          enablesReturnKeyAutomatically={true}
          blurOnSubmit={false}
          accessibilityLabel="City name input"
          accessibilityHint="Enter the name of the city to get weather information, then press Enter or the search button"
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSearch}
          accessibilityLabel="Search weather"
          accessibilityHint="Search for weather information for the entered city"
          accessibilityRole="button"
        >
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
    height: Math.max(height / 20, 48), // Ensure minimum 48dp height
    minHeight: 48,
    justifyContent: "center",
    paddingLeft: 25,
    borderRadius: 8,
    fontWeight: Platform.OS === "android" ? "medium" : "500",
    fontSize: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#00C1F6",
    width: Math.max(80, 48), // Ensure minimum 48dp width
    height: Math.max(height / 20, 48), // Ensure minimum 48dp height
    justifyContent: "center",
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: Platform.OS === "android" ? "normal" : "500",
    fontSize: 14,
  },
};