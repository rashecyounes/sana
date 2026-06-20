import { useEffect, useState } from "react";

import api from "../../../api/axios";
import DashboardCard from "../shared/components/DashboardCard";
import StatusBadge from "../shared/components/StatusBadge";

type AdminOverviewStats = {
  total_users: number;
  total_students: number;
  total_teachers: number;
  total_admins: number;

  total_subjects: number;
  total_courses: number;
  published_courses: number;
  unpublished_courses: number;

  total_lessons: number;
  published_lessons: number;
  unpublished_lessons: number;

  total_purchases: number;
  completed_purchases: number;
  pending_purchases: number;

  total_enrollments: number;
  active_enrollments: number;
  inactive_enrollments: number;

  total_access_codes: number;
  used_access_codes: number;
  unused_access_codes: number;
  active_access_codes: number;

  active_devices: number;
  active_sessions: number;
  active_video_locks: number;
};

const emptyStats: AdminOverviewStats = {
  total_users: 0,
  total_students: 0,
  total_teachers: 0,
  total_admins: 0,

  total_subjects: 0,
  total_courses: 0,
  published_courses: 0,
  unpublished_courses: 0,

  total_lessons: 0,
  published_lessons: 0,
  unpublished_lessons: 0,

  total_purchases: 0,
  completed_purchases: 0,
  pending_purchases: 0,

  total_enrollments: 0,
  active_enrollments: 0,
  inactive_enrollments: 0,

  total_access_codes: 0,
  used_access_codes: 0,
  unused_access_codes: 0,
  active_access_codes: 0,

  active_devices: 0,
  active_sessions: 0,
  active_video_locks: 0,
};

function Overview() {
  const [stats, setStats] = useState<AdminOverviewStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchOverview() {
      try {
        const response = await api.get<AdminOverviewStats>(
          "/admin-dashboard/overview/"
        );

        if (isMounted) {
          setStats(response.data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load dashboard overview.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.total_users,
      description: "All registered accounts",
    },
    {
      title: "Total Students",
      value: stats.total_students,
      description: "Registered student accounts",
    },
    {
      title: "Total Teachers",
      value: stats.total_teachers,
      description: "Teachers managing courses",
    },
    {
      title: "Total Admins",
      value: stats.total_admins,
      description: "Platform administrators",
    },
    {
      title: "Total Subjects",
      value: stats.total_subjects,
      description: "Educational subject categories",
    },
    {
      title: "Total Courses",
      value: stats.total_courses,
      description: `${stats.published_courses} published / ${stats.unpublished_courses} unpublished`,
    },
    {
      title: "Total Lessons",
      value: stats.total_lessons,
      description: `${stats.published_lessons} published / ${stats.unpublished_lessons} unpublished`,
    },
    {
      title: "Total Purchases",
      value: stats.total_purchases,
      description: `${stats.completed_purchases} completed / ${stats.pending_purchases} pending`,
    },
    {
      title: "Enrollments",
      value: stats.total_enrollments,
      description: `${stats.active_enrollments} active / ${stats.inactive_enrollments} inactive`,
    },
    {
      title: "Access Codes",
      value: stats.total_access_codes,
      description: `${stats.used_access_codes} used / ${stats.unused_access_codes} unused`,
    },
    {
      title: "Active Devices",
      value: stats.active_devices,
      description: "Currently active registered devices",
    },
    {
      title: "Active Video Locks",
      value: stats.active_video_locks,
      description: "Active protected video sessions",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quick summary of users, courses, lessons, purchases, and access.
          </p>
        </div>

        <StatusBadge label="Admin Area" variant="info" />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
          Loading dashboard overview...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((stat) => (
            <DashboardCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Security Snapshot
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Active Devices
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {stats.active_devices}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Active Sessions
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {stats.active_sessions}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Video Locks
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {stats.active_video_locks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Platform Status
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge label="JWT Active" variant="success" />
            <StatusBadge label="Device Security" variant="success" />
            <StatusBadge label="Video Lock Ready" variant="success" />
            <StatusBadge label="Signed Mux Playback" variant="info" />
            <StatusBadge label="DRM Ready" variant="warning" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Overview;