import { useState } from "react";
import type { Course } from "../../courses/types/course.types";
import type { LessonFormData } from "../types/lesson.types";

type LessonFormProps = {
  courses: Course[];
  initialValues?: {
    course: number;
    title: string;
    description: string;
    order: number;
    duration?: string | null;
    is_preview: boolean;
    is_published: boolean;
    thumbnail?: string | null;
  };
  submitText: string;
  loading?: boolean;
  onSubmit: (data: LessonFormData) => Promise<void> | void;
};

function LessonForm({
  courses,
  initialValues,
  submitText,
  loading = false,
  onSubmit,
}: LessonFormProps) {
  const [course, setCourse] = useState(initialValues?.course || 0);
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [order, setOrder] = useState(initialValues?.order || 1);
  const [duration, setDuration] = useState(initialValues?.duration || "");
  const [isPreview, setIsPreview] = useState(
    initialValues?.is_preview || false
  );
  const [isPublished, setIsPublished] = useState(
    initialValues?.is_published || false
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      course,
      title,
      description,
      order,
      duration: duration || null,
      is_preview: isPreview,
      is_published: isPublished,
      thumbnail,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Course
        </label>

        <select
          value={course}
          onChange={(event) => setCourse(Number(event.target.value))}
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        >
          <option value={0}>Select course</option>

          {courses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Lesson Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Introduction to the course"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Write lesson description..."
          required
          rows={5}
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
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
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Duration
          </label>

          <input
            type="text"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="Example: 12:30"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
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
            className="h-5 w-5 rounded border-slate-300 text-sky-500"
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
            className="h-5 w-5 rounded border-slate-300 text-sky-500"
          />
        </label>
      </div>

      {initialValues?.thumbnail && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Current Thumbnail
          </p>

          <img
            src={initialValues.thumbnail}
            alt={initialValues.title}
            className="h-32 w-48 rounded-2xl object-cover"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Thumbnail
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
        disabled={loading || course === 0}
        className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default LessonForm;