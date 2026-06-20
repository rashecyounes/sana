import { useEffect, useState } from "react";

import LoadingState from "../../../shared/components/LoadingState";
import EmptyState from "../../../shared/components/EmptyState";
import MyCoursesGrid from "../components/MyCoursesGrid";
import { getStudentMyCourses } from "../services/myCoursesApi";
import type { StudentCourse } from "../types/myCourse.types";

export default function MyCourses() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCourses() {
      try {
        const data = await getStudentMyCourses();

        if (isMounted) {
          setCourses(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load your courses.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading your courses..." />;
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          Courses you currently have access to.
        </p>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="When you buy a course or redeem an access code, it will appear here."
        />
      ) : (
        <MyCoursesGrid courses={courses} />
      )}
    </div>
  );
}