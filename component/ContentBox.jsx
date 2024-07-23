import React from "react";
import { Platform } from 'react-native';
import { useSelector } from "react-redux";
import { Text, View , Image} from "react-native";

const pressure = require("../Image/pressure.png");
const wind = require("../Image/wind.png");
const humidity = require("../Image/humidity.png");
const uv = require("../Image/uv-index.png");

const ContentBox = () => {

    const { data, loading, error } = useSelector((state) => state.weather);

    if (!data)  
        {
        return <Text>No data available</Text>;  
        }

    return (
        <View style={styles.container}>
        <View style={styles.smallbox}>
            <View style={styles.smallbox1}>
<Image source={pressure} style={styles.image} />  
<Text style={styles.subtitle}>Pressure</Text>              
<Text style={styles.subtitle1}>{data.days[0].pressure} mph</Text>   

            </View>
            <View style={styles.smallbox1}>
            <Image source={wind} style={styles.image} />  
<Text style={styles.subtitle}>Wind</Text>              
<Text style={styles.subtitle1}>{data.days[0].windspeed}km/h</Text>  
            </View>
            <View style={styles.smallbox1}>
            <Image source={humidity} style={styles.image} />  
<Text style={styles.subtitle}>Humidity</Text>              
<Text style={styles.subtitle1}>{data.days[0].humidity}%</Text>  
            </View>
            <View style={styles.smallbox1}>
            <Image source={uv} style={styles.image} />  
<Text style={styles.subtitle}>UV Index</Text>              
<Text style={styles.subtitle1}>{data.days[0].uvindex} of 10</Text>  
            </View>
        </View>
        </View>
    );
    };

export default ContentBox;

const styles = {    
    container: {
        flex: 1,
        width: "100%",  
        paddingLeft: 15,
        paddingRight: 15,
    },

    smallbox: {
        height: 96,
        marginTop: 15,
        // marginLeft: -15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
       
    },
    smallbox1: {
        width: 80,
        backgroundColor: "#00C1F6",
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap:4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.36,
        shadowRadius: 2,
        elevation: 2

    

    },
    image: {
        width: 30,
        height: 30,
        
    },
    subtitle: {
        color: '#FFFFFF', 
        fontWeight: Platform.OS === 'android' ? 'medium' : '500',
        fontSize: 14,
       
    },
    subtitle1: {
        color: '#FFFFFF', 
        fontWeight: Platform.OS === 'android' ? 'normal' : '300',
        fontSize: 12,
       
    },
    

};

