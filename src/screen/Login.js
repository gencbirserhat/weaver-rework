import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Platform, SafeAreaView, Modal, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, } from 'react-native';
import Logo from "../assets/logo.png";
import CheckBox from '@react-native-community/checkbox';
import { loginRequest, meRequest, updateDeviceTokenRequest } from '../api/controllers/account-controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import { firebase } from '@react-native-firebase/messaging';
import MaskInput from 'react-native-mask-input';
import { useTranslation } from "react-i18next";
import * as RNLocalize from "react-native-localize"
import tr from "../assets/Turk.png"
import en from "../assets/English.png"
import NotificationsRounded from '../assets/NotificationsRounded.png'
const { width, height } = Dimensions.get("window")
const Login = () => {
    const { t, i18n } = useTranslation();


    //const t = (text) => { return text }
    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("weaver:selectedLang")
            if (token) {
                //console.log("++++++", token);
                setModal(false)
            }
            else {
                setModal(true)
            }
        })()

    }, [lang])
    const [lang, setLang] = useState(JSON.parse(JSON.stringify(RNLocalize.getLocales()[0].languageCode)))


    const navigation = useNavigation()
    const [rememberMe, setRememberMe] = useState(false)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState("")
    const [modal, setModal] = useState(false)

    async function requestUserPermission() {
        try {

            const messaging = firebase.messaging()
            console.log("aaaaaaa")
            console.log(firebase.messaging.AuthorizationStatus)
            const authStatus = await messaging.requestPermission();
            const enabled =
                authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
            }
        } catch (error) {
            console.log(error);
        }

    }
    const fetchMe = async () => {
        try {
            let res = await meRequest()
            if (res?.status === 200) {
                navigation.navigate("route-name")
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        requestUserPermission()
        fetchMe()
        // homeRequest()
        return () => {

        }
    }, [])

    const handleLogin = async () => {
        let token = null;
        setLoading(true)
        try {
            const messaging = firebase.messaging()
            if (!messaging.isDeviceRegisteredForRemoteMessages) {
                await firebase.messaging().registerDeviceForRemoteMessages();
            }
            if (messaging.isDeviceRegisteredForRemoteMessages) {
                token = await messaging.getToken();
                console.log("firebase token");
                console.log(token);
            }

        } catch (error) {
            Alert.alert("Hata", error.response)
        }
        try {
            AsyncStorage.removeItem('weaver:token')
            let res = await loginRequest({
                password: password,
                phoneNumber: phone,
                rememberMe,
            })
            if (res?.data) {
                if (token !== null) {
                    await updateDeviceTokenRequest(token)
                }
                console.log("deneme", "deneme")
                setTimeout(() => {
                    setLoading(false)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'route-name' }],
                      });
                    /* navigation.navigate("route-name") */
                }, 2000);
            } else {
                console.log("456", res)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            if (error?.response?.status === 400) {
                if (Array.isArray(error.response.data.data)) {
                    Alert.alert(t("Hata"), error?.response?.data?.data[0].message)
                } else {
                    Alert.alert(t("Hata"), error?.response?.data.message)
                }
            }
            else {
                Alert.alert(t("Hata"), t("Bilinmeyen hata meydana geldi. Lütfen sistem yöneticinizle konuşunuz"))
            }
        }
    }
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.top}>
                <View></View>
                <TouchableOpacity onPress={() => setModal(true)} style={{ width: 'auto', height: 'auto', flexDirection: 'row', padding: 10, backgroundColor: 'rgba(79,79,79,0.1)', borderRadius: 4 }}>

                    {
                        lang === 'tr' ?
                            <>
                                <Image source={tr} style={{ width: 20, height: 16 }} />
                                <Text style={{ marginLeft: 4 }}>
                                    Türkçe
                                </Text>
                            </>
                            :
                            <>
                                <Image source={en} style={{ width: 20, height: 16 }} />
                                <Text style={{ marginLeft: 4 }}>
                                    English
                                </Text>
                            </>
                    }
                </TouchableOpacity>
            </View>
            <View style={{ height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "height"} keyboardVerticalOffset={keyboardVerticalOffset} style={{ width: '100%', justifyContent: 'center', alignSelf: 'center', backgroundColor: '#F5F5F5' }}>

                    <Image source={Logo} style={styles.logo} />

                    <MaskInput
                        value={phone}
                        style={styles.input}
                        //mask={Masks.BRL_PHONE}
                        onChangeText={(masked, unmasked) => {
                            setPhone(`+90${unmasked}`); // you can use the unmasked value as well

                            // assuming you typed "9" all the way:
                            //  console.log(masked); // (99) 99999-9999
                            // console.log(unmasked); // 99999999999
                        }}

                        placeholder={t("telefon_numaraniz")}
                        placeholderTextColor="black"
                        showObfuscatedValue
                        keyboardType="phone-pad"
                        // mask={['(', '0',  ')', ' ',/\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/,' ', /\d/, /\d/]}
                        mask={['+', '9', '0', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/]}
                    // mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                    />
                    <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder={t("sifre")} placeholderTextColor="#000" secureTextEntry />
                    <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                        <Text style={styles.text}>{t("giris_yap")}</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.remmeberMe}>
                            <CheckBox
                                disabled={false}
                                value={rememberMe}
                                onValueChange={(newValue) => {
                                    setRememberMe(newValue)
                                }}
                                tintColors={{ true: '#D05515', false: 'black' }} //sadece adnroid için 
                                tintColor="black" // sadece ios için 
                                onTintColor="#D05515"// sadece ios için 
                                onCheckColor="#D05515"// sadece ios için 
                                boxType="square"// sadece ios için 
                                lineWidth={1}// sadece ios için 
                            />
                            <Text style={styles.headerText}>{t("beni_hatirla")} </Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text>{t("şifremi_unuttum")}</Text>
                        </TouchableOpacity>

                    </View>
                    {
                        <Loading loading={loading} />
                    }
                </KeyboardAvoidingView>
                <View style={{ width: '90%', backgroundColor: 'rgba(208, 85, 21, 0.2)', height: 1, marginTop: 25 }}>

                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                    style={{ marginTop: 15 }}>
                    <Text style={{ color: '#D05515', fontSize: 16 }}>{t("kayitli_degilim")}</Text>
                </TouchableOpacity>
            </View>

            <Modal animationType='fade' transparent={true} visible={modal} onRequestClose={() => setModal(false)} >
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0, 0.54)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '70%', height: 'auto', padding: 20, backgroundColor: '#fff', borderRadius: 15 }}>
                        {
                            lang === 'tr' ?
                                <Text>Dil seçimi yapın</Text>
                                :
                                <Text>Choose Language</Text>
                        }
                        <View style={{ width: '100%', height: 1, marginVertical: 10, backgroundColor: 'rgba(0,0,0, 0.14)' }}>
                        </View>
                        <TouchableOpacity onPress={() => setLang("tr")} style={lang === 'tr' ? styles.languageText : styles.selectedlanguageText}>
                            <Image source={tr} style={{ width: 20, height: 16 }} />
                            <Text style={{ marginLeft: 4 }}>
                                Türkçe
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setLang("en")} style={lang === 'en' ? styles.languageText : styles.selectedlanguageText}>
                            <Image source={en} style={{ width: 20, height: 16 }} />
                            <Text style={{ marginLeft: 4 }}>
                                English
                            </Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={async () => {
                            await AsyncStorage.setItem("weaver:selectedLang", lang)
                            i18n.changeLanguage(lang)
                            setModal(false)
                        }} >
                            <Text style={{ color: '#fff' }}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "flex-start",
        backgroundColor: "#F5F5F5",
        justifyContent: 'flex-start',
        position: 'relative',

    },
    logo: {
        resizeMode: "contain",
        width: width / 2,
        height: 100,
        alignSelf: 'center'

    },

    input: {
        width: "90%",
        backgroundColor: '#fff',
        padding: 15,
        margin: 10,
        borderRadius: 5,
        color: 'black',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0, 0.54)'
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
    text: {
        color: '#fff',
    },
    remmeberMe: {
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'
    },
    header: {
        width: '90%',
        padding: 8,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    headerText: {
        marginLeft: 5,
        fontSize: 14
    },
    languageText: {
        backgroundColor: '#FBE9E7',
        padding: 10,
        textAlign: 'center',
        marginVertical: 5,
        borderRadius: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectedlanguageText: {
        backgroundColor: '#fff',
        padding: 10,
        textAlign: 'center',
        marginVertical: 5,
        justifyContent: 'flex-start',
        flexDirection: 'row'

    },
    top: {
        width: '100%',
        height: 70,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',

    },
})

export default Login;