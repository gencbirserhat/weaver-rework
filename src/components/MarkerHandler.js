import { BASE_URL } from "../api/ApiProvider";
import React, { Component, createRef } from "react"
import { Callout, Marker, Overlay } from "react-native-maps";
import { Image, StyleSheet, Text, View } from "react-native";
import { SvgCss, SvgCssUri, SvgUri, SvgXml } from "react-native-svg";
import Svg, { Circle, G, Path } from "react-native-svg"


class MarkerHandler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vehicles: [

            ],
            selectedVehicleId: null
        }
    }


    onMarkerClickCallback = null;
    setOnMarkerClickCallback(callback) {
        this.onMarkerClickCallback = callback;
    }

    setVehicles(v) {
        this.setState({ vehicles: v })
    }

    handleWs(vehicle) {
        //   console.log("handleWs=====================");
        //  console.log(vehicle);
        const vd = this.state.vehicles.find(x => x?.id === vehicle?.id);
        if (vd !== undefined) {
            vd.lastLog = vehicle.lastLog; //BURADA HATA VAR
            this.setState({ vehicles: [...this.state.vehicles] });
        }

    }

    selectVehicle(mapView, vehicleId) {

        //.log("selectVehicle");
        //console.log(vehicle);
        if (vehicleId !== null) {
            // console.log("AAAAAAA");
            // console.log(vehicle);
            const vd = this.state.vehicles.find(v => v.id === vehicleId);
            // console.log("BBBBBBBBB");
            //console.log("vd", vd);
            this.setState({ selectedVehicleId: vd?.id })
            mapView.current.animateCamera({
                center: {
                    latitude: vd?.lastLog?.latLng?.lat,
                    longitude: vd?.lastLog?.latLng?.lng,
                },
                zoom: vd.lastLog !== null ? 15 : 5,
                altitude: 100,
            },
                {
                    duration: 1000,
                }


            );
        }
    }

    moveToVehicle(mapView, vehicle) {

        //.log("selectVehicle");
        //console.log(vehicle);
        if (vehicle !== null) {
            // console.log("AAAAAAA");
            // console.log(vehicle);
            const vd = this.state.vehicles.find(v => v.id === vehicle.id);

            // console.log("BBBBBBBBB");

            // console.log(vd);
            mapView.current.animateCamera({
                center: {
                    latitude: vd.lastLog.latLng.lat,
                    longitude: vd.lastLog.latLng.lng,
                }
            },
                {
                    duration: 1500,
                }


            );
        }
    }


    carSvgUri(vehicle) {
        return `${BASE_URL}/api/v1/svg/vehicle?rotation=${vehicle?.lastLog?.course}&color=000000&status=${vehicle?.lastLog?.status}`
    }

    render() {

        return (
            this.state.vehicles.map((vehicle) => {
                return vehicle.lastLog &&

                    /* vehicle.vehicleStatus === "ACTIVE" && */
                    <Marker
                        key={vehicle.id}
                        coordinate={{ latitude: vehicle?.lastLog?.latLng?.lat, longitude: vehicle?.lastLog?.latLng?.lng }}
                        //title={vehicle.licensePlate}
                        /* image={{ uri: `${BASE_URL}/api/v1/svg/car?rotation=${vehicle?.lastLog?.course}&color=000000&ignition=${vehicle?.lastLog?.ignition}` }} */
                        identifier={`${vehicle.id}`}
                        anchor={{ x: 0.5, y: 0.76 }}
                        style={{ zIndex: (this.state.selectedVehicleId === vehicle.id ? 11 : 10) }}
                    >

                        <View style={styles.labelMarkerContainer}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>{vehicle?.licensePlate}</Text>
                            </View>
                            <SvgUri
                                width="36"
                                height="36"
                                uri={this.carSvgUri(vehicle)}
                            />
                        </View>

                    </Marker >
            }
            )
        )
    }

}

export default MarkerHandler

const styles = StyleSheet.create({
    label: {
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '0px 0px 2px 0px rgba(0,0,0,0)',
        borderWidth: 1,
        padding: 10,
        marginBottom: 5
    },
    labelText: {
        color: '#1273EBFF',
        fontSize: 12,
    },
    labelMarkerContainer: {
        alignItems: 'center'

    }

})