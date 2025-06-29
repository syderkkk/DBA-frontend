import apiClient from "./apiClient";

export interface QuestionData {
  title: string;
  content: string;
  // add other fields as needed
}

export const createQuestion = (classroomId: string, data: QuestionData) => apiClient.post(`/classroom/${classroomId}/question`, data);
export const getQuestionsByClassroom = (classroomId: string) => apiClient.get(`/classroom/${classroomId}/questions`);

export interface AnswerData {
  content: string;
}

export const answerQuestion = (questionId: string, data: AnswerData) => apiClient.post(`/question/${questionId}/answer`, data);

export const closeQuestion = async (questionId: string) => {
  try {
    const response = await apiClient.patch(`/question/${questionId}/close`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkIfAnswered = async (questionId: string) => {
  try {
    const response = await apiClient.get(`/question/${questionId}/check-answered`);
    return response.data;
  } catch (error) {
    throw error;
  }
};