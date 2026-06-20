import api from "../../../../../api/axios";

import type {
  Lesson,
  LessonFormData,
  LessonResource,
  LessonResourceFormData,
} from "../types/teacherLesson.types";

import type { Course } from "../../courses/types/teacherCourse.types";

export type LessonFormDataOptions = {
  courses: Course[];
};

export async function getTeacherLessons(
  courseId?: string
): Promise<Lesson[]> {
  const response = await api.get<Lesson[]>(
    "/teacher-dashboard/lessons/",
    {
      params: courseId ? { course: courseId } : {},
    }
  );

  return response.data;
}

export async function getTeacherLesson(
  id: number | string
): Promise<Lesson> {
  const response = await api.get<Lesson>(
    `/teacher-dashboard/lessons/${id}/`
  );

  return response.data;
}

export async function getTeacherLessonFormData(): Promise<LessonFormDataOptions> {
  const response = await api.get<LessonFormDataOptions>(
    "/teacher-dashboard/lesson-form-data/"
  );

  return response.data;
}

export async function createTeacherLesson(
  data: LessonFormData
): Promise<Lesson> {
  const formData = new FormData();

  formData.append("course", String(data.course));

  formData.append("title", data.title);

  formData.append("description", data.description);

  formData.append("order", String(data.order));

  formData.append(
    "is_preview",
    String(data.is_preview)
  );

  formData.append(
    "is_published",
    String(data.is_published)
  );

  if (data.duration) {
    formData.append("duration", data.duration);
  }

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  const response = await api.post<Lesson>(
    "/teacher-dashboard/lessons/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function updateTeacherLesson(
  id: number | string,
  data: LessonFormData
): Promise<Lesson> {
  const formData = new FormData();

  formData.append("course", String(data.course));

  formData.append("title", data.title);

  formData.append("description", data.description);

  formData.append("order", String(data.order));

  formData.append(
    "is_preview",
    String(data.is_preview)
  );

  formData.append(
    "is_published",
    String(data.is_published)
  );

  if (data.duration) {
    formData.append("duration", data.duration);
  }

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail);
  }

  const response = await api.patch<Lesson>(
    `/teacher-dashboard/lessons/${id}/update/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteTeacherLesson(
  id: number | string
): Promise<void> {
  await api.delete(
    `/teacher-dashboard/lessons/${id}/delete/`
  );
}

export async function getTeacherLessonResources(
  lessonId: number
): Promise<LessonResource[]> {
  const response = await api.get<LessonResource[]>(
    `/teacher-dashboard/lessons/${lessonId}/resources/`
  );

  return response.data;
}

export async function createTeacherLessonResource(
  lessonId: number,
  data: LessonResourceFormData
): Promise<LessonResource> {
  const formData = new FormData();

  formData.append("title", data.title);

  if (data.description) {
    formData.append("description", data.description);
  }

  formData.append("file", data.file);

  const response = await api.post<LessonResource>(
    `/teacher-dashboard/lessons/${lessonId}/resources/create/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteTeacherLessonResource(
  resourceId: number
): Promise<void> {
  await api.delete(
    `/teacher-dashboard/resources/${resourceId}/delete/`
  );
}