import api from "./axios";

export type CourseAIKnowledge = {
  id: number;
  course: number;
  content: string;
  instructions: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CourseAIKnowledgePayload = {
  content: string;
  instructions?: string;
  is_active?: boolean;
};

export async function getCourseAIKnowledge(courseId: number) {
  const response = await api.get<CourseAIKnowledge>(
    `/courses/${courseId}/ai-knowledge/`
  );

  return response.data;
}

export async function saveCourseAIKnowledge(
  courseId: number,
  payload: CourseAIKnowledgePayload
) {
  const response = await api.patch<CourseAIKnowledge>(
    `/courses/${courseId}/ai-knowledge/`,
    payload
  );

  return response.data;
}
export async function uploadCourseAIKnowledgeFile(
  courseId: number,
  file: File
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/courses/${courseId}/ai-knowledge/upload-file/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}