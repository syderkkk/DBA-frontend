import apiClient from "./apiClient";

export interface ClassroomData {
  title: string;
  description?: string;
  max_capacity: number;
  start_date?: string;
  expiration_date?: string;
}

export const createClassroom = (data: ClassroomData) => apiClient.post("/classroom", data);
export const getClassroomById = (id: string) => apiClient.get(`/classroom/${id}`);
export const updateClassroomById = (id: string, data: ClassroomData) => apiClient.patch(`/classroom/${id}`, data);
export const deleteClassroomById = (id: string) => apiClient.delete(`/classroom/${id}`);

export const addUserToClassroom = (id: string, data: { userId: string }) => apiClient.post(`/classroom/${id}/add-user`, data);
export const removeUserFromClassroom = (id: string, data: { userId: string }) => apiClient.post(`/classroom/${id}/remove-user`, data);
export const getUsersInClassroom = (id: string) => apiClient.get(`/classroom/${id}/users`);



// Obtener todas las aulas del profesor
export const getClassroomsByProfessor = () => apiClient.get("/classroom");

// Unirse a un aula por código 
export const joinClassroomByCode = (join_code: string) => apiClient.post("/classroom/join", { join_code });

// Obtener las aulas del estudiante
export const getMyClassrooms = () => apiClient.get("/my-classrooms");
