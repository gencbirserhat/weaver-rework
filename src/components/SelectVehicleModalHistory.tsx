import React from 'react';
import {Component} from 'react';
import {
  Alert,
  Image,
  ImageURISource,
  Modal,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Loading from './Loading';
import {findByDateRangeRequestSingleVehicle} from '../api/controllers/vehicle-log-conroller';
import {WithTranslation, withTranslation} from 'react-i18next';
import {Input} from '@ui-kitten/components';
const error: ImageURISource = require('../assets/error.png');
const KontakOpen: ImageURISource = require('../assets/KontakOpen.png');
const KontakClose: ImageURISource = require('../assets/KontakClose.png');
const KontakWaiting: ImageURISource = require('../assets/KontakWaiting.png');

interface LastLog {
  speedKmh: number;
  status: 'STARTED' | 'STOPPED' | 'MOVING';
}

interface Vehicle {
  id: number;
  licensePlate: string;
  vehicleName: string;
  totalDistanceKm: number;
  lastLog: LastLog;
  checked?: boolean;
  vehicleStatus: 'ACTIVE' | 'INACTIVE';
}

interface SelectVehicleModalHistoryState {
  visible: boolean;
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isDatePickerVisibleStart: boolean;
  baslamaDate: Date;
  isDatePickerVisibleFinish: boolean;
  bitisDate: Date;
  loading: boolean;
  searchValue: string;
}

interface SelectVehicleModalHistoryProps extends WithTranslation {
  onSearchCallback: (data: {
    startDateTime: Date;
    finishDateTime: Date;
    vehicleLogs: any[];
    vehicle: Vehicle;
  }) => void;
}

class SelectVehicleModalHistory extends Component<
  SelectVehicleModalHistoryProps,
  SelectVehicleModalHistoryState
> {
  imageMap = new Map<string, ImageURISource>();
  constructor(props: SelectVehicleModalHistoryProps) {
    super(props);
    const startDt = new Date(new Date().setHours(0, 0, 0));
    const endDt = new Date();
    const d = new Date();
    this.state = {
      visible: true,
      vehicles: [],
      isDatePickerVisibleStart: false,
      baslamaDate: startDt,
      isDatePickerVisibleFinish: false,
      bitisDate: endDt,
      selectedVehicle: null,
      loading: false,
      searchValue: '',
    };
    this.imageMap.set('STARTED', KontakWaiting);
    this.imageMap.set('FINISHED', KontakClose);
    this.imageMap.set('MOVING', KontakOpen);
  }

  setVisible(value: boolean): void {
    this.setState({
      visible: value,
    });
  }

  setVehicles(vehicles: Vehicle[]): void {
    this.setState({
      vehicles: vehicles,
    });
    //  console.log(vehicles)
  }
  float2int(value: number): number {
    return value | 0;
  }
  handleChange(vehicle: Vehicle, value: boolean) {
    const updatedVehicles = this.state.vehicles.map(v =>
      v.id === vehicle.id ? {...v, checked: value} : {...v, checked: false},
    );
    this.setState({
      vehicles: updatedVehicles,
      selectedVehicle: value ? vehicle : null,
    });
  }
  showDatePickerStart = () => {
    this.setState({
      isDatePickerVisibleStart: true,
    });
  };
  hideDatePickerStart = () => {
    this.setState({
      isDatePickerVisibleStart: false,
    });
  };
  handleConfirmStart = (date: Date) => {
    this.setState({
      baslamaDate: date,
      isDatePickerVisibleStart: false,
    });
  };

  // Bitiş
  showDatePickerFinish = () => {
    this.setState({
      isDatePickerVisibleFinish: true,
    });
  };
  hideDatePickerFinish = () => {
    this.setState({
      isDatePickerVisibleFinish: false,
    });
  };
  handleConfirmFinish = (date: Date) => {
    this.setState({
      bitisDate: date,
      isDatePickerVisibleFinish: false,
    });
  };

  async onButtonSearchClick() {
    const {t} = this.props;
    this.setState({
      loading: true,
    });

    const selectedVehicles = this.state.vehicles.filter(
      vehicle => vehicle.checked,
    );
    if (selectedVehicles.length !== 1) {
      Alert.alert(t('Hata'), t('Tek bir araç seçimi yapınız.'));
      this.setState({
        loading: false,
      });
      return;
    }

    const diff = Math.abs(
      this.state.bitisDate.getTime() - this.state.baslamaDate.getTime(),
    );
    if (diff > 172800000) {
      Alert.alert(
        t('Hata'),
        t('Başlangıç ve bitiş tarihleri aralığı 48 saati geçmemelidir.'),
      );
      this.setState({
        loading: false,
      });
      return;
    }

    const startDate = moment(this.state.baslamaDate).utc().format();
    const endDate = moment(this.state.bitisDate).utc().format();
    const vehicleLogs = (
      await findByDateRangeRequestSingleVehicle({
        endDateTime: endDate,
        startDateTime: startDate,
        vehicleId: selectedVehicles[0].id,
      })
    ).data;

    if (vehicleLogs.length === 0) {
      Alert.alert(
        t('Uyarı'),
        t('Belirttiğiniz tarihler arasında kayıt bulunamadı.'),
      );
      this.setState({
        loading: false,
      });
    } else {
      this.setVisible(false);
      this.setState({
        loading: false,
      });
      this.props.onSearchCallback({
        startDateTime: this.state.baslamaDate,
        finishDateTime: this.state.bitisDate,
        vehicleLogs: vehicleLogs,
        vehicle: selectedVehicles[0],
      });
    }
  }

  searchVehicle() {
    return this.state.vehicles.filter(
      vehicle =>
        vehicle.licensePlate
          .toLowerCase()
          .includes(this.state.searchValue.toLowerCase()) ||
        vehicle.vehicleName
          .toLowerCase()
          .includes(this.state.searchValue.toLowerCase()),
    );
  }

  // const [modalVisible, setModalVisible] = useState(false);
  render() {
    const { t } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.visible}>
        <SafeAreaView style={styles.root}>
          <View style={styles.topModal}>
            <Text style={{fontSize: 20}}>{t('arac_sec')} </Text>
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => {
                this.setVisible(false);
              }}>
              <Text style={{color: `#D05515`}}>{t('kapat')} </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.root}>
            <ScrollView
              nestedScrollEnabled
              style={styles.scrollViewModal}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.contentContainerStyleModal}>
              <View style={styles.Alert}>
                <Image source={error} style={styles.iconModal} />
                <Text style={styles.headerText}>{t('alert')}</Text>
              </View>

              <Input
                placeholder={t('Araçlar içinde arama yapabilirsiniz')}
                value={this.state.searchValue}
                onChange={(
                  e: NativeSyntheticEvent<TextInputChangeEventData>,
                ) => {
                  this.setState({searchValue: e.nativeEvent.text});
                }}
                style={{...styles.input, marginTop: 10}}
              />

              <View style={styles.datePickersContainer}>
                <View style={styles.datePicker}>
                  <TouchableOpacity onPress={this.showDatePickerStart}>
                    <Text style={{color: `#D05515`}}>
                      {t('baslama_tarihi')}{' '}
                    </Text>
                    <DateTimePickerModal
                      isVisible={this.state.isDatePickerVisibleStart}
                      mode="datetime"
                      locale="tr_TR"
                      maximumDate={new Date()}
                      date={this.state.baslamaDate}
                      onConfirm={this.handleConfirmStart}
                      onCancel={this.hideDatePickerStart}
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    />
                    <Text style={{padding: 0, fontSize: 11}}>
                      {this.state.baslamaDate &&
                        moment(this.state.baslamaDate).format('lll')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.datePicker}>
                  <TouchableOpacity onPress={this.showDatePickerFinish}>
                    <Text style={{color: `#D05515`}}>{t('bitis_tarihi')} </Text>
                    <DateTimePickerModal
                      isVisible={this.state.isDatePickerVisibleFinish}
                      mode="datetime"
                      locale="tr_TR"
                      date={this.state.bitisDate}
                      maximumDate={moment(this.state.baslamaDate)
                        .add(2, 'days')
                        .toDate()}
                      minimumDate={this.state.baslamaDate}
                      onConfirm={this.handleConfirmFinish}
                      onCancel={this.hideDatePickerFinish}
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    />
                    <Text style={{padding: 0, fontSize: 11}}>
                      {this.state.bitisDate &&
                        moment(this.state.bitisDate).format('lll')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {this.searchVehicle().map((vehicle, i) => (
                <View
                  key={i}
                  style={
                    vehicle.vehicleStatus === 'ACTIVE'
                      ? styles.vehicle
                      : styles.vehicleOff
                  }>
                  <CheckBox
                    disabled={false}
                    value={vehicle.checked || false}
                    onValueChange={value => this.handleChange(vehicle, value)}
                    tintColors={{true: '#D05515', false: 'black'}}
                    style={styles.checkbox}
                  />
                  <Text>{vehicle.licensePlate}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.BottomModal}>
            <TouchableOpacity
              style={styles.buttonModalHistory}
              onPress={() => {
                this.onButtonSearchClick();
              }}>
              <Text style={{color: `#fff`, fontSize: 18}}>
                {t('gecmisi_goster')}
              </Text>
            </TouchableOpacity>
          </View>
          <Loading loading={this.state.loading} />
        </SafeAreaView>
      </Modal>
    );
  }
}
export default withTranslation('', {withRef: true})(SelectVehicleModalHistory);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    justifyContent: 'center',
  },
  topModal: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    shadowColor: '0px 0px 4px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    zIndex: 2,
  },
  buttonModal: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderColor: '#D05515',
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    marginBottom: 10,
  },
  scrollViewModal: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  contentContainerStyleModal: {
    minHeight: '90%',
  },
  Alert: {
    width: '100%',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 'auto',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  iconModal: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  headerText: {
    color: '#721c24',
  },
  vehicle: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  vehicleOff: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#fff',
    opacity: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 10,

    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonModalHistory: {
    width: '90%',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D05515',

    borderRadius: 4,
  },
  BottomModal: {
    width: '100%',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
    shadowColor: '0px 0px 4px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    zIndex: 2,
  },
  datePickersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  datePicker: {
    borderColor: '#d5d5d5',
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    width: '48%',
  },
  checkbox: {
    width: 20,
    height: 20,
    minHeight: 20,
    minWidth: 20,
  },
});
