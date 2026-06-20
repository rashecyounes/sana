import api from "../../../../../api/axios";
import type { StudentCourse } from "../types/myCourse.types";

export async function getStudentMyCourses(): Promise<StudentCourse[]> {
  const response = await api.get<StudentCourse[]>(
    "/student-dashboard/my-courses/"
  );

  return response.data;
}