import React from "react";

import { ActivityIndicator, Image, SafeAreaView, StyleSheet, View, Text } from "react-native";
import LoadingJson from "../assets/Loading.json"
import SVGatorComponent from "./weaver"

const Loading = (props) => {
    if (props.loading) {
        return (
          
            <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 5, backgroundColor: 'rgba(255,255,255, .9)', }}>
                <SVGatorComponent width={350} height={350} />
            </View>
    
        )
    }
    else{
        return null
    }
  
}

export default Loading

const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        alignSelf: 'center',
        bottom: 200
    }
})