import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CourseForm from "../components/CourseForm";
import { createCourse, getCourseFormData } from "../services/coursesApi";
import type { CourseFormData, Teacher } from "../types/course.types";
import type { Subject } from "../../subjects/types/subject.types";

function CreateCourse() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFormData() {
      try {
        setLoadingData(true);
        setError("");

        const data = await getCourseFormData();

        setSubjects(data.subjects);
        setTeachers(data.teachers);
      } catch {
        setError("Failed to load course form data.");
      } finally {
        setLoadingData(false);
      }
    }

    loadFormData();
  }, []);

  async function handleCreate(data: CourseFormData) {
    try {
      setSaveLoading(true);
      setError("");

      await createCourse(data);

      navigate("/admin/courses");
    } catch {
      setError("Failed to create course.");
    } finally {
      setSaveLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading course form...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to="/admin/courses"
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to courses
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create Course
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new course and assign it to a subject and teacher.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <CourseForm
        subjects={subjects}
        teachers={teachers}
        submitText="Create Course"
        loading={saveLoading}
        onSubmit={handleCreate}
      />
    </section>
  );
}

export default CreateCourse;