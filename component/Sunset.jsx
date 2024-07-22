import React from "react";

import {  View, ScrollView ,Text,Image} from "react-native";

const sunset = require("../Image/sunset.png");
const sunrise = require("../Image/sunrise.png");

const Sunset = () => {
  return (
    <View style={styles.container}>
    <View style={styles.box}>
      
       <View style={styles.set}>
        <Image source={sunset} style={styles.image} />
         <Text style={styles.subtitle}>sunrise</Text>
         <Text style={styles.subtitle1}>5.30am</Text>
       </View>
       <View style={styles.set}>
        <Image source={sunrise} style={styles.image} />
         <Text style={styles.subtitle}>Sunset</Text>
         <Text style={styles.subtitle1}>6.30pm</Text>
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
        width: "100%",
        marginTop: 15,
        // marginLeft: -15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#00C1F6",
       borderRadius: 10,
       paddingLeft: "15%",
         paddingRight: "15%",
         marginBottom: 25,
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
