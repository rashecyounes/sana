import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import TeacherUploadVideoForm from "../components/TeacherUploadVideoForm";

import {
  createTeacherMuxDirectUpload,
  getTeacherVideoFormData,
  uploadFileDirectlyToMux,
  uploadTeacherLessonVideo,
} from "../services/teacherVideosApi";

import { getTeacherCourses } from "../../courses/services/teacherCoursesApi";

import type {
  UploadVideoFormData,
  VideoLesson,
} from "../types/teacherVideo.types";

import type { Course } from "../../courses/types/teacherCourse.types";

type UploadStatus = "idle" | "uploading" | "processing" | "ready" | "failed";

function TeacherUploadVideo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const lessonIdFromUrl = searchParams.get("lesson");

  const [lessons, setLessons] = useState<VideoLesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  const [lastUploadData, setLastUploadData] =
    useState<UploadVideoFormData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoadingData(true);
        setError("");

        const [videoFormData, teacherCourses] = await Promise.all([
          getTeacherVideoFormData(),
          getTeacherCourses(),
        ]);

        if (isMounted) {
          setLessons(videoFormData.lessons);
          setCourses(teacherCourses);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load upload form data.");
        }
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleUpload(data: UploadVideoFormData) {
    try {
      setLastUploadData(data);
      setUploadLoading(true);
      setError("");
      setSuccessMessage("");
      setUploadProgress(0);
      setUploadStatus("uploading");

      if (data.method === "url") {
        if (!data.video_url) {
          setError("Video URL is required.");
          setUploadStatus("failed");
          return;
        }

        await uploadTeacherLessonVideo(data);

        setUploadStatus("processing");
        navigate(`/teacher/videos?lesson=${data.lesson_id}`);
        return;
      }

      if (data.method === "device") {
        if (!data.video_file) {
          setError("Video file is required.");
          setUploadStatus("failed");
          return;
        }

        const directUpload = await createTeacherMuxDirectUpload(data.lesson_id);

        await uploadFileDirectlyToMux(
          directUpload.upload_url,
          data.video_file,
          setUploadProgress
        );

        setUploadProgress(100);
        setUploadStatus("processing");

        setSuccessMessage(
          "Video uploaded successfully. Mux is processing it now."
        );
      }
    } catch {
      setUploadStatus("failed");
      setError("Failed to upload video.");
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleRetry() {
    if (!lastUploadData) return;

    await handleUpload(lastUploadData);
  }

  if (loadingData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading upload form...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={
            lessonIdFromUrl
              ? `/teacher/videos?lesson=${lessonIdFromUrl}`
              : "/teacher/videos"
          }
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to videos
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Upload Video
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Upload lesson videos directly to Mux.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            Upload Status:
            <span className="ml-2 capitalize text-sky-600">
              {uploadStatus}
            </span>
          </p>

          {uploadStatus === "failed" && lastUploadData && (
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          )}
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-sky-500 transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {uploadProgress}% uploaded
        </p>
      </div>

      <TeacherUploadVideoForm
        lessons={lessons}
        courses={courses}
        initialLessonId={lessonIdFromUrl ? Number(lessonIdFromUrl) : undefined}
        loading={uploadLoading}
        onSubmit={handleUpload}
      />
    </section>
  );
}

export default TeacherUploadVideo;