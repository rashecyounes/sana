export type Lesson = {
  id: number;

  course: number;

  course_title?: string;

  title: string;

  description: string;

  order: number;

  duration?: string | null;

  thumbnail?: string | null;

  is_preview: boolean;

  is_published: boolean;

  video_provider: string;

  video_asset_id?: string | null;

  video_playback_id?: string | null;

  is_drm_protected?: boolean;

  created_at: string;

  updated_at: string;
};

export type LessonFormData = {
  course: number;

  title: string;

  description: string;

  order: number;

  duration?: string | null;

  thumbnail?: File | null;

  is_preview: boolean;

  is_published: boolean;
};

export type LessonResource = {
  id: number;

  title: string;

  description?: string;

  file: string;

  created_at: string;
};

export type LessonResourceFormData = {
  title: string;

  description?: string;

  file: File;
};