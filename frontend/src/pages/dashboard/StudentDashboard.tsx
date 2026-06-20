import { useEffect, useState } from "react";
import api from "../../api/axios";
import CourseGrid, {
  type DashboardCourse,
} from "../../components/courses/CourseGrid";

type EnrollmentResponse = {
  id: number;
  course: number;
  course_title: string;
  course_description: string;
  course_image: string | null;
  course_price: string;
  subject_name: string;
  teacher_name: string;
  source: string;
  is_active: boolean;
  created_at: string;
};

function StudentDashboard() {
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get<EnrollmentResponse[]>(
          "/enrollments/my-courses/"
        );

        const mappedCourses: DashboardCourse[] = response.data.map(
          (enrollment) => ({
            id: enrollment.course,
            title: enrollment.course_title,
            description: enrollment.course_description,
            image: enrollment.course_image,
            price: enrollment.course_price,
            subjectName: enrollment.subject_name,
            teacherName: enrollment.teacher_name,
          })
        );

        setCourses(mappedCourses);
      } catch {
        setError("Failed to load your courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <p className="text-slate-600">Loading your courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-sky-600">Student Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Courses
          </h1>
          <p className="mt-2 text-slate-600">
            Courses you unlocked by access code or purchase.
          </p>
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>
        ) : (
          <CourseGrid
            courses={courses}
            emptyMessage="You do not have any courses yet."
          />
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;