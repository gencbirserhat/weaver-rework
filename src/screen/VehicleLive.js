import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import Logo from "../assets/logo.png";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import GmapComponentLive from "../components/GmapComponentLive"
const { width, height } = Dimensions.get("window")

const VehicleLive = ({ navigation, }) => {


    return (


        <GmapComponentLive />


    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        display: 'flex',
        justifyContent: 'center',
    },
    top: {
        width: '100%',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        shadowColor: '0px 0px 4px rgba(0, 0, 0, 0.15)',
        backgroundColor: '#fff',
        zIndex: 2
    },

    button: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderColor: '#D05515',
        borderWidth: 1,
        borderRadius: 4
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 'auto',
        width: 'auto',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,

    },

})

export default VehicleLive;