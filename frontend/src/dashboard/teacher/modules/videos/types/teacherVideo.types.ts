import type { Lesson } from "../../lessons/types/teacherLesson.types";

export type VideoLesson = Lesson;

export type UploadVideoMethod =
  | "url"
  | "device";

export type UploadVideoFormData = {
  lesson_id: number;

  method: UploadVideoMethod;

  video_url?: string;

  video_file?: File | null;
};