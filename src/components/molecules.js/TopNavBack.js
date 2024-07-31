import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/core';
import ArrowBackIosNewRounded from '../../assets/ArrowBackIosNewRounded.png'
import CustomIconButton from '../atoms.js/CustomIconButton';
import colors from '../../../public/assets/colors/colors';



const TopNavBack = props => {
  const navigation = useNavigation();
  return (
    <View style={styles.layout}>
      <CustomIconButton
        icon={<Image source={ArrowBackIosNewRounded} style={styles.icon} />}
        onPress={() => navigation.goBack()}
      />

      <Text category="h6" style={styles.title}>
        {props.title}
      </Text>
    </View>
  );
};

export default TopNavBack;

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
    width: 20,
    height: 20
  },
  title: {
    fontWeight: 'normal',
  },
});
