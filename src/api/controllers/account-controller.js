import axios from "axios";

export const meRequest = () => axios.get(`/account`)

export const forgotPasswordSendSmsRequest = ({ phone }) => axios.post(`/account/forgotPassword/sendSms`, { phone })

export const loginRequest = async ({ password, phoneNumber, rememberMe }) => axios.post(`/account/login`, {
    password, phoneNumber, rememberMe
})

export const resetPasswordRequest = ({ newPassword, verificationCode }) => axios.post(`/account/resetPassword`, { newPassword, verificationCode })

export const logoutRequest = () => axios.post(`/account/logout`)

export const changePasswordRequest = ({ newPassword, oldPassword, repeatNewPassword }) => axios.put(`/account/changePassword`, { newPassword, oldPassword, repeatNewPassword })

export const getCurrentUserRequest = () => axios.get(`/account`)

export const registerIndividualRequest = async ({ email, firstName, lastName, phone, password, province }) => axios.post("/account/register/individual", {
    email, firstName, lastName, phone, password, province
})

export const registerCorporateRequest = async ({ email, password, phone, province, title }) => axios.post("/account/register/corporate", {
    email, password, phone, province, title
})

export const updateDeviceTokenRequest = (deviceToken) => axios.put(`/account/deviceToken?deviceToken=${deviceToken}`)
//export const ignitionNotificationRequest = ({value}) => axios.put(`/members/setting/ignitionNotification?value=${value}`)

//export const updateDeviceTokenRequest = ({value}) => axios.put(`/account/deviceToken?value=${value}`)

//export const getMemberSettingsRequest = () => axios.get(`/members/setting`)