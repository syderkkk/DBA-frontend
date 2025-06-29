import apiClient from "./apiClient";

export interface QuestionData {
  question: string;
  option_1: string;
  option_2: string;
  option_3?: string;
  option_4?: string;
  correct_option: string;
}

export const createQuestion = (classroomId: string, data: QuestionData) => apiClient.post(`/classroom/${classroomId}/question`, data);



export const getQuestionsByClassroom = (classroomId: string) => apiClient.get(`/classroom/${classroomId}/questions`);

export interface AnswerData {
  selected_option: string;
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


export const rewardStudent = (classroomId: string, userId: string, reward: { gold?: number; experience?: number; hp?: number; mp?: number }) =>
  apiClient.post(`/classroom/${classroomId}/reward-student`, { userId, ...reward });

export const penalizeStudent = (classroomId: string, userId: string, penalty: { hp?: number; mp?: number }) =>
  apiClient.post(`/classroom/${classroomId}/penalize-student`, { userId, ...penalty });