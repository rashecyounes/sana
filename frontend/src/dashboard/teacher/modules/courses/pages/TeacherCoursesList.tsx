import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../../../../admin/shared/components/SearchBar";
import DataTable from "../../../../admin/shared/components/DataTable";
import StatusBadge from "../../../../admin/shared/components/StatusBadge";

import {
  getTeacherCourses,
} from "../services/teacherCoursesApi";

import type { Course } from "../types/teacherCourse.types";

function TeacherCoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  async function loadCourses(searchValue = "") {
    try {
      setLoading(true);

      setError("");

      const data = await getTeacherCourses(searchValue);

      setCourses(data);
    } catch {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Courses
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your assigned courses and educational content.
        </p>
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
        <DataTable
          data={courses}
          emptyTitle="No courses found"
          emptyDescription="No assigned courses yet."
          columns={[
            {
              header: "Image",
              render: (course) =>
                course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                    No image
                  </div>
                ),
            },

            {
              header: "Course",
              render: (course) => (
                <div>
                  <p className="font-semibold text-slate-900">
                    {course.title}
                  </p>

                  <p className="text-xs text-slate-500">
                    {course.subject_name}
                  </p>
                </div>
              ),
            },

            {
              header: "Price",
              render: (course) => (
                <span className="font-semibold text-slate-900">
                  ${course.price}
                </span>
              ),
            },

            {
              header: "Status",
              render: (course) =>
                course.is_published ? (
                  <StatusBadge
                    label="Published"
                    variant="success"
                  />
                ) : (
                  <StatusBadge
                    label="Hidden"
                    variant="warning"
                  />
                ),
            },

            {
              header: "Actions",
              render: (course) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/teacher/courses/${course.id}`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    View
                  </Link>

                  <Link
                    to={`/teacher/courses/${course.id}/edit`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                </div>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}

export default TeacherCoursesList;