import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getTeacherLesson, updateTeacherLesson } from "../services/teacherLessonsApi";
import type { Lesson } from "../types/teacherLesson.types";

function EditTeacherLesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(1);
  const [duration, setDuration] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [loadingData, setLoadingData] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadLesson() {
      if (!id) return;

      try {
        setLoadingData(true);
        setError("");

        const data = await getTeacherLesson(id);

        if (isMounted) {
          setLesson(data);
          setTitle(data.title);
          setDescription(data.description);
          setOrder(data.order);
          setDuration(data.duration || "");
          setIsPreview(data.is_preview);
          setIsPublished(data.is_published);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load lesson data.");
        }
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    }

    loadLesson();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lesson || !id) return;

    try {
      setSaveLoading(true);
      setError("");

      await updateTeacherLesson(id, {
        course: lesson.course,
        title,
        description,
        order,
        duration: duration || null,
        is_preview: isPreview,
        is_published: isPublished,
        thumbnail,
      });

      navigate(`/teacher/lessons?course=${lesson.course}`);
    } catch {
      setError("Failed to update lesson.");
    } finally {
      setSaveLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading lesson data...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Lesson not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={`/teacher/lessons?course=${lesson.course}`}
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to lessons
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Edit Lesson
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update this lesson. The course is locked for security.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Course
          </label>

          <input
            value={lesson.course_title || "Unknown course"}
            disabled
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Lesson Title
          </label>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            required
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Order
            </label>

            <input
              type="number"
              min="1"
              value={order}
              onChange={(event) => setOrder(Number(event.target.value))}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Duration
            </label>

            <input
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              placeholder="Example: 12:30"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">
              Free Preview
            </span>

            <input
              type="checkbox"
              checked={isPreview}
              onChange={(event) => setIsPreview(event.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">
              Published
            </span>

            <input
              type="checkbox"
              checked={isPublished}
              onChange={(event) => setIsPublished(event.target.checked)}
              className="h-5 w-5"
            />
          </label>
        </div>

        {lesson.thumbnail && (
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Current Thumbnail
            </p>

            <img
              src={lesson.thumbnail}
              alt={lesson.title}
              className="h-32 w-48 rounded-2xl object-cover"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            New Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(event) => setThumbnail(event.target.files?.[0] || null)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saveLoading}
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          {saveLoading ? "Saving..." : "Update Lesson"}
        </button>
      </form>
    </section>
  );
}

export default EditTeacherLesson;