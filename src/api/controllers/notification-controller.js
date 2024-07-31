import axios from "axios";

export const getMyNotificationsRequest = (pageable) => axios.get(`/notification/my?page=${pageable.page}&size=${pageable.size}`);