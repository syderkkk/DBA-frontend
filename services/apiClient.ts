import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  /* baseURL: "https://mtsbno-ip-190-237-162-229.tunnelmole.net/api", */
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/register"];
    // Usar ?. para evitar el error de undefined
    if (
      token &&
      config.url &&
      !publicRoutes.some((route) => config.url?.endsWith(route))
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;