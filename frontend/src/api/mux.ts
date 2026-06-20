import api from "./axios";

export type WatermarkData = {
  username: string;
  email: string;
  device_id: string;
};

export type MuxLessonTokenResponse = {
  playback_id: string;
  token: string;
  expires_in_minutes: number;

  watermark?: WatermarkData | null;

  is_drm_protected?: boolean;

  drm_license_type?: string | null;
};

export async function getMuxLessonToken(
  lessonId: number
): Promise<MuxLessonTokenResponse> {
  const response = await api.get<MuxLessonTokenResponse>(
    `/lessons/${lessonId}/mux-token/`
  );

  return response.data;
}