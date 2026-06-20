import { useState } from "react";
import type { SubjectFormData } from "../types/subject.types";

type SubjectFormProps = {
  initialValues?: {
    name: string;
    image?: string | null;
  };
  submitText: string;
  loading?: boolean;
  onSubmit: (data: SubjectFormData) => Promise<void> | void;
};

function SubjectForm({
  initialValues,
  submitText,
  loading = false,
  onSubmit,
}: SubjectFormProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      name,
      image,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Subject Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Example: Arabic"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </div>

      {initialValues?.image && (
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Current Image
          </p>

          <img
            src={initialValues.image}
            alt={initialValues.name}
            className="h-28 w-28 rounded-2xl object-cover"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Subject Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            setImage(event.target.files?.[0] || null);
          }}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-xs text-slate-500">
          Upload an image for this subject.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default SubjectForm;