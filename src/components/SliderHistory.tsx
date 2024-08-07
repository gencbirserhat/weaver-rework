import React from 'react';
import {Component} from 'react';
import {
  Image,
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import {WithTranslation, withTranslation} from 'react-i18next';

const KontakClose: ImageURISource = require('../assets/KontakClose.png');
const KontakOpen: ImageURISource = require('../assets/KontakOpen.png');
const Back: ImageURISource = require('../assets/Back.png');
const Play: ImageURISource = require('../assets/Play.png');
const Pause: ImageURISource = require('../assets/Pause.png');
const Next: ImageURISource = require('../assets/Next.png');

interface VehicleLog {
  currentTotalDistance: number;
  ignition: boolean;
  speedKmh: number;
  mqttLogDateTime: string;
  address: {
    neighborhood: string | null;
    street: string | null;
    district: string;
    province: string;
  };
}

interface Vehicle {
  id: string;
  licensePlate: string;
  currentLog: VehicleLog;
  lastLog?: VehicleLog;
}

interface SliderHistoryProps extends WithTranslation {
  onCurIndexChangeCallback: (value: number) => void;
  t: (key: string) => string;
}

interface SliderHistoryState {
  visible: boolean;
  vehicle: Vehicle | null;
  play: boolean;
  startIndex: number;
  endIndex: number;
  currentIndex: number;
  logs: VehicleLog[];
  startLog: number;
  endLog: number;
}

class SliderHistory extends Component<SliderHistoryProps, SliderHistoryState> {
  timerID: NodeJS.Timeout | null = null;

  constructor(props: SliderHistoryProps) {
    super(props);
    const initDt = new Date().getTime() / 1000;
    this.state = {
      visible: false,
      vehicle: null,
      play: false,
      startIndex: 0,
      endIndex: 0,
      currentIndex: 0,
      logs: [],
      startLog: 0,
      endLog: 0,
    };
  }
  onSearch(data: {vehicle: Vehicle; vehicleLogs: VehicleLog[]}) {
    this.setState({
      visible: true,
      vehicle: data.vehicle,
      startIndex: 0,
      endIndex: data.vehicleLogs.length - 1,
      currentIndex: 0,
      logs: data.vehicleLogs,
      startLog: data.vehicleLogs[0].currentTotalDistance / 1000,
      endLog:
        data.vehicleLogs[data.vehicleLogs.length - 1].currentTotalDistance /
        1000,
    });
  }
  onPlayPauseButton(value: boolean): void {
    this.setState({play: value});

    if (value) {
      this.timerID = setInterval(() => this.tick(), 1000);
    } else {
      if (this.timerID) {
        clearInterval(this.timerID);
        this.timerID = null;
      }
    }
  }

  setVisible(value: boolean): void {
    this.setState({
      visible: value,
    });
  }

  setVehicle(vehicle: Vehicle): void {
    this.setState({
      vehicle: vehicle,
      visible: true,
    });
  }
  updateData(vehicle: Vehicle): void {
    if (this.state.vehicle && this.state.vehicle.id === vehicle.id) {
      this.setState({vehicle: vehicle});
      //  console.log(vehicle?.lastLog?.mqttLogDateTime)
    }
  }
  float2int(value: number): number {
    return value | 0;
  }
  sliderChange(value: number): void {
    //  console.log(value);
    if (value < this.state.startIndex) {
      value = 0;
    }
    if (value > this.state.endIndex) {
      value = this.state.endIndex;
    }
    this.setState({currentIndex: value});
    this.onCurIndex(value);
  }
  setIndex(value: number): void {
    this.sliderChange(value);
  }
  tick(): void {
    //console.log("tick");
    //console.log(this.state.currentIndex);
    let newCurrentIndex = this.state.currentIndex + 1;
    if (newCurrentIndex >= this.state.endIndex) {
      newCurrentIndex = this.state.endIndex;

      if (this.timerID) {
        clearInterval(this.timerID);
        this.timerID = null;
      }
      this.setState({play: false});
    }

    this.setState({currentIndex: newCurrentIndex});
    this.onCurIndex(newCurrentIndex);
  }
  setCurIndex(value: number): void {
    this.setState({currentIndex: value});
    if (this.state.vehicle) {
      this.state.vehicle.currentLog = this.state.logs[value];
    }
  }

  onCurIndex(value: number): void {
    if (this.state.vehicle) {
      this.state.vehicle.currentLog = this.state.logs[value];
    }
    this.props.onCurIndexChangeCallback(value);
  }

  // const [modalVisible, setModalVisible] = useState(false);
  render() {
    //console.log(this.state.vehicle?.currentLog);
    if (!this.state.visible) {
      return null;
    }
    const {t} = this.props;

    let total = 0;
    let current = 0;

    if (this.state.vehicle && this.state.vehicle.currentLog) {
      total = this.state.endLog - this.state.startLog;
      const different =
        this.state.endLog -
        this.state.vehicle.currentLog.currentTotalDistance / 1000;
      current = total - different;
    }

    return (
      <View style={styles.centeredView}>
        <View style={styles.root}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Image
                source={
                  this.state.vehicle?.currentLog?.ignition === true
                    ? KontakOpen
                    : KontakClose
                }
                style={{width: 18, height: 18}}
              />
              <Text style={{fontSize: 15, color: '#D05515'}}>
                {' '}
                {this.state.vehicle?.licensePlate}
              </Text>
            </View>
          </View>
          <View style={styles.InfoHeader}>
            <Text style={{fontSize: 12}}>{t('arac_bilgileri')} </Text>
          </View>
          <View style={styles.VehicleInfo}>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 10 }}>Kontak: </Text>
                        <Text style={{ fontSize: 10, color: '#D05515' }}> {this.state.vehicle?.lastLog?.ignition === true ? "Açık" : "Kapalı"}</Text>
                    </View> */}
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12}}>{t('hiz')}: </Text>
              {this.state.vehicle?.currentLog?.speedKmh !== undefined && (
                <Text style={{fontSize: 12, color: '#D05515'}}>
                  {this.float2int(this.state.vehicle?.currentLog?.speedKmh)}{' '}
                  KM/H
                </Text>
              )}
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12}}>{t('yapilan_yol')}: </Text>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {this.float2int(current)} KM
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12}}>{t('total')}: </Text>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {this.float2int(total)} KM
              </Text>
            </View>
          </View>
          <View style={styles.InfoHeader}>
            <Text style={{fontSize: 12}}>{t('konum_bilgileri')}</Text>
            <Text style={{fontSize: 12}}>
              {moment(this.state.vehicle?.currentLog?.mqttLogDateTime).format(
                'LL LTS',
              )}
            </Text>
          </View>
          <View style={styles.VehicleInfo}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {' '}
                {this.state.vehicle?.currentLog?.address?.neighborhood !== null
                  ? this.state.vehicle?.currentLog?.address?.neighborhood
                  : 'Bilinmeyen Mahalle'}{' '}
                -{' '}
                {this.state.vehicle?.currentLog?.address?.street !== null
                  ? this.state.vehicle?.currentLog?.address?.street
                  : 'Bilinmeyen Sk/Cd'}{' '}
                - {this.state.vehicle?.currentLog?.address?.district} /{' '}
                {this.state.vehicle?.currentLog?.address?.province}
              </Text>
            </View>
          </View>
        </View>
        <Slider
          style={{width: '100%', height: 35}}
          minimumValue={this.state.startIndex}
          maximumValue={this.state.endIndex}
          minimumTrackTintColor="#3C3C3B"
          maximumTrackTintColor="#3C3C3B"
          step={1}
          value={this.state.currentIndex}
          onValueChange={event => this.sliderChange(event)}
        />
        <View
          style={{
            width: '85%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}>
          <Text>{this.state.startIndex}</Text>
          <Text>{this.state.currentIndex}</Text>
          <Text>{this.state.endIndex}</Text>
        </View>
        <View style={styles.Media}>
          <TouchableOpacity
            style={styles.MediaButton}
            onPress={() => this.sliderChange(this.state.currentIndex - 1)}>
            <Image source={Back} style={styles.MediaArrow} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.onPlayPauseButton(!this.state.play)}
            style={styles.MediaButton}>
            {!this.state.play ? (
              <Image source={Play} style={styles.MediaArrow} />
            ) : (
              <Image source={Pause} style={styles.MediaArrow} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.sliderChange(this.state.currentIndex + 1)}
            style={styles.MediaButton}>
            <Image source={Next} style={styles.MediaArrow} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default withTranslation('', {withRef: true})(SliderHistory);

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: 'auto',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 7,
  },
  centeredView: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 230, 230, 0.7)',
    bottom: 20,
    width: '100%',
    height: 'auto',
    zIndex: 5,
    padding: 10,
    borderRadius: 7,
    shadowColor: '#E0E0E0',
    shadowOffset: {
      width: 14,
      height: 14,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  header: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  InfoHeader: {
    width: '100%',
    height: 'auto',
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(79, 79, 79, 0.1)',
    borderRadius: 4,
    flexDirection: 'row',
  },
  VehicleInfo: {
    width: '100%',
    height: 'auto',
    padding: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  Media: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  MediaButton: {
    padding: 5,
    borderColor: '#5F5F5F40',
    borderWidth: 1,
    borderRadius: 100,
    marginHorizontal: 5,
    backgroundColor: 'rgba(230, 230, 230, 1)',
  },
  MediaArrow: {
    width: 30,
    height: 30,
  },
});
