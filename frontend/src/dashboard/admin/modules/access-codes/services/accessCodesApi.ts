import api from "../../../../../api/axios";
import type {
  AccessCode,
  AccessCodeFilters,
} from "../types/accessCode.types";

export async function getAccessCodes(filters: AccessCodeFilters = {}) {
  const response = await api.get<AccessCode[]>("/access-codes/", {
    params: filters,
  });

  return response.data;
}

export async function toggleAccessCodeActive(id: number) {
  const response = await api.patch<{
    message: string;
    access_code: AccessCode;
  }>(`/access-codes/${id}/toggle-active/`);

  return response.data;
}

export async function generateAccessCodes(data: {
  course_id: number;
  count: number;
  expires_at?: string | null;
}) {
  const response = await api.post<{
    message: string;
    codes: AccessCode[];
  }>("/access-codes/generate/", data);

  return response.data;
}