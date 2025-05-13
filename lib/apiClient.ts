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
    if (error.response?.status === 401) {
      // El token ha expirado o no es válido
      console.error("Token expirado o no válido");
      localStorage.removeItem("token"); // Elimina el token del almacenamiento local
      window.location.href = "/auth/login"; // Redirige al inicio de sesión
    }
    return Promise.reject(error);
  }
);

export default apiClient;