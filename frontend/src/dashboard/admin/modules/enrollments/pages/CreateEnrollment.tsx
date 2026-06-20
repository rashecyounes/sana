import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";

import {
  createEnrollment,
  getEnrollmentFormData,
  type EnrollmentFormData,
} from "../services/enrollmentsApi";

function CreateEnrollment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EnrollmentFormData>({
    students: [],
    courses: [],
  });

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [source, setSource] = useState<"admin_grant" | "free">("admin_grant");

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchFormData() {
      try {
        const data = await getEnrollmentFormData();

        if (isMounted) {
          setFormData(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load enrollment form data.");
        }
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    }

    fetchFormData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!studentId) {
      setError("Please select a student.");
      return;
    }

    if (!courseId) {
      setError("Please select a course.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await createEnrollment({
        student_id: Number(studentId),
        course_id: Number(courseId),
        source,
      });

      navigate("/admin/enrollments");
    } catch {
      setError("Failed to create enrollment. The student may already have access.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Create Enrollment
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manually grant a student access to a course.
          </p>
        </div>

        <Link
          to="/admin/enrollments"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft size={18} />
          Back to Enrollments
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Student
            </label>

            <select
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              disabled={loadingData}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 disabled:bg-slate-100"
            >
              <option value="">
                {loadingData ? "Loading students..." : "Select student"}
              </option>

              {formData.students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} — {student.email || student.username}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Course
            </label>

            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              disabled={loadingData}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 disabled:bg-slate-100"
            >
              <option value="">
                {loadingData ? "Loading courses..." : "Select course"}
              </option>

              {formData.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} — {course.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Source
            </label>

            <select
              value={source}
              onChange={(event) =>
                setSource(event.target.value as "admin_grant" | "free")
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              <option value="admin_grant">Admin Grant</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || loadingData}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60"
        >
          <UserPlus size={18} />
          {submitting ? "Creating..." : "Create Enrollment"}
        </button>
      </form>
    </div>
  );
}

export default CreateEnrollment;