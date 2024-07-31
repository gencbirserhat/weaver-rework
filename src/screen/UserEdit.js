import { StyleSheet, Modal, TouchableWithoutFeedback, Image, View, Alert, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import PhoneInput from "react-native-phone-number-input";
import { useTranslation } from 'react-i18next';
import ArrowBackIosNewRounded from '../assets/ArrowBackIosNewRounded.png'
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import { Icon, Input, Text } from '@ui-kitten/components';
import { saveEmployeeRequest, updateEployeeRequest } from '../api/controllers/employee-controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UserEdit = ({ route }) => {
    //console.log(route.params.data);
    const { t } = useTranslation()
    const navigation = useNavigation()
    const [editData, setEditData] = useState(route.params.data)
    let phoneValue = editData?.phone.substr(3)
    const [firstName, setFirstName] = useState(editData?.firstName)
    const [lastName, setLastName] = useState(editData?.lastName)
    const [mail, setMail] = useState(editData?.email)
    const [password, setPassword] = useState("")
    const [rePassword, setRePassword] = useState("")
    const [value, setValue] = useState(phoneValue);
    const [formattedValue, setFormattedValue] = useState(phoneValue);
    const [editId, setEditId] = useState(editData?.id)
    const [lang, setLang] = useState("")
    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("weaver:selectedLang")
            setLang(token)
        })()

    }, [])
    const handleCreate = async () => {
        console.log('res', {
            id: editId,
            email: mail,
            firstName: firstName,
            lastName: lastName,
            password: password,
            phone: `+90${value}`
        })

        if (firstName === "" || lastName === "" || value === "" || mail === "" || password === "") {
            Alert.alert(`${t("hata")}`, `${t("zorunlu_alan")}`)
            return
        }
        if (password !== rePassword) {
            Alert.alert(`${t("hata")}`, `${t("parolalar_uyusmuyor")}`)
            return
        }
        try {
            let res = await updateEployeeRequest({
                id: editId,
                email: mail,
                firstName: firstName,
                lastName: lastName,
                password: password,
                phone: `+90${value}`
            })

            if (res) {
                Alert.alert(`${t("basarili")}`, `${t("basarili_kayit")}`,
                    [
                        {
                            text: `${t("evet")}`, onPress: () => {
                                navigation.navigate("Users")
                            }
                        }
                    ])
            }

        } catch (error) {
            console.log(error)
            if (error?.response?.status === 400) {
                if (Array.isArray(error.response.data.data)) {
                    Alert.alert(`${t("hata")}`, error?.response?.data?.data[0].message)
                } else {
                    Alert.alert(`${t("hata")}`, error?.response?.data.message)
                }
            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <View style={styles.top}>
                <View style={styles.topLeft}>
                    <TouchableOpacity style={styles.buttonTop} onPress={() => navigation.goBack()}>
                        <Image source={ArrowBackIosNewRounded} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>{t("kullanici")}  </Text>
                </View>
            </View>
            <ScrollView
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                style={{ backgroundColor: '#F5F5F5' }}>
                <View style={styles.container}>
                    <Input
                        label={t("isim")}
                        placeholder={t("isim")}
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                    />
                    <Input

                        label={t("soyisim")}
                        placeholder={t("soyisim")}
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.input}
                    />
                    <Text style={{ marginTop: 8, color: '#8F9BB3', fontWeight: '800', fontSize: 12, textAlign: 'left', width: '100%' }}>{t("telefon_numaraniz")}</Text>
                    <PhoneInput
                        defaultValue={value}
                        defaultCode="TR"
                        layout="first"
                        placeholder={t("telefon_numaraniz")}
                        onChangeText={(text) => {
                            setValue(text);
                            console.log('text2', text)
                        }}
                        onChangeFormattedText={(text) => {
                            /*  setFormattedValue(text);
                             console.log('text', text) */
                        }}
                        codeTextStyle={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
                        textInputStyle={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
                        textContainerStyle={{ backgroundColor: '#fff', padding: 0, height: 'auto', margin: 0, borderRadius: 4 }}
                        countryPickerButtonStyle={{ padding: 0, backgroundColor: '#fff', padding: 0, margin: 0, borderRadius: 4 }}
                        containerStyle={{ backgroundColor: '#fff', width: '100%', borderWidth: 1, padding: 0, borderRadius: 4, borderColor: 'rgba(0,0,0, 0.54)', marginBottom: 8, marginTop: 4, height: 'auto', }}
                        flagButtonStyle={{ backgroundColor: '#fff', padding: 0, margin: 0, borderRadius: 4 }}
                    />
                    <Input
                        label={t("mail")}
                        placeholder={t("mail")}
                        value={mail}
                        onChangeText={setMail}
                        style={styles.input}
                        keyboardType="email-address"
                    />
                    <Input
                        label={t("sifre")}
                        placeholder={t("sifre")}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry={true}
                    />
                    <Input
                        label={t("resifre")}
                        placeholder={t("resifre")}
                        value={rePassword}
                        onChangeText={setRePassword}
                        style={styles.input}
                        secureTextEntry={true}
                    />


                    <TouchableOpacity onPress={() => handleCreate()} style={styles.button} >
                        <Text style={{ color: '#fff', fontSize: 16 }}>{t("düzenle")}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    topLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        width: "100%",
        backgroundColor: '#fff',
        borderRadius: 5,
        color: 'black',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0, 0.54)',
        marginVertical: 8,

    }, inputImei: {
        width: "80%",
        backgroundColor: '#fff',
        borderRadius: 5,
        color: 'black',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0, 0.54)',
        marginVertical: 5,

    },
    inputOption: {
        width: "100%",
        backgroundColor: '#fff',
        borderRadius: 5,
        color: 'black',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0, 0.54)',
        marginVertical: 10,

    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'column',
        alignItems: 'center'
    },
    selectView: {
        width: '100%',
        marginVertical: 5,
        backgroundColor: '#F5F5F5',
    },
    button: {
        width: '100%',
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: '#D05515',
        borderRadius: 4,
        alignSelf: 'center'
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
    buttonTop: {
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

})

export default UserEdit