import { BASE_URL } from "../api/ApiProvider";
import React, { Component, createRef } from "react"
import { Callout, Marker, Polyline, Overlay } from "react-native-maps";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import { SvgCss, SvgCssUri, SvgUri, SvgXml } from "react-native-svg";
import Svg, { Circle, G, Path } from "react-native-svg"
import startSvg from "../assets/start.png"
import { beforeAll } from "jest-circus";
import Ball from "../assets/ball2.png"
const { width, height } = Dimensions.get("window")

class MarkerHandlerHistory extends Component {
    constructor(props) {
        super(props)
        //vehicleDataList = new Array();

        this.state = {
            vehicle: null,
            startLog: null,
            finishLog: null,
            logs: [],
            filteredLogs: []
        }
    }
    async onCurIndexChangeCallback(index) {

        const vehicleLog = this.state.logs[index];
        //console.log(vehicleLog)
        this.state.vehicle.currentLog = vehicleLog
        this.setState({ vehicle: this.state.vehicle })
        const point = await this.mapView.pointForCoordinate({
            latitude: vehicleLog.latLng.lat,
            longitude: vehicleLog.latLng.lng,
        })
        point.y += 75
        const coords = await this.mapView.coordinateForPoint(point)
        const camera =
        {
            center: coords,
            pitch: 0,
            heading: 0,
            altitude: 150,
        }
        this.mapView.animateCamera(camera,
            {
                duration: 250,
            }
        );
    }
    float2int(value) {
        return value | 0;
    }
    onSearch(data) {

        this.state.vehicle = null;
        this.state.startLog = null;
        this.state.finishLog = null;
        this.state.logs = [];
        this.state.filteredLogs = []

        this.state.vehicle = data.vehicle
        this.state.logs = data.vehicleLogs
        const dataSize = data.vehicleLogs.length
        const delta = this.float2int(dataSize > 1000 ? dataSize / 1000 : 1)

        // console.log(this.state.logs)
        for (i = 0; i < data.vehicleLogs.length; i = i + delta) {
            this.state.filteredLogs.push(data.vehicleLogs[i]);
        }
        //console.log("data burada", data);
        if (this.state.logs.length === 0) {
            return;
        }

        this.state.startLog = this.state.logs[0];
        this.state.finishLog = this.state.logs[this.state.logs.length - 1]
        // console.log(this.state.logs);
        this.state.vehicle.currentLog = this.state.startLog;

        this.setState({
            vehicle: this.state.vehicle,
            startLog: this.state.startLog,
            finishLog: this.state.finishLog,
            logs: this.state.logs,
            filteredLogs: this.state.filteredLogs

        });
        this.mapView.animateCamera({
            center: {
                latitude: this.state.startLog.latLng.lat,
                longitude: this.state.startLog.latLng.lng,
            },

            zoom: 16,

        },
            {
                duration: 1500,
            }



        );
        this.mapView.coordinateForPoint({ x: 100, y: 200 })


    }
    setMapView(mapView) {
        this.mapView = mapView
    }


    carSvgUri(vehicle) {
        //  console.log(vehicle.currentLog);
        return `${BASE_URL}/api/v1/svg/vehicle?rotation=${vehicle?.currentLog?.course}&color=000000&status=${vehicle?.currentLog?.status}`
    }



    render() {
        const dataSize = this.state.logs.length
        const delta = this.float2int(dataSize > 1000 ? dataSize / 1000 : 1)
        return (
            <>
                {this.state.vehicle?.currentLog &&
                    <Marker
                        key={this.state.vehicle.id}
                        coordinate={{ latitude: this.state.vehicle.currentLog?.latLng?.lat, longitude: this.state.vehicle?.currentLog?.latLng?.lng }}
                        identifier={JSON.stringify({ type: "vehicle", data: this.state.vehicle.id })}
                        anchor={{ x: 0.5, y: 0.76 }}
                        zIndex={5}
                    >

                        <View style={styles.labelMarkerContainer}>
                            <View style={styles.label}>
                                <Text style={styles.labelText}>{this.state.vehicle?.licensePlate}</Text>
                            </View>
                            <SvgUri
                                width="36"
                                height="36"
                                uri={this.carSvgUri(this.state.vehicle)}
                            />
                        </View>

                    </Marker >
                }
                {
                    this.state.logs.map((log, i) => {
                        if (i % delta === 0) {
                            return <Marker
                                zIndex={4}
                                key={i}
                                coordinate={{ latitude: log.latLng?.lat, longitude: log.latLng?.lng }}
                                identifier={JSON.stringify({ type: "log", data: i })}
                                anchor={{ x: 0.5, y: 0.5 }}
                                icon={Ball}
                            />
                        } else {
                            return null
                        }
                    })
                }
                {
                    this.state.logs &&
                    <Polyline
                        coordinates={this.state.logs.map((log) => ({
                            latitude: log.latLng.lat,
                            longitude: log.latLng.lng,
                        }))}
                        strokeColor="rgba(239, 83,83, 0.5)" // fallback for when `strokeColors` is not supported by the map-provider

                        strokeWidth={4}
                    />
                }

                {
                    this.state.startLog && false &&
                    <Marker

                        coordinate={{ latitude: this.state.startLog.latLng.lat, longitude: this.state.startLog.latLng?.lng }}
                        style={{ overflow: 'hidden' }}
                    >

                        <View style={styles.labelMarkerContainer}>

                            <SvgUri
                                width="36"
                                height="36"
                                uri={require('../assets/start.svg')}
                            />
                        </View>

                    </Marker >
                }
                {
                    this.state.finishLog && false &&
                    <Marker

                        coordinate={{ latitude: this.state.finishLog.latLng.lat, longitude: this.state.finishLog.latLng?.lng }}
                        style={{ overflow: 'hidden' }}
                    >

                        <View style={styles.labelMarkerContainer}>

                            <SvgCss
                                width="36"
                                height="36"
                                uri="../assests/finish.svg"

                            />
                        </View>

                    </Marker >
                }
            </>



        )
    }

}

export default MarkerHandlerHistory

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
        alignItems: 'center',
        justifyContent: 'center',


    }

})