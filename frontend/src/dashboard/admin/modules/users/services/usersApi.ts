import api from "../../../../../api/axios";

import type {
  AdminUser,
  UpdateUserPayload,
  UserFilters,
} from "../types/user.types";

export async function getUsers(filters: UserFilters = {}) {
  const response = await api.get<AdminUser[]>("/admin-dashboard/users/", {
    params: filters,
  });

  return response.data;
}

export async function getUserDetails(id: number) {
  const response = await api.get<AdminUser>(`/admin-dashboard/users/${id}/`);

  return response.data;
}

export async function updateUser(id: number, data: UpdateUserPayload) {
  const response = await api.patch<{
    message: string;
    user: AdminUser;
  }>(`/admin-dashboard/users/${id}/update/`, data);

  return response.data;
}

export async function toggleUserActive(id: number) {
  const response = await api.patch<{
    message: string;
    user: AdminUser;
  }>(`/admin-dashboard/users/${id}/toggle-active/`);

  return response.data;
}