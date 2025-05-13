import apiClient from "../lib/apiClient";

export async function fetchUserData(token: string) {
  const response = await apiClient.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}