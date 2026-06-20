export type AccessCode = {
  id: number;
  code: string;
  course: number;
  course_title: string;
  is_used: boolean;
  is_active: boolean;
  used_by: number | null;
  used_by_name?: string | null;
  created_by: number | null;
  created_by_name?: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type AccessCodeFilters = {
  search?: string;
  is_used?: string;
  is_active?: string;
  course?: string;
};