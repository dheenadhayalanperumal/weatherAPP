import React from "react";
import { View, Text, Image } from "react-native";

const sun = require("../Image/cloud.png");

const WeeklyData = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Forecast</Text>
            <View>
                {days.map((day, index) => (
                    <View key={index} style={styles.smallbox}>
                        <Text style={styles.subtitle}>{day.name}</Text>
                        <Image source={sun} style={styles.image} />
                        <Text style={styles.subtitle}>Mostly Clear</Text>
                        <Text style={styles.subtitle}>27/20°C</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const days = [
    { name: "MON" },
    { name: "TUE" },
    { name: "WED" },
    { name: "THU" },
    { name: "FRI" },
    { name: "SAT" },
    { name: "SUN" },
];

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
        padding: 5, // Adds padding inside each box
        backgroundColor: "#f0f8ff", // Light background color to distinguish each day
        borderRadius: 8, // Rounds the corners of each box
    },
    image: {
        width: 30,
        height: 30,
    },
    subtitle: {
        color: "#0F67B1",
        fontSize: 14,
    },
    title: {
        color: "#3FA2F6",
        fontSize: 18,
        marginTop: 10,
        fontWeight: "medium",
        textAlign: "left",
    },
};
