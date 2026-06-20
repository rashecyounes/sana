import api from "../../../../../api/axios";
import type { UploadVideoFormData, VideoLesson } from "../types/video.types";

export type VideoFormDataOptions = {
  lessons: VideoLesson[];
};

export async function getVideos(lessonId?: string): Promise<VideoLesson[]> {
  const response = await api.get<VideoLesson[]>("/admin-dashboard/videos/", {
    params: lessonId ? { lesson: lessonId } : {},
  });

  return response.data;
}

export async function getVideoFormData(): Promise<VideoFormDataOptions> {
  const response = await api.get<VideoFormDataOptions>(
    "/admin-dashboard/video-form-data/"
  );

  return response.data;
}

export async function uploadLessonVideo(
  data: UploadVideoFormData
): Promise<VideoLesson> {
  const response = await api.post<VideoLesson>("/courses/upload-video/", data);
  return response.data;
}
export type DirectUploadResponse = {
  upload_id: string;
  upload_url: string;
};

export async function createMuxDirectUpload(
  lessonId: number
): Promise<DirectUploadResponse> {
  const response = await api.post<DirectUploadResponse>(
    "/admin-dashboard/mux/direct-upload/",
    {
      lesson_id: lessonId,
    }
  );

  return response.data;
}

export function uploadFileDirectlyToMux(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", uploadUrl);

    xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error("Mux upload failed."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading to Mux."));
    };

    xhr.send(file);
  });
}