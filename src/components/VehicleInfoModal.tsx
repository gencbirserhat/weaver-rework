import React, {createRef, RefObject} from 'react';
import {Component} from 'react';
import {
  Dimensions,
  Image,
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {WithTranslation, withTranslation} from 'react-i18next';

const CloseIcon: ImageURISource = require('../assets/CloseIcon.png');
const KontakClose: ImageURISource = require('../assets/KontakClose.png');
const KontakOpen: ImageURISource = require('../assets/KontakOpen.png');
const {width, height} = Dimensions.get('window');

interface VehicleInfoModalProps extends WithTranslation {
  onDetailButtonPress: (vehicle: any) => void;
  onSwipe: (vehicle: any) => void;
}

interface VehicleInfoModalState {
  visible: boolean;
  vehicle: any | null;
  vehicles: any[];
}

class VehicleInfoModal extends Component<
  VehicleInfoModalProps,
  VehicleInfoModalState
> {
  _swiper: RefObject<any>;
  constructor(props: VehicleInfoModalProps) {
    super(props);
    this._swiper = createRef();
    this.state = {
      visible: false,
      vehicle: null,
      vehicles: [],
    };
  }

  setVisible(value: boolean) {
    this.setState({
      visible: value,
    });
  }

  setVehicle(vehicle: any) {
    const vehicleIndex = this.state.vehicles
      .map(function (v) {
        return v.id;
      })
      .indexOf(vehicle.id);
    //this._swiper.current.snapToItem(vehicleIndex)
    this.setState({
      vehicle: vehicle,
      visible: true,
    });
  }
  setVehicles(vehicles: any[]) {
    this.setState({
      vehicles: vehicles,
    });
  }

  updateData(vehicle: any) {
    const vehicleIndex = this.state.vehicles
      .map(function (v) {
        return v.id;
      })
      .indexOf(vehicle.id);
    this.state.vehicles[vehicleIndex] = vehicle;
    this.setState({
      vehicles: this.state.vehicles,
    });
    if (this.state.vehicle.id === vehicle.id) {
      this.setState({vehicle: vehicle});
      //  console.log(vehicle?.lastLog?.mqttLogDateTime)
    }
  }

  renderVehicle(props: any) {
    function float2int(value: number): number {
      return value | 0;
    }
    console.log('props', props);
    return (
      <View style={this.state.visible ? styles.centeredView : styles.hidden}>
        <View style={styles.centeredView2}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Image
                source={
                  props.vehicle?.lastLog?.ignition === true
                    ? KontakOpen
                    : KontakClose
                }
                style={{width: 18, height: 18, alignSelf: 'center'}}
              />
              <Text
                style={{fontSize: 15, alignSelf: 'center', color: '#D05515'}}>
                {' '}
                {props.vehicle?.licensePlate}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => props.onDetailButtonPress(props.vehicle)}>
                <Text style={{color: `#D05515`}}>
                  {props.translation('detay')}{' '}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setVisible(false);
              }}
              style={{
                width: 'auto',
                alignItems: 'center',
                height: 'auto',
                padding: 5,
                borderRadius: 4,
              }}>
              <Image source={CloseIcon} style={styles.icon}></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.InfoHeader}>
            <Text style={{fontSize: 12}}>
              {props.translation('arac_bilgileri')}
            </Text>
          </View>
          <View style={styles.VehicleInfo}>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 10 }}>Kontak: </Text>
                        <Text style={{ fontSize: 10, color: '#D05515' }}> {this.state.vehicle?.lastLog?.ignition === true ? "Açık" : "Kapalı"}</Text>
                    </View> */}
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12}}>{props.translation('hiz')}: </Text>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {' '}
                {float2int(props.vehicle?.lastLog?.speedKmh)} KM/H
              </Text>
            </View>
            {/*  <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={{ fontSize: 12 }}>{props.translation("gunluk")} : </Text>
                        <Text style={{ fontSize: 12, color: '#D05515' }}> {float2int(props.vehicle?.dailyDistanceKm)} KM</Text>
                    </View> */}
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12}}>
                {props.translation('kontak_sonrası')}:{' '}
              </Text>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {' '}
                {float2int(props.vehicle?.distanceSinceIgnitionKm)} KM
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12}}>
                {props.translation('total')} :{' '}
              </Text>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {' '}
                {float2int(props.vehicle?.totalDistanceKm)} KM
              </Text>
            </View>
          </View>
          <View style={styles.InfoHeader}>
            <Text style={{fontSize: 12}}>
              {props.translation('konum_bilgileri')}
            </Text>
            <Text style={{fontSize: 12}}>
              {moment(props.vehicle?.lastLog?.mqttLogDateTime).format('LL LTS')}
            </Text>
          </View>
          <View style={styles.VehicleInfo}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={{fontSize: 12, color: '#D05515'}}>
                {' '}
                {props.vehicle?.lastLog?.address?.neighborhood !== null
                  ? props.vehicle?.lastLog?.address?.neighborhood
                  : 'Bilinmeyen Mahalle'}{' '}
                -{' '}
                {props.vehicle?.lastLog?.address?.street !== null
                  ? props.vehicle?.lastLog?.address?.street
                  : 'Bilinmeyen Sk/Cd'}{' '}
                - {props.vehicle?.lastLog?.address?.district} /{' '}
                {props.vehicle?.lastLog?.address?.province}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {t} = this.props;
    return this.renderVehicle({
      vehicle: this.state.vehicle,
      translation: t,
      onDetailButtonPress: this.props.onDetailButtonPress,
    });
    /*  <View style={this.state.visible ? styles.centeredView : styles.hidden}>
                 <Carousel
                     ref={this._swiper}
                     loop={true}
                     data={this.state.vehicles}
                     renderItem={({ item, index }) => <this.renderVehicle translation={t} setVisible={(value) => this.setVisible(value)} onDetailButtonPress={this.props.onDetailButtonPress} vehicle={item} />}
                     sliderWidth={width * 0.95}
                     itemWidth={width * 0.95}
                     //onSnapToItem={(index) => { this.props.onSwipe(this.state.vehicles[index]) }}
                     swipeThreshold={width * 0.25}
                 >
                    </Carousel> 
             </View>*/
  }
}
export default withTranslation('', { withRef: true })(VehicleInfoModal); //

const styles = StyleSheet.create({
  centeredView: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    bottom: 20,
    width: '100%',
    height: 'auto',
    zIndex: 5,
    paddingHorizontal: 5,
  },
  hidden: {
    zIndex: -1,
    display: 'none',
  },
  centeredView2: {
    display: 'flex',

    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: 'auto',
    zIndex: 5,
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
  button: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    borderColor: '#D05515',
    borderWidth: 1,
    borderRadius: 4,
    marginLeft: 5,
  },
});
