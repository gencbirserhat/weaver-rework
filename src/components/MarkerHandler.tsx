import {BASE_URL} from '../api/ApiProvider';
import React, {Component, RefObject} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, Text, View} from 'react-native';
import {SvgUri} from 'react-native-svg';

interface Vehicle {
  id: string;
  licensePlate: string;
  lastLog?: {
    latLng: {
      lat: number;
      lng: number;
    };
    course?: number;
    status?: string;
  };
}

interface MarkerHandlerState {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
}

interface MarkerHandlerProps {
  mapView: any;
  vehicle: Vehicle;
  vehicleId: string | null;
  latitude: number | null;
  longitude: number | null;
}

class MarkerHandler extends Component<MarkerHandlerProps, MarkerHandlerState> {
  onMarkerClickCallback: ((vehicleId: string) => void) | null = null;
  constructor(props: MarkerHandlerProps) {
    super(props);
    this.state = {
      vehicles: [],
      selectedVehicleId: null,
    };
  }

  setOnMarkerClickCallback(callback: (vehicleId: string) => void) {
    this.onMarkerClickCallback = callback;
  }

  setVehicles(v: Array<Vehicle>) {
    this.setState({vehicles: v});
  }

  handleWs(vehicle: Vehicle) {
    const vd = this.state.vehicles.find(x => x?.id === vehicle?.id);
    if (vd !== undefined) {
      vd.lastLog = vehicle.lastLog;
      this.setState({vehicles: [...this.state.vehicles]});
    }
  }

  selectVehicle(mapView: RefObject<MapView>, vehicleId: string) {
    //.log("selectVehicle");
    //console.log(vehicle);
    if (vehicleId !== null) {
      // console.log("AAAAAAA");
      // console.log(vehicle);
      const vd = this.state.vehicles.find(v => v.id === vehicleId);
      // console.log("BBBBBBBBB");
      //console.log("vd", vd);
      if (vd !== undefined) {
        this.setState({selectedVehicleId: vd.id});
      }
      if (vd?.lastLog?.latLng?.lat !== undefined) {
        mapView.current?.animateCamera(
          {
            center: {
              latitude: vd?.lastLog?.latLng.lat,
              longitude: vd?.lastLog?.latLng.lng,
            },
            zoom: vd?.lastLog !== null ? 15 : 5,
            altitude: 100,
          },
          {
            duration: 1000,
          },
        );
      }
    }
  }

  moveToVehicle(mapView: RefObject<MapView>, vehicle: Vehicle) {
    //.log("selectVehicle");
    //console.log(vehicle);
    if (vehicle !== null) {
      // console.log("AAAAAAA");
      // console.log(vehicle);
      const vd = this.state.vehicles.find(v => v.id === vehicle.id);

      // console.log("BBBBBBBBB");

      // console.log(vd);
      if (vd?.lastLog?.latLng?.lat !== undefined) {
        mapView.current?.animateCamera(
          {
            center: {
              latitude: vd?.lastLog?.latLng.lat,
              longitude: vd?.lastLog?.latLng.lng,
            },
          },
          {
            duration: 1500,
          },
        );
      }
    }
  }

  carSvgUri(vehicle: Vehicle) {
    return `${BASE_URL}/api/v1/svg/vehicle?rotation=${vehicle?.lastLog?.course}&color=000000&status=${vehicle?.lastLog?.status}`;
  }

  render() {
    return this.state.vehicles.map(vehicle => {
      return (
        vehicle.lastLog && (
          /* vehicle.vehicleStatus === "ACTIVE" && */
          <Marker
            key={vehicle.id}
            coordinate={{
              latitude: vehicle?.lastLog?.latLng?.lat,
              longitude: vehicle?.lastLog?.latLng?.lng,
            }}
            //title={vehicle.licensePlate}
            /* image={{ uri: `${BASE_URL}/api/v1/svg/car?rotation=${vehicle?.lastLog?.course}&color=000000&ignition=${vehicle?.lastLog?.ignition}` }} */
            identifier={`${vehicle.id}`}
            anchor={{x: 0.5, y: 0.76}}
            style={{
              zIndex: this.state.selectedVehicleId === vehicle.id ? 11 : 10,
            }}>
            <View style={styles.labelMarkerContainer}>
              <View style={styles.label}>
                <Text style={styles.labelText}>{vehicle?.licensePlate}</Text>
              </View>
              <SvgUri width="36" height="36" uri={this.carSvgUri(vehicle)} />
            </View>
          </Marker>
        )
      );
    });
  }
}

export default MarkerHandler;

const styles = StyleSheet.create({
  label: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '0px 0px 2px 0px rgba(0,0,0,0)',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  labelText: {
    color: '#1273EBFF',
    fontSize: 12,
  },
  labelMarkerContainer: {
    alignItems: 'center',
  },
});
