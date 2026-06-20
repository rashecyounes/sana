import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../../../shared/components/SearchBar";
import ConfirmModal from "../../../shared/components/ConfirmModal";

import CoursesTable from "../components/CoursesTable";

import {
  deleteCourse,
  getCourses,
} from "../services/coursesApi";

import type { Course } from "../types/course.types";

function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  async function loadCourses(searchValue = "") {
    try {
      setLoading(true);
      setError("");

      const data = await getCourses(searchValue);

      setCourses(data);
    } catch {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedCourse) return;

    try {
      setDeleteLoading(true);

      await deleteCourse(selectedCourse.id);

      setSelectedCourse(null);

      await loadCourses(search);
    } catch {
      setError("Failed to delete course.");
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCourses(search);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Courses Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage platform courses, teachers, prices, and
            publishing.
          </p>
        </div>

        <Link
          to="/admin/courses/create"
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Create Course
        </Link>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search courses..."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading courses...
        </div>
      ) : (
        <CoursesTable
          courses={courses}
          onDelete={setSelectedCourse}
        />
      )}

      <ConfirmModal
        open={selectedCourse !== null}
        title="Delete course"
        description={`Are you sure you want to delete "${selectedCourse?.title}"?`}
        confirmText="Delete"
        loading={deleteLoading}
        onCancel={() => setSelectedCourse(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default CoursesList;