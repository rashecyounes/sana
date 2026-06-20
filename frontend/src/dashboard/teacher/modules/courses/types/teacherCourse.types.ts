export type Course = {
  id: number;

  subject: number;

  subject_name?: string;

  teacher: number | null;

  teacher_name?: string | null;

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

export type CourseFormData = {
  subject: number;

  title: string;

  description: string;

  price: string;

  is_published: boolean;

  image?: File | null;
};