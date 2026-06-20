import { Link } from "react-router-dom";

import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import type { VideoLesson } from "../types/video.types";

type VideosTableProps = {
  videos: VideoLesson[];
};

function VideosTable({ videos }: VideosTableProps) {
  return (
    <DataTable
      data={videos}
      emptyTitle="No lessons found"
      emptyDescription="Create lessons first, then connect videos to them."
      columns={[
        {
          header: "Lesson",
          render: (lesson) => (
            <div>
              <p className="font-semibold text-slate-900">{lesson.title}</p>
              <p className="text-xs text-slate-500">
                {lesson.course_title || "Unknown course"}
              </p>
            </div>
          ),
        },
        {
          header: "Video Status",
          render: (lesson) =>
            lesson.video_playback_id ? (
              <StatusBadge label="Connected" variant="success" />
            ) : (
              <StatusBadge label="No Video" variant="warning" />
            ),
        },
        {
          header: "Provider",
          render: (lesson) => lesson.video_provider || "mux",
        },
        {
          header: "Playback ID",
          render: (lesson) => (
            <span className="break-all text-xs text-slate-600">
              {lesson.video_playback_id || "Not connected"}
            </span>
          ),
        },
        {
          header: "DRM",
          render: (lesson) =>
            lesson.is_drm_protected ? (
              <StatusBadge label="DRM Protected" variant="success" />
            ) : (
              <StatusBadge label="Not Active" variant="warning" />
            ),
        },
        {
          header: "Actions",
          render: (lesson) => (
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/videos/upload?lesson=${lesson.id}`}
                className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-100"
              >
                {lesson.video_playback_id ? "Replace" : "Upload"}
              </Link>

              <Link
                to={`/admin/lessons/${lesson.id}`}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Lesson
              </Link>
            </div>
          ),
        },
      ]}
    />
  );
}

export default VideosTable;