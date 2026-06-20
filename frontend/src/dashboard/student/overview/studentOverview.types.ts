export type StudentOverview = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  profile_image_url: string | null;
  courses_count: number;
};