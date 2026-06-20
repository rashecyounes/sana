import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import CourseForm from "../components/CourseForm";
import {
  getCourse,
  getCourseFormData,
  updateCourse,
} from "../services/coursesApi";

import type { Course, CourseFormData, Teacher } from "../types/course.types";
import type { Subject } from "../../subjects/types/subject.types";

function EditCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoadingData(true);
        setError("");

        const [courseData, formData] = await Promise.all([
          getCourse(id),
          getCourseFormData(),
        ]);

        setCourse(courseData);
        setSubjects(formData.subjects);
        setTeachers(formData.teachers);
      } catch {
        setError("Failed to load course data.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [id]);

  async function handleUpdate(data: CourseFormData) {
    if (!id) return;

    try {
      setSaveLoading(true);
      setError("");

      await updateCourse(id, data);

      navigate("/admin/courses");
    } catch {
      setError("Failed to update course.");
    } finally {
      setSaveLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading course data...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Course not found.
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
          Edit Course
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update course information, teacher, price, image, and publish status.
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
        initialValues={{
          subject: course.subject,
          teacher: course.teacher,
          title: course.title,
          description: course.description,
          price: course.price,
          is_published: course.is_published,
          image: course.image,
        }}
        submitText="Update Course"
        loading={saveLoading}
        onSubmit={handleUpdate}
      />
    </section>
  );
}

export default EditCourse;