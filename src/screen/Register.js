import { StyleSheet, Text, View, SafeAreaView, Alert, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/core';
import PhoneInput from "react-native-phone-number-input";
import { useTranslation } from 'react-i18next';
import * as RNLocalize from "react-native-localize"
import { registerCorporateRequest, registerIndividualRequest } from '../api/controllers/account-controller';
import colors from '../../public/assets/colors/colors';
const Register = () => {
    const { t } = useTranslation()
    const navigation = useNavigation()
    const FirstRoute = () => {
        const [name, setName] = useState("")
        const [surname, setSurname] = useState("")
        const [phone, setPhone] = useState("")
        const [mail, setMail] = useState("")
        const [province, setProvince] = useState("")
        const [password, setPassword] = useState("")
        const [repassword, setRepassword] = useState("")
        const [value, setValue] = useState("");
        const [formattedValue, setFormattedValue] = useState("");
        /*  const phoneCode = JSON.parse(JSON.stringify(RNLocalize.getLocales()[0].countryCode));
         const upperCasePhoneCode = phoneCode.toUpperCase()
         console.log(upperCasePhoneCode); */

        const handleRegisterIndividual = async () => {

            if (password !== repassword) {
                Alert.alert(`${t("hata")}`, `${t("parolalar_uyusmuyor")}`)
                return
            }

            try {
                let res = await registerIndividualRequest({
                    email: mail,
                    firstName: name,
                    lastName: surname,
                    phone: formattedValue,
                    password: password,
                })

                if (res) {
                    Alert.alert(`${t("basarili")}`, `${t("basarili_kayit")}`,
                        [
                            {
                                text: `${t("evet")}`, onPress: () => {
                                    navigation.navigate("Login")
                                }
                            }
                        ])
                }
            } catch (error) {
                console.log(error.response.data.message)
                // setPhoneModalOpen(false)
                //alert('Bir Hata Oldu.', { variant: "error" });
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
            <ScrollView
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder={t("isim")}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("soyisim")}
                        value={surname}
                        onChangeText={setSurname}
                    />
                    {/* <TextInput
                        style={styles.input}
                        placeholder="Telefon Numaranız"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="numeric"

                    /> */}

                    <PhoneInput
                        defaultValue={value}
                        defaultCode="TR"
                        layout="first"
                        placeholder={t("telefon_numaraniz")}
                        onChangeText={(text) => {
                            setValue(text);
                        }}
                        onChangeFormattedText={(text) => {
                            setFormattedValue(text);
                        }}
                        codeTextStyle={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
                        textInputStyle={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
                        textContainerStyle={{ backgroundColor: '#fff', padding: 0, height: '100%', margin: 0, borderRadius: 4 }}
                        countryPickerButtonStyle={{ padding: 0, backgroundColor: '#fff', padding: 0, margin: 0, borderRadius: 4 }}
                        containerStyle={{ backgroundColor: '#fff', width: '100%', borderWidth: 1, padding: 0, borderRadius: 4, borderColor: 'rgba(0,0,0, 0.54)', marginVertical: 15, height: 'auto', }}
                        flagButtonStyle={{ backgroundColor: '#fff', padding: 0, margin: 0, borderRadius: 4 }}

                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("mail")}
                        value={mail}
                        onChangeText={setMail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("sehir")}
                        value={province}
                        onChangeText={setProvince}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("sifre")}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("resifre")}
                        value={repassword}
                        onChangeText={setRepassword}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={() => handleRegisterIndividual()} style={styles.button} >
                        <Text style={{ color: '#fff', fontSize: 16 }}>{t("kaydol")}</Text>
                    </TouchableOpacity>
                    <View style={{ width: '100%', backgroundColor: 'rgba(208, 85, 21, 0.2)', height: 1, marginTop: 25 }}>

                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={{ marginTop: 15 }}>
                        <Text style={{ color: '#D05515', fontSize: 16 }}>{t("kayitliyim")}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    const SecondRoute = () => {
        const [title, setTitle] = useState("")
        const [value, setValue] = useState("");
        const [mail, setMail] = useState("")
        const [password, setPassword] = useState("")
        const [repassword, setRepassword] = useState("")
        const [formattedValue, setFormattedValue] = useState("");
        const handleRegisterCorporate = async () => {

            if (password !== repassword) {
                Alert.alert(`${t("hata")}`, `${t("parolalar_uyusmuyor")}`)
                return
            }
            try {
                let res = await registerCorporateRequest({
                    title: title,
                    email: mail,
                    phone: formattedValue,
                    password: password
                })
                if (res) {
                    Alert.alert(`${t("basarili")}`, `${t("basarili_kayit")}`,
                        [
                            {
                                text: `${t("evet")}`, onPress: () => {
                                    navigation.navigate("Login")
                                }
                            }
                        ])
                }
            } catch (error) {
                console.log(error.response.data.message)
                // setPhoneModalOpen(false)
                //alert('Bir Hata Oldu.', { variant: "error" });
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
            <ScrollView keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder={t("sirket_unvani")}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <PhoneInput
                        defaultValue={value}
                        defaultCode="TR"
                        layout="first"
                        placeholder={t("telefon_numaraniz")}
                        onChangeText={(text) => {
                            setValue(text);
                        }}
                        onChangeFormattedText={(text) => {
                            setFormattedValue(text);
                        }}
                        codeTextStyle={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
                        textInputStyle={{ backgroundColor: '#fff', padding: 0, margin: 0 }}
                        textContainerStyle={{ backgroundColor: '#fff', padding: 0, height: '100%', margin: 0, borderRadius: 4 }}
                        countryPickerButtonStyle={{ padding: 0, backgroundColor: '#fff', padding: 0, margin: 0, borderRadius: 4 }}
                        containerStyle={{ backgroundColor: '#fff', width: '100%', borderWidth: 1, padding: 0, borderRadius: 4, borderColor: 'rgba(0,0,0, 0.54)', marginVertical: 15, height: 'auto', }}
                        flagButtonStyle={{ backgroundColor: '#fff', padding: 0, margin: 0, borderRadius: 4 }}

                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("mail")}
                        value={mail}
                        onChangeText={setMail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("sifre")}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={t("resifre")}
                        value={repassword}
                        onChangeText={setRepassword}
                        secureTextEntry
                    />
                    <TouchableOpacity onPress={() => handleRegisterCorporate()} style={styles.button} >
                        <Text style={{ color: '#fff', fontSize: 16 }}>{t("kaydol")}</Text>
                    </TouchableOpacity>
                    <View style={{ width: '100%', backgroundColor: 'rgba(208, 85, 21, 0.2)', height: 1, marginTop: 25 }}>

                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={{ marginTop: 15 }}>
                        <Text style={{ color: '#D05515', fontSize: 16 }}>{t("kayitliyim")}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        )
    }






    const [selectedType, setSelectedType] = useState('individual')
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Bireysel' },
        { key: 'second', title: 'Kurumsal' },
    ]);
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });
    const renderTabBar = props => (

        <TabBar
            {...props}
            activeColor={'#007DFF'}
            inactiveColor={'rgba(0, 0, 0, 0.54)'}
            indicatorStyle={{ backgroundColor: '#007DFF' }}
            style={{ backgroundColor: '#fff' }}
        />
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.top}>
                <TouchableOpacity style={selectedType === 'individual' ? styles.selected : styles.unselected} onPress={() => { setSelectedType('individual') }}>
                    <Text style={styles.topText}>{t("bireysel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={selectedType === 'corporate' ? styles.selected : styles.unselected} onPress={() => { setSelectedType('corporate') }}>
                    <Text style={styles.topText}>{t("kurumsal")}</Text>
                </TouchableOpacity>
            </View>
            {/*  <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                style={{ borderRadius: 4, }}
            /> */}
            {selectedType === 'individual' && <FirstRoute />}
            {selectedType === 'corporate' && <SecondRoute />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    selected: {
        backgroundColor: colors.orangeLight,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.orange,
        marginHorizontal: 4
    },
    unselected: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 4
    },
    topText: {
        color: colors.orange
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 70,
        backgroundColor: colors.white
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
    input: {
        width: "100%",
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 5,
        color: 'black',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0, 0.54)',
        marginVertical: 10,

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


})

export default Register