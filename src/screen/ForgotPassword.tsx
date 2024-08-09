import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  ImageURISource,
} from 'react-native';
const Logo: ImageURISource = require('../assets/logo.png');
import {
  forgotPasswordSendSmsRequest,
  resetPasswordRequest,
} from '../api/controllers/account-controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import MaskInput from 'react-native-mask-input';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamListBase} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamListBase, 'Login'>>();

  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [changePasswordModal, setChangePasswordModal] =
    useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordRe, setNewPasswordRe] = useState<string>('');

  const handleSubmit = async () => {
    AsyncStorage.removeItem('token');
    let res = await forgotPasswordSendSmsRequest({phone: `+9${phone}`});
    if (res?.status === 200) {
      setChangePasswordModal(true);
    }
  };
  const handleChangePassword = async () => {
    if (newPassword !== newPasswordRe) {
      Alert.alert('Hata', 'Girdiğiniz parolalar eşleşmiyor.');
      return;
    }
    try {
      let res = await resetPasswordRequest({
        newPassword: newPassword,
        verificationCode: verificationCode,
      });
      if (res?.status === 200) {
        Alert.alert('Başarılı', 'Başarılı şifre değiştirme.');
        setTimeout(() => {
          setChangePasswordModal(false);
          navigation.navigate('Login');
        }, 2500);
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu');
    }
  };

  return (
    <View style={styles.root}>
      <Image source={Logo} style={styles.logo} />
      <MaskInput
        value={phone}
        //mask={Masks.BRL_PHONE}
        onChangeText={(masked, unmasked) => {
          setPhone(unmasked); // you can use the unmasked value as well

          // assuming you typed "9" all the way:
          // console.log(masked); // (99) 99999-9999
          //console.log(unmasked); // 99999999999
        }}
        style={styles.input}
        placeholder="Telefon Numaranız"
        showObfuscatedValue
        keyboardType="phone-pad"
        // mask={['(', '0',  ')', ' ',/\d/, /\d/, /\d/,' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/,' ', /\d/, /\d/]}
        mask={[
          '(',
          /\d/,
          ')',
          ' ',
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
          ' ',
          /\d/,
          /\d/,
        ]}
        // mask={['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
      />
      {/*   <TextInput keyboardType="phone-pad" value={phone} onChangeText={setPhone} style={styles.input} placeholder="Telefon Numarası. +90 ile başlaynız" placeholderTextColor="#000" /> */}
      <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
        <Text style={styles.text}>Parolamı Sıfırla</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
      {<Loading loading={loading} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModal}
        onRequestClose={() => {
          //  Alert.alert("Hata", "Modal has been closed.");
          setChangePasswordModal(!changePasswordModal);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              secureTextEntry
              value={verificationCode}
              onChangeText={setVerificationCode}
              style={styles.input}
              placeholder="Sms kodu"
              placeholderTextColor="#000"
            />
            <TextInput
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              placeholder="Yeni Şifreniz"
              placeholderTextColor="#000"
            />
            <TextInput
              secureTextEntry
              value={newPasswordRe}
              onChangeText={setNewPasswordRe}
              style={styles.input}
              placeholder="Yeni Şifreniz Tekrar"
              placeholderTextColor="#000"
            />
            <TouchableOpacity
              onPress={() => {
                handleChangePassword();
              }}
              style={styles.button}>
              <Text style={styles.text}>Değiştir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChangePasswordModal(false);
              }}
              style={styles.buttonClose}>
              <Text style={styles.textClose}>İptal Et</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: width / 2,
    height: 100,
  },

  input2: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    color: 'black',
  },
  button: {
    width: '90%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    backgroundColor: '#D05515',
    borderRadius: 4,
  },
  buttonClose: {
    width: '90%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  text: {
    color: '#fff',
  },
  textClose: {
    color: '#D05515',
  },
  remmeberMe: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    width: '90%',
    padding: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    marginLeft: 5,
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    color: 'black',
    borderColor: 'rgba(0, 0, 0, 0.10)',
    borderWidth: 1,
  },

  icon: {
    width: 20,
    height: 20,
  },
});
