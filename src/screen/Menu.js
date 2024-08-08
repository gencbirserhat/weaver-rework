import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, Button, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableOpacityBase, View, Modal, } from 'react-native';
import { logoutRequest, meRequest } from '../api/controllers/account-controller';
import AccountCircleRounded from '../assets/AccountCircleRounded.png'
import ArrowForwardIosRounded from '../assets/ArrowForwardIosRounded.png'
import NotificationsRoundedColor from '../assets/NotificationsRoundedColor.png'
import Setting from '../assets/settings.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import car from "../assets/DirectionsCarRounded.png"
import users from "../assets/users.png"
import CloseIcon from '../assets/CloseIcon.png'
import colors from '../../public/assets/colors/colors';
import OnayModal from '../components/molecules.js/OnayModal';
import { firebase } from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get("window")

const Menu = ({ navigation }) => {
    const { t, i18n } = useTranslation()

    const [modalVisible, setModalVisible] = useState(false)

    const [userName, setUserName] = useState("")
    const [displayName, setDisplayName] = useState("")

    const [userType, setUserType] = useState("")
    const logOut = async () => {

        // console.log(res?.status)

        const removeToken = AsyncStorage.removeItem('weaver:token')
        if (removeToken) {
            /* navigation.navigate("Login") */
            firebase.messaging().deleteToken()
            setModalVisible(false)

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }, 1000);

        }
        else {
            Alert.alert(`${t("hata")}`, `${t("cikis_hata")}`)
        }
    }

    const fetchMe = async () => {
        try {
            let res = await meRequest()
            //console.log(res?.data)
            if (res?.data) {
                setUserType(res?.data?.userType)
                if (res?.data.userType === "CorporateUser") {
                    setDisplayName(res?.data?.title)
                }
                else if (res?.data.userType === "IndividualUser") {
                    setDisplayName(res?.data?.firstName + " " + res?.data?.lastName)
                }
                else if (res?.data.userType === "Employee") {
                    setDisplayName(res?.data?.firstName + " " + res?.data?.lastName)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchMe()
        // homeRequest()
        return () => {
        }
    }, [])

    return (
        <>
            <SafeAreaView style={styles.root}>
                <View style={styles.top}>
                    <Text style={{ fontSize: 20 }}>{t("menu")}</Text>
                </View>
                <ScrollView nestedScrollEnabled
                    style={styles.scrollView}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    <View style={styles.container}>
                        <View style={{ width: '100%', height: 'auto' }}>
                            <View style={styles.text} >
                                <Text>{t("merhaba")}, {displayName}</Text>
                            </View>
                            <TouchableOpacity style={styles.Islemler} onPress={() => navigation.navigate("MyAccount")}>
                                <View style={styles.header}>
                                    <Image source={AccountCircleRounded} style={styles.icon} />
                                    <Text style={styles.headerText}>{t("hesabim")}</Text>
                                </View>
                                <Image source={ArrowForwardIosRounded} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Islemler} onPress={() => navigation.navigate("Notifications")}>
                                <View style={styles.header}>
                                    <Image source={NotificationsRoundedColor} style={styles.icon} />
                                    <Text style={styles.headerText}>{t("bildirimler")}</Text>
                                </View>
                                <Image source={ArrowForwardIosRounded} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Islemler} onPress={() => navigation.navigate("Settings")}>
                                <View style={styles.header}>
                                    <Image source={Setting} style={styles.icon} />
                                    <Text style={styles.headerText}>{t("ayarlar")}</Text>
                                </View>
                                <Image source={ArrowForwardIosRounded} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Islemler} onPress={() => navigation.navigate("Vehicles")}>
                                <View style={styles.header}>
                                    <Image source={car} style={styles.icon} />
                                    <Text style={styles.headerText}>{t("araclar")}</Text>
                                </View>
                                <Image source={ArrowForwardIosRounded} style={styles.icon} />
                            </TouchableOpacity>
                            {
                                userType === "Employee" ?
                                    <></>
                                    :
                                    <TouchableOpacity style={styles.Islemler} onPress={() => navigation.navigate("Users")}>
                                        <View style={styles.header}>
                                            <Image source={users} style={styles.icon} />
                                            <Text style={styles.headerText}>{t("kullanici")}</Text>
                                        </View>
                                        <Image source={ArrowForwardIosRounded} style={styles.icon} />
                                    </TouchableOpacity>
                            }

                        </View>

                        <TouchableOpacity style={styles.IslemlerBottom} onPress={() => { setModalVisible(true) /* logOut() */ }} >
                            <View style={styles.header}>
                                <Text style={styles.headerText}>{t("cikis_yap")}</Text>
                            </View>
                            <Image source={ArrowForwardIosRounded} style={styles.icon} />
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Hata", "Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <OnayModal title={t("Çıkış yapmak istediğinize emin misiniz?")} decline={() => setModalVisible(false)} approve={() => logOut()} />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({

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
        justifyContent: 'center',
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
        backgroundColor: colors.orange,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        display: 'flex',
        height: '90%',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10
    },
    containerFuel: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        display: 'flex',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10, marginBottom: 30
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
        borderColor: colors.orange,
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
        padding: 10
    },
    contentContainerStyle: {
        minHeight: "90%",
    },
    text: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: 'rgba(79, 79, 79, 0.15)',
        borderBottomWidth: 1
    },
    Islemler: {
        width: '100%',
        height: 'auto',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: 'rgba(79, 79, 79, 0.15)',
        borderBottomWidth: 1,
        padding: 10
    },
    IslemlerBottom: {
        width: '100%',
        height: 'auto',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopColor: 'rgba(79, 79, 79, 0.15)',
        borderTopWidth: 1,
        padding: 10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },


})

export default Menu;