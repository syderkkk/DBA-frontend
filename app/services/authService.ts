import apiClient from "../lib/apiClient";

interface LoginData {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const response = await apiClient.post("/login", data);
  return response.data; // Retorna el token o cualquier dato necesario
}