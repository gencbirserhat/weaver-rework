import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import colors from '../../../public/assets/colors/colors'
import { Divider } from '@ui-kitten/components'
import InfoGrey from '../../assets/InfoGrey.png'
import TimeGrey from '../../assets/TimeGrey.png'
import CategoryGrey from '../../assets/CategoryGrey.png'
import moment from 'moment'

const NotificationCard = (props) => {

    return (
        <View style={styles.layout}>
            <View style={styles.top}>
                <View style={styles.topLeft}>
                    <Image source={TimeGrey} style={styles.icon} />
                    <Text style={{ marginLeft: 4 }}>{moment(props.data?.createdDateTime).format("Do.MM.YYYY - hh.ss")}</Text>
                </View>
                <View style={styles.topRight}>
                    <Image source={CategoryGrey} style={styles.icon} />
                    <Text style={{ marginLeft: 4 }}>{props.data?.title}</Text>
                </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.bottom}>
                <Image source={InfoGrey} style={styles.icon} />
                <Text style={{ marginLeft: 4 }}>{props.data?.body}</Text>
            </View>
        </View>
    )
}

export default NotificationCard

const styles = StyleSheet.create({
    layout: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 10,
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    bottom: {
        flexDirection: "row",
        alignItems: "center"
    },
    topLeft: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%"
    },
    topRight: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%"
    },
    divider: {
        marginVertical: 8
    },
    icon: {
        width: 24,
        height: 24
    }

})