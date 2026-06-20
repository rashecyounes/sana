import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import StatusBadge from "../../../../admin/shared/components/StatusBadge";

import {
  createTeacherLessonResource,
  deleteTeacherLessonResource,
  getTeacherLesson,
  getTeacherLessonResources,
} from "../services/teacherLessonsApi";

import type {
  Lesson,
  LessonResource,
} from "../types/teacherLesson.types";

function TeacherLessonDetails() {
  const { id } = useParams<{ id: string }>();

  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [resources, setResources] = useState<
    LessonResource[]
  >([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [file, setFile] = useState<File | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [uploadLoading, setUploadLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoading(true);

        setError("");

        const [lessonData, resourcesData] =
          await Promise.all([
            getTeacherLesson(id),

            getTeacherLessonResources(
              Number(id)
            ),
          ]);

        setLesson(lessonData);

        setResources(resourcesData);
      } catch {
        setError(
          "Failed to load lesson details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function handleUploadResource(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id || !file) return;

    try {
      setUploadLoading(true);

      setError("");

      const newResource =
        await createTeacherLessonResource(
          Number(id),
          {
            title,
            description,
            file,
          }
        );

      setResources((current) => [
        newResource,
        ...current,
      ]);

      setTitle("");

      setDescription("");

      setFile(null);
    } catch {
      setError("Failed to upload resource.");
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleDeleteResource(
    resourceId: number
  ) {
    try {
      await deleteTeacherLessonResource(
        resourceId
      );

      setResources((current) =>
        current.filter(
          (resource) =>
            resource.id !== resourceId
        )
      );
    } catch {
      setError("Failed to delete resource.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading lesson details...
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={`/teacher/lessons?course=${lesson.course}`}
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
              Lesson details and resource
              management.
            </p>
          </div>

          <Link
            to={`/teacher/lessons/${lesson.id}/edit`}
            className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Edit Lesson
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
              {lesson.is_published ? (
                <StatusBadge
                  label="Published"
                  variant="success"
                />
              ) : (
                <StatusBadge
                  label="Hidden"
                  variant="warning"
                />
              )}

              {lesson.is_preview ? (
                <StatusBadge
                  label="Preview"
                  variant="info"
                />
              ) : (
                <StatusBadge
                  label="Locked"
                  variant="neutral"
                />
              )}

              {lesson.video_playback_id ? (
                <StatusBadge
                  label="Video Connected"
                  variant="success"
                />
              ) : (
                <StatusBadge
                  label="No Video"
                  variant="warning"
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Lesson Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem
                label="Course"
                value={
                  lesson.course_title ||
                  "Unknown course"
                }
              />

              <InfoItem
                label="Order"
                value={String(lesson.order)}
              />

              <InfoItem
                label="Duration"
                value={
                  lesson.duration || "-"
                }
              />

              <InfoItem
                label="Video Provider"
                value={
                  lesson.video_provider ||
                  "-"
                }
              />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-slate-700">
                Description
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                {lesson.description}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Lesson Resources
              </h2>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {resources.length} Files
              </span>
            </div>

            <form
              onSubmit={handleUploadResource}
              className="mt-5 space-y-4"
            >
              <input
                type="text"
                placeholder="Resource title"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
              />

              <input
                type="file"
                onChange={(event) =>
                  setFile(
                    event.target.files?.[0] ||
                      null
                  )
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
                required
              />

              <button
                type="submit"
                disabled={uploadLoading}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
              >
                {uploadLoading
                  ? "Uploading..."
                  : "Upload Resource"}
              </button>
            </form>

            <div className="mt-8 space-y-3">
              {resources.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No resources uploaded yet.
                </div>
              ) : (
                resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {resource.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          resource.description
                        }
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={resource.file}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Download
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteResource(
                            resource.id
                          )
                        }
                        className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
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

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default TeacherLessonDetails;