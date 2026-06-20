import { Link } from "react-router-dom";

import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";

import type { Course } from "../types/course.types";

type CoursesTableProps = {
  courses: Course[];
  onDelete: (course: Course) => void;
};

function CoursesTable({
  courses,
  onDelete,
}: CoursesTableProps) {
  return (
    <DataTable
      data={courses}
      emptyTitle="No courses found"
      emptyDescription="Create your first course to start building lessons."
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
                {course.subject_name || "Unknown subject"}
              </p>
            </div>
          ),
        },

        {
          header: "Teacher",
          render: (course) => (
            <span className="text-sm text-slate-700">
              {course.teacher_name || "No teacher"}
            </span>
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
                to={`/admin/courses/${course.id}`}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                View
              </Link>

              <Link
                to={`/admin/courses/${course.id}/edit`}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => onDelete(course)}
                className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}

export default CoursesTable;