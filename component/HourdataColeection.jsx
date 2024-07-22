import React from "react";
import { ScrollView, View,Text, Dimensions } from "react-native";
import HourData from "./HourData";

const { width } = Dimensions.get("window");

const data = [
    {
        time: "12:00",
        temperature: "30",
        image: require("../Image/cloud.png")
    },
    {
        time: "13:00",
        temperature: "31",
        image: require("../Image/cloud.png")
    },
    {
        time: "14:00",
        temperature: "32",
        image: require("../Image/cloud.png")
    },
    {
        time: "15:00",
        temperature: "33",
        image: require("../Image/cloud.png")
    },
    {
        time: "16:00",
        temperature: "34",
        image: require("../Image/cloud.png")
    },
    {
        time: "17:00",
        temperature: "35",
        image: require("../Image/cloud.png")
    },
    {
        time: "18:00",
        temperature: "36",
        image: require("../Image/cloud.png")
    },
    {
        time: "19:00",
        temperature: "37",
        image: require("../Image/cloud.png")
    },
    {
        time: "20:00",
        temperature: "38",
        image: require("../Image/cloud.png")
    },
    {
        time: "21:00",
        temperature: "39",
        image: require("../Image/cloud.png")
    },
];

const HourDataCollection = () => {
    return (
        <View style={styles.container}>
            <View>
            <Text style={styles.subtitle}>Hourly Forecast</Text>  
            </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} >
            
            
            {data.map((item, index) => (
                <HourData
                    key={index}
                    time={item.time}
                    temperature={item.temperature}
                    image={item.image}
                    isLastItem={index === data.length - 1}
                />
            ))}
        </ScrollView>
        </View>
       
    );
}

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
        fontSize: 20,
        marginTop: 10,
        fontWeight: "bold",
        marginLeft: 15,
        
      },
  
};
