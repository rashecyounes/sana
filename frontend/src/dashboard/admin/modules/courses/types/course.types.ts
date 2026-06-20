export type Course = {
  id: number;
  subject: number;
  subject_name?: string;
  subject_slug?: string;

  teacher: number | null;
  teacher_name?: string | null;

  created_by?: number | null;
  created_by_name?: string | null;

  title: string;
  description: string;
  image: string | null;
  price: string;
  is_published: boolean;

  lessons_count?: number;
  enrollments_count?: number;

  created_at: string;
  updated_at: string;
};

export type Teacher = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export type CourseFormData = {
  subject: number;
  teacher?: number | null;
  title: string;
  description: string;
  price: string;
  is_published: boolean;
  image?: File | null;
};