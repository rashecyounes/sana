import api from "../../../api/axios";
import type { StudentOverview } from "./studentOverview.types";

export async function getStudentOverview(): Promise<StudentOverview> {
  const response = await api.get<StudentOverview>(
    "/student-dashboard/overview/"
  );

  return response.data;
}