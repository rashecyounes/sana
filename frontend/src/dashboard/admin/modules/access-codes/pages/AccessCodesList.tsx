import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCcw, Search } from "lucide-react";

import api from "../../../../../api/axios";

import {
  getAccessCodes,
  toggleAccessCodeActive,
} from "../services/accessCodesApi";

import type {
  AccessCode,
  AccessCodeFilters,
} from "../types/accessCode.types";

type CourseOption = {
  id: number;
  title: string;
};

function formatDate(value: string | null) {
  if (!value) return "غير محدد";

  return new Date(value).toLocaleString("ar-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function AccessCodesList() {
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);

  const [filters, setFilters] = useState<AccessCodeFilters>({
    search: "",
    is_used: "",
    is_active: "",
    course: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function buildCleanFilters(currentFilters: AccessCodeFilters) {
    const cleanFilters: AccessCodeFilters = {};

    if (currentFilters.search) {
      cleanFilters.search = currentFilters.search;
    }

    if (currentFilters.is_used) {
      cleanFilters.is_used = currentFilters.is_used;
    }

    if (currentFilters.is_active) {
      cleanFilters.is_active = currentFilters.is_active;
    }

    if (currentFilters.course) {
      cleanFilters.course = currentFilters.course;
    }

    return cleanFilters;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      try {
        const [codesData, coursesResponse] = await Promise.all([
          getAccessCodes(),
          api.get<CourseOption[]>("/courses/"),
        ]);

        if (isMounted) {
          setAccessCodes(codesData);
          setCourses(coursesResponse.data);
        }
      } catch {
        if (isMounted) {
          setError("حدث خطأ أثناء تحميل رموز الوصول.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingCourses(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const cleanFilters = buildCleanFilters(filters);
      const data = await getAccessCodes(cleanFilters);

      setAccessCodes(data);
    } catch {
      setError("حدث خطأ أثناء تحميل رموز الوصول.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id: number) {
    try {
      setActionLoadingId(id);

      const result = await toggleAccessCodeActive(id);

      setAccessCodes((prev) =>
        prev.map((code) => (code.id === id ? result.access_code : code))
      );
    } catch {
      alert("حدث خطأ أثناء تغيير حالة الرمز.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            إدارة رموز الوصول
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            عرض رموز الوصول، معرفة المستخدمين الذين استخدموها، وتفعيل أو تعطيل
            الرموز.
          </p>
        </div>

        <Link
          to="/admin/access-codes/generate"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600"
        >
          <Plus size={18} />
          توليد رموز جديدة
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
              placeholder="ابحث عن الرمز..."
              className="w-full rounded-2xl border border-slate-200 py-3 pr-10 pl-4 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <select
            value={filters.course}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                course: event.target.value,
              }))
            }
            disabled={loadingCourses}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 disabled:bg-slate-100"
          >
            <option value="">
              {loadingCourses ? "جاري تحميل الكورسات..." : "كل الكورسات"}
            </option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>

          <select
            value={filters.is_used}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                is_used: event.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          >
            <option value="">كل حالات الاستخدام</option>
            <option value="true">مستخدم</option>
            <option value="false">غير مستخدم</option>
          </select>

          <select
            value={filters.is_active}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                is_active: event.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          >
            <option value="">كل حالات التفعيل</option>
            <option value="true">فعال</option>
            <option value="false">معطل</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <RefreshCcw size={17} />
            تطبيق الفلترة
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            جاري تحميل رموز الوصول...
          </div>
        ) : accessCodes.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            لا توجد رموز وصول حاليًا.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-right text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">الرمز</th>
                  <th className="px-5 py-4">الكورس</th>
                  <th className="px-5 py-4">الاستخدام</th>
                  <th className="px-5 py-4">الحالة</th>
                  <th className="px-5 py-4">استخدمه</th>
                  <th className="px-5 py-4">تاريخ الاستخدام</th>
                  <th className="px-5 py-4">تاريخ الانتهاء</th>
                  <th className="px-5 py-4">إجراء</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {accessCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-black text-slate-900">
                      {code.code}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {code.course_title}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          code.is_used
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {code.is_used ? "مستخدم" : "غير مستخدم"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          code.is_active
                            ? "bg-sky-100 text-sky-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {code.is_active ? "فعال" : "معطل"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {code.used_by_name || "لم يستخدم"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(code.used_at)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(code.expires_at)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={actionLoadingId === code.id}
                        onClick={() => handleToggleActive(code.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-60 ${
                          code.is_active
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {actionLoadingId === code.id
                          ? "جاري..."
                          : code.is_active
                          ? "تعطيل"
                          : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccessCodesList;