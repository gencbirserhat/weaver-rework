import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableOpacityBase, View, } from 'react-native';
import ArrowBackIosNewRounded from '../assets/ArrowBackIosNewRounded.png'
import CheckBox from '@react-native-community/checkbox';
import { getMemberSettingsRequest, ignitionNotificationRequest } from '../api/controllers/account-controller';
import { useTranslation } from 'react-i18next';
import PageContainerFullScroll from '../components/templates.js/PageContainerFullScroll';
import TopNavBack from '../components/molecules.js/TopNavBack';
import colors from '../../public/assets/colors/colors';
import SettingItem from '../components/molecules.js/SettingItem';
import { getSettingsInfoRequest, idleNotificationRequest, ignitionFalseNotificationRequest, ignitionTrueNotificationRequest, logChangesWhenIgnitionFalseNotificationRequest, overSpeedRequest, safeZoneOutNotificationRequest } from '../api/controllers/settings-controller';
import { useLayoutEffect } from 'react';
const { width, height } = Dimensions.get("window")

const Settings = ({ navigation }) => {
    const { t } = useTranslation()

    const [settings, setSettings] = useState({
        ignitionTrueNotification: false,
        ignitionFalseNotification: false,
        safeZoneOutNotification: false,
        overSpeed: false,
        logChangesWhenIgnitionFalseNotification: false,
        idleNotification: false
    })

    const fetchSetting = async () => {
        try {
            let res = await getSettingsInfoRequest()
            //  console.log(res?.data)
            if (res) {
                setSettings(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useLayoutEffect(() => {
        fetchSetting()
        return () => {

        }
    }, [])

    const ignitionTrueNotification = async () => {
        try {
            let res = await ignitionTrueNotificationRequest(!settings.ignitionTrueNotification)
            if (res) {
                fetchSetting()
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const ignitionFalseNotification = async () => {
        try {
            let res = await ignitionFalseNotificationRequest(!settings.ignitionFalseNotification)
            if (res) {
                fetchSetting()
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const safeZoneOutNotification = async () => {
        try {
            let res = await safeZoneOutNotificationRequest(!settings.safeZoneOutNotification)
            if (res) {
                fetchSetting()
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const overSpeed = async () => {
        try {
            let res = await overSpeedRequest(!settings.overSpeed)
            if (res) {
                fetchSetting()
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const logChangesWhenIgnitionFalseNotification = async () => {
        try {
            let res = await logChangesWhenIgnitionFalseNotificationRequest(!settings.logChangesWhenIgnitionFalseNotification)
            if (res) {
                fetchSetting()
            }
        } catch (error) {
            console.log('error', error)
        }
    }
    const idleNotification = async () => {
        try {
            let res = await idleNotificationRequest(!settings.idleNotification)
            if (res) {
                fetchSetting()
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            <PageContainerFullScroll topNav={<TopNavBack title={t("ayarlar")} />} onRefresh={() => fetchSetting()}  >

                <View style={styles.Card}>

                    <SettingItem onPress={() => {
                        ignitionTrueNotification()
                        setSettings({ ...settings, ignitionTrueNotification: !settings.ignitionTrueNotification })
                    }}
                        value={settings.ignitionTrueNotification}
                        text={t('Kontak açıldığında bildirim al')}
                    />

                    <SettingItem onPress={() => {
                        ignitionFalseNotification()
                        setSettings({ ...settings, ignitionFalseNotification: !settings.ignitionFalseNotification })
                    }}
                    value={settings.ignitionFalseNotification}
                    text={t('Kontak kapandığında bildirim al')}
                    />

                    <SettingItem onPress={() => {
                        safeZoneOutNotification()
                        setSettings({ ...settings, safeZoneOutNotification: !settings.safeZoneOutNotification })
                    }}
                    value={settings.safeZoneOutNotification}
                    text={t('Bölge sınırın dışına çıktığında bildirim al')}
                    />

                    <SettingItem onPress={() => {
                        overSpeed()
                        setSettings({ ...settings, overSpeed: !settings.overSpeed })
                    }}
                    value={settings.overSpeed}
                    text={t('Hız limiti aştığında bildirim al')}
                    />

                    <SettingItem onPress={() => {
                        logChangesWhenIgnitionFalseNotification()
                        setSettings({ ...settings, logChangesWhenIgnitionFalseNotification: !settings.logChangesWhenIgnitionFalseNotification })
                    }}
                    value={settings.logChangesWhenIgnitionFalseNotification}
                    text={t('Kontak kapalı iken Konum değiştiğinde bildirim al')}
                    />

                    <SettingItem onPress={() => {
                        idleNotification()
                        setSettings({ ...settings, idleNotification: !settings.idleNotification })
                    }}
                        value={settings.idleNotification}
                        text={t('Rölantı bildirimi al')}
                        lastItem
                    />

                </View>

            </PageContainerFullScroll>

            {/*    <SafeAreaView style={styles.root}>

                 <View style={styles.top}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Image source={ArrowBackIosNewRounded} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>{t("ayarlar")} </Text>
                    <View></View>
                </View> 
                <ScrollView nestedScrollEnabled
                    style={styles.scrollView}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.contentContainerStyle}
                >
                    <View style={styles.Card}>

                     <View style={styles.CardHeader}>
                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={Clock} style={styles.icon} />
                            <Text style={{ color: '#3C3C3B', marginLeft: 5 }}>04.11.2021 - 10:19</Text>
                        </View>

                        <View style={{ justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.redball} />
                        </View>
                    </View>
                    <View style={styles.CardContainer}>
                        <Image source={PinDropRounded} style={styles.icon} />
                        <Text style={{ color: '#3C3C3B', marginLeft: 5 ,paddingRight:5}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </Text>
                    </View> 
                    </View>
                </ScrollView>
            </SafeAreaView> */}
        </>
    );
};

const styles = StyleSheet.create({
    Card: {
        alignItems: "flex-start",
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 8,
        flex: 1
    },
})

export default Settings;