import axios from "axios";

export const saveSafeZoneRequest = ({ latLngList, safeZoneName }) => axios.post(`/safeZone`, {
    latLngList,
    safeZoneName
})

export const findAllSafeZonesRequest = () => axios.get(`/safeZone`)