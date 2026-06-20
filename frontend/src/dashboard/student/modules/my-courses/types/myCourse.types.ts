export type StudentCourse = {
  id: number;
  title: string;
  description: string;
  image: string | null;
  image_url?: string | null;
  price: string;
  is_published: boolean;
  teacher_name?: string;
  subject_name?: string;
  has_access?: boolean;
};