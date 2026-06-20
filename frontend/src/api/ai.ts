import api from "./axios";

export type AIResponse = {
  result: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export async function askCourseAI(courseId: number, question: string) {
  const response = await api.post<AIResponse>(
    `/courses/${courseId}/ai/ask/`,
    { question }
  );

  return response.data;
}

export async function generateCourseQuiz(courseId: number, prompt: string) {
  const response = await api.post<AIResponse>(
    `/courses/${courseId}/ai/quiz/`,
    { prompt }
  );

  return response.data;
}

export async function generateCourseExercises(courseId: number, prompt: string) {
  const response = await api.post<AIResponse>(
    `/courses/${courseId}/ai/exercises/`,
    { prompt }
  );

  return response.data;
}

export async function generateCourseExamples(courseId: number, prompt: string) {
  const response = await api.post<AIResponse>(
    `/courses/${courseId}/ai/examples/`,
    { prompt }
  );

  return response.data;
}