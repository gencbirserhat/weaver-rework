import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../../public/assets/colors/colors'
import { useTranslation } from 'react-i18next'

const OnayModal = (props) => {
    const { t } = useTranslation()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0, 0.54)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ height: 'auto', alignItems: 'flex-start', justifyContent: 'center', width: '100%', padding: 10 }}>
                        <Text>{props.title}</Text>
                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                        <TouchableOpacity style={styles.button3} onPress={props.decline}>
                            <Text style={styles.text3}>{t("iptalet")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button2} onPress={props.approve}>
                            <Text style={styles.text2}>{t("eminim")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default OnayModal

const styles = StyleSheet.create({
    button2: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 12,
        backgroundColor: colors.orange,
        borderRadius: 4,
        alignSelf: 'center'
    },
    button3: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        margin: 12,
        borderColor: colors.orange,
        borderWidth: 1,
        borderRadius: 4,
        alignSelf: 'center'
    },
    text2: {
        color: '#fff',
    },
    text3: {
        color: colors.orange,
    },
    centeredView: {
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
})