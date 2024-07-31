import axios from "axios";

export const findAllRequest = ({ alarmTypes, endDateTime, startDateTime, vehicleId }) => axios.post(`/alarms?endDateTime=${endDateTime}&startDateTime=${startDateTime}&vehicleId=${vehicleId}`, alarmTypes)
