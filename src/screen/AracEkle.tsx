import {
  StyleSheet,
  Modal,
  Image,
  View,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ImageURISource,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';
import {saveVehicleRequest} from '../api/controllers/vehicle-controller';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';
import {findAllSafeZonesRequest} from '../api/controllers/safeZone-controller';
import {Input, Text} from '@ui-kitten/components';
import QRCodeScanner from 'react-native-qrcode-scanner';
import PageContainerFullScroll from '../components/templates.js/PageContainerFullScroll';
import TopNavBack from '../components/molecules.js/TopNavBack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ParamListBase} from '@react-navigation/native';


const qr: ImageURISource = require('../assets/Qr.png');
const ArrowBackIosNewRounded: ImageURISource = require('../assets/ArrowBackIosNewRounded.png');

interface SafeZone {
  id: string;
  safeZoneName: string;
}

interface FuelOption {
  title: string;
  value: string;
}

const Marker: React.FC = () => {
  return (
    <View style={{height: '40%', width: '60%'}}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View
          style={{
            borderTopWidth: 4,
            borderLeftWidth: 4,
            flex: 1,
            borderTopLeftRadius: 20,
          }}></View>
        <View style={{flex: 1}}></View>
        <View
          style={{
            borderTopWidth: 4,
            borderRightWidth: 4,
            flex: 1,
            borderTopRightRadius: 20,
          }}></View>
      </View>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
        <View style={{flex: 1}}></View>
      </View>
      <View style={{flexDirection: 'row', flex: 1}}>
        <View
          style={{
            borderBottomWidth: 4,
            borderLeftWidth: 4,
            flex: 1,
            borderBottomLeftRadius: 20,
          }}></View>
        <View style={{flex: 1}}></View>
        <View
          style={{
            borderBottomWidth: 4,
            borderRightWidth: 4,
            flex: 1,
            borderBottomRightRadius: 20,
          }}></View>
      </View>
    </View>
  );
};
const AracEkle = () => {
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamListBase, 'Vehicles'>>();

  const [vehicleName, setVehicleName] = useState<string>('');
  const [imei, setImei] = useState<string>('');
  const [fuel, setFuel] = useState<string>('DIESEL');
  const [maintanence, setMaintanence] = useState<number>(Number);
  const [safeZone, setSafeZone] = useState<string>('');
  const [licencePlate, setLicencePlate] = useState<string>('');
  const [maxSpeed, setMaxSpeed] = useState<number>(Number(''));
  const [totalDistance, setTotalDistance] = useState<number>(Number);
  const [alarm, setAlarm] = useState<string>('');
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
    new IndexPath(0),
  );
  const [selectedIndexSafezone, setSelectedIndexSafezone] = useState<IndexPath>(
    new IndexPath(0),
  );
  const [qrModal, setQrModal] = useState<boolean>(false);

  const data: FuelOption[] = [
    {
      title: t('benzin'),
      value: 'GASOLINE',
    },
    {
      title: t('dizel'),
      value: 'DIESEL',
    },
    {
      title: t('LPG'),
      value: 'GAS',
    },
    {
      title: t('elektrik'),
      value: 'ELECTRIC',
    },
  ];
  const fetchSafeZones = async (): Promise<void> => {
    let res = await findAllSafeZonesRequest();
    if (res?.data) {
      //    console.log(res?.data)
      setSafeZones(res?.data);
    }
  };
  useEffect(() => {
    fetchSafeZones();

    return () => {};
  }, []);

  const displayValue: string =
    selectedIndex !== null ? data[selectedIndex.row].title : '';
  const safezoneValue: string =
    safeZones[selectedIndexSafezone.row]?.safeZoneName;

  const renderOption = ({title, i}: {title: string; i: number}) => {
    return <SelectItem style={{padding: 10}} title={title} key={i} />;
  };

  const handleCreate = async (): Promise<void> => {
    if (
      vehicleName === '' ||
      licencePlate === '' ||
      imei === '' ||
      alarm === '' ||
      maxSpeed === Number('')
    ) {
      Alert.alert(`${t('hata')}`, `${t('zorunlu_alan')}`);
      return;
    }
    if (selectedIndex === null) {
      Alert.alert(`${t('hata')}`, `${t('yakit_secimi')}`);
      return;
    }
    try {
      let res = await saveVehicleRequest({
        fuelType: data[selectedIndex.row].value,
        idleAlarmSecond: alarm,
        imei: imei,
        licensePlate: licencePlate,
        maintenanceDistance: maintanence,
        maxSpeed: maxSpeed,
        safeZoneId: safeZones[selectedIndexSafezone.row]?.id,
        totalDistance: Number(totalDistance) * 1000,
        vehicleName: vehicleName,
      });

      if (res) {
        Alert.alert(`${t('basarili')}`, `${t('basarili_kayit')}`, [
          {
            text: `${t('evet')}`,
            onPress: () => {
              navigation.navigate('Vehicles');
            },
          },
        ]);
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.status === 400) {
        if (Array.isArray(error.response.data.data)) {
          Alert.alert(`${t('hata')}`, error?.response?.data?.data[0].message);
        } else {
          Alert.alert(`${t('hata')}`, error?.response?.data.message);
        }
      }
    }
  };

  return (
    <>
      <PageContainerFullScroll topNav={<TopNavBack title={t('aracekle')} />}>
        <Input
          label={t('arac_adi_z')}
          placeholder={t('arac_adi_z')}
          value={vehicleName}
          onChangeText={setVehicleName}
          style={styles.input}
        />
        <Input
        autoCapitalize='characters'
          label={t('plaka_z')}
          placeholder={t('plaka_z')}
          value={licencePlate}
          onChangeText={setLicencePlate}
          keyboardType={'default'}
          
          style={styles.input}
        />
        <View
          style={{
            width: '100%',
            height: '10%',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
          <Input
            label={t('Imei*')}
            placeholder={t('Imei*')}
            value={imei}
            onChangeText={setImei}
            style={styles.inputImei}
          />
          <TouchableOpacity
            onPress={() => setQrModal(true)}
            style={{
              borderRadius: 4,
              marginVertical: 5,
              width: '15%',
              height: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: 10,
            }}>
            <Image source={qr} style={{width: '100%', height: 30}} />
          </TouchableOpacity>
        </View>
        <Input
          label={t('max_hiz')}
          placeholder={t('max_hiz')}
          value={maxSpeed === 0 ? '' : maxSpeed.toString()}
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setMaxSpeed(Number(numericText));
          }}
          style={styles.input}
          keyboardType='numeric'
        />
        <Layout style={styles.selectView} level="1">
          <Select
            label={t('yakit_türü')}
            value={displayValue}
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index as IndexPath)}>
            {data.map((val, i) => renderOption({title: val?.title, i: i}))}
          </Select>
        </Layout>

        <Input
          label={t('total_km')}
          placeholder={t('total_km')}
          value={totalDistance === 0 ? '' : totalDistance.toString()}
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setTotalDistance(Number(numericText));
          }}
          style={styles.input}
          keyboardType='number-pad'
        />
        <Input
          label={t('bakim_km')}
          placeholder={t('bakim_km')}
          value={maintanence === 0 ? '' : maintanence.toString()}
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setMaintanence(Number(numericText));
          }}
          style={styles.input}
          keyboardType='number-pad'
        />
        <Input
          label={t('alarm')}
          placeholder={t('alarm')}
          value={alarm}
          onChangeText={setAlarm}
          style={styles.input}
        />
        <Layout style={styles.selectView} level="1">
          <Select
            label={t('bolge')}
            value={safezoneValue}
            placeholder={t('guvenli_alan')}
            selectedIndex={selectedIndexSafezone}
            disabled={safeZones.length === 0}
            onSelect={index => setSelectedIndexSafezone(index as IndexPath)}>
            {safeZones.map((val, i) =>
              renderOption({title: val?.safeZoneName, i: i}),
            )}
          </Select>
        </Layout>

        <TouchableOpacity onPress={() => handleCreate()} style={styles.button}>
          <Text style={{color: '#fff', fontSize: 16}}>Kaydet</Text>
        </TouchableOpacity>

        <Modal animationType="none" transparent={true} visible={qrModal}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.top}>
              <TouchableOpacity
                style={styles.buttonTop}
                onPress={() => setQrModal(false)}>
                <Image source={ArrowBackIosNewRounded} style={styles.icon} />
              </TouchableOpacity>

              <Text style={{fontSize: 20, marginLeft: 4}}>{t('kamera')}</Text>
            </View>
            <QRCodeScanner
              cameraStyle={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                alignSelf: 'center',
              }}
              showMarker={true}
              reactivate={true}
              reactivateTimeout={2000}
              onRead={e => {
                Alert.alert(
                  t('basarili'),
                  `${e.data} ` + t("numaralı IMEI'yi kabul ediyor musunuz?"),
                  [
                    {
                      text: t('hayır'),
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: t('evet'),
                      onPress: () => {
                        setImei(e.data);
                        setQrModal(false);
                      },
                    },
                  ],
                );
              }}
              //flashMode={isEnabled ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.touch}
              customMarker={<Marker />}
              //cameraTimeout={cameraVisible ? 500 : 10000}
            ></QRCodeScanner>
          </SafeAreaView>
        </Modal>
      </PageContainerFullScroll>
    </>
  );
};

export default AracEkle;

const styles = StyleSheet.create({
  Card: {},
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    color: 'black',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0, 0.54)',
    marginVertical: 5,
  },
  inputImei: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
    color: 'black',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0, 0.54)',
    marginVertical: 5,
  },
  inputOption: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    color: 'black',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0, 0.54)',
    marginVertical: 10,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectView: {
    width: '100%',
    marginVertical: 5,
    backgroundColor: '#F5F5F5',
  },
  button: {
    width: '100%',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
    backgroundColor: '#D05515',
    borderRadius: 4,
    alignSelf: 'center',
  },
  top: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  buttonTop: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
