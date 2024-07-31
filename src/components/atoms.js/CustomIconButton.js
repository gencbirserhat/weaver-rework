import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '../../../public/assets/colors/colors';


const CustomIconButton = props => {
  const styles = StyleSheet.create({
    layout: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      borderColor: props.borderColor || colors.whiteOpacity,
      backgroundColor: props.backgroundColor || colors.whiteOpacity,
      borderWidth: props.borderColor ? 1 : 0,
      width: 35,
      height: 35,
    },
  });

  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.layout]}>
      {props.icon}
    </TouchableOpacity>
  );
};

export default CustomIconButton;
