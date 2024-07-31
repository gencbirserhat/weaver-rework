import axios from "axios";

export const getSettingsInfoRequest = () => axios.get(`/settings/info`)

export const ignitionTrueNotificationRequest = () => axios.put(`/settings/ignition/true`)

export const ignitionFalseNotificationRequest = () => axios.put(`/settings/ignition/false`)

export const safeZoneOutNotificationRequest = () => axios.put(`/settings/safeZone/out`)

export const overSpeedRequest = () => axios.put(`/settings/speedLimit/out`)

export const logChangesWhenIgnitionFalseNotificationRequest = () => axios.put(`/settings/ignition/false/locationChange`)

export const idleNotificationRequest = () => axios.put(`/settings/idle`)

