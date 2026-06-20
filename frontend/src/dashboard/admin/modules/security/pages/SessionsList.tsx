import { useEffect, useState } from "react";
import { RefreshCcw, Search } from "lucide-react";

import {
  deactivateAdminSession,
  getAdminSessions,
} from "../services/securityApi";

import type {
  AdminUserSession,
  SecurityFilters,
} from "../types/security.types";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function SessionsList() {
  const [sessions, setSessions] = useState<AdminUserSession[]>([]);
  const [filters, setFilters] = useState<SecurityFilters>({
    search: "",
    is_active: "",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function buildCleanFilters(currentFilters: SecurityFilters) {
    const cleanFilters: SecurityFilters = {};

    if (currentFilters.search) cleanFilters.search = currentFilters.search;
    if (currentFilters.is_active) {
      cleanFilters.is_active = currentFilters.is_active;
    }

    return cleanFilters;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchSessions() {
      try {
        const data = await getAdminSessions();

        if (isMounted) {
          setSessions(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load sessions.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchSessions();

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
      const data = await getAdminSessions(cleanFilters);

      setSessions(data);
    } catch {
      setError("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate(id: number) {
    try {
      setActionLoadingId(id);

      const result = await deactivateAdminSession(id);

      setSessions((prev) =>
        prev.map((session) =>
          session.id === id ? result.session : session
        )
      );
    } catch {
      alert("Failed to deactivate session.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Sessions Security
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor user sessions and manually deactivate suspicious sessions.
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
              placeholder="Search user, device, or IP..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400"
            />
          </div>

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
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            No sessions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Device</th>
                  <th className="px-5 py-4">IP Address</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Last Seen</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">
                        {session.user_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {session.user_email || "No email"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-700">
                        {session.device_name || "Unknown Device"}
                      </div>
                      <div className="max-w-[240px] truncate text-xs text-slate-400">
                        {session.device_identifier}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {session.ip_address || "Unknown"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          session.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {session.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(session.created_at)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(session.last_seen_at)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        disabled={
                          actionLoadingId === session.id || !session.is_active
                        }
                        onClick={() => handleDeactivate(session.id)}
                        className="rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {actionLoadingId === session.id
                          ? "Ending..."
                          : "End Session"}
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

export default SessionsList;