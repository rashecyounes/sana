import { useEffect, useState } from "react";

import ConfirmModal from "../../../shared/components/ConfirmModal";
import EmptyState from "../../../shared/components/EmptyState";

import {
  createLessonResource,
  deleteLessonResource,
  getLessonResources,
} from "../services/lessonsApi";

import type {
  LessonResource,
  LessonResourceFormData,
} from "../types/lesson.types";

type LessonResourcesProps = {
  lessonId: number;
};

function LessonResources({ lessonId }: LessonResourcesProps) {
  const [resources, setResources] = useState<LessonResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [selectedResource, setSelectedResource] =
    useState<LessonResource | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadResources() {
      try {
        setLoading(true);
        setError("");

        const data = await getLessonResources(lessonId);

        if (isMounted) {
          setResources(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load lesson resources.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadResources();

    return () => {
      isMounted = false;
    };
  }, [lessonId, refreshKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please choose a file.");
      return;
    }

    const payload: LessonResourceFormData = {
      title,
      description,
      file,
    };

    try {
      setUploadLoading(true);
      setError("");

      await createLessonResource(lessonId, payload);

      setTitle("");
      setDescription("");
      setFile(null);

      setRefreshKey((current) => current + 1);
    } catch {
      setError("Failed to upload lesson resource.");
    } finally {
      setUploadLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedResource) return;

    try {
      setDeleteLoading(true);

      await deleteLessonResource(selectedResource.id);

      setSelectedResource(null);

      setRefreshKey((current) => current + 1);
    } catch {
      setError("Failed to delete lesson resource.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Lesson Resources
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload and manage files attached to this lesson.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4"
      >
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Resource title"
          required
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Resource description optional"
          rows={3}
          className="resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />

        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        />

        <button
          type="submit"
          disabled={uploadLoading}
          className="w-fit rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          {uploadLoading ? "Uploading..." : "Upload Resource"}
        </button>
      </form>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
          Loading resources...
        </div>
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description="Upload the first file for this lesson."
        />
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="font-semibold text-slate-900">
                  {resource.title}
                </p>

                {resource.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {resource.description}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  {new Date(resource.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={resource.file}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Open
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedResource(resource)}
                  className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={selectedResource !== null}
        title="Delete resource"
        description={`Are you sure you want to delete "${selectedResource?.title}"?`}
        confirmText="Delete"
        loading={deleteLoading}
        onCancel={() => setSelectedResource(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default LessonResources;