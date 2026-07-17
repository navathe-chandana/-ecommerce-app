import axiosInstance from "./axiosInstance";

export const createRazorpayOrder = (data) => axiosInstance.post("/payment/create-order", data);
export const verifyPayment = (data) => axiosInstance.post("/payment/verify", data);