import React from 'react';
import { store, useGlobalState } from 'state-pool';
import { BASE_URL } from "../api/ApiProvider"
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as encoding from 'text-encoding';

store.setState("vehicles", []);

class WsHandler {

    callback = null;
    stompClient = null;
    vehicles = []
    setCallback(c) {
        this.callback = c;
    }
    start(vehicleList) {
        //this.stompClient?.activate()
      /*   this.stompClient?.deactivate()
        this.reInit(vehicleList) */
    }
    stop() {
        this.stompClient?.deactivate()
    }

    async reInit(me) {
        let url = `${BASE_URL}/api/v1/ws`;
        //let socket = SockJS(url)
        this.stompClient = Stomp.over(() => { return SockJS(url) });
        this.stompClient.configure({
            reconnectDelay: 5000
        });
        const token = await AsyncStorage.getItem("weaver:token")
        // console.log("stomp öncesi");
        this.stompClient.connect({ token: `Bearer ${token}` }, (frame) => {
            //  console.log('WsHandler Connected');
            //     console.log('Subscribe');

            this.stompClient.subscribe(`user/${me?.id}/vehicle`, async (resp) => {
                let vehicleWs = JSON.parse(resp.body)
                //     console.log(vehicleWs)
                if (this.callback) {
                    //console.log(vehicleWs); //debug
                    this.callback(vehicleWs);
                }

            }, {
                token: `Bearer ${token}`
            })
        },
            (error) => {
                console.log(error)
            }
        )
    }




    async init(me) {
        //console.log(vehicles)
        let url = `${BASE_URL}/api/v1/ws`;
        //let socket = SockJS(url)
        this.stompClient = Stomp.over(() => { return SockJS(url) });
        this.stompClient.configure({
            reconnectDelay: 5000
        });
        const token = await AsyncStorage.getItem("weaver:token")
        // console.log("stomp öncesi");
        this.stompClient.connect({ token: `Bearer ${token}` }, (frame) => {
            //  console.log('WsHandler Connected');
            //     console.log('Subscribe');
            this.stompClient.subscribe(`user/${me?.id}/vehicle`, async (resp) => {
                let vehicleWs = JSON.parse(resp.body)
                //     console.log(vehicleWs)
                if (this.callback) {
                    //console.log(vehicleWs); //debug
                    this.callback(vehicleWs);
                }

            }, {
                token: `Bearer ${token}`
            })


        },
            (error) => {
                //console.log(error)
            }
        )


    }


}

export default WsHandler