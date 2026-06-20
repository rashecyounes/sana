import api from "../../../../../api/axios";
import type { Enrollment, EnrollmentFilters } from "../types/enrollment.types";

export async function getEnrollments(filters: EnrollmentFilters = {}) {
  const response = await api.get<Enrollment[]>(
    "/admin-dashboard/enrollments/",
    {
      params: filters,
    }
  );

  return response.data;
}

export async function toggleEnrollmentActive(id: number) {
  const response = await api.patch<{
    message: string;
    enrollment: Enrollment;
  }>(`/admin-dashboard/enrollments/${id}/toggle-active/`);

  return response.data;
}
export type EnrollmentFormData = {
  students: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  }[];
  courses: {
    id: number;
    title: string;
    subject: number;
    subject_name: string;
    teacher: number | null;
    teacher_name: string | null;
    is_published: boolean;
  }[];
};

export async function getEnrollmentFormData() {
  const response = await api.get<EnrollmentFormData>(
    "/admin-dashboard/enrollment-form-data/"
  );

  return response.data;
}

export async function createEnrollment(data: {
  student_id: number;
  course_id: number;
  source: "admin_grant" | "free";
}) {
  const response = await api.post<{
    message: string;
    enrollment: Enrollment;
  }>("/admin-dashboard/enrollments/create/", data);

  return response.data;
}