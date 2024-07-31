import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ArrowBackIosNewRounded from '../assets/ArrowBackIosNewRounded.png'
import Clock from '../assets/Clock.png'
import KontakOpen from '../assets/KontakOpen.png'
import KontakClose from '../assets/KontakClose.png'
import moment from 'moment';
import 'moment/locale/tr'
import KontakWaiting from '../assets/KontakWaiting.png'
import plus from "../assets/Plus.png"
import car from "../assets/Car.png"
import GPS from "../assets/GPS.png"
import callender from "../assets/Callender.png"
import edit from "../assets/Edit.png"
import info from "../assets/InfoRounded.png"
import { deleteByIdRequest, getMyVehiclesRequest, getTrackableVehiclesRequest } from '../api/controllers/vehicle-controller';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import trash from '../assets/Trash.png'
import { useFocusEffect } from '@react-navigation/native';
import { logoutRequest, meRequest } from '../api/controllers/account-controller';
import OnayModal from '../components/molecules.js/OnayModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get("window")

const Vehicles = () => {
    const { t } = useTranslation()
    const [vehicleData, setVehicleData] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [userType, setUserType] = useState("")
    const navigation = useNavigation()
    imageMap = new Map()
    imageMap["STARTED"] = KontakWaiting;
    imageMap["STOPPED"] = KontakClose;
    imageMap["MOVING"] = KontakOpen;
    let timerId = null;

    const fetchVehicles = async () => {
        try {
            let res = await getTrackableVehiclesRequest()
            if (res?.data) {
                setVehicleData(res?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchMe = async () => {
        try {
            let res = await meRequest()
            //console.log(res?.data)
            if (res?.data) {
                setUserType(res?.data?.userType)

            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        (async () => {
            await fetchMe()
        })()

        // homeRequest()
        return () => {

        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const fetchVehicles = async () => {
                try {
                    let res = await getTrackableVehiclesRequest()
                    if (res?.data) {
                        setVehicleData(res?.data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchVehicles()
        }, [])
    );

    const [selectedId, setSelectedId] = useState(null)

    const leftSwipe = (val) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('AracEkleEdit', {
                data: val,
            })
            } style={styles.editbox}>
                <Image source={edit} style={styles.icon} />

            </TouchableOpacity>
        )
    }
    const rightSwipe = (id) => {
        return (
            <TouchableOpacity onPress={() => {
                setModalDelete(true)
                setSelectedId(id)
            }
            } style={styles.deletebox}>
                <Image source={trash} style={styles.icon} />

            </TouchableOpacity>
        )
    }

    const deleteVehicle = async () => {
        try {
            let res = await deleteByIdRequest({ id: selectedId })
            if (res?.status === 200) {
                fetchVehicles()
                setModalDelete(false)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const Vehicle = ({ val }) => {

        return (

            <TouchableOpacity onPress={val?.lastLog !== null ? () => navigation.navigate('Canlı', {
                vehicle: val,
            }) : null} style={userType === "Employee" ? styles.Card2 : styles.Card} >
                {
                    userType === "Employee" ?
                        <>
                            <View style={styles.cardInfo}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
                                    <Image source={GPS} style={styles.icon} />
                                    <View style={{ marginLeft: 8 }}>
                                        <Text>{val?.lastLog === null ? `${t("araca_ait_veri_yok")}` : moment(val?.lastLog.mqttLogDateTime).format('LL LTS')}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={imageMap[val?.lastLog?.status]} style={styles.icon} />
                                </View>
                            </View>
                            <View style={styles.cardInfo}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
                                    <Image source={car} style={styles.icon} />
                                    <View style={{ marginLeft: 4 }}>
                                        <Text > {val?.licensePlate} - {val?.vehicleName}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cardInfo2}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
                                    <Image source={callender} style={{ width: 16, height: 16 }} />
                                    <View style={{ marginLeft: 4 }}>
                                        <Text> {val?.licenseDate ? moment(val?.licenseDate).format('LL') : `${t("lisans_tarihine_ait_veri_yok")}`}</Text>
                                    </View>
                                </View>
                            </View>
                        </>
                        :
                        <Swipeable renderRightActions={() => rightSwipe(val?.id)} renderLeftActions={() => leftSwipe(val)}   >
                            <View style={styles.cardInfo}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
                                    <Image source={GPS} style={styles.icon} />
                                    <View style={{ marginLeft: 8 }}>
                                        <Text>{val?.lastLog === null ? `${t("araca_ait_veri_yok")}` : moment(val?.lastLog.mqttLogDateTime).format('LL LTS')}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={imageMap[val?.lastLog?.status]} style={styles.icon} />
                                </View>
                            </View>
                            <View style={styles.cardInfo}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
                                    <Image source={car} style={styles.icon} />
                                    <View style={{ marginLeft: 4 }}>
                                        <Text > {val?.licensePlate} - {val?.vehicleName}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.cardInfo2}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
                                    <Image source={callender} style={{ width: 16, height: 16 }} />
                                    <View style={{ marginLeft: 4 }}>
                                        <Text> {val?.licenseDate ? moment(val?.licenseDate).format('LL') : `${t("lisans_tarihine_ait_veri_yok")}`}</Text>
                                    </View>
                                </View>
                            </View>
                        </Swipeable>

                }

            </TouchableOpacity>

        )
    }

    const [modalDelete, setModalDelete] = useState(false)

    return (
        <>
            <SafeAreaView style={styles.root}>

                <View style={styles.top}>
                    <View style={styles.topLeft}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                            <Image source={ArrowBackIosNewRounded} style={styles.icon} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20 }}>{t("araclar")} </Text>
                    </View>
                    {
                        userType === "Employee" ?
                            <></>
                            :
                            <TouchableOpacity onPress={() => navigation.navigate("AracEkle")} style={styles.buttonNew} >
                                <Image source={plus} style={styles.icon} />
                                <Text style={{ color: '#fff', marginLeft: 4 }}>{t("yeni_ekle")}</Text>
                            </TouchableOpacity>
                    }

                </View>
                <ScrollView nestedScrollEnabled
                    style={styles.scrollView}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.contentContainerStyle}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={async () => {
                                setRefreshing(true)
                                await fetchVehicles()
                                setRefreshing(false)

                            }}
                        />
                    }
                >
                    {
                        vehicleData.map((val, i) => <Vehicle key={i} val={val} />)
                    }

                </ScrollView>

            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalDelete}
                onRequestClose={() => {
                    // Alert.alert("Hata", "Modal has been closed.");
                    setModalDelete(!modalDelete);
                }}
            >
                <OnayModal
                    title={t("Aracı silmek istediğinize emin misiniz?")}
                    decline={() => {
                        setSelectedId(null)
                        setModalDelete(false)
                    }}
                    approve={() => deleteVehicle()}
                />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    topLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
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
    button: {
        width: '90%',
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: '#D05515',
        borderRadius: 4,
        alignSelf: 'center'
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
        backgroundColor: '#fff',
        borderRadius: 10,
        borderLeftColor: '#4F4F4F',
        borderLeftWidth: 2,
        overflow: 'hidden',
        borderRightColor: '#E74C3C',
        borderRightWidth: 2,
        zIndex: 2
    },
    Card2: {
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        zIndex: 2
    },
    cardInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: 'rgba(79,79,79, 0.15)',
        borderBottomWidth: 1,
        padding: 8,
    },
    cardInfo2: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 8
    },
    CardHeader: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5,

    },
    CardContainer: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 4
    },
    redball: {
        width: 10,
        height: 10,
        borderRadius: 500,
        backgroundColor: '#D05515'
    },
    buttonNew: {
        width: 'auto',
        height: 'auto',
        padding: 7,
        backgroundColor: '#D05515',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        marginLeft: 4
    },
    editbox: {
        width: '20%',
        backgroundColor: '#4F4F4F',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1
    },
    deletebox: {
        width: '20%',
        backgroundColor: '#E74C3C',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    }


})

export default Vehicles;