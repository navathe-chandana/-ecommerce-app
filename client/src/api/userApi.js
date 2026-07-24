import axiosInstance from "./axiosInstance";

export const getAllUsers = () => axiosInstance.get("/users");
export const toggleBlockUser = (id) => axiosInstance.put(`/users/${id}/toggle-block`);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);