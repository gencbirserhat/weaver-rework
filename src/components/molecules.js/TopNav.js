import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import CustomIconButton from '../atoms/CustomIconButton';
import colors from '../../../public/assets/colors';
import Notification from '../../assets/image/Notification.svg';
import Person from '../../assets/image/Person.svg';
import Logo from '../../assets/image/Logo.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParams } from '../../../App';
import CustomModal from '../atoms/CustomModal';
import CustomMenu from './CustomMenu';

const TopNav = props => {
  const navigation = useNavigation();
  const [menü, setMenü] = useState(false);
  return (
    <>
      <View style={styles.layout}>
        <Logo height={40} width={97} />
        <View style={styles.right}>
          <CustomIconButton
            icon={<Notification style={styles.icon} />}
            onPress={() => {
              navigation.navigate('Notification');
            }}
          />
          <CustomIconButton
            icon={<Person />}
            onPress={() => {
              setMenü(true);
            }}
            backgroundColor={colors.bg}
          />
        </View>
      </View>
      <CustomModal
        value={menü}
        onRequestClose={() => setMenü(false)}
        position={{ justifyContent: 'flex-start', paddingTop: 64 }}>
        <CustomMenu
          onClose={() => setMenü(false)}
          phone="+90 555 555 55 55"
          title="Mehmet Yılmaz"
        />
      </CustomModal>
    </>
  );
};

export default TopNav;

const styles = StyleSheet.create({
  layout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
});
