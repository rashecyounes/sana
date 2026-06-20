import { useEffect, useState } from "react";
import { RefreshCcw, Search, Plus } from "lucide-react";

import {
  getEnrollments,
  toggleEnrollmentActive,
} from "../services/enrollmentsApi";

import type {
  Enrollment,
  EnrollmentFilters,
} from "../types/enrollment.types";

import { Link } from "react-router-dom";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getSourceStyle(source: string) {
  if (source === "purchase") return "bg-emerald-100 text-emerald-700";
  if (source === "access_code") return "bg-sky-100 text-sky-700";
  if (source === "admin_grant") return "bg-purple-100 text-purple-700";
  if (source === "free") return "bg-slate-100 text-slate-700";

  return "bg-slate-100 text-slate-700";
}

function EnrollmentsList() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filters, setFilters] = useState<EnrollmentFilters>({
    search: "",
    source: "",
    is_active: "",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function buildCleanFilters(currentFilters: EnrollmentFilters) {
    const cleanFilters: EnrollmentFilters = {};

    if (currentFilters.search) cleanFilters.search = currentFilters.search;
    if (currentFilters.source) cleanFilters.source = currentFilters.source;
    if (currentFilters.is_active) {
      cleanFilters.is_active = currentFilters.is_active;
    }

    return cleanFilters;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchEnrollments() {
      try {
        const data = await getEnrollments();

        if (isMounted) {
          setEnrollments(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load enrollments.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchEnrollments();

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
      const data = await getEnrollments(cleanFilters);

      setEnrollments(data);
    } catch {
      setError("Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id: number) {
    try {
      setActionLoadingId(id);

      const result = await toggleEnrollmentActive(id);

      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment.id === id ? result.enrollment : enrollment
        )
      );
    } catch {
      alert("Failed to update enrollment status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Enrollments Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student course access, enrollment sources, and active access
            status.
          </p>
        </div>

        <Link
          to="/admin/enrollments/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600"
        >
          <Plus size={18} />
          Create Enrollment
        </Link>
      </div>
      <form
        onSubmit={handleSearch}
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  search: event.target.value,
                }))
              }
              placeholder="Search by student or course..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <select
            value={filters.source}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                source: event.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          >
            <option value="">All sources</option>
            <option value="purchase">Purchase</option>
            <option value="access_code">Access Code</option>
            <option value="admin_grant">Admin Grant</option>
            <option value="free">Free</option>
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
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <RefreshCcw size={17} />
            Apply Filters
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
            Loading enrollments...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            No enrollments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Source</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created At</th>
                  <th className="px-5 py-4">Updated At</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-black text-slate-900">
                      #{enrollment.id}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">
                        {enrollment.student_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {enrollment.student_email || "No email"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {enrollment.course_title}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getSourceStyle(
                          enrollment.source
                        )}`}
                      >
                        {enrollment.source_display}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          enrollment.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {enrollment.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(enrollment.created_at)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(enrollment.updated_at)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={actionLoadingId === enrollment.id}
                        onClick={() => handleToggleActive(enrollment.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-60 ${
                          enrollment.is_active
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {actionLoadingId === enrollment.id
                          ? "Updating..."
                          : enrollment.is_active
                          ? "Deactivate"
                          : "Reactivate"}
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

export default EnrollmentsList;