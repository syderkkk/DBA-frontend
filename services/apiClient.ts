import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/login", "/register"];
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