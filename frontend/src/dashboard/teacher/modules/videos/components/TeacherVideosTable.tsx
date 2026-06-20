import DataTable from "../../../../admin/shared/components/DataTable";

import StatusBadge from "../../../../admin/shared/components/StatusBadge";

import type { VideoLesson } from "../types/teacherVideo.types";

type Props = {
  videos: VideoLesson[];
};

function TeacherVideosTable({
  videos,
}: Props) {
  return (
    <DataTable
      data={videos}
      emptyTitle="No videos found"
      emptyDescription="Upload your first lesson video."
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
            lesson.course_title ||
            "Unknown course",
        },

        {
          header: "Provider",
          render: (lesson) => (
            <span className="text-sm font-semibold text-slate-700 uppercase">
              {lesson.video_provider ||
                "-"}
            </span>
          ),
        },

        {
          header: "Playback ID",
          render: (lesson) =>
            lesson.video_playback_id ? (
              <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-mono text-slate-700">
                {
                  lesson.video_playback_id
                }
              </span>
            ) : (
              <StatusBadge
                label="No Video"
                variant="warning"
              />
            ),
        },

        {
          header: "DRM",
          render: (lesson) =>
            lesson.is_drm_protected ? (
              <StatusBadge
                label="Protected"
                variant="success"
              />
            ) : (
              <StatusBadge
                label="Disabled"
                variant="neutral"
              />
            ),
        },

        {
          header: "Status",
          render: (lesson) =>
            lesson.video_playback_id ? (
              <StatusBadge
                label="Ready"
                variant="success"
              />
            ) : (
              <StatusBadge
                label="Pending"
                variant="warning"
              />
            ),
        },
      ]}
    />
  );
}

export default TeacherVideosTable;