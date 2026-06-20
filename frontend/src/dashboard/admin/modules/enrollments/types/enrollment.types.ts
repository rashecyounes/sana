export type EnrollmentSource =
  | "access_code"
  | "purchase"
  | "admin_grant"
  | "free";

export type Enrollment = {
  id: number;
  student: number;
  student_name: string;
  student_email: string;
  course: number;
  course_title: string;
  source: EnrollmentSource;
  source_display: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type EnrollmentFilters = {
  search?: string;
  source?: string;
  is_active?: string;
};