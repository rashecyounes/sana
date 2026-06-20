import { useState } from "react";
import type {
  UploadVideoFormData,
  UploadVideoMethod,
  VideoLesson,
} from "../types/video.types";

type UploadVideoFormProps = {
  lessons: VideoLesson[];
  initialLessonId?: number;
  loading?: boolean;
  onSubmit: (data: UploadVideoFormData) => Promise<void> | void;
};

function UploadVideoForm({
  lessons,
  initialLessonId,
  loading = false,
  onSubmit,
}: UploadVideoFormProps) {
  const [lessonId, setLessonId] = useState(initialLessonId || 0);
  const [method, setMethod] = useState<UploadVideoMethod>("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      lesson_id: lessonId,
      method,
      video_url: videoUrl || undefined,
      video_file: videoFile,
    });
  }

  const canSubmit =
    lessonId !== 0 &&
    !loading &&
    ((method === "url" && videoUrl.trim().length > 0) ||
      (method === "device" && videoFile !== null));

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <h2 className="text-sm font-bold text-sky-800">Upload Method</h2>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod("url")}
            className={`rounded-2xl border p-4 text-left transition ${
              method === "url"
                ? "border-sky-400 bg-white ring-4 ring-sky-100"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="font-semibold text-slate-900">Video URL</p>
            <p className="mt-1 text-sm text-slate-500">
              Send a direct video URL to the backend, then backend sends it to
              Mux.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMethod("device")}
            className={`rounded-2xl border p-4 text-left transition ${
              method === "device"
                ? "border-sky-400 bg-white ring-4 ring-sky-100"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <p className="font-semibold text-slate-900">Upload from Device</p>
            <p className="mt-1 text-sm text-slate-500">
              Upload the video directly from browser to Mux Direct Upload.
            </p>
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Lesson
        </label>

        <select
          value={lessonId}
          onChange={(event) => setLessonId(Number(event.target.value))}
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          <option value={0}>Select lesson</option>

          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.course_title ? `${lesson.course_title} - ` : ""}
              {lesson.title}
            </option>
          ))}
        </select>
      </div>

      {method === "url" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Video URL
          </label>

          <input
            type="url"
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Use a direct video URL that Mux can access.
          </p>
        </div>
      )}

      {method === "device" && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Video File
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={(event) =>
              setVideoFile(event.target.files?.[0] || null)
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            The video will be uploaded directly to Mux, not through Django.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
      >
        {loading
          ? method === "device"
            ? "Uploading directly to Mux..."
            : "Uploading to Mux..."
          : "Upload Video"}
      </button>
    </form>
  );
}

export default UploadVideoForm;