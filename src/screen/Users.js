import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, Image, Linking, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import ArrowBackIosNewRounded from '../assets/ArrowBackIosNewRounded.png'
import phone from '../assets/Phone.png'
import mail from '../assets/Email.png'
import users from '../assets/AccountCircleRounded.png'
import trash from '../assets/Trash.png'
import moment from 'moment';
import 'moment/locale/tr'
import KontakWaiting from '../assets/KontakWaiting.png'
import plus from "../assets/Plus.png"
import { getMyVehiclesRequest, getTrackableVehiclesRequest } from '../api/controllers/vehicle-controller';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { deleteByIdRequest, getEmployeeRequest } from '../api/controllers/employee-controller';
const { width, height } = Dimensions.get("window")
import Swipeable from 'react-native-gesture-handler/Swipeable';
import edit from "../assets/Edit.png"
import { useFocusEffect } from '@react-navigation/native';
import OnayModal from '../components/molecules.js/OnayModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Users = () => {
    const { t } = useTranslation()
    const [usersData, setUsersData] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()

    const fetchUsers = async () => {
        try {
            let res = await getEmployeeRequest()
            if (res?.data) {
                setUsersData(res?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        (async () => {
            await fetchUsers()
        })()
        return () => {

        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            const fetchUsers = async () => {
                try {
                    let res = await getEmployeeRequest()
                    if (res?.data) {
                        setUsersData(res?.data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchUsers()

        }, [])
    );


    const [selectedId, setSelectedId] = useState(null)

    const handleCalling = (number) => {
        let phoneNumber
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`
        } else {
            phoneNumber = `telprompt://${number}`
        }
        Linking.openURL(phoneNumber);
    }

    const leftSwipe = (val) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('UserEdit', {
                data: val,
            })
            } style={styles.editbox}>
                <Image source={edit} style={styles.icon} />

            </TouchableOpacity>
        )
    }

    const rightSwipe = (id) => {

        return (
            <TouchableOpacity onPress={() => {
                setModalDelete(true)
                setSelectedId(id)
            }} style={styles.deletebox}>
                <Image source={trash} style={styles.icon} />

            </TouchableOpacity>
        )
    }

    const deleteUser = async () => {
        try {
            let res = await deleteByIdRequest({ id: selectedId })
            if (res?.status === 200) {
                fetchUsers()
                setModalDelete(false)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const Users = ({ val }) => {

        return (

            <View style={styles.Card}  >

                <Swipeable
                    friction={0.5}
                    renderRightActions={() => rightSwipe(val?.id)}
                    renderLeftActions={() => leftSwipe(val)} >
                    <View style={styles.cardInfo}>
                        <Image source={users} style={styles.icon} />
                        <Text style={{ marginLeft: 4 }}>{val?.firstName} {val?.lastName}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                        <Image source={phone} style={styles.icon} />
                        <TouchableOpacity onPress={() => handleCalling(val?.phone)} style={{ marginLeft: 4 }}>
                            <Text>
                                {val?.phone}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardInfo2}>
                        <Image source={mail} style={styles.icon} />
                        <Text style={{ marginLeft: 4 }}>{val?.email}</Text>
                    </View>
                </Swipeable>

            </View >

        )
    }

    const [modalDelete, setModalDelete] = useState(false)

    return (
        <>
            <SafeAreaView style={styles.root}>

                <View style={styles.top}>
                    <View style={styles.topLeft}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                            <Image source={ArrowBackIosNewRounded} style={styles.icon} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20 }}>{t("kullanici")} </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("UserAdd")} style={styles.buttonNew} >
                        <Image source={plus} style={styles.icon} />
                        <Text style={{ color: '#fff', marginLeft: 4 }}>{t("yeni_ekle")}</Text>
                    </TouchableOpacity>

                </View>
                <ScrollView nestedScrollEnabled
                    style={styles.scrollView}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.contentContainerStyle}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={async () => {
                                setRefreshing(true)
                                await fetchUsers()
                                setRefreshing(false)

                            }}
                        />
                    }
                >
                    {
                        usersData.map((val, i) => <Users key={i} val={val} />)
                    }

                </ScrollView>
            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalDelete}
                onRequestClose={() => {
                    // Alert.alert("Hata", "Modal has been closed.");
                    setModalDelete(!modalDelete);
                }}
            >
                <OnayModal
                    title={t("Kullanıcıyı silmek istediğinize emin misiniz?")}
                    decline={() => {
                        setSelectedId(null)
                        setModalDelete(false)
                    }}
                    approve={() => deleteUser()}
                />
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    topLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
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
        justifyContent: 'space-between',
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
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        height: 'auto',
        backgroundColor: '#fff',
        marginTop: 15,
        borderRadius: 10
    },
    scrollView: {
        flex: 1,
        padding: 10
    },
    contentContainerStyle: {
        minHeight: "90%",
    },
    raporla: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        borderColor: '#D05515',
        borderWidth: 1,
        borderRadius: 4

    },
    Card: {
        width: '100%',
        height: 'auto',
        flexDirection: 'column',
        marginTop: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderRightColor: '#E74C3C',
        borderRightWidth: 2,
        overflow: 'hidden',
        borderLeftColor: '#4F4F4F',
        borderLeftWidth: 2,
    },
    CardHeader: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5,

    },
    CardContainer: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 4
    },
    redball: {
        width: 10,
        height: 10,
        borderRadius: 500,
        backgroundColor: '#D05515'
    },
    buttonNew: {
        width: 'auto',
        height: 'auto',
        padding: 7,
        backgroundColor: '#D05515',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        marginLeft: 4
    },
    cardInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomColor: 'rgba(79,79,79, 0.15)',
        borderBottomWidth: 1,
        padding: 8
    },
    cardInfo2: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10
    },
    deletebox: {
        width: '20%',
        backgroundColor: '#E74C3C',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    editbox: {
        width: '20%',
        backgroundColor: '#4F4F4F',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 1
    },

})

export default Users;