import React from "react";

import {  View,Text,Image} from "react-native";
import { useSelector } from "react-redux";

const sunset = require("../Image/sunset.png");
const sunrise = require("../Image/sunrise.png");

const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(':');
  return `${hour}:${minute}`;
};

const Sunset = () => {
  const { data, loading, error } = useSelector((state) => state.weather);

  
  if (!data)  
    {
    return <Text>No data available</Text>;  
    }

  return (
    <View style={styles.container}>
    <View style={styles.box}>
      
       <View style={styles.set}>
        <Image source={sunset} style={styles.image} />
         <Text style={styles.subtitle}>sunrise</Text>
         <Text style={styles.subtitle1}>{formatTime(data.days[0].sunrise)}</Text>
       </View>
       <View style={styles.set}>
        <Image source={sunrise} style={styles.image} />
         <Text style={styles.subtitle}>Sunset</Text>
         <Text style={styles.subtitle1}>{formatTime(data.days[0].sunset)}</Text>
       </View>
      </View>
    </View>
  );
};

export default Sunset;

const styles = {
    container: {
        flex: 1,
    
       
        marginLeft: 15,
        marginRight: 15,

    
    },
    set: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap:5,
    },
    box: {
        height: 120,
        borderRadius: 10,
        width: "100%",
        marginTop: 15,
        // marginLeft: -15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#00C1F6",
       
       paddingLeft: "15%",
         paddingRight: "15%",
         shadowColor: "#000",
         shadowOffset: {
             width: 0,
             height: 3,
         },
         shadowOpacity: 0.36,
         shadowRadius: 3,
         elevation: 3,
         
    },
    subtitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "normal",
        
    },
    subtitle1: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "normal",
        
    },
    image: {
        width: 50,
        height: 32.88,
    },
    };
