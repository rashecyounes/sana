import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import SearchBar from "../../../../admin/shared/components/SearchBar";

import ConfirmModal from "../../../../admin/shared/components/ConfirmModal";

import TeacherLessonsTable from "../components/TeacherLessonsTable";

import {
  deleteTeacherLesson,
  getTeacherLessons,
} from "../services/teacherLessonsApi";

import type { Lesson } from "../types/teacherLesson.types";

function TeacherLessonsList() {
  const [searchParams] = useSearchParams();

  const courseId =
    searchParams.get("course") || undefined;

  const [lessons, setLessons] = useState<Lesson[]>(
    []
  );

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadLessons() {
      try {
        setLoading(true);

        setError("");

        const data =
          await getTeacherLessons(courseId);

        if (isMounted) {
          setLessons(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load lessons.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLessons();

    return () => {
      isMounted = false;
    };
  }, [courseId, refreshKey]);

  async function handleDelete() {
    if (!selectedLesson) return;

    try {
      setDeleteLoading(true);

      await deleteTeacherLesson(
        selectedLesson.id
      );

      setSelectedLesson(null);

      setRefreshKey((current) => current + 1);
    } catch {
      setError("Failed to delete lesson.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const filteredLessons = lessons.filter(
    (lesson) => {
      const keyword = search.toLowerCase();

      return (
        lesson.title
          .toLowerCase()
          .includes(keyword) ||
        lesson.course_title
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Lessons Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage lessons inside your assigned
            courses.
          </p>
        </div>

        <Link
          to={
            courseId
              ? `/teacher/lessons/create?course=${courseId}`
              : "/teacher/lessons/create"
          }
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Create Lesson
        </Link>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search lessons..."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading lessons...
        </div>
      ) : (
        <TeacherLessonsTable
          lessons={filteredLessons}
          onDelete={setSelectedLesson}
        />
      )}

      <ConfirmModal
        open={selectedLesson !== null}
        title="Delete lesson"
        description={`Are you sure you want to delete "${selectedLesson?.title}"?`}
        confirmText="Delete"
        loading={deleteLoading}
        onCancel={() =>
          setSelectedLesson(null)
        }
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default TeacherLessonsList;