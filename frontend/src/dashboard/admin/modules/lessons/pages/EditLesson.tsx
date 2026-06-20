import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import LessonForm from "../components/LessonForm";
import {
  getLesson,
  getLessonFormData,
  updateLesson,
} from "../services/lessonsApi";
import type { Course } from "../../courses/types/course.types";
import type { Lesson, LessonFormData } from "../types/lesson.types";

function EditLesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoadingData(true);
        setError("");

        const [lessonData, formData] = await Promise.all([
          getLesson(id),
          getLessonFormData(),
        ]);

        setLesson(lessonData);
        setCourses(formData.courses);
      } catch {
        setError("Failed to load lesson data.");
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [id]);

  async function handleUpdate(data: LessonFormData) {
    if (!id) return;

    try {
      setSaveLoading(true);
      setError("");

      await updateLesson(id, data);

      navigate(`/admin/lessons?course=${data.course}`);
    } catch {
      setError("Failed to update lesson.");
    } finally {
      setSaveLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading lesson data...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Lesson not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={`/admin/lessons?course=${lesson.course}`}
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to lessons
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Edit Lesson
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update lesson details. Video is managed separately from Video
          Management.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <LessonForm
        courses={courses}
        initialValues={{
          course: lesson.course,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          duration: lesson.duration,
          is_preview: lesson.is_preview,
          is_published: lesson.is_published,
          thumbnail: lesson.thumbnail,
        }}
        submitText="Update Lesson"
        loading={saveLoading}
        onSubmit={handleUpdate}
      />
    </section>
  );
}

export default EditLesson;