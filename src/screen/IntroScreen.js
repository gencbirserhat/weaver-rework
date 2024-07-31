import React from 'react';
import { Dimensions, Image, StyleSheet, View, } from 'react-native'
import Logo from "../assets/logo.png";
const { width, height } = Dimensions.get("window")

const IntroScreen = () => {



    return (
        <View style={styles.root}>
            <View style={styles.logoContainer}>
                <Image source={Logo} style={styles.logo} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white"
    },
    logo: {
        resizeMode: "contain",
        width: width / 2
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default IntroScreen;