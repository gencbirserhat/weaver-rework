import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colors from '../../../public/assets/colors/colors'

const CustomButton = (props) => {
    const styles = StyleSheet.create({

        button: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: props.backgroundColor || colors.orange,
            padding: 10,
            borderRadius: 4,
        },
        text: {
            color: props.color || '#fff',
        },
    })
    return (
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton

