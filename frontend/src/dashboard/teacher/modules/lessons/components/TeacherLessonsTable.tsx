import { Link } from "react-router-dom";

import DataTable from "../../../../admin/shared/components/DataTable";
import StatusBadge from "../../../../admin/shared/components/StatusBadge";

import type { Lesson } from "../types/teacherLesson.types";

type Props = {
  lessons: Lesson[];

  onDelete: (lesson: Lesson) => void;
};

function TeacherLessonsTable({
  lessons,
  onDelete,
}: Props) {
  return (
    <DataTable
      data={lessons}
      emptyTitle="No lessons found"
      emptyDescription="Create your first lesson."
      columns={[
        {
          header: "Lesson",
          render: (lesson) => (
            <div>
              <p className="font-semibold text-slate-900">
                {lesson.title}
              </p>

              <p className="text-xs text-slate-500">
                Order: {lesson.order}
              </p>
            </div>
          ),
        },

        {
          header: "Course",
          render: (lesson) =>
            lesson.course_title || "Unknown course",
        },

        {
          header: "Video",
          render: (lesson) =>
            lesson.video_playback_id ? (
              <StatusBadge
                label="Connected"
                variant="success"
              />
            ) : (
              <StatusBadge
                label="No video"
                variant="warning"
              />
            ),
        },

        {
          header: "Preview",
          render: (lesson) =>
            lesson.is_preview ? (
              <StatusBadge
                label="Preview"
                variant="info"
              />
            ) : (
              <StatusBadge
                label="Locked"
                variant="neutral"
              />
            ),
        },

        {
          header: "Status",
          render: (lesson) =>
            lesson.is_published ? (
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
          render: (lesson) => (
            <div className="flex items-center gap-2">
              <Link
                to={`/teacher/lessons/${lesson.id}`}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                View
              </Link>

              <Link
                to={`/teacher/lessons/${lesson.id}/edit`}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => onDelete(lesson)}
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

export default TeacherLessonsTable;