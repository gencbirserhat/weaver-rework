import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Toggle } from '@ui-kitten/components'

const SettingItem = (props) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
        },
        container2: {
            flexDirection: "row",
            alignItems: "center",
        },
        layout: {},
        switch: {
            marginRight: 8
        },
        text: {
            maxWidth: "80%"
        }
    })
    return (
        <>
            <View style={props.lastItem ? styles.container2 : styles.container}>
                <Toggle style={styles.switch} onChange={props.onPress} checked={props.value} />
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </>
    )
}

export default SettingItem
