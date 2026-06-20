import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StatusBadge from "../../../shared/components/StatusBadge";
import { getLesson } from "../services/lessonsApi";
import type { Lesson } from "../types/lesson.types";
import LessonResources from "../components/LessonResources";

function LessonDetails() {
  const { id } = useParams<{ id: string }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLesson() {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const data = await getLesson(id);
        setLesson(data);
      } catch {
        setError("Failed to load lesson details.");
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading lesson details...
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Lesson not found."}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={`/admin/lessons?course=${lesson.course}`}
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to lessons
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {lesson.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Lesson details and video/security overview.
            </p>
          </div>

          <Link
            to={`/admin/lessons/${lesson.id}/edit`}
            className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Edit Lesson
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {lesson.thumbnail ? (
              <img
                src={lesson.thumbnail}
                alt={lesson.title}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                No thumbnail
              </div>
            )}

            <div className="space-y-3 p-5">
              <div className="flex flex-wrap gap-2">
                {lesson.is_published ? (
                  <StatusBadge label="Published" variant="success" />
                ) : (
                  <StatusBadge label="Hidden" variant="warning" />
                )}

                {lesson.is_preview ? (
                  <StatusBadge label="Preview" variant="info" />
                ) : (
                  <StatusBadge label="Locked" variant="neutral" />
                )}
              </div>

              <p className="text-sm text-slate-500">
                Order #{lesson.order}
              </p>

              {lesson.duration && (
                <p className="text-sm font-semibold text-slate-900">
                  Duration: {lesson.duration}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem
                label="Course"
                value={lesson.course_title || "Unknown course"}
              />

              <InfoItem label="Video Provider" value={lesson.video_provider} />

              <InfoItem
                label="Video Asset ID"
                value={lesson.video_asset_id || "Not connected"}
              />

              <InfoItem
                label="Playback ID"
                value={lesson.video_playback_id || "Not connected"}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Video Security
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {lesson.video_playback_id ? (
                <StatusBadge label="Video Connected" variant="success" />
              ) : (
                <StatusBadge label="No Video" variant="warning" />
              )}

              {lesson.video_playback_id ? (
                <StatusBadge label="Signed Playback Ready" variant="info" />
              ) : (
                <StatusBadge label="Signed Playback Pending" variant="neutral" />
              )}

              {lesson.is_drm_protected ? (
                <StatusBadge label="DRM Protected" variant="success" />
              ) : (
                <StatusBadge label="DRM Not Active" variant="warning" />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {lesson.description}
            </p>
          </div>
          <LessonResources lessonId={lesson.id} />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/admin/lessons/${lesson.id}/edit`}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit Lesson
              </Link>

              <Link
                to={`/admin/videos?lesson=${lesson.id}`}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Manage Video
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-all text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default LessonDetails;