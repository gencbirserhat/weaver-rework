import React from "react";
import { Component } from "react";
import { Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import error from '../assets/error.png'
import SpeedRounded from '../assets/SpeedRounded.png'
import KontakOpen from '../assets/KontakOpen.png'
import KontakClose from '../assets/KontakClose.png'
import KontakWaiting from '../assets/KontakWaiting.png'
import CheckBox from "@react-native-community/checkbox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Loading from "./Loading";
import { findByDateRangeRequest, findByDateRangeRequestSingleVehicle } from "../api/controllers/vehicle-log-conroller";
import { withTranslation } from 'react-i18next';
import { Icon, Input, } from '@ui-kitten/components';


class SelectVehicleModalHistory extends Component {

    imageMap = new Map()
    constructor(props) {
        super(props)
        const startDt = new Date(new Date().setHours(0, 0, 0));
        const endDt = new Date();
        const d = new Date()
        this.state = {
            visible: true,
            vehicles: [],
            isDatePickerVisibleStart: false,
            baslamaDate: startDt,
            isDatePickerVisibleFinish: false,
            bitisdate: endDt,
            selectedVehicle: null,
            loading: false,
            searchValue: "",
        };
        this.imageMap["STARTED"] = KontakWaiting;
        this.imageMap["STOPPED"] = KontakClose;
        this.imageMap["MOVING"] = KontakOpen;

    }

    setVisible(value) {
        this.setState({
            visible: value,
        });
    }

    setVehicles(vehicles) {
        this.setState({
            vehicles: vehicles,
        });
        //  console.log(vehicles)
    }
    float2int(value) {
        return value | 0;
    }
    handleChange(vehicle, value) {
        this.state.vehicles.map((v) => {
            v.checked = false
        })
        let selectedVehicle = this.state.vehicles.filter(vd => vd.id === vehicle.id);
        // console.log(value)
        selectedVehicle[0].checked = value;
        //console.log(selectedVehicle)
        this.setState({
            selectedVehicle: selectedVehicle
        });
        //this.setState({ checked: event.currentTarget.checked })
        //this.checked = event;
    }
    //Başlangıç 
    showDatePickerStart = () => {
        this.setState({
            isDatePickerVisibleStart: true,
        });
    };
    hideDatePickerStart = () => {
        this.setState({
            isDatePickerVisibleStart: false,
        });
    };
    handleConfirmStart = (date) => {
        this.hideDatePickerStart(date);
    };

    // Bitiş
    showDatePickerFinish = () => {
        this.setState({
            isDatePickerVisibleFinish: true,
        });
    };
    hideDatePickerFinish = () => {
        this.setState({
            isDatePickerVisibleFinish: false,
        });
    };
    handleConfirmFinish = (date) => {
        this.hideDatePickerFinish(date);
    };

    async onButtonSearchClick() {
        const { t } = this.props;
        this.setState({
            loading: true,
        });
        const selectedVehicles = this.state.vehicles.filter(vehicle => vehicle.checked === true);
        const selectedvehicleCount = this.state.vehicles.filter(vehicle => vehicle.checked).length;

        // console.log(selectedvehicleCount)
        if (selectedvehicleCount !== 1) {

            Alert.alert(t("Hata"), t("Tek bir araç seçimi yapınız."))
            this.setState({
                loading: false,
            });
            return
        }
        const diff = Math.abs(this.state.bitisdate - this.state.baslamaDate)

        if (diff > 172800000) {

            //  console.log(this.state.bitisdate.getDate() - this.state.baslamaDate.getDate())
            Alert.alert(t("Hata"), t("Başlangıç ve bitiş tarihleri aralığı 48 saati geçmemelidir."))
            this.setState({
                loading: false,
            });
            return
        }


        let startDate = moment(this.state.baslamaDate).utc().format()
        let endDate = moment(this.state.bitisdate).utc().format()
        //console.log(this.state.baslamaDate)
        //Logları Getir
        // console.log(typeof selectedVehicles[0].id);
        const vehicleLogs = (await (findByDateRangeRequestSingleVehicle({
            endDateTime: endDate,
            startDateTime: startDate,
            vehicleId: selectedVehicles[0].id,
        }))).data;

        if (vehicleLogs.length === 0) {

            Alert.alert(t("Uyarı"), t("Belirttiğiniz tarihler arasında kayıt bulunamadı."))
            //Alert.alert(t("kayıt bulunamadıs"))
            this.setState({
                loading: false,
            });
        } else {
            //Callback -> GmapsComponent.onSearchCallback

            this.setVisible(false)
            this.setState({
                loading: false,
            });
            this.props.onSearchCallback({
                startDateTime: this.state.baslamaDate,
                finishDateTime: this.state.bitisdate,
                vehicleLogs: vehicleLogs,
                vehicle: selectedVehicles[0]
            })
            //Search basınca accordion kapat
        }
    }

    searchVehicle() {

        let newList = this.state.vehicles.filter(x => String(x.licensePlate).toLowerCase().includes(this.state.searchValue) || String(x.vehicleName).toLowerCase().includes(this.state.searchValue))
        return newList

    }


    // const [modalVisible, setModalVisible] = useState(false);
    render() {
        const { t } = this.props;
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
                        <Text style={{ fontSize: 20 }}>{t("arac_sec")} </Text>
                        <TouchableOpacity style={styles.buttonModal} onPress={() => { this.setVisible(false) }} >
                            <Text style={{ color: `#D05515` }}>{t("kapat")} </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.root}>

                        <ScrollView nestedScrollEnabled
                            style={styles.scrollViewModal}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.contentContainerStyleModal}
                        >
                            <View style={styles.Alert}>
                                <Image source={error} style={styles.iconModal} />
                                <Text style={styles.headerText}>{t("alert")}
                                </Text>
                            </View>

                            <Input
                                /* label={"arac_adi_z"} */
                                placeholder={t("Araçlar içinde arama yapabilirsiniz")}
                                value={this.searchValue}
                                onChange={(e) => {
                                    this.setState({ searchValue: e.nativeEvent.text })
                                    this.searchVehicle(e.nativeEvent.text)
                                }}
                                style={{ ...styles.input, marginTop: 10 }}
                            />

                            <View style={{ width: '100%', alignItems: 'center', flexDirection: "row", paddingVertical: 10, justifyContent: "space-between" }}>
                                <View style={{ borderColor: "#d5d5d5", borderWidth: 1, padding: 5, borderRadius: 5, backgroundColor: "#f8f8f8", alignItems: 'center', width: "48%", }}>
                                    <TouchableOpacity onPress={this.showDatePickerStart}>
                                        <Text style={{ color: `#D05515` }}>{t("baslama_tarihi")} </Text>

                                        <DateTimePickerModal
                                            isVisible={this.state.isDatePickerVisibleStart}
                                            mode="datetime"
                                            locale="tr_TR"
                                            maximumDate={new Date()}

                                            date={this.state.baslamaDate}
                                            onChange={(newValue) => {
                                                this.setState({
                                                    baslamaDate: newValue,
                                                });
                                                const diff = Math.abs(this.state.bitisdate - newValue)
                                                // console.log(diff);
                                                if (diff > 172800000) {
                                                    const d = moment(newValue).add(2, "days").toDate()

                                                    this.setState({
                                                        bitisdate: new Date() > d ? d : new Date(),
                                                    });
                                                }
                                            }}
                                            onConfirm={(newValue) => {
                                                //  console.log(newValue)
                                                this.setState({
                                                    baslamaDate: newValue,
                                                });
                                                this.handleConfirmStart(newValue)
                                            }}

                                            onCancel={this.hideDatePickerStart}
                                            display={Platform.OS === `ios` ? 'inline' : "default"}
                                        />
                                        <Text style={{ padding: 0, fontSize: 11 }}>{this.state.baslamaDate && moment(this.state.baslamaDate).format("lll")}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderColor: "#d5d5d5", borderWidth: 1, padding: 5, borderRadius: 5, backgroundColor: "#f8f8f8", alignItems: 'center', width: "48%" }}>
                                    <TouchableOpacity onPress={this.showDatePickerFinish}>
                                        <Text style={{ color: `#D05515` }}>{t("bitis_tarihi")} </Text>
                                        <DateTimePickerModal
                                            isVisible={this.state.isDatePickerVisibleFinish}
                                            mode="datetime"
                                            locale="tr_TR"
                                            date={this.state.bitisdate}
                                            maximumDate={moment(this.state.baslamaDate).add(2, "days").toDate()}
                                            minimumDate={new Date(this.state.baslamaDate)}
                                            onChange={(newValue) => {
                                                this.setState({
                                                    bitisdate: newValue,
                                                });
                                            }}
                                            onConfirm={(newValue) => {
                                                //  console.log(newValue)
                                                this.setState({
                                                    bitisdate: newValue,
                                                });
                                                this.handleConfirmFinish(newValue)
                                            }}
                                            onCancel={this.hideDatePickerFinish}
                                            style={styles.datetime}
                                            display={Platform.OS === `ios` ? 'inline' : "default"}
                                        />
                                        <Text style={{ padding: 0, fontSize: 11 }}>{this.state.bitisdate && moment(this.state.bitisdate).format("lll")}</Text>
                                    </TouchableOpacity>

                                </View>
                                {/* View>
                                <TouchableOpacity style={styles.raporla} onPress={getVehicleLog}>
                                    <Text style={{ color: `#D05515` }}>Raporla</Text>
                                </TouchableOpacity>
                            </View> */}
                            </View>

                            {
                                this.searchVehicle().map((vehicle, i) => {
                                    return <View key={i} style={vehicle.vehicleStatus === "ACTIVE" ? styles.vehicle : styles.vehicleOff} onPress={() => {
                                        if (vehicle.vehicleStatus === "ACTIVE") {
                                            this.props.onVehicleSelect(vehicle);
                                            this.setVisible(false);
                                            this.setState({ searchValue: "" })
                                            this.searchVehicle("")
                                        }

                                    }} >
                                        <CheckBox
                                            disabled={false}
                                            value={vehicle?.checked}
                                            onValueChange={(value) => this.handleChange(vehicle, value)}
                                            tintColors={{ true: '#D05515', false: 'black' }} //sadece adnroid için 
                                            tintColor="black" // sadece ios için 
                                            onTintColor="#D05515"// sadece ios için 
                                            onCheckColor="#D05515"// sadece ios için 
                                            boxType="square"// sadece ios için 
                                            lineWidth={1}// sadece ios için 
                                            style={{ width: 20, height: 20, minHeight: 20, minWidth: 20 }}
                                        />
                                        <Text>{vehicle?.licensePlate}</Text>


                                    </View>


                                })

                            }



                        </ScrollView>

                    </View>
                    <View style={styles.BottomModal}>
                        <TouchableOpacity style={styles.buttonModalHistory} onPress={() => { this.onButtonSearchClick() }} >
                            <Text style={{ color: `#fff`, fontSize: 18 }}>{t("gecmisi_goster")}</Text>
                        </TouchableOpacity>
                    </View>
                    <Loading loading={this.state.loading} />
                </SafeAreaView>

            </Modal>
        )
    }



}
export default withTranslation('', { withRef: true })(SelectVehicleModalHistory)


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
    scrollViewModal: {
        flex: 1,
        padding: 10,
        width: '100%'
    },
    contentContainerStyleModal: {
        minHeight: "90%",
    },
    Alert: {
        width: '100%',
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 16,
        paddingVertical: 10,
        height: 'auto',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center'
    },
    iconModal: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    icon: {
        width: 20,
        height: 20
    },
    vehicle: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    vehicleOff: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#fff',
        opacity: 0.5,
        paddingHorizontal: 15,
        paddingVertical: 10,

        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    buttonModalHistory: {
        width: '90%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#D05515',

        borderRadius: 4
    },
    BottomModal: {
        width: '100%',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        shadowColor: '0px 0px 4px rgba(0, 0, 0, 0.15)',
        backgroundColor: '#fff',
        zIndex: 2,
    }

})