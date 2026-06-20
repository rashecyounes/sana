import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../../api/axios";
import StatusBadge from "../../admin/shared/components/StatusBadge";

type LatestLesson = {
  id: number;
  title: string;
  course_title: string;
  is_published: boolean;
  video_connected: boolean;
  created_at: string;
};

type TeacherOverviewStats = {
  total_courses: number;
  published_courses: number;
  hidden_courses: number;
  total_lessons: number;
  published_lessons: number;
  hidden_lessons: number;
  videos_connected: number;
  videos_missing: number;
  latest_lessons: LatestLesson[];
};

const emptyStats: TeacherOverviewStats = {
  total_courses: 0,
  published_courses: 0,
  hidden_courses: 0,
  total_lessons: 0,
  published_lessons: 0,
  hidden_lessons: 0,
  videos_connected: 0,
  videos_missing: 0,
  latest_lessons: [],
};

function TeacherOverview() {
  const [stats, setStats] = useState<TeacherOverviewStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<TeacherOverviewStats>(
          "/teacher-dashboard/overview/"
        );

        if (isMounted) {
          setStats(response.data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load teacher overview.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      title: "My Courses",
      value: stats.total_courses,
      description: `${stats.published_courses} published / ${stats.hidden_courses} hidden`,
    },
    {
      title: "My Lessons",
      value: stats.total_lessons,
      description: `${stats.published_lessons} published / ${stats.hidden_lessons} hidden`,
    },
    {
      title: "Connected Videos",
      value: stats.videos_connected,
      description: "Lessons with uploaded videos",
    },
    {
      title: "Missing Videos",
      value: stats.videos_missing,
      description: "Lessons without video yet",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Teacher Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quick summary of your courses, lessons, and uploaded videos.
          </p>
        </div>

        <StatusBadge label="Teacher Area" variant="info" />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
          Loading teacher overview...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-600">
                  {card.title}
                </p>

                <h2 className="mt-4 text-3xl font-black text-slate-900">
                  {card.value}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Quick Actions
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/teacher/courses"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Manage Courses
                </Link>

                <Link
                  to="/teacher/lessons"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Manage Lessons
                </Link>

                <Link
                  to="/teacher/videos"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Manage Videos
                </Link>

                <Link
                  to="/teacher/profile"
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Video Snapshot
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Connected
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.videos_connected}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase text-slate-400">
                    Missing
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {stats.videos_missing}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Latest Lessons
            </h2>

            <div className="mt-4 space-y-3">
              {stats.latest_lessons.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No lessons created yet.
                </div>
              ) : (
                stats.latest_lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {lesson.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {lesson.course_title}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {lesson.is_published ? (
                        <StatusBadge label="Published" variant="success" />
                      ) : (
                        <StatusBadge label="Hidden" variant="warning" />
                      )}

                      {lesson.video_connected ? (
                        <StatusBadge label="Video Connected" variant="success" />
                      ) : (
                        <StatusBadge label="No Video" variant="warning" />
                      )}

                      <Link
                        to={`/teacher/lessons/${lesson.id}`}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default TeacherOverview;