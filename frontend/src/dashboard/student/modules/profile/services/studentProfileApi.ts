import api from "../../../../../api/axios";
import type {
  StudentProfile,
  UpdateStudentProfilePayload,
} from "../types/studentProfile.types";

export async function getStudentProfile(): Promise<StudentProfile> {
  const response = await api.get<StudentProfile>(
    "/student-dashboard/profile/"
  );

  return response.data;
}

export async function updateStudentProfile(
  data: UpdateStudentProfilePayload
): Promise<StudentProfile> {
  const response = await api.patch<StudentProfile>(
    "/student-dashboard/profile/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}