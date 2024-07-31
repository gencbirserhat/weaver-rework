import axios from "axios";

export const getMyVehiclesRequest = () => axios.get(`/vehicles/myVehicles`)

export const getTrackableVehiclesRequest = () => axios.get(`/vehicle`)

export const getCurrentFuelPricesRequest = () => axios.get(`/dashboard/currentFuelPrices`)

export const getMyVehiclesInformationRequest = () => axios.get(`/dashboard/member/vehicleInformation`)

export const getMemberMyVehiclesInformation = () => axios.get(`/dashboard/myVehicles`)

export const getDashBoardStatisticsRequest = () => axios.get(`/dashboard/member/statistics`)

export const deleteByIdRequest = ({ id }) => axios.delete(`/vehicle/${id}`)

export const saveVehicleRequest = ({
    fuelType,
    idleAlarmSecond,
    imei,
    licensePlate,
    maintenanceDistance,
    maxSpeed,
    safeZoneId,
    totalDistance,
    vehicleName
}) => axios.post(`/vehicle`, {
    fuelType,
    idleAlarmSecond,
    imei,
    licensePlate,
    maintenanceDistance,
    maxSpeed,
    safeZoneId,
    totalDistance,
    vehicleName
})

export const updateVehicleRequest = ({
    id,
    fuelType,
    idleAlarmSecond,
    imei,
    licensePlate,
    maintenanceDistance,
    maxSpeed,
    vehicleName
}) => axios.put(`/vehicle/${id}`, {
    fuelType,
    idleAlarmSecond,
    imei,
    licensePlate,
    maintenanceDistance,
    maxSpeed,
    vehicleName
})