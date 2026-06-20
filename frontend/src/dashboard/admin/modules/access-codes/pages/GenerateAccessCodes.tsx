import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Copy, KeyRound } from "lucide-react";

import api from "../../../../../api/axios";
import { generateAccessCodes } from "../services/accessCodesApi";
import type { AccessCode } from "../types/accessCode.types";

type CourseOption = {
  id: number;
  title: string;
};

function GenerateAccessCodes() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [courseId, setCourseId] = useState("");
  const [count, setCount] = useState(10);
  const [expiresAt, setExpiresAt] = useState("");

  const [generatedCodes, setGeneratedCodes] = useState<AccessCode[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCourses() {
      try {
        const response = await api.get<CourseOption[]>("/courses/");

        if (isMounted) {
          setCourses(response.data);
        }
      } catch {
        if (isMounted) {
          setError("حدث خطأ أثناء تحميل الكورسات.");
        }
      } finally {
        if (isMounted) {
          setLoadingCourses(false);
        }
      }
    }

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!courseId) {
      setError("اختر الكورس أولًا.");
      return;
    }

    if (count < 1 || count > 500) {
      setError("عدد الرموز يجب أن يكون بين 1 و 500.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");
      setGeneratedCodes([]);

      const result = await generateAccessCodes({
        course_id: Number(courseId),
        count,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });

      setGeneratedCodes(result.codes);
      setSuccessMessage(result.message);
    } catch {
      setError("حدث خطأ أثناء توليد رموز الوصول.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyAll() {
    const text = generatedCodes.map((item) => item.code).join("\n");

    await navigator.clipboard.writeText(text);
    alert("تم نسخ جميع الرموز.");
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            توليد رموز وصول جديدة
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            اختر الكورس وعدد الرموز، ويمكنك تحديد تاريخ انتهاء اختياري.
          </p>
        </div>

        <Link
          to="/admin/access-codes"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowRight size={18} />
          الرجوع للرموز
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              الكورس
            </label>

            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              disabled={loadingCourses}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              <option value="">
                {loadingCourses ? "جاري تحميل الكورسات..." : "اختر الكورس"}
              </option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              عدد الرموز
            </label>

            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              تاريخ الانتهاء اختياري
            </label>

            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60"
        >
          <KeyRound size={18} />
          {submitting ? "جاري التوليد..." : "توليد الرموز"}
        </button>
      </form>

      {generatedCodes.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-900">
              الرموز التي تم توليدها
            </h2>

            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
            >
              <Copy size={16} />
              نسخ الكل
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {generatedCodes.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center font-black tracking-widest text-slate-900"
              >
                {item.code}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateAccessCodes;