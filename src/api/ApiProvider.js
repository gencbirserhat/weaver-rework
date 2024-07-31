import axios from "axios"
import { useMemo, useEffect } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core';
import { Alert } from "react-native";


export const BASE_URL = "https://weavergps.com"
//export const BASE_URL = "http://10.10.10.252:8088"
//export const BASE_URL = "http://10.10.10.90:8088"


axios.defaults.baseURL = `${BASE_URL}/api/v1`
// axios.defaults.withCredentials = true

const ApiProvider = (props) => {

    //rconst t = (text) => { return text }
    //const t = props.t;


    const navigation = useNavigation()
    //console.log(props)
    useMemo(() => {
        axios.interceptors.request.use(async (config) => {
            props.loadingCallback(true)
            const token = await AsyncStorage.getItem("weaver:token")
            const language = await AsyncStorage.getItem("weaver:selectedLang")

            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`
            }
            return config
        }, async () => {
        });
        axios.interceptors.response.use(async (response) => {
            props.loadingCallback(false)

            // if (response.status === 401) {
            //     window.location.href = "/login"
            //     return response
            // }


            if (response?.data?.token) {
                AsyncStorage.setItem("weaver:token", response?.data?.token)
            }


            return response;
        }, (error) => {
            props.loadingCallback(false)

            const statusCode = error.response ? error.response.status : null;
            console.log(error.request)
            if (statusCode === 404) {
                //console.log('The requested resource does not exist or has been deleted')
            } else if (statusCode === 401) {
                if (navigation.getCurrentRoute().name === "Login") {
                    return
                }
                //  console.log(navigation)
                //console.log(navigation.getCurrentRoute().name)
                // console.log('Please login to access this resource')

                Alert.alert(`Error`, `Your session has been closed. Please login again.`)
                //Alert.alert(`${t("hata")}`, `${t("oturum_kapali")}`)
                setTimeout(() => {

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });

                }, 1000);
            }
            else if (statusCode === 400) {
                /*  if (Array.isArray(error.response.data.data)) {
                     Alert.alert("Hata", error?.response?.data?.data[0].message)
                 } else {
                     Alert.alert("Hata", error?.response?.data.message)
                 } */
            }
            else if (statusCode === 503) {
                Alert.alert(`Error`, `The system is working. Try again soon.`)
                //Alert.alert(`${t("hata")}`, `${t("sistem_calisma")}`)
            }
            else if (statusCode === 500) {
                Alert.alert(`Error`, `Unknown error has occurred. Please talk to your system administrator.`)
            }
            /*  else {
                 console.log(statusCode);
                 Alert.alert(`Error`, `No Connection`)
                 //Alert.alert(`${t("hata")}`, `${t("sunucuya_baglanamiyor")}`)
             } */
            return Promise.reject(error)

        }
        );
    }, [])
    return null
}



export default ApiProvider