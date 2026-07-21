import axiosInstance from "./axiosInstance";

export const generateDescription = (data) => axiosInstance.post("/ai/generate-description", data);