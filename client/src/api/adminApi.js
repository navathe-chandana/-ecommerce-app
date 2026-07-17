import axiosInstance from "./axiosInstance";

export const getAllOrders = () => axiosInstance.get("/orders");
export const updateOrderStatus = (orderId, orderStatus) =>
  axiosInstance.put(`/orders/${orderId}/status`, { orderStatus });