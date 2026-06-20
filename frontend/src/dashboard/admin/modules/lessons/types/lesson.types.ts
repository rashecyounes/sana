export type Lesson = {
  id: number;
  course: number;
  course_title?: string;

  title: string;
  description: string;

  video_provider: "mux" | "bunny" | "youtube" | string;
  video_asset_id: string | null;
  video_playback_id: string | null;

  is_drm_protected?: boolean;
  drm_configuration_id?: string | null;
  drm_license_type?: string | null;

  thumbnail: string | null;
  order: number;
  duration: string | null;

  is_preview: boolean;
  is_published: boolean;

  created_at: string;
  updated_at: string;
};

export type LessonFormData = {
  course: number;
  title: string;
  description: string;
  order: number;
  duration?: string | null;
  is_preview: boolean;
  is_published: boolean;
  thumbnail?: File | null;
};
export type LessonResource = {
  id: number;
  lesson: number;
  title: string;
  description: string;
  file: string;
  uploaded_by?: number | null;
  uploaded_by_name?: string | null;
  created_at: string;
};

export type LessonResourceFormData = {
  title: string;
  description?: string;
  file: File;
};