import React from 'react';

import GmapCompanentHistory from '../components/GmapCompanentHistory';

const VehicleHistory = () => {
  return <GmapCompanentHistory />;
};

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
