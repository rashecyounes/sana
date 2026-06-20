export type Subject = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type SubjectFormData = {
  name: string;
  image?: File | null;
};