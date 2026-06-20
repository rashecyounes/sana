import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import StatusBadge from "../../../shared/components/StatusBadge";
import { getCourse } from "../services/coursesApi";
import type { Course } from "../types/course.types";

function AdminCourseDetails() {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const data = await getCourse(id);
        setCourse(data);
      } catch {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading course details...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error || "Course not found."}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to="/admin/courses"
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to courses
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {course.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Course details and management overview.
            </p>
          </div>

          <Link
            to={`/admin/courses/${course.id}/edit`}
            className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Edit Course
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                No course image
              </div>
            )}

            <div className="space-y-3 p-5">
              {course.is_published ? (
                <StatusBadge label="Published" variant="success" />
              ) : (
                <StatusBadge label="Hidden" variant="warning" />
              )}

              <p className="text-2xl font-bold text-slate-900">
                ${course.price}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Basic Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem
                label="Subject"
                value={course.subject_name || "Unknown subject"}
              />

              <InfoItem
                label="Teacher"
                value={course.teacher_name || "No teacher assigned"}
              />

              <InfoItem
                label="Lessons"
                value={String(course.lessons_count ?? 0)}
              />

              <InfoItem
                label="Enrollments"
                value={String(course.enrollments_count ?? 0)}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {course.description}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/admin/courses/${course.id}/edit`}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit Course
              </Link>

              <Link
                to={`/admin/lessons?course=${course.id}`}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Manage Lessons
              </Link>

              <Link
                to={`/admin/videos?course=${course.id}`}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Manage Videos
              </Link>
              <Link
                to={`/admin/courses/${course.id}/ai-knowledge`}
                className="inline-flex items-center justify-center rounded-2xl bg-purple-600 px-5 py-3 text-sm font-black text-white transition hover:bg-purple-700"
              >
                إدارة مادة المساعد الذكي
              </Link>
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

function InfoItem({ label, value }: InfoItemProps) {
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

export default AdminCourseDetails;