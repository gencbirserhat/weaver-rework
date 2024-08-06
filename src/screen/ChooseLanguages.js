import { StyleSheet, Text, Image, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker';
import * as RNLocalize from "react-native-localize"
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from "../assets/Turk.png"
import en from "../assets/English.png"
import { useTranslation } from 'react-i18next';

const ChooseLanguages = () => {
    const { t, i18n } = useTranslation()

    //console.log("Route", linkTo);
    useEffect(() => {
        (async () => {
            if (await AsyncStorage.getItem("weaver:selectedLang")) {
                navigation.navigate("Login")
                return
            }
        })()

    }, [])
    const navigation = useNavigation()
    // console.log(JSON.parse(JSON.stringify(RNLocalize.getLocales()[0].languageCode)));
    const [lang, setLang] = useState(JSON.parse(JSON.stringify(RNLocalize.getLocales()[0].languageCode)))
        //console.log(lang);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0, 0.54)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '70%', height: 'auto', padding: 20, backgroundColor: '#fff', borderRadius: 15 }}>
                <Text>Dil seçimi yapın</Text>
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
                    //await AsyncStorage.setItem("weaver:selectedLang", lang)
                    //console.log(i18n);
                    i18n.changeLanguage(lang)
                    //navigation.navigate("Login")
                }} >
                    <Text style={{ color: '#fff' }}>Seç</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default ChooseLanguages

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10,
        padding: 10
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
    button: {
        width: '100%',
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: '#D05515',
        borderRadius: 4,
        alignSelf: 'center'
    },
})

