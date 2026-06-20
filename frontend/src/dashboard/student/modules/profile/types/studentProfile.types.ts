export type StudentProfile = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string | null;
  bio: string | null;
  profile_image: string | null;
  profile_image_url: string | null;
};

export type UpdateStudentProfilePayload = FormData;