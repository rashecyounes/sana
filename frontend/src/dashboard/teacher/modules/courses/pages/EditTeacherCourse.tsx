import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../../../../api/axios";

type TeacherCourse = {
  id: number;
  title: string;
  description: string;
  price: string;
  is_published: boolean;
  subject_name?: string;
};

function EditTeacherCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<TeacherCourse>(
          `/teacher-dashboard/courses/${id}/`
        );

        if (isMounted) {
          setTitle(response.data.title);
          setDescription(response.data.description || "");
          setPrice(response.data.price);
          setIsPublished(response.data.is_published);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load course data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.patch(`/teacher-dashboard/courses/${id}/`, {
        title,
        description,
        price,
        is_published: isPublished,
      });

      setSuccess("Course updated successfully.");

      window.setTimeout(() => {
        navigate(`/teacher/courses/${id}`);
      }, 700);
    } catch {
      setError("Failed to update course.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading course form...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Course</h1>
          <p className="mt-1 text-sm text-slate-500">
            Update course information for your assigned course.
          </p>
        </div>

        <Link
          to={`/teacher/courses/${id}`}
          className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Course Title
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-700">
            Price
          </label>
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            required
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="h-4 w-4"
          />
          Published Course
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}

export default EditTeacherCourse;