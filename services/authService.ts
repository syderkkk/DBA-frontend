import apiClient from "./apiClient";

interface RegisterData {
  username: string;
  password: string;
  email?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = (data: RegisterData) => apiClient.post("/register", data);
export const login = (data: LoginData) => apiClient.post("/login", data);
export const getUser = () => apiClient.get("/user");
export const logout = () => apiClient.post("/logout");