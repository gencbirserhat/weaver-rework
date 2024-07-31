import React, { Component, createRef } from "react"
import { getMyVehiclesInformationRequest, getMyVehiclesRequest, getTrackableVehiclesRequest } from "../api/controllers/vehicle-controller";
import MarkerHandlerHistory from "./MarkerHandlerHistory";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Modal, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import { meRequest } from "../api/controllers/account-controller";
import moment from "moment";
import SelectVehicleModalHistory from "./SelectVehicleModalHistory";
import SliderHistory from "./SliderHistory";
import { useNavigation } from "@react-navigation/core";
import { findTimeLineByDateAndVehicleIdListRequest, findTimeLineByDateAndVehicleIdRequest } from "../api/controllers/vehicle-log-conroller";
import { withTranslation } from 'react-i18next';
class GmapCompanentHistory extends Component {
    vehicleList = null;
    constructor(props) {
        super(props);
        this._selectVehicleButton = createRef();
        this._markerHandler = createRef();
        this._selectVehicleModalHistory = createRef();
        this._mapView = createRef();
        this._slider = createRef();
        this._myRef = createRef();
        this.state = {
            isFullScreen: true,
        };
        props.navigation.addListener('focus', () => {
            try {
                let res = meRequest().then();
            } catch (error) {
                console.log(error)
            }
        });
        this.searchData = null;

    }

    async handleApiLoaded(event) {
        this.vehicleList = (await getTrackableVehiclesRequest()).data;
        this._selectVehicleModalHistory.current.setVehicles(this.vehicleList);
        this._markerHandler.current.setMapView(this._mapView.current)
        /*   this.markerHandler.setOnMarkerClickCallback((vehicle) => { this.onMarkerClickCallbak(vehicle) }) */

    }
    onSearchCallback(data) {
        this.searchData = data;
        this._markerHandler.current.onSearch(data);
        this._slider.current.onSearch(data);
    }
    onCurIndexChangeCallback(index) {
        this._markerHandler.current.onCurIndexChangeCallback(index);
        // this._slider.current.onCurIndexChangeCallback(index);
    }

    onSelectVehiclePress() {
        this._selectVehicleModalHistory.current.setVisible(true);
    }

    onVehicleSelect(vehicle) {
        this._markerHandler.current.selectVehicle(this._mapView, vehicle.id);
        this._slider.current.setVehicle(vehicle)
    }
    onMarkerClickCallback(event) {
        const markerId = JSON.parse(event.nativeEvent.id)
        if (markerId.type === "log") {
            this._slider.current.setIndex(markerId.data)
        }
        //console.log(event.nativeEvent.id)
        /*  const id = parseInt(event.nativeEvent.id)
         const vehicle = this.vehicleList.find(x => x?.id === id)
         this._markerHandler.current.selectVehicle(this._mapView, vehicle.id);
         this._slider.current.setVehicle(vehicle) */

    }



    render() {
        //const theme = this.props.theme
        const { t } = this.props;
        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.top}>
                    <Text style={{ fontSize: 20 }}>{t("gecmis")} </Text>
                    <TouchableOpacity style={styles.button} onPress={() => { this.onSelectVehiclePress(); }}>
                        <Text style={{ color: `#D05515` }}>{t("arac_sec")} </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.root}>


                    <SelectVehicleModalHistory ref={this._selectVehicleModalHistory} onSearchCallback={(data) => this.onSearchCallback(data)} />

                    <SliderHistory onCurIndexChangeCallback={(index) => this.onCurIndexChangeCallback(index)} ref={this._slider} />


                    <MapView
                        ref={this._mapView}
                        onMapReady={(evt) => { this.handleApiLoaded(evt); }}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        maxZoomLevel={20}
                        showsUserLocation={false}
                        camera={
                            {
                                center: {
                                    latitude: 40.3,
                                    longitude: 35,
                                },
                                pitch: 0,
                                heading: 0,
                                altitude: 500,
                                zoom: 4.5,
                            }
                        }
                        onMarkerPress={(event) => { this.onMarkerClickCallback(event) }}
                    >
                        <MarkerHandlerHistory ref={this._markerHandler} />
                    </MapView>


                </View>
            </SafeAreaView>

        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        display: 'flex',
        justifyContent: 'center',
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
    container: {
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10,
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
    map: {
        ...StyleSheet.absoluteFillObject,

    },

})
export default withTranslation()(GmapCompanentHistory)



