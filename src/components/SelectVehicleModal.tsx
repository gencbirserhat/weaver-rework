import React from "react";
import { Component } from "react";
import { Image, ImageURISource, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input, } from '@ui-kitten/components';
import { WithTranslation, withTranslation } from "react-i18next";


const SpeedRounded: ImageURISource= require( '../assets/SpeedRounded.png')
const KontakOpen: ImageURISource= require( '../assets/KontakOpen.png')
const KontakClose: ImageURISource= require( '../assets/KontakClose.png')
const KontakWaiting: ImageURISource= require( '../assets/KontakWaiting.png')

interface LastLog {
    speedKmh : number;
    status : "STARTED" | "STOPPED" | "MOVING";
}

interface Vehicle { 
    licensePlate: string;
    vehicleName: string;
    totalDistanceKm: number;
    lastLog: LastLog;
}

interface SelectVehicleModalState {
    visible: boolean;
    vehicles: Vehicle[];
    searchValue: string;
}


interface SelectVehicleModalProps extends WithTranslation {
    onVehicleSelect: (vehicle: Vehicle) => void;
}

class SelectVehicleModal extends Component<SelectVehicleModalProps, SelectVehicleModalState> {
    imageMap = new Map()
    constructor(props : SelectVehicleModalProps) {
        super(props)
        this.state = {
            visible: false,
            vehicles: [],
            searchValue: "",
        };
        this.imageMap.set("STARTED", KontakWaiting);
        this.imageMap.set("STOPPED", KontakClose);
        this.imageMap.set("MOVING", KontakOpen);
    }

    setVisible(value: boolean) {
        this.setState({
            visible: value,
        });
    }

    setVehicles(vehicles: Vehicle[]){
        this.setState({
            vehicles: vehicles,
        });
        //   console.log(vehicles)
    }
    float2int(value:number):number {
        return value | 0;
    }

    searchVehicle(text: string = this.state.searchValue) {

        let newList = this.state.vehicles.filter(x => 
            String(x.licensePlate).toLowerCase().includes(this.state.searchValue) || 
            String(x.vehicleName).toLowerCase().includes(this.state.searchValue) || 
            String(x.totalDistanceKm).toLowerCase().includes(this.state.searchValue))
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
                        <Text style={{ fontSize: 20 }}>{t("arac_sec")}</Text>
                        <TouchableOpacity style={styles.buttonModal} onPress={() => { this.setVisible(false) }} >
                            <Text style={{ color: `#D05515` }}>{t("kapat")}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.root}>

                        <ScrollView nestedScrollEnabled
                            style={styles.scrollViewModal}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.contentContainerStyleModal}
                        >
                            <Input
                                /* label={"arac_adi_z"} */
                                placeholder={t("Araçlar içinde arama yapabilirsiniz")}
                                value={this.state.searchValue}
                                onChange={(e) => {
                                    this.setState({ searchValue: e.nativeEvent.text })
                                    this.searchVehicle(e.nativeEvent.text)
                                }}
                                style={styles.input}
                            />

                            {
                                this.searchVehicle().map((vehicle, i) => {
                                    return <TouchableOpacity key={i} style={styles.vehicle} onPress={() => {
                                        this.props.onVehicleSelect(vehicle);
                                        this.setVisible(false);
                                        this.setState({ searchValue: "" })
                                        this.searchVehicle("")
                                    }} >
                                        <Text>{vehicle?.licensePlate}</Text>
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={SpeedRounded} style={styles.icon} />
                                            <Text style={{ color: '#3C3C3B', marginLeft: 5 }}>{this.float2int(vehicle?.lastLog?.speedKmh)} Km/H</Text>
                                        </View>
                                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={this.imageMap.get(vehicle?.lastLog?.status)} style={styles.icon} />
                                        </View>
                                    </TouchableOpacity>


                                })

                            }



                        </ScrollView>

                    </View>
                </SafeAreaView>

            </Modal>
        )
    }

}
export default withTranslation('', { withRef: true })(SelectVehicleModal)


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
    input: {
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
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
        marginTop: 20,
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
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    }

})