import api from "../../../../../api/axios";
import type { Course, CourseFormData, Teacher } from "../types/course.types";
import type { Subject } from "../../subjects/types/subject.types";

export type CourseFormDataOptions = {
  subjects: Subject[];
  teachers: Teacher[];
};

export async function getCourses(search?: string): Promise<Course[]> {
  const response = await api.get<Course[]>("/courses/", {
    params: search ? { search } : {},
  });

  return response.data;
}

export async function getCourse(id: number | string): Promise<Course> {
  const response = await api.get<Course>(`/courses/${id}/`);
  return response.data;
}

export async function getCourseFormData(): Promise<CourseFormDataOptions> {
  const response = await api.get<CourseFormDataOptions>(
    "/admin-dashboard/course-form-data/"
  );

  return response.data;
}

export async function createCourse(data: CourseFormData): Promise<Course> {
  const formData = new FormData();

  formData.append("subject", String(data.subject));

  if (data.teacher) {
    formData.append("teacher", String(data.teacher));
  }

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("is_published", String(data.is_published));

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.post<Course>("/courses/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateCourse(
  id: number | string,
  data: CourseFormData
): Promise<Course> {
  const formData = new FormData();

  formData.append("subject", String(data.subject));

  if (data.teacher) {
    formData.append("teacher", String(data.teacher));
  }

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("price", data.price);
  formData.append("is_published", String(data.is_published));

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.patch<Course>(`/courses/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteCourse(id: number | string): Promise<void> {
  await api.delete(`/courses/${id}/`);
}