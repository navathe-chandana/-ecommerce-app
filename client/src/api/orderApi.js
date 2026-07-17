import axiosInstance from "./axiosInstance";

export const createOrder = (data) => axiosInstance.post("/orders", data);
export const getMyOrders = () => axiosInstance.get("/orders/my-orders");