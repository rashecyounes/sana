import api from "../../../../../api/axios";
import type { Course } from "../../courses/types/course.types";
import type {
  Lesson,
  LessonFormData,
  LessonResource,
  LessonResourceFormData,
} from "../types/lesson.types";

export type LessonFormDataOptions = {
  courses: Course[];
};

export async function getLessons(courseId?: string): Promise<Lesson[]> {
  const response = await api.get<Lesson[]>("/admin-dashboard/lessons/", {
    params: courseId ? { course: courseId } : {},
  });

  return response.data;
}

export async function getLesson(id: number | string): Promise<Lesson> {
  const response = await api.get<Lesson>(`/lessons/${id}/`);
  return response.data;
}

export async function getLessonFormData(): Promise<LessonFormDataOptions> {
  const response = await api.get<LessonFormDataOptions>(
    "/admin-dashboard/lesson-form-data/"
  );

  return response.data;
}

export async function createLesson(data: LessonFormData): Promise<Lesson> {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("order", String(data.order));
  formData.append("is_preview", String(data.is_preview));
  formData.append("is_published", String(data.is_published));

  if (data.duration) {
    formData.append("duration", data.duration);
  }

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  const response = await api.post<Lesson>(
    `/courses/${data.course}/lessons/create/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function updateLesson(
  id: number | string,
  data: LessonFormData
): Promise<Lesson> {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("order", String(data.order));
  formData.append("is_preview", String(data.is_preview));
  formData.append("is_published", String(data.is_published));

  if (data.duration) {
    formData.append("duration", data.duration);
  }

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  const response = await api.patch<Lesson>(`/lessons/${id}/update/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteLesson(id: number | string): Promise<void> {
  await api.delete(`/lessons/${id}/delete/`);
}
export async function getLessonResources(
  lessonId: number | string
): Promise<LessonResource[]> {
  const response = await api.get<LessonResource[]>(
    `/lessons/${lessonId}/resources/`
  );

  return response.data;
}

export async function createLessonResource(
  lessonId: number | string,
  data: LessonResourceFormData
): Promise<LessonResource> {
  const formData = new FormData();

  formData.append("title", data.title);

  if (data.description) {
    formData.append("description", data.description);
  }

  formData.append("file", data.file);

  const response = await api.post<LessonResource>(
    `/lessons/${lessonId}/resources/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteLessonResource(
  resourceId: number | string
): Promise<void> {
  await api.delete(`/resources/${resourceId}/delete/`);
}