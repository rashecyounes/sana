import { useState } from "react";
import type { Subject } from "../../subjects/types/subject.types";
import type { CourseFormData, Teacher } from "../types/course.types";

type CourseFormProps = {
  subjects: Subject[];
  teachers: Teacher[];
  initialValues?: {
    subject: number;
    teacher?: number | null;
    title: string;
    description: string;
    price: string;
    is_published: boolean;
    image?: string | null;
  };
  submitText: string;
  loading?: boolean;
  onSubmit: (data: CourseFormData) => Promise<void> | void;
};

function CourseForm({
  subjects,
  teachers,
  initialValues,
  submitText,
  loading = false,
  onSubmit,
}: CourseFormProps) {
  const [subject, setSubject] = useState(initialValues?.subject || 0);
  const [teacher, setTeacher] = useState<number | null>(
    initialValues?.teacher || null
  );
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [price, setPrice] = useState(initialValues?.price || "0");
  const [isPublished, setIsPublished] = useState(
    initialValues?.is_published || false
  );
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      subject,
      teacher,
      title,
      description,
      price,
      is_published: isPublished,
      image,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Subject
          </label>

          <select
            value={subject}
            onChange={(event) => setSubject(Number(event.target.value))}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value={0}>Select subject</option>

            {subjects.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Teacher
          </label>

          <select
            value={teacher || ""}
            onChange={(event) =>
              setTeacher(event.target.value ? Number(event.target.value) : null)
            }
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="">Select teacher</option>

            {teachers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.first_name || item.last_name
                  ? `${item.first_name || ""} ${item.last_name || ""}`.trim()
                  : item.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Course Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Arabic Grammar Course"
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
          placeholder="Write course description..."
          required
          rows={5}
          className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Price
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="flex items-end">
          <label className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
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
      </div>

      {initialValues?.image && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Current Image
          </p>

          <img
            src={initialValues.image}
            alt={initialValues.title}
            className="h-32 w-48 rounded-2xl object-cover"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Course Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImage(event.target.files?.[0] || null)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading || subject === 0 || !teacher}
        className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default CourseForm;