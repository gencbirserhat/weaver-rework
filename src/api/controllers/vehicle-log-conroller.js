import axios from "axios";
import NonLoadApiProvider from "../NonLoadApiProvider"
//export const findByDateRangeRequest = ({ endDateTime, startDateTime, vehicleIdList }) => axios.get(`/vehicleLog/dateRange?endDateTime=${endDateTime}&startDateTime=${startDateTime}&vehicleIdList=${vehicleIdList}`)

export const findByDateRangeRequestSingleVehicle = ({ endDateTime, startDateTime, vehicleId }) => axios.get(`/vehicleLog/dateRange/oneVehicle?endDateTime=${endDateTime}&startDateTime=${startDateTime}&vehicleId=${vehicleId}`)

export const historyReportRequest = ({ endDateTime, startDateTime, vehicleIdList }) => axios.get(`/vehicleLog/historyReport?endDateTime=${endDateTime}&startDateTime=${startDateTime}&vehicleIdList=${vehicleIdList}`)

export const findTimeLineByDateAndVehicleIdListRequest = ({ logDateTime, vehicleIdList }) => axios.get(`/vehicleLog/timeLine?logDateTime=${logDateTime}&vehicleIdList=${vehicleIdList}`)

//export const findTimeLineByDateAndVehicleIdRequest = ({ logDateTime, vehicleId }) => NonLoadApiProvider.get(`/vehicleLog/timeLine/oneVehicle?logDateTime=${logDateTime}&vehicleId=${vehicleId}`)
