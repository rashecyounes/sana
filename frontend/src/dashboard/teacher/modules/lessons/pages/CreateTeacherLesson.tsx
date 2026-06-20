import { useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import LessonForm from "../../../../admin/modules/lessons/components/LessonForm";

import {
  createTeacherLesson,
  getTeacherLessonFormData,
} from "../services/teacherLessonsApi";

import type { Course } from "../../courses/types/teacherCourse.types";

import type { LessonFormData } from "../types/teacherLesson.types";

function CreateTeacherLesson() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const courseIdFromUrl =
    searchParams.get("course");

  const [courses, setCourses] = useState<
    Course[]
  >([]);

  const [loadingData, setLoadingData] =
    useState(true);

  const [saveLoading, setSaveLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFormData() {
      try {
        setLoadingData(true);

        setError("");

        const data =
          await getTeacherLessonFormData();

        setCourses(data.courses);
      } catch {
        setError(
          "Failed to load lesson form data."
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadFormData();
  }, []);

  async function handleCreate(
    data: LessonFormData
  ) {
    try {
      setSaveLoading(true);

      setError("");

      await createTeacherLesson(data);

      navigate(
        courseIdFromUrl
          ? `/teacher/lessons?course=${courseIdFromUrl}`
          : "/teacher/lessons"
      );
    } catch {
      setError("Failed to create lesson.");
    } finally {
      setSaveLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading lesson form...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to={
            courseIdFromUrl
              ? `/teacher/lessons?course=${courseIdFromUrl}`
              : "/teacher/lessons"
          }
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to lessons
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create Lesson
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a lesson for your course.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <LessonForm
        courses={courses}
        initialValues={
          courseIdFromUrl
            ? {
                course:
                  Number(courseIdFromUrl),

                title: "",

                description: "",

                order: 1,

                duration: "",

                is_preview: false,

                is_published: false,
              }
            : undefined
        }
        submitText="Create Lesson"
        loading={saveLoading}
        onSubmit={handleCreate}
      />
    </section>
  );
}

export default CreateTeacherLesson;