import React from "react";
import { Component } from "react";
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import error from '../assets/error.png'
import SpeedRounded from '../assets/SpeedRounded.png'
import Plaka from '../assets/LicencePlate.png'
import Konum from '../assets/PinDropRounded.png'
import Phone from '../assets/Phone.png'
import KontakOpen from '../assets/KontakOpenIcon.png'
import KontakClose from '../assets/KontakCloseIcon.png'
import SonMesafe from '../assets/LastRange.png'
import GunlukMesafe from '../assets/DailyRange.png'
import TotalMesafe from '../assets/TotalDistance.png'
import Sofor from '../assets/Driver.png'
import Arac from '../assets/Vehicle.png'
import SonVeriZamanı from '../assets/LastLogTime.png'
import Bolge from '../assets/Bolge.png'
import moment from "moment";
import { withTranslation } from "react-i18next";
class VehicleDetail extends Component {
    imageMap = new Map()
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            vehicle: null,
        };

    }

    setVisible(value) {
        this.setState({
            visible: value,
        });
    }

    setVehicle(vehicle) {
        this.setState({
            vehicle: vehicle,
            visible: true
        });
        //  console.log(vehicle)
    }
    float2int(value) {
        return value | 0;
    }

    // const [modalVisible, setModalVisible] = useState(false);
    render() {
        if (!this.state.visible) {
            return null
        }
       // console.log(this.state.vehicle);
        const { t } = this.props
        return (


            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.visible}
            /*  onRequestClose={() => {
                 alert("Modal has been closed.");
                 setModalVisible(!modalVisible);
             }} */
            >
                <SafeAreaView style={styles.root}>
                    <View style={styles.topModal}>
                        <Text style={{ fontSize: 20 }}>{t("arac_datay")} </Text>
                        <TouchableOpacity style={styles.buttonModal} onPress={() => { this.setState({ vehicle: null }); this.setVisible(false) }} >
                            <Text style={{ color: `#D05515` }}>{t("kapat")}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.root2}>
                        <ScrollView nestedScrollEnabled
                            style={styles.scrollViewModal}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.contentContainerStyleModal}
                        >
                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={Plaka} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("plaka")} | {t("arac_adi")}:</Text>
                                    <Text style={styles.text}>{this.state.vehicle?.licensePlate} | {this.state.vehicle?.vehicleName}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={Konum} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("adres")}:</Text>
                                    <Text style={styles.text}>{this.state.vehicle?.lastLog?.address?.neighborhood !== null ? this.state.vehicle?.lastLog?.address?.neighborhood : "Bilinmeyen Mahalle"} - {this.state.vehicle?.lastLog?.address?.street !== null ? this.state.vehicle?.lastLog?.address?.street : "Bilinmeyen Sk/Cd"} - {this.state.vehicle?.lastLog?.address?.district} / {this.state.vehicle?.lastLog?.address?.province}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={Bolge} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("bolge")}:</Text>
                                    <Text style={styles.text}>{this.state.vehicle?.safeZone?.safeZoneName === null ? "Bölge Atanmamış" : this.state.vehicle?.safeZone?.safeZoneName}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={KontakOpen} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("kontak_acma_zamani")}:</Text>
                                    <Text style={styles.text}>{moment(this.state.vehicle?.lastIgnitionOnDt).format("LL LTS")}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={KontakClose} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("kontak_kapama_zamani")}:</Text>
                                    <Text style={styles.text}>{moment(this.state.vehicle?.lastIgnitionOffDt).format("LL LTS")}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={SonMesafe} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("son_mesafe")}:</Text>
                                    <Text style={styles.text}> {this.float2int(this.state.vehicle?.distanceSinceIgnitionKm)} KM</Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={TotalMesafe} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("total_mesafe")}:</Text>
                                    <Text style={styles.text}>{this.float2int(this.state.vehicle?.totalDistanceKm)} KM</Text>
                                </View>
                            </View>

                            <View style={styles.row}>
                                <View style={styles.icon}>
                                    <Image source={SonVeriZamanı} style={styles.icon} />
                                </View>
                                <View style={styles.desc}>
                                    <Text>{t("son_sinyal")}:</Text>
                                    <Text style={styles.text}>{moment(this.state.vehicle?.lastLog?.mqttLogDateTime).format('LL LTS')}</Text>
                                </View>
                            </View>

                        </ScrollView>


                    </View>
                </SafeAreaView>

            </Modal>
        )
    }



}
export default withTranslation('', { withRef: true })(VehicleDetail)


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    root: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        display: 'flex',
        justifyContent: 'center',

    },
    text: {
        fontWeight: '500'
    },
    root2: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        display: 'flex',


    },
    desc: {
        width: '90%',
        height: 'auto',
        padding: 8,
        flexDirection: 'column'
    },
    row: {
        width: '100%',
        height: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1
    },
    topModal: {
        width: '100%',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        shadowColor: '0px 0px 4px rgba(0, 0, 0, 0.15)',
        backgroundColor: '#fff',
        zIndex: 2,
    },
    buttonModal: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderColor: '#D05515',
        borderWidth: 1,
        borderRadius: 4
    },

    icon: {
        width: 30,
        height: 30,
    },
    scrollViewModal: {
        flex: 1,
        width: '100%'
    },
    contentContainerStyleModal: {
        minHeight: "90%",
    },

})