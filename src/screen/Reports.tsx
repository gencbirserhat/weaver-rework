import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ImageURISource,
} from 'react-native';
const NotificationsRounded: ImageURISource = require('../assets/NotificationsRounded.png');
const Clock: ImageURISource = require('../assets/Clock.png');
const SpeedRounded: ImageURISource = require('../assets/SpeedRounded.png');
const KontakOpen: ImageURISource = require('../assets/KontakOpen.png');
const PinDropRounded: ImageURISource = require('../assets/PinDropRounded.png');
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {getTrackableVehiclesRequest} from '../api/controllers/vehicle-controller';
import {historyReportRequest} from '../api/controllers/vehicle-log-conroller';
const KontakClose: ImageURISource = require('../assets/KontakClose.png');
import Loading from '../components/Loading';
const ArrowBackIosNewRounded: ImageURISource = require('../assets/ArrowBackIosNewRounded.png');
import {useTranslation} from 'react-i18next';
import colors from '../../public/assets/colors/colors';
import {findAllRequest} from '../api/controllers/alarm-controller';
const CategoryGrey: ImageURISource = require('../assets/CategoryGrey.png');
const {width, height} = Dimensions.get('window');

interface Vehicle {
  id: string;
  licensePlate: string;
}

interface ReportData {
  mqttLogDateTime: string;
  speedKmh: number;
  ignition: boolean;
  address: {
    neighborhood: string | null;
    street: string | null;
    district: string;
    province: string;
  };
}

interface AlarmData {
  startDt: string;
  endDt: string;
  alarmType: 'IdleAlarm' | 'MaxSpeedAlarm' | 'SafeZoneAlarm';
}

interface ReportsProps {
  navigation: any; // Assuming navigation is provided by React Navigation, could be typed more specifically
}

const Reports: React.FC<ReportsProps> = ({navigation}) => {
  const {t} = useTranslation();

  const [baslamaDate, setBaslamaDate] = useState<Date>(
    new Date(new Date().setHours(0, 0, 0)),
  );
  const [bitisdate, setBitisDate] = useState<Date>(new Date());
  const [isDatePickerVisibleStart, setDatePickerVisibilityStart] =
    useState<boolean>(false);
  const [isDatePickerVisibleFinish, setDatePickerVisibilityFinish] =
    useState<boolean>(false);

  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [vehiccles, setVehiccles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<'hareket' | 'alarm'>(
    'hareket',
  );
  const [alarmTypes, setAlarmTypes] = useState<string[]>([]);
  const [selectedAlarmType, setSelectedAlarmType] = useState<
    'MaxSpeedAlarm' | 'SafeZoneAlarm' | 'IdleAlarm'
  >('MaxSpeedAlarm');

  const fetchVehicle = async () => {
    try {
      let res = await getTrackableVehiclesRequest();
      if (res?.data) {
        setVehiccles(res?.data);
        setVehicleId(res?.data[0]?.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getVehicleLog = async () => {
    setLoading(true);
    try {
      let baslamatarihi = moment(baslamaDate).utc().format();
      let bitistarihi = moment(bitisdate).utc().format();
      //  console.log(baslamatarihi)
      //console.log(baslamatarihi)
      //console.log(vehicleId)
      let res = await historyReportRequest({
        endDateTime: bitistarihi,
        startDateTime: baslamatarihi,
        vehicleIdList: vehicleId,
      });
      if (res?.data) {
        setLoading(false);
        // console.log(res?.data)
        setReportData(res?.data);
        if (res?.data.length === 0) {
          Alert.alert(`${t('hata')}`, `${t('hareket_bulunmadi')}`);
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      if (error?.response?.status === 400) {
        if (Array.isArray(error.response.data.data)) {
          Alert.alert(`${t('hata')}`, error?.response?.data?.data[0].message);
        } else {
          Alert.alert(`${t('hata')}`, error?.response?.data.message);
        }
      } else {
        Alert.alert(`${t('hata')}`, `${t('sistem_hatasi')}`);
      }
    }
  };
  const getAlarm = async (): Promise<void> => {
    alarmTypes.push(selectedAlarmType);

    setLoading(true);
    try {
      let baslamatarihi = moment(baslamaDate).utc().format();
      let bitistarihi = moment(bitisdate).utc().format();
      //  console.log(baslamatarihi)
      //console.log(baslamatarihi)
      //console.log(vehicleId)
      let res = await findAllRequest({
        alarmTypes: alarmTypes,
        endDateTime: bitistarihi,
        startDateTime: baslamatarihi,
        vehicleId: vehicleId,
      });
      console.log('res?.data', res?.data);
      if (res?.data) {
        alarmTypes.pop();

        setLoading(false);
        // console.log(res?.data)
        setAlarmData(res?.data);
        if (res?.data.length === 0) {
          Alert.alert(`${t('hata')}`, `${t('alarm_bulunmadi')}`);
        }
      }
    } catch (error: any) {
      alarmTypes.pop();
      setLoading(false);
      console.log(error);
      if (error?.response?.status === 400) {
        if (Array.isArray(error.response.data.data)) {
          Alert.alert(`${t('hata')}`, error?.response?.data?.data[0].message);
        } else {
          Alert.alert(`${t('hata')}`, error?.response?.data.message);
        }
      } else {
        Alert.alert(`${t('hata')}`, `${t('sistem_hatasi')}`);
      }
    }
  };

  useEffect(() => {
    fetchVehicle();
    // homeRequest()
    return () => {};
  }, []);

  const showDatePickerStart = () => {
    setDatePickerVisibilityStart(true);
  };
  const showDatePickerFinish = () => {
    setDatePickerVisibilityFinish(true);
  };

  const hideDatePickerStart = () => {
    setDatePickerVisibilityStart(false);
  };
  const hideDatePickerFinish = () => {
    setDatePickerVisibilityFinish(false);
  };

  const handleConfirmStart = (date: Date): void => {
    hideDatePickerStart();
  };
  const handleConfirmFinish = (date: Date) => {
    hideDatePickerFinish();
  };
  function float2int(value: number): number {
    return value | 0;
  }

  const Card: React.FC<{val: ReportData}> = ({val}) => {
    //  console.log(val)
    return (
      <View style={styles.Card}>
        <View style={styles.CardHeader}>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image source={Clock} style={styles.icon} />
            <Text style={{color: '#3C3C3B', marginLeft: 5}}>
              {moment(val?.mqttLogDateTime).format('LL LTS')}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image source={SpeedRounded} style={styles.icon} />
            <Text style={{color: '#3C3C3B', marginLeft: 5}}>
              {float2int(val?.speedKmh)} Km/H
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={val?.ignition === true ? KontakOpen : KontakClose}
              style={styles.icon}
            />
          </View>
        </View>
        <View style={styles.CardContainer}>
          <Image source={PinDropRounded} style={styles.icon} />
          <Text style={{color: '#3C3C3B', marginLeft: 5, paddingRight: 5}}>
            {val?.address?.neighborhood !== null
              ? val?.address?.neighborhood
              : `${t('bilinmeyen_mahalle')}`}{' '}
            -
            {val?.address?.street !== null
              ? val?.address?.street
              : `${t('bilinmeyen_cadde')}`}{' '}
            -{val?.address?.district} / {val?.address?.province}
          </Text>
        </View>
      </View>
    );
  };
  const [alarmData, setAlarmData] = useState<AlarmData[]>([]);
  const AlarmCard: React.FC<{val: AlarmData}> = ({val}) => {
    console.log('val', val);
    return (
      <View style={styles.Card}>
        <View style={styles.CardHeader}>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image source={Clock} style={styles.icon} />
            <Text style={{color: '#3C3C3B', marginLeft: 5}}>
              {moment(val?.startDt).format('LL LTS')}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/*  <Image source={SpeedRounded} style={styles.icon} /> */}
            <Text style={{color: '#3C3C3B', marginLeft: 5}}>
              {/*  {float2int(val?.speedKmh)} Km/H */}

              {moment(moment(val?.endDt).diff(moment(val?.startDt)))
                .utc()
                .format('HH:mm:ss')}
            </Text>
          </View>
        </View>
        <View style={styles.CardContainer}>
          <Image source={CategoryGrey} style={styles.icon} />
          <Text style={{color: '#3C3C3B', marginLeft: 5, paddingRight: 5}}>
            {val?.alarmType === 'IdleAlarm'
              ? 'Rölantide Fazla Bekleme'
              : val?.alarmType === 'MaxSpeedAlarm'
              ? 'Maksimum Hız Alarmı'
              : val?.alarmType === 'SafeZoneAlarm'
              ? 'Güvenli Alan Alarmı'
              : '-'}
          </Text>
        </View>
      </View>
    );
  };
  //console.log(Array.isArray(reportData))   setAlarmTypes([])
  //    alarmTypes.push(itemValue)

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        {reportData.length === 0 ? (
          <></>
        ) : (
          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => setReportData([])}>
            <Image source={ArrowBackIosNewRounded} style={styles.icon} />
          </TouchableOpacity>
        )}
        {reportData.length !== 0 ? <></> : <View></View>}

        {selectedType === 'alarm' && reportData.length !== 0 ? (
          <></>
        ) : (
          <TouchableOpacity
            style={selectedType === 'hareket' ? styles.selected : styles.unselected}
            onPress={() => {
              setSelectedType('hareket');
            }}>
            <Text style={styles.topText}>{t('hareket_raporu')}</Text>
          </TouchableOpacity>
        )}
        {selectedType === 'hareket' && reportData.length !== 0 ? (
          <></>
        ) : (
          <TouchableOpacity
            style={selectedType === 'alarm' ? styles.selected : styles.unselected}
            onPress={() => {
              setSelectedType('alarm');
            }}>
            <Text style={styles.topText}>{t('alarm_raporu')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Notifications')}>
          <Image source={NotificationsRounded} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {selectedType === 'hareket' ? (
        reportData.length === 0 ? (
          <View style={styles.container}>
            {vehiccles.length === 0 ? (
              <Text
                style={{
                  padding: 10,
                  textAlign: 'center',
                  fontSize: 20,
                  color: '#D05515',
                }}>
                {t('arac_bulunamdi')}{' '}
              </Text>
            ) : (
              <Picker
                selectedValue={vehicleId}
                mode="dialog"
                onValueChange={(itemValue) =>
                  setVehicleId(itemValue)
                }>
                {vehiccles &&
                  vehiccles.map((val, i) => (
                    <Picker.Item
                      key={i}
                      value={val?.id}
                      label={val?.licensePlate}
                    />
                  ))}
              </Picker>
            )}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  borderColor: '#d5d5d5',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#f8f8f8',
                  alignItems: 'center',
                  width: '48%',
                }}>
                <TouchableOpacity onPress={showDatePickerStart}>
                  <Text style={{color: `#D05515`}}>{t('baslama_tarihi')} </Text>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisibleStart}
                    mode="datetime"
                    locale="tr_TR"
                    date={baslamaDate}
                    onChange={newValue => {
                      setBaslamaDate(newValue as Date);
                    }}
                    onConfirm={newValue => {
                      setBaslamaDate(newValue);
                      handleConfirmStart(newValue);
                    }}
                    onCancel={hideDatePickerStart}
                    display={Platform.OS === `ios` ? 'inline' : 'default'}
                  />
                  <Text style={{padding: 0, fontSize: 11}}>
                    {baslamaDate && moment(baslamaDate).format('lll')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderColor: '#d5d5d5',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#f8f8f8',
                  alignItems: 'center',
                  width: '48%',
                }}>
                <TouchableOpacity onPress={showDatePickerFinish}>
                  <Text style={{color: `#D05515`}}>{t('bitis_tarihi')}</Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisibleFinish}
                    mode="datetime"
                    locale="tr_TR"
                    date={bitisdate}
                    onChange={newValue => {
                      setBitisDate(newValue as Date);
                    }}
                    onConfirm={newValue => {
                      setBitisDate(newValue);
                      handleConfirmFinish(newValue);
                    }}
                    onCancel={hideDatePickerFinish}
               
                    display={Platform.OS === `ios` ? 'inline' : 'default'}
                  />
                  <Text style={{padding: 0, fontSize: 11}}>
                    {bitisdate && moment(bitisdate).format('lll')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.raporla} onPress={getVehicleLog}>
                <Text style={{color: `#D05515`, fontSize: 14}}>
                  {t('raporla')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={reportData}
            renderItem={item => {
              return <Card val={item.item} />;
            }}
            style={{paddingHorizontal: 10}}
          />
        )
      ) : (
        <></>
      )}
      {selectedType === 'alarm' ? (
        alarmData.length === 0 ? (
          <View style={styles.container}>
            {vehiccles.length === 0 ? (
              <Text
                style={{
                  padding: 10,
                  textAlign: 'center',
                  fontSize: 20,
                  color: '#D05515',
                }}>
                {t('arac_bulunamdi')}{' '}
              </Text>
            ) : (
              <>
                <Picker
                  selectedValue={vehicleId}
                  mode="dialog"
                  onValueChange={(itemValue) =>
                    setVehicleId(itemValue)
                  }>
                  {vehiccles &&
                    vehiccles.map((val, i) => (
                      <Picker.Item
                        key={i}
                        value={val?.id}
                        label={val?.licensePlate}
                      />
                    ))}
                </Picker>
                <Picker
                  selectedValue={selectedAlarmType}
                  mode="dialog"
                  onValueChange={(itemValue) => {
                    setSelectedAlarmType(itemValue);
                  }}>
                  <Picker.Item
                    value="MaxSpeedAlarm"
                    label="Maksimum Hız Alarmı"
                  />
                  <Picker.Item
                    value="SafeZoneAlarm"
                    label="Güvenli Alan Alarmı"
                  />
                  <Picker.Item
                    value="IdleAlarm"
                    label="Rölantide Fazla Bekleme Alarmı"
                  />
                </Picker>
              </>
            )}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  borderColor: '#d5d5d5',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#f8f8f8',
                  alignItems: 'center',
                  width: '48%',
                }}>
                <TouchableOpacity onPress={showDatePickerStart}>
                  <Text style={{color: `#D05515`}}>{t('baslama_tarihi')} </Text>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisibleStart}
                    mode="datetime"
                    locale="tr_TR"
                    date={baslamaDate}
                    onChange={newValue => {
                      setBaslamaDate(newValue as Date);
                    }}
                    onConfirm={newValue => {
                      setBaslamaDate(newValue);
                      handleConfirmStart(newValue);
                    }}
                    onCancel={hideDatePickerStart}
                    display={Platform.OS === `ios` ? 'inline' : 'default'}
                  />
                  <Text style={{padding: 0, fontSize: 11}}>
                    {baslamaDate && moment(baslamaDate).format('lll')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderColor: '#d5d5d5',
                  borderWidth: 1,
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#f8f8f8',
                  alignItems: 'center',
                  width: '48%',
                }}>
                <TouchableOpacity onPress={showDatePickerFinish}>
                  <Text style={{color: `#D05515`}}>{t('bitis_tarihi')}</Text>
                  <DateTimePickerModal
                    isVisible={isDatePickerVisibleFinish}
                    mode="datetime"
                    locale="tr_TR"
                    date={bitisdate}
                    onChange={newValue => {
                      setBitisDate(newValue as Date);
                    }}
                    onConfirm={newValue => {
                      setBitisDate(newValue);
                      handleConfirmFinish(newValue);
                    }}
                    onCancel={hideDatePickerFinish}
                    
                    display={Platform.OS === `ios` ? 'inline' : 'default'}
                  />
                  <Text style={{padding: 0, fontSize: 11}}>
                    {bitisdate && moment(bitisdate).format('lll')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.raporla} onPress={getAlarm}>
                <Text style={{color: `#D05515`, fontSize: 14}}>
                  {t('raporla')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            data={alarmData}
            renderItem={item => {
              return <AlarmCard val={item.item} />;
            }}
            style={{paddingHorizontal: 10}}
          />
        )
      ) : (
        <></>
      )}
      {loading && <Loading />}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  top: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    shadowColor: '0px 0px 4px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
  },
  logo: {
    resizeMode: 'contain',
    width: width / 2,
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#D05515',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonBack: {
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
  container: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    display: 'flex',
    height: 'auto',
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 10,
    padding: 10,
  },
  scrollView: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
  },
  contentContainerStyle: {
    minHeight: '90%',
  },
  raporla: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderColor: '#D05515',
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  Card: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 5,
  },
  CardHeader: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 5,
    borderBottomColor: 'rgba(79, 79, 79, 0.15)',
    borderBottomWidth: 1,
  },
  CardContainer: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: colors.orangeLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.orange,
    marginHorizontal: 4,
  },
  unselected: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  topText: {
    color: colors.orange,
  },
});

export default Reports;
