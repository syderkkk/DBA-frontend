import apiClient from "./apiClient";

export interface CharacterData {
  name: string;
  age: number;
  // Add other character properties as needed
}

export const createCharacter = (classroomId: string, data: CharacterData) => apiClient.post(`/classroom/${classroomId}/character`, data);
export const getMyCharacter = (classroomId: string) => apiClient.get(`/classroom/${classroomId}/my-character`);
export const getCharactersByClassroom = (classroomId: string) => apiClient.get(`/classroom/${classroomId}/characters`);
export const updateCharacterByClassroomAndId = (classroomId: string, characterId: string, data: CharacterData) =>
  apiClient.patch(`/classroom/${classroomId}/character/${characterId}`, data);
export const deleteCharacterByClassroomAndId = (classroomId: string, characterId: string) =>
  apiClient.delete(`/classroom/${classroomId}/character/${characterId}`);