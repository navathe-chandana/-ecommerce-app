import axiosInstance from "./axiosInstance";

// INTEGRATION POINT: No backend endpoint exists yet for image-based product search.
// This function is wired for future use — calling it now will fail (404) until
// a real POST /api/products/search-by-image route + model is implemented on the backend.
export const searchByImage = (formData) =>
  axiosInstance.post("/products/search-by-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });