import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, RefreshCcw, Search } from "lucide-react";

import { getPurchases } from "../services/purchasesApi";
import type { Purchase, PurchaseFilters } from "../types/purchase.types";

function formatDate(value: string | null) {
  if (!value) return "Not completed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusStyle(status: string) {
  if (status === "completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "pending") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "failed" || status === "cancelled") {
    return "bg-red-100 text-red-700";
  }

  if (status === "refunded") {
    return "bg-slate-100 text-slate-700";
  }

  return "bg-slate-100 text-slate-700";
}

function PurchasesList() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filters, setFilters] = useState<PurchaseFilters>({
    search: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function buildCleanFilters(currentFilters: PurchaseFilters) {
    const cleanFilters: PurchaseFilters = {};

    if (currentFilters.search) {
      cleanFilters.search = currentFilters.search;
    }

    if (currentFilters.status) {
      cleanFilters.status = currentFilters.status;
    }

    return cleanFilters;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchPurchases() {
      try {
        const data = await getPurchases();

        if (isMounted) {
          setPurchases(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load purchases.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPurchases();

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
      const data = await getPurchases(cleanFilters);

      setPurchases(data);
    } catch {
      setError("Failed to load purchases.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Purchases Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor course purchases, payment status, students, and related
          courses.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                status: event.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
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
            Loading purchases...
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            No purchases found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Course</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Completed At</th>
                  <th className="px-5 py-4">Created At</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-black text-slate-900">
                      #{purchase.id}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">
                        {purchase.student_name || `Student #${purchase.student}`}
                      </div>
                      <div className="text-xs text-slate-500">
                        {purchase.student_email || "No email"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {purchase.course_title || `Course #${purchase.course}`}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      {purchase.amount} JOD
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          purchase.status
                        )}`}
                      >
                        {purchase.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {purchase.provider || "internal"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(purchase.completed_at)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(purchase.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/purchases/${purchase.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                      >
                        <Eye size={15} />
                        View
                      </Link>
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

export default PurchasesList;