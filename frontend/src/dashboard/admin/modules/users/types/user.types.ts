export type UserRole = "student" | "teacher" | "admin";

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  profile_image: string | null;
  bio: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
};

export type UserFilters = {
  search?: string;
  role?: string;
  is_active?: string;
};

export type UpdateUserPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  role?: UserRole;
  bio?: string | null;
  is_active?: boolean;
};