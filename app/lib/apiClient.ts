import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Base URL del backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;