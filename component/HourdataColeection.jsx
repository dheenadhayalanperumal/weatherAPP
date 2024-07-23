import React from "react";
import { ScrollView, View, Text, Dimensions } from "react-native";
import HourData from "./HourData";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

// Function to format time from "HH:MM:SS" to "HH:MM"
const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
};

const HourDataCollection = () => {
    const { data, loading, error } = useSelector((state) => state.weather);

    // Handle loading state
    if (loading) {
        return <Text>Loading...</Text>;
    }

    // Handle error state
    if (error) {
        return <Text>Error: {error}</Text>;
    }

    // Handle cases where data or days may be undefined
    if (!data || !data.days || !data.days[0] || !data.days[0].hours) {
        return <Text>No data available</Text>;
    }

    const hours = data.days[0].hours;

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.subtitle}>Hourly Forecast</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                {hours.map((item, index) => (
                    <HourData
                        key={index}
                        time={formatTime(item.datetime)}  // Format the time here
                        temperature={item.temp}
                        image={item.icon}  // Ensure 'icon' is the correct property name
                        isLastItem={index === hours.length - 1}  // Corrected from data.length
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default HourDataCollection;

const styles = {
    scrollContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
    },
    container: {
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    subtitle: {
        color: "#3FA2F6",
        fontSize: 18,
        marginTop: 10,
        fontWeight: "medium",
        marginLeft: 15,
    },
};
