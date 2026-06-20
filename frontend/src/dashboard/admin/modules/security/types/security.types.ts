export type SecurityFilters = {
  search?: string;
  is_active?: string;
};

export type AdminDevice = {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  user_role: string;
  device_id: string;
  device_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string;
};

export type AdminUserSession = {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  device: number;
  device_name: string | null;
  device_identifier: string;
  ip_address: string | null;
  user_agent: string | null;
  is_active: boolean;
  created_at: string;
  last_seen_at: string;
};

export type AdminVideoSession = {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  device: number;
  device_name: string | null;
  device_identifier: string;
  course_id: number;
  lesson_id: number;
  is_active: boolean;
  started_at: string;
  last_seen_at: string;
};