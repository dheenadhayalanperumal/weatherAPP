import React from "react";
import { View, Text, Image } from "react-native";
import { useSelector } from "react-redux";

// const sun = require("../Image/icon/cloudy.png");



const WeeklyData = () => {
    const { data, loading, error } = useSelector((state) => state.weather);

    // Check if data is null or undefined before logging
    if (data && data.days && data.days[0]) {
        console.log(data.days[0].temp);
    }

    // Check if data is null or undefined, or if days is not an array or empty
    if (!data || !Array.isArray(data.days) || data.days.length === 0) {
        return <Text>No data available</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Forecast</Text>
            <View>
                {data.days.map((day, index) => {
                    const date = new Date(day.datetime);
                    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return (
                        <View key={index} style={styles.smallbox}>
                            <Text style={styles.subtitle}>{formattedDate}</Text>
                            {/* <Image source={sun} style={styles.image} /> */}
                            <Text style={styles.subtitle}>{day.conditions}</Text>
                            <Text style={styles.subtitle}>{day.tempmin}/{day.tempmax}°C</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};



export default WeeklyData;

const styles = {
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "column",
        paddingLeft: 15,
        paddingRight: 15,
    },
    smallbox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5, // Adds space between each day's forecast
        padding: 10, // Adds padding inside each box
        backgroundColor: "#fff", // Light background color to distinguish each day
        borderRadius: 8, // Rounds the corners of each box
    },
    image: {
        width: 30,
        height: 30,
    },
    subtitle: {
        color: "#5AB2FF",
        fontSize: 13,
        fontWeight: "normal",

    },
    title: {
        color: "#3FA2F6",
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "medium",
        textAlign: "left",
    },
};
