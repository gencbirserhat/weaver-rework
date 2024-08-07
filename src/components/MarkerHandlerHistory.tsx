import {BASE_URL} from '../api/ApiProvider';
import React, {Component, RefObject} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {StyleSheet, Text, View, Dimensions, ImageURISource} from 'react-native';
import {SvgUri} from 'react-native-svg';

const Ball: ImageURISource = require('../assets/ball2.png');

const {width, height} = Dimensions.get('window');

interface LatLng {
  lat: number;
  lng: number;
}

interface Log {
  latLng: LatLng;
  course?: number;
  status?: string;
}

interface Vehicle {
  id: string;
  licensePlate: string;
  currentLog?: Log;
}

interface Data {
  vehicle: Vehicle;
  vehicleLogs: Log[];
}

interface MarkerHandlerHistoryState {
  vehicle: Vehicle | null;
  startLog: Log | null;
  finishLog: Log | null;
  logs: Log[];
  filteredLogs: Log[];
}

interface MarkerHandlerHistoryProps {
  data: Data;
  mapView: RefObject<MapView>;
  onCurIndexChangeCallback: (index: number) => void;
  onSearch: (data: Data) => void;
}
class MarkerHandlerHistory extends Component<
  MarkerHandlerHistoryProps,
  MarkerHandlerHistoryState
> {
  mapView: RefObject<any>;

  constructor(props: MarkerHandlerHistoryProps) {
    super(props);

    this.mapView = React.createRef();

    this.state = {
      vehicle: null,
      startLog: null,
      finishLog: null,
      logs: [],
      filteredLogs: [],
    };
  }
  async onCurIndexChangeCallback(index: number) {
    const vehicleLog = this.state.logs[index];
    if (this.state.vehicle) {
      this.state.vehicle.currentLog = vehicleLog;
    }
    this.setState({vehicle: this.state.vehicle});
    const point = await this.mapView.current?.pointForCoordinate({
      latitude: vehicleLog.latLng.lat,
      longitude: vehicleLog.latLng.lng,
    });
    point.y += 75;
    const coords = await this.mapView.current?.coordinateForPoint(point);
    const camera = {
      center: coords,
      pitch: 0,
      heading: 0,
      altitude: 150,
    };
    this.mapView.current?.animateCamera(camera, {
      duration: 250,
    });
  }
  float2int(value: number): number {
    return value | 0;
  }
  onSearch(data: Data) {
    this.setState({
      vehicle: data.vehicle,
      startLog: data.vehicleLogs.length > 0 ? data.vehicleLogs[0] : null,
      finishLog:
        data.vehicleLogs.length > 0
          ? data.vehicleLogs[data.vehicleLogs.length - 1]
          : null,
      logs: data.vehicleLogs,
      filteredLogs: data.vehicleLogs.filter(
        (_, i) =>
          i %
            this.float2int(
              data.vehicleLogs.length > 1000
                ? data.vehicleLogs.length / 1000
                : 1,
            ) ===
          0,
      ),
    });

    if (data.vehicleLogs.length > 0 && this.mapView.current) {
      this.mapView.current.animateCamera(
        {
          center: {
            latitude: data.vehicleLogs[0].latLng.lat,
            longitude: data.vehicleLogs[0].latLng.lng,
          },
          zoom: 16,
        },
        {
          duration: 1500,
        },
      );
    }
  }
  setMapView(mapView: any) {
    this.mapView = mapView;
  }

  carSvgUri(vehicle: Vehicle): string {
    return `${BASE_URL}/api/v1/svg/vehicle?rotation=${vehicle?.currentLog?.course}&color=000000&status=${vehicle?.currentLog?.status}`;
  }

  render() {
    const dataSize = this.state.logs.length;
    const delta = this.float2int(dataSize > 1000 ? dataSize / 1000 : 1);
    return (
      <>
        {this.state.vehicle?.currentLog && (
          <Marker
            key={this.state.vehicle.id}
            coordinate={{
              latitude: this.state.vehicle.currentLog?.latLng?.lat,
              longitude: this.state.vehicle?.currentLog?.latLng?.lng,
            }}
            identifier={JSON.stringify({
              type: 'vehicle',
              data: this.state.vehicle.id,
            })}
            anchor={{x: 0.5, y: 0.76}}
            zIndex={5}>
            <View style={styles.labelMarkerContainer}>
              <View style={styles.label}>
                <Text style={styles.labelText}>
                  {this.state.vehicle?.licensePlate}
                </Text>
              </View>
              <SvgUri
                width="36"
                height="36"
                uri={this.carSvgUri(this.state.vehicle)}
              />
            </View>
          </Marker>
        )}
        {this.state.logs.map((log, i) => {
          if (i % delta === 0) {
            return (
              <Marker
                zIndex={4}
                key={i}
                coordinate={{
                  latitude: log.latLng?.lat,
                  longitude: log.latLng?.lng,
                }}
                identifier={JSON.stringify({type: 'log', data: i})}
                anchor={{x: 0.5, y: 0.5}}
                icon={Ball}
              />
            );
          } else {
            return null;
          }
        })}
        {this.state.logs && (
          <Polyline
            coordinates={this.state.logs.map(log => ({
              latitude: log.latLng.lat,
              longitude: log.latLng.lng,
            }))}
            strokeColor="rgba(239, 83,83, 0.5)" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
        )}

        {this.state.startLog && false && (
          <Marker
            coordinate={{
              latitude: this.state.startLog?.latLng?.lat ?? 0,
              longitude: this.state.startLog?.latLng?.lng ?? 0,
            }}
            style={{overflow: 'hidden'}}>
            <View style={styles.labelMarkerContainer}>
              <SvgUri
                width="36"
                height="36"
                uri={require('../assets/start.svg')}
              />
            </View>
          </Marker>
        )}
        {this.state.finishLog && false && (
          <Marker
            coordinate={{
              latitude: this.state.finishLog?.latLng?.lat ?? 0,
              longitude: this.state.finishLog?.latLng?.lng ?? 0,
            }}
            style={{overflow: 'hidden'}}>
            <View style={styles.labelMarkerContainer}>
              <SvgUri width="36" height="36" uri={require('../assets/finish.svg')} />
            </View>
          </Marker>
        )}
      </>
    );
  }
}

export default MarkerHandlerHistory;

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
    justifyContent: 'center',
  },
});
