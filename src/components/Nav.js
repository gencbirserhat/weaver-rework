import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, } from "react-native";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from "../screen/Dashboard"
import Menu from "../screen/Menu"
import Reports from "../screen/Reports"
import VehicleHistory from "../screen/VehicleHistory"
import VehicleLive from "../screen/VehicleLive"
import homeIcon from "../assets/HomeRounded.png"
import menuvector from "../assets/menuvector.png"
import gecmis from "../assets/gecmis.png"
import reports from "../assets/reports.png"
import canlitr from "../assets/canliTr.png"
import canlien from "../assets/canliEn.png"
import GMapComponentLive from "./GmapComponentLive";
import GMapComponentHistory from "./GmapCompanentHistory"

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const Nav = () => {
    const { t } = useTranslation()
    const [lang, setLang] = useState(null)
    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("weaver:selectedLang")
            if (token) {
                setLang(token)
            }

        })()

    }, [])
    return (
        <Tab.Navigator

            initialRouteName="Canlı"
            headerShown='none'
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    headerShown: false,
                    style: 'absolute',
                    backgroundColor: '#ffffff',
                    elevation: 0,
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }}>
            <Tab.Screen name="Anasayfa" component={Dashboard} options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={homeIcon}
                            resizeMode='contain'
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? '#D05515' : '#3C3C3B'
                            }} />
                        <Text style={{ color: focused ? '#D05515' : '#3C3C3B' }}>{t("anasayfa")}</Text>
                    </View>
                ),
            }} />
            <Tab.Screen name="Geçmiş" component={GMapComponentHistory}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            <Image source={gecmis}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,

                                    tintColor: focused ? '#D05515' : '#3C3C3B'
                                }} />
                            <Text style={{ color: focused ? '#D05515' : '#3C3C3B' }}>{t("gecmis")}</Text>
                        </View>
                    ),
                }} />
            <Tab.Screen name="Canlı" component={GMapComponentLive}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={lang === 'en' ? canlien : canlitr}
                                resizeMode='contain'
                                style={{
                                    width: 80,
                                    height: 80,
                                    marginBottom: 10

                                }} />
                        </View>
                    ),
                }}
            />
            <Tab.Screen name="Raporlar" component={Reports}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={reports}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#D05515' : '#3C3C3B'
                                }} />
                            <Text style={{ color: focused ? '#D05515' : '#3C3C3B' }}>{t("raporlar")}</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen name="Menu" component={Menu}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={menuvector}
                                resizeMode='contain'
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? '#D05515' : '#3C3C3B'
                                }} />
                            <Text style={{ color: focused ? '#D05515' : '#3C3C3B' }}>{t("menu")}</Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator >
    )


}

export default Nav;

const styles = StyleSheet.create({

})