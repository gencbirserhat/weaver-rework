import axios from 'axios';
export const BASE_URL = "https://weavergps.com"
import AsyncStorage from '@react-native-async-storage/async-storage'
const NonLoadApiProvider = axios.create({
    baseURL : `${BASE_URL}/api/v1`
});

NonLoadApiProvider.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("weaver:token")
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}, async () => {
});



 export default NonLoadApiProvider;
/*// First we need to import axios.js
import axios from 'axios';
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: 'https://api.example.com'
});
// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';
// Also add/ configure interceptors && all the other cool stuff
instance.interceptors.request...
export default instance; */