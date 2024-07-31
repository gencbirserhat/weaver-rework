import axios from "axios";

export const saveEmployeeRequest = ({ email, firstName, lastName, password, phone }) => axios.post(`/employee`, {
    email, firstName, lastName, password, phone
})
export const updateEployeeRequest = ({ id, email, firstName, lastName, password, phone }) => axios.put(`/employee/${id}`, {
    email, firstName, lastName, password, phone
})

export const getEmployeeRequest = () => axios.get(`/employee`)

export const deleteByIdRequest = ({ id }) => axios.delete(`/employee/${id}`)