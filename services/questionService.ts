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