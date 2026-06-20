import api from "./axios";

type VideoPayload = {
  course_id: number;
  lesson_id: number;
};

type StartVideoResponse = {
  message: string;
  video_session_id: number;
};

export async function startVideoLock(
  payload: VideoPayload
): Promise<StartVideoResponse> {
  const response = await api.post<StartVideoResponse>(
    "/security/video/start/",
    payload
  );

  return response.data;
}

export async function stopVideoLock(payload: VideoPayload): Promise<void> {
  await api.post("/security/video/stop/", payload);
}