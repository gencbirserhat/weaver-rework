import React, { useEffect, useState } from "react";
import { Image, ImageURISource, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from "../screen/Dashboard";
import Menu from "../screen/Menu";
import Reports from "../screen/Reports";
import GMapComponentLive from "./GmapComponentLive";
import GMapComponentHistory from "./GmapCompanentHistory";

const homeIcon: ImageURISource = require("../assets/HomeRounded.png")
const menuvector: ImageURISource = require("../assets/menuvector.png")
const gecmis: ImageURISource = require("../assets/gecmis.png")
const reports: ImageURISource = require("../assets/reports.png")
const canlitr: ImageURISource = require("../assets/canliTr.png")
const canlien: ImageURISource = require("../assets/canliEn.png")


import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

const Nav: React.FC = () => {
    const { t } = useTranslation();
    const [lang, setLang] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem("weaver:selectedLang");
            if (token) {
                setLang(token);
            }
        })();
    }, []);

    return (
        <Tab.Navigator
            initialRouteName="Canlı"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    elevation: 0,
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center'
                }
            }}
        >
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
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
        </Tab.Navigator>
    );
}

export default Nav;

const styles = StyleSheet.create({
    // Stil tanımları buraya eklenebilir
});
