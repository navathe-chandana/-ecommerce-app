import axiosInstance from "./axiosInstance";

export const sendChatMessage = (data) => axiosInstance.post("/chat", data);