import { LoginData } from "@/types/types";
import apiClient from "../lib/apiClient";

export async function login(data: LoginData) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await apiClient.post("/login", data);
  return response.data; // Retorna el token o cualquier dato necesario
}