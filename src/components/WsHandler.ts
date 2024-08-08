import {store} from 'state-pool';
import {BASE_URL} from '../api/ApiProvider';
import SockJS from 'sockjs-client';
import {Stomp, CompatClient} from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Vehicle {
  id: string;
}

interface Me {
  id: string;
}

type CallbackFunction = (vehicleWs: Vehicle) => void;

store.setState('vehicles', []);

class WsHandler {
  callback: CallbackFunction | null = null;
  stompClient: CompatClient | null = null;
  vehicles = [];
  setCallback(c: CallbackFunction) {
    this.callback = c;
  }
  start(vehicleList: Vehicle[]) {
    //this.stompClient?.activate()
    /*   this.stompClient?.deactivate()
        this.reInit(vehicleList) */
  }
  stop() {
    this.stompClient?.deactivate();
  }

  async reInit(me: Me): Promise<void> {
    let url = `${BASE_URL}/api/v1/ws`;
    //let socket = SockJS(url)
    this.stompClient = Stomp.over(() => {
      return SockJS(url);
    });
    this.stompClient.configure({
      reconnectDelay: 5000,
    });
    const token = await AsyncStorage.getItem('weaver:token');
    // console.log("stomp öncesi");
    this.stompClient.connect(
      {token: `Bearer ${token}`},
      () => {
        //  console.log('WsHandler Connected');
        //     console.log('Subscribe');

        if (this.stompClient) {
          this.stompClient.subscribe(
            `user/${me?.id}/vehicle`,
            async resp => {
              let vehicleWs = JSON.parse(resp.body);
              //     console.log(vehicleWs)
              if (this.callback) {
                //console.log(vehicleWs); //debug
                this.callback(vehicleWs);
              }
            },
            {
              token: `Bearer ${token}`,
            },
          );
        }
      },
      (error: any) => {
        console.log(error);
      },
    );
  }

  async init(me: Me) {
    //console.log(vehicles)
    let url = `${BASE_URL}/api/v1/ws`;
    //let socket = SockJS(url)
    this.stompClient = Stomp.over(() => {
      return SockJS(url);
    });
    this.stompClient.configure({
      reconnectDelay: 5000,
    });
    const token = await AsyncStorage.getItem('weaver:token');
    // console.log("stomp öncesi");
    this.stompClient.connect(
      {token: `Bearer ${token}`},
      (frame: any) => {
        //  console.log('WsHandler Connected');
        //     console.log('Subscribe');
        if (this.stompClient) {
          this.stompClient.subscribe(
            `user/${me?.id}/vehicle`,
            async resp => {
              let vehicleWs = JSON.parse(resp.body);
              //     console.log(vehicleWs)
              if (this.callback) {
                //console.log(vehicleWs); //debug
                this.callback(vehicleWs);
              }
            },
            {
              token: `Bearer ${token}`,
            },
          );
        }
      },
      (error: any) => {
        //console.log(error)
      },
    );
  }
}

export default WsHandler;
