import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArrowBackIosNewRounded from '../assets/ArrowBackIosNewRounded.png'
import GmapCompanentHistory from '../components/GmapCompanentHistory';
const { width, height } = Dimensions.get("window")

const VehicleHistory = ({ navigation }) => {

    return (
       <GmapCompanentHistory />
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
    },
    logo: {
        resizeMode: "contain",
        width: width / 2,
    },
    button: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    icon: {
        width: 20,
        height: 20
    },
    container: {
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10
    },
    scrollView: {
        flex: 1,
        padding: 10
    },
    contentContainerStyle: {
        minHeight: "90%",
    },
    raporla: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderColor: '#D05515',
        borderWidth: 1,
        borderRadius: 4

    },
    Card: {
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
        marginTop: 10,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    CardHeader: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5,
        borderBottomColor: 'rgba(79, 79, 79, 0.15)',
        borderBottomWidth: 1
    },
    CardContainer: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 10
    },
    redball: {
        width: 10,
        height: 10,
        borderRadius: 500,
        backgroundColor: '#D05515'
    }

})

export default VehicleHistory;





/* import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View, } from 'react-native';
import Logo from "../assets/logo.png";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
const { width, height } = Dimensions.get("window")

const VehicleHistory = ({ navigation }) => {



    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: 39.3467538,
                    longitude: 36.3243235,
                    latitudeDelta: 15,
                    longitudeDelta: 15,
                }}
            >
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white"
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 'auto',
        width: 'auto',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})

export default VehicleHistory; */