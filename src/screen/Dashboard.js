import React, { useEffect, useState } from 'react';
import { Dimensions, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableOpacityBase, View, } from 'react-native';
import Logo from "../assets/logo.png";
import NotificationsRounded from '../assets/NotificationsRounded.png'
import DirectionsCarRounded from '../assets/DirectionsCarRounded.png'
import Statistic from '../assets/Statistic.png';
import LocalGasStationRounded from '../assets/LocalGasStationRounded.png'
import { getCurrentFuelPricesRequest, getDashBoardStatisticsRequest, getMemberMyVehiclesInformation, getMyVehiclesInformationRequest, getTrackableInformationRequest, getTrackableVehiclesRequest } from '../api/controllers/vehicle-controller';
const { width, height } = Dimensions.get("window")
import Swiper from 'react-native-swiper'
import Carousel from "react-native-snap-carousel"
import { useTranslation } from 'react-i18next';
const Dashboard = ({ navigation }) => {
    const { t } = useTranslation()

    const [oil, setOil] = useState("")
    const [diesel, setDiesel] = useState("")
    const [gas, setGas] = useState("")
    const [openVehicleCount, setOpenVehicleCount] = useState("")
    const [closedVehicleCount, setClosedVehicleCount] = useState("")
    const [totalVehicleCount, setTotalVehicleCount] = useState("")
    const [refreshing, setRefreshing] = useState(false)

    const [dailyDistance, setDailyDistance] = useState("")
    const [ignitionDistance, setİgnitionDistance] = useState("")
    const [data, setData] = useState([])

    function float2int(value) {
        return value | 0;
    }
    const fetchFuelPrice = async () => {
        try {
            let res = await getCurrentFuelPricesRequest()
            if (res?.data) {
                setOil(res?.data?.priceGasoline)
                setDiesel(res?.data?.priceDiesel)
                setGas(res?.data?.priceGas)
            }
        } catch (error) {
            // console.log(error)
        }
    }
    const fetchVehicleStatiscs = async () => {
        try {
            let res = await getDashBoardStatisticsRequest()
            if (res?.data) {
                setDailyDistance(res?.data?.dailyTotalDistanceKm)
                setİgnitionDistance(res?.data?.ignitionTotalDistanceKm)
            }
        } catch (error) {
            // console.log(error)
        }
    }
    const fetchVehicleInformation = async () => {
        try {
            let res = await getMemberMyVehiclesInformation()
            if (res?.data) {
                setOpenVehicleCount(res?.data?.vehiclesIgnition)
                setClosedVehicleCount(res?.data?.vehiclesNoIgnition)
                setTotalVehicleCount(res?.data?.totalVehicles)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchTrackeble = async () => {
        try {
            let res = await getTrackableVehiclesRequest()
            if (res?.data) {
                setData(res.data)
               // console.log(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {

        (async () => {
            await fetchFuelPrice()
            await fetchVehicleInformation()
            //await fetchVehicleStatiscs()
            await fetchTrackeble()
        })()

        return () => {

        }
    }, [])

    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.container} >
                <View style={styles.headerSlider}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={Statistic} style={styles.icon} />
                        <Text style={styles.headerText}>{t("istatistik")} </Text>
                    </View>
                    <Text style={styles.headerText}>{item.licensePlate}</Text>

                </View>
                <View style={styles.bodyFuel}>
                    <Text>{t("yapilan_yol")} </Text>
                </View>
                <View style={styles.bodyFuel}>
                    <Text>{t("total")} </Text>
                    <Text>{float2int(item.totalDistance / 1000)} km</Text>
                </View>
                <View style={styles.body}>
                    <Text>{t("kontak_sonrası")}</Text>
                    <Text>{float2int(item.distanceSinceIgnitionKm)} km</Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.root}>



            <View style={styles.top}>
                <Image source={Logo} style={styles.logo} />
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Notifications")}>
                    <Image source={NotificationsRounded} style={styles.icon} />
                </TouchableOpacity>
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
                            await fetchFuelPrice()
                            await fetchVehicleInformation()
                            //await fetchVehicleStatiscs()
                            setRefreshing(false)

                        }}
                    />
                }
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={DirectionsCarRounded} style={styles.icon} />
                        <Text style={styles.headerText}>{t("araclarım")} </Text>
                    </View>
                    <View style={styles.body}>
                        <View style={styles.leftBody}>
                            <Text style={{ color: 'rgba(0, 0, 0, 0.54)' }}>{t("kontak_durumuna_göre")} </Text>
                            <View style={styles.contact}>
                                <View style={styles.box}>
                                    <View style={styles.inbox}>
                                        <Text style={{ borderRadius: 100, width: 5, height: 5, backgroundColor: '#19D808' }}></Text>
                                        <Text style={{ marginLeft: 5 }} >{t("acik")} </Text>
                                    </View>
                                    <View style={{ width: 'auto', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.54);', padding: 5 }}>

                                        <Text style={{ color: '#fff' }}>{openVehicleCount}</Text>
                                    </View>
                                </View>
                                <View style={styles.box}>
                                    <View style={styles.inbox}>
                                        <Text style={{ borderRadius: 100, width: 5, height: 5, backgroundColor: '#D80808' }}></Text>
                                        <Text style={{ marginLeft: 5 }} >{t("kapali")} </Text>
                                    </View>
                                    <View style={{ width: 'auto', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.54);', padding: 5 }}>

                                        <Text style={{ color: '#fff' }}>{closedVehicleCount}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.link} onPress={() => navigation.navigate("Vehicles")}>
                                <Text style={{ color: '#D05515' }}> {t("tüm_araclar")} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rightBody}>
                            <Text style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 12, textAlign: 'center', justifyContent: 'center' }}>{t("toplam_arac")} </Text>
                            <Text style={{ color: '#D05515', fontSize: 28, textAlign: 'center', justifyContent: 'center' }}>{totalVehicleCount}</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={LocalGasStationRounded} style={styles.icon} />
                        <Text style={styles.headerText}>{t("guncel_yakit_fiyatları")} </Text>
                    </View>
                    <View style={styles.bodyFuel}>
                        <Text>{t("benzin")} </Text>
                        <Text>{oil} ₺ </Text>
                    </View>
                    <View style={styles.body}>
                        <Text>{t("dizel")}</Text>
                        <Text>{diesel} ₺ </Text>

                    </View>
                    {/* <View style={styles.body}>
                        <Text>Gaz</Text>
                        <Text>{gas} ₺ </Text>

                    </View> */}
                </View>
                <Carousel
                    data={data}
                    renderItem={_renderItem}
                    sliderWidth={width * 0.95}
                    itemWidth={width * 0.95}
                >



                </Carousel>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        display: 'flex',
        justifyContent: 'center',
    },
    wrapper: {},
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
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
        backgroundColor: '#D05515',
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
        alignItems: 'center',
        textAlign: 'center',
        display: 'flex',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10,

    },
    header: {
        width: '100%',
        padding: 8,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        alignItems: 'center'
    },
    headerSlider: {
        width: '100%',
        padding: 8,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerText: {
        marginLeft: 5,
        fontSize: 14
    },
    body: {
        width: '100%',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftBody: {
        width: '65%',
        flexDirection: 'column'
    },
    contact: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    box: {
        width: '45%',
        justifyContent: 'space-between',
        borderColor: 'rgba(0, 0, 0, 0.54);',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inbox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    link: {
        marginTop: 15
    },
    rightBody: {
        width: '25%',
        borderColor: '#D05515',
        borderWidth: 2,
        padding: 5,
        borderRadius: 5,
        flexDirection: 'column'
    },
    bodyFuel: {
        width: '100%',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(79, 79, 79, 0.25)'
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 10,
        marginBottom: 10
    },
    contentContainerStyle: {
        minHeight: "90%",
    },



})

