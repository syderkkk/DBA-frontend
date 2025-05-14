import apiClient from "../lib/apiClient";

export async function fetchUserData(token: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await apiClient.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}