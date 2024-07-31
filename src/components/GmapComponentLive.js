import React, { Component, createRef } from "react"
import { getMyVehiclesInformationRequest, getMyVehiclesRequest, getTrackableVehiclesRequest } from "../api/controllers/vehicle-controller";
import WsHandler from "./WsHandler";
import MarkerHandler from "./MarkerHandler";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Modal, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, AppState, Image } from "react-native";
import { getCurrentUserRequest, meRequest } from "../api/controllers/account-controller";

import SelectVehicleModal from "./SelectVehicleModal";
import VehicleInfoModal from "./VehicleInfoModal";
import { useNavigation } from "@react-navigation/core";
import Traffic from "../assets/trafficLayer.png"
import TrafficWhite from "../assets/trafficLayerWhite.png"
import CheckBox from "@react-native-community/checkbox";
import VehicleDetail from "./VehicleDetail";
import { withTranslation } from 'react-i18next';
class GMapComponentLive extends Component {
    vehicleList = null;
    wshandler = new WsHandler()
    constructor(props) {
        super(props);
        //  console.log('route123213',this.props.route);
        this._selectVehicleButton = createRef();
        this._vehicleAccordionTab = createRef();
        this._activeVehiclePopup = createRef();
        this._markerHandler = createRef();
        this._selectVehicleModal = createRef();
        this._mapView = createRef();
        this._vehicleInfoModal = createRef();
        this._vehicleDetail = createRef();
        this.state = {
            isFullScreen: true,
            value: false
        };
        props.navigation.addListener('focus', () => {
            try {
                let res = meRequest().then();
                getTrackableVehiclesRequest().then((resp) => {
                    // console.log("--------",resp.data);
                    this._markerHandler.current.setVehicles(resp.data)
                    this._selectVehicleModal.current.setVehicles(resp.data)
                    this._vehicleInfoModal.current.setVehicles(resp.data)
                    this.wshandler?.start(resp.data)
                })
                if (this.props.route.vehicle !== null) {
                   // console.log('this.props.route.vehicle', this.props.route.params.vehicle)
                    this.onVehicleSelect(this.props.route.params.vehicle)
                }
            } catch (error) {
                console.log(error)
            }
        });

    }

    componentDidMount() {
        this.appStateSubscription = AppState.addEventListener(
            "change",
            nextAppState => {
                if (nextAppState === "active") {
                    //console.log("App has come to the foreground!");
                    const vehicleList = getTrackableVehiclesRequest().then((resp) => {
                        //console.log("+++++++++", resp?.data);
                        this._markerHandler.current.setVehicles(resp.data)
                        this._selectVehicleModal.current.setVehicles(resp.data)
                        this._vehicleInfoModal.current.setVehicles(resp.data)
                        this.wshandler?.start(resp.data)
                    });

                } else {
                    this.wshandler?.stop()
                }

            }
        );
    }
    componentWillUnmount() {
        this.appStateSubscription.remove();
    }



    async handleApiLoaded(event) {
        this.vehicleList = (await getTrackableVehiclesRequest()).data.filter(v => v.lastLog  && (v.lastLog.latLng.lat !== null && v.lastLog.latLng.lat !== 0) && (v.lastLog.latLng.lng !== null && v.lastLog.latLng.lng !== 0));
        this._markerHandler.current.setVehicles(this.vehicleList);
        this._selectVehicleModal.current.setVehicles(this.vehicleList);
        this._vehicleInfoModal.current.setVehicles(this.vehicleList)
        this.me = (await getCurrentUserRequest()).data
        //console.log(this.me);
        //console.log(this.me.boss.id);
        /*   this.markerHandler.setOnMarkerClickCallback((vehicle) => { this.onMarkerClickCallbak(vehicle) }) */
        this.wshandler.setCallback((vehicle) => {
            this._markerHandler.current.handleWs(vehicle);
            if (this._vehicleInfoModal.current.state.vehicle?.id === vehicle.id) {
                this._vehicleInfoModal.current.updateData(vehicle);
                this._markerHandler.current.moveToVehicle(this._mapView, vehicle)
            }

        })
        if (this.me.role === "ROLE_EMPLOYEE") {
            this.wshandler.init(this.me?.boss);
        }
        else if (this.me.role === "ROLE_BOSS") {
            this.wshandler.init(this.me);
        }

        if (this.vehicleList.length > 0) {
            setTimeout(() => {
                this._mapView.current.fitToElements(
                    options = {
                        edgePadding: {
                            top: 100,
                            right: 50,
                            bottom: 50,
                            left: 50,
                        },
                        animated: true
                    })
            }, 1000);
        }
    }

    onSelectVehiclePress() {
        this._selectVehicleModal.current.setVisible(true);
    }


    onVehicleSelect(vehicle) {
        this._markerHandler.current.selectVehicle(this._mapView, vehicle.id);
        this._vehicleInfoModal.current.setVehicle(vehicle)
    }
    onMarkerClickCallback(event) {
        const id = parseInt(event.nativeEvent.id)
        const vehicle = this.vehicleList.find(x => x?.id === id)
        this._markerHandler.current.selectVehicle(this._mapView, vehicle.id);
        this._vehicleInfoModal.current.setVehicle(vehicle)

    }
    onSwipe(vehicle) {
        this._markerHandler.current.selectVehicle(this._mapView, vehicle.id);
        // console.log('data', vehicle.id);
    }



    render() {
        const { t } = this.props

        return (
            <SafeAreaView style={styles.root}>
                <View style={styles.top}>
                    <Text style={{ fontSize: 20 }}>{t("canli")}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => { this.onSelectVehiclePress(); }}>
                        <Text style={{ color: `#D05515` }}>{t("arac_sec")}</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.root}>


                    <SelectVehicleModal ref={this._selectVehicleModal} onVehicleSelect={(vehicle) => this.onVehicleSelect(vehicle)} />

                    <VehicleInfoModal onSwipe={(vehicle) => this.onSwipe(vehicle)} onDetailButtonPress={(vehicle) => this._vehicleDetail.current.setVehicle(vehicle)} ref={this._vehicleInfoModal} />
                    <VehicleDetail ref={this._vehicleDetail} />

                    <MapView
                        ref={this._mapView}
                        onMapReady={(evt) => { this.handleApiLoaded(evt); }}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        maxZoomLevel={20}
                        showsCompass={false}
                        showsTraffic={this.state.value === true ? true : false}
                        showsUserLocation={false}
                        camera={
                            {
                                center: {
                                    latitude: 40.3,
                                    longitude: 35,
                                },
                                pitch: 90,
                                heading: 0,
                                altitude: 500,
                                zoom: 4.5,
                            }
                        }
                        onMarkerPress={(event, id) => { this.onMarkerClickCallback(event) }}
                    >


                        <MarkerHandler ref={this._markerHandler} />
                    </MapView>

                    <TouchableOpacity onPress={() => this.setState({
                        value: !this.state.value,
                    })} style={{ display: "flex", borderRadius: 4, backgroundColor: "#fff", backgroundColor: this.state.value === true ? "#D05515" : "#fff", justifyContent: "center", alignItems: "center", width: 40, height: 40, top: 10, left: 10, position: "absolute", }}>
                        <Image source={this.state.value === true ? TrafficWhite : Traffic} style={styles.icon} />

                    </TouchableOpacity>
                </View>
            </SafeAreaView >

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
    icon: {
        width: 20,
        height: 20
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
export default withTranslation()(GMapComponentLive)



