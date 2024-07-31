import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableOpacityBase, View, } from 'react-native';
import AccountCircleRounded from '../assets/AccountCircleRounded.png'
import ArrowForwardIosRounded from '../assets/ArrowForwardIosRounded.png'
import CloseIcon from '../assets/CloseIcon.png'
import ArrowBackIosNewRounded from '../assets/ArrowBackIosNewRounded.png'
import { changePasswordRequest, meRequest } from '../api/controllers/account-controller';
import { useTranslation } from 'react-i18next';
import PageContainerFullScroll from '../components/templates.js/PageContainerFullScroll';
import TopNavBack from '../components/molecules.js/TopNavBack';
import colors from '../../public/assets/colors/colors';
import CustomButton from '../components/atoms.js/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window")

const MyAccount = ({ navigation }) => {

    const { t } = useTranslation()
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordRe, setNewPasswordRe] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [phone, setPhone] = useState("")

    const fetchMe = async () => {
        try {
            let res = await meRequest()
            if (res?.data) {
                setPhone(res?.data?.phone)

                if (res?.data.userType === "CorporateUser") {
                    setDisplayName(res?.data?.commercialTitle)
                }
                else if (res?.data.userType === "IndividualUser") {
                    setDisplayName(res?.data?.firstName + " " + res?.data?.lastName)
                } else {
                    Alert.alert(`${t("hata")}`, "Kullanıcı ekranıdır.")
                }
            }
        } catch (error) {
        }
    }
    useEffect(() => {


        fetchMe()
        return () => {

        }
    }, [])

    const changePassord = async (e) => {
        try {

            let res = await changePasswordRequest({
                newPassword: newPassword,
                oldPassword: oldPassword,
                repeatNewPassword: newPasswordRe,
            })
            if (res?.status === 200) {
                setTimeout(() => {
                    Alert.alert(`${t("basarili")}`, `${t("basarili_sifre_degistirme")}`)
                    navigation.navigate("Login")
                }, 1500);
            } else {
                Alert.alert(`${t("hata")}`, `${t("bilgiler_hatali")}`)
            }
        } catch (error) {
            Alert.alert(`${t("hata")}`, error.response.data.message)
        }
    }

    const deleteAccount = () => {
        setConfirmDeleteModal(false)
        Alert.alert(t("Hesap silme talebiniz alınmıştır"), t("Hesaba 5 gün erişim olmaması halinde hesabınız silinecektir"),
            [
                {
                    text: `${t("evet")}`, onPress: () => {
                        logOut()
                    }
                }
            ])
    }

    const logOut = async () => {
        const removeToken = AsyncStorage.removeItem('weaver:token')
        if (removeToken) {
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

    return (
        <>
            <PageContainerFullScroll topNav={<TopNavBack title={t("hesabim")} />} onRefresh={() => { console.log('Hesabımı çek') }}  >
                <View style={styles.Card}>
                    <Text style={{ color: '#D05515', fontSize: 18 }}>{t("genel_bilgiler")} </Text>
                    <Text style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 14 }}>{t("genel_bilgiler")} / {t("isim")} {t("soyisim")}</Text>
                    <Text style={{ color: '#000', fontSize: 16 }}> {displayName} </Text>
                    <Text style={{ marginTop: 20, color: '#D05515', fontSize: 18 }}>{t("iletisim_bilgileri")}</Text>
                    <Text style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 14 }}>{t("telefon_numarasi")}</Text>
                    <Text style={{ color: '#000', fontSize: 16 }}> {phone} </Text>
                    <View
                        style={{
                            marginTop: 20,
                            width: '100%',
                            borderBottomColor: '#E0E0E0',
                            borderBottomWidth: 1,
                        }}
                    />
                    <Text style={{ marginTop: 10, color: '#D05515', fontSize: 18 }}>{t("genel_bilgiler")}</Text>
                    <View style={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: 14, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>{t("sifre_degistirmek_icin")}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ width: 'auto', alignItems: 'center', height: 'auto', backgroundColor: '#FFEBEE', padding: 5, borderRadius: 4 }} >
                            <Text style={{ color: '#D05515' }}>{t("tiklayiniz")} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => setConfirmDeleteModal(true)} style={{ width: 'auto', alignItems: 'center', height: 'auto', backgroundColor: '#FFEBEE', padding: 5, borderRadius: 4, marginTop: 16, marginBottom: 8, width: "50%", alignSelf: "center" }} >
                    <Text style={{ color: '#D05515' }}>{t("hesabimi_sil")} </Text>
                </TouchableOpacity>
            </PageContainerFullScroll>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert("Hata", "Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ height: 'auto', alignItems: 'flex-start', justifyContent: 'center', width: '100%', padding: 10 }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ width: 'auto', alignItems: 'center', height: 'auto', backgroundColor: '#FFEBEE', padding: 5, borderRadius: 4 }} >
                                <Image source={CloseIcon} style={styles.icon}></Image>
                            </TouchableOpacity>
                        </View>
                        <TextInput secureTextEntry value={oldPassword} onChangeText={setOldPassword} style={styles.input} placeholder={t("Eski Şifreniz")} placeholderTextColor="#000" />
                        <TextInput secureTextEntry value={newPassword} onChangeText={setNewPassword} style={styles.input} placeholder={t("Yeni Şifreniz")} placeholderTextColor="#000" />
                        <TextInput secureTextEntry value={newPasswordRe} onChangeText={setNewPasswordRe} style={styles.input} placeholder={t("Yeni Şifreniz Tekrar")} placeholderTextColor="#000" />
                        <TouchableOpacity onPress={() => {
                            changePassord()
                        }
                        } style={styles.buttonChange} >
                            <Text style={{ color: '#D05515' }}>{t("Değiştir")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmDeleteModal}
                onRequestClose={() => {
                    // Alert.alert("Hata", "Modal has been closed.");
                    setConfirmDeleteModal(false);
                }}
            >
                <View style={styles.centeredView2}>
                    <View style={styles.modalView}>
                        <View style={{ marginBottom: 16 }}>
                            <Text>{t("Hesabınızı silmek istediğinize emin misiniz?")} </Text>
                        </View>
                        <View style={styles.buttonsContainer}>
                            <View style={styles.confirmButton}>
                                <CustomButton backgroundColor={colors.white} color={colors.orange} text='İptal et' onPress={() => { setConfirmDeleteModal(false); }} />
                            </View>
                            <View style={styles.confirmButton}>
                                <CustomButton text='Eminim' onPress={() => { deleteAccount() }} />
                            </View>
                        </View>
                        {/*  <View style={{ height: 'auto', alignItems: 'flex-start', justifyContent: 'center', width: '100%', padding: 10 }}>
                            <TouchableOpacity onPress={() => setConfirmDeleteModal(false)} style={{ width: 'auto', alignItems: 'center', height: 'auto', backgroundColor: '#FFEBEE', padding: 5, borderRadius: 4 }} >
                                <Image source={CloseIcon} style={styles.icon}></Image>
                            </TouchableOpacity>
                        </View>
                        <TextInput secureTextEntry value={oldPassword} onChangeText={setOldPassword} style={styles.input} placeholder={t("Eski Şifreniz")} placeholderTextColor="#000" />
                        <TextInput secureTextEntry value={newPassword} onChangeText={setNewPassword} style={styles.input} placeholder={t("Yeni Şifreniz")} placeholderTextColor="#000" />
                        <TextInput secureTextEntry value={newPasswordRe} onChangeText={setNewPasswordRe} style={styles.input} placeholder={t("Yeni Şifreniz Tekrar")} placeholderTextColor="#000" />
                        <TouchableOpacity onPress={() => {
                            changePassord()
                        }
                        } style={styles.buttonChange} >
                            <Text style={{ color: '#D05515' }}>{t("Değiştir")}</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
            </Modal>
        </>

    );
};

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%"
    },
    confirmButton: {
        width: "40%"
    },
    Card: {
        alignItems: "flex-start",
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 8,
    },
    icon: {
        width: 20,
        height: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 22
    },
    centeredView2: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: '90%',
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        width: "90%",
        backgroundColor: '#fff',
        padding: 15,
        margin: 10,
        borderRadius: 5,
        color: 'black',
        borderColor: 'rgba(0, 0, 0, 0.54)',
        borderWidth: 1
    },
    buttonChange: {
        width: "90%",
        alignItems: 'center',
        height: 'auto',
        backgroundColor: '#FFEBEE',
        padding: 10,
        borderRadius: 4,
        margin: 10,
    }


})

export default MyAccount;