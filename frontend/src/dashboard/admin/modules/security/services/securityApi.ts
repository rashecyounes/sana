import api from "../../../../../api/axios";

import type {
  AdminDevice,
  AdminUserSession,
  AdminVideoSession,
  SecurityFilters,
} from "../types/security.types";

export async function getAdminDevices(filters: SecurityFilters = {}) {
  const response = await api.get<AdminDevice[]>(
    "/admin-dashboard/security/devices/",
    {
      params: filters,
    }
  );

  return response.data;
}

export async function toggleAdminDeviceActive(id: number) {
  const response = await api.patch<{
    message: string;
    device: AdminDevice;
  }>(`/admin-dashboard/security/devices/${id}/toggle-active/`);

  return response.data;
}

export async function getAdminSessions(filters: SecurityFilters = {}) {
  const response = await api.get<AdminUserSession[]>(
    "/admin-dashboard/security/sessions/",
    {
      params: filters,
    }
  );

  return response.data;
}

export async function deactivateAdminSession(id: number) {
  const response = await api.patch<{
    message: string;
    session: AdminUserSession;
  }>(`/admin-dashboard/security/sessions/${id}/deactivate/`);

  return response.data;
}

export async function getAdminVideoSessions(filters: SecurityFilters = {}) {
  const response = await api.get<AdminVideoSession[]>(
    "/admin-dashboard/security/video-sessions/",
    {
      params: filters,
    }
  );

  return response.data;
}

export async function deactivateAdminVideoSession(id: number) {
  const response = await api.patch<{
    message: string;
    video_session: AdminVideoSession;
  }>(`/admin-dashboard/security/video-sessions/${id}/deactivate/`);

  return response.data;
}