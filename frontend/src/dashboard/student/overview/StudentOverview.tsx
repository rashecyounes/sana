import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User } from "lucide-react";

import LoadingState from "../shared/components/LoadingState";
import StudentStatCard from "../shared/components/StudentStatCard";
import { getStudentOverview } from "./studentOverviewApi";
import type { StudentOverview as StudentOverviewType } from "./studentOverview.types";

export default function StudentOverview() {
  const [student, setStudent] = useState<StudentOverviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        const data = await getStudentOverview();

        if (isMounted) {
          setStudent(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load student overview.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading student dashboard..." />;
  }

  if (error || !student) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-700">
        {error || "Student data not found."}
      </div>
    );
  }

  const fullName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim() ||
    student.username;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100 ring-4 ring-sky-100">
              {student.profile_image_url ? (
                <img
                  src={student.profile_image_url}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-sky-600">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-sky-600">
                Student Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Welcome, {fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">{student.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/student/my-courses"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              <BookOpen size={18} />
              My Courses
            </Link>

            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <User size={18} />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StudentStatCard
          title="My Courses"
          value={student.courses_count}
          description="Courses you currently have access to."
        />

        <StudentStatCard
          title="Account Type"
          value="Student"
          description="Your active platform role."
        />

        <StudentStatCard
          title="Profile"
          value={student.profile_image_url ? "Complete" : "Needs image"}
          description="You can update your personal information."
        />
      </section>
    </div>
  );
}