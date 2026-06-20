import api from "../../../../../api/axios";

import type {
  Course,
  CourseFormData,
} from "../types/teacherCourse.types";

export async function getTeacherCourses(
  search?: string
): Promise<Course[]> {
  const response = await api.get<Course[]>(
    "/teacher-dashboard/courses/",
    {
      params: search ? { search } : {},
    }
  );

  return response.data;
}

export async function getTeacherCourse(
  id: number | string
): Promise<Course> {
  const response = await api.get<Course>(
    `/teacher-dashboard/courses/${id}/`
  );

  return response.data;
}

export async function updateTeacherCourse(
  id: number | string,
  data: CourseFormData
): Promise<Course> {
  const formData = new FormData();

  formData.append("subject", String(data.subject));

  formData.append("title", data.title);

  formData.append("description", data.description);

  formData.append("price", data.price);

  formData.append(
    "is_published",
    String(data.is_published)
  );

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.patch<Course>(
    `/teacher-dashboard/courses/${id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}