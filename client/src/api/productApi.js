import axiosInstance from "./axiosInstance";

export const getProducts = (params) => axiosInstance.get("/products", { params });
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);
export const createProduct = (formData) =>
  axiosInstance.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });