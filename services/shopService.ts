import apiClient from "./apiClient";

// Interfaces basadas en el backend PHP
export interface CharacterSkin {
  id: number;
  skin_code: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSkin {
  id: number;
  user_id: number;
  skin_code: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface PurchaseSkinRequest {
  skin_code: string;
}

export interface PurchaseSkinResponse {
  message: string;
  remaining_gold: number;
}

export interface ChangeSkinRequest {
  skin_code: string;
}

export interface ChangeSkinResponse {
  message: string;
}

export interface UserGoldResponse {
  gold: number;
}

export interface ShopCharacter {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// API Response wrapper (común en APIs)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Funciones del servicio con tipos correctos
export const getShopSkins = (): Promise<{ data: CharacterSkin[] }> => {
  return apiClient.get('/shop/skins');
};

export const purchaseSkin = (skinData: PurchaseSkinRequest): Promise<{ data: PurchaseSkinResponse }> => {
  return apiClient.post('/shop/purchase-skin', skinData);
};

export const getUserSkins = (): Promise<{ data: UserSkin[] }> => {
  return apiClient.get('/shop/my-skins');
};

export const changeSkin = (skinData: ChangeSkinRequest): Promise<{ data: ChangeSkinResponse }> => {
  return apiClient.post('/character/change-skin', skinData);
};

export const getUserGold = (): Promise<{ data: UserGoldResponse }> => {
  return apiClient.get('/user/gold');
};

// Función adicional si la necesitas
export const getShopCharacters = (): Promise<{ data: ShopCharacter[] }> => {
  return apiClient.get('/shop/characters');
};