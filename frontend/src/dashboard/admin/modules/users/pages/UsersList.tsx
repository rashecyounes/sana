import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, RefreshCcw, Search } from "lucide-react";

import { getUsers, toggleUserActive } from "../services/usersApi";
import type { AdminUser, UserFilters } from "../types/user.types";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getRoleStyle(role: string) {
  if (role === "admin") return "bg-purple-100 text-purple-700";
  if (role === "teacher") return "bg-sky-100 text-sky-700";
  return "bg-slate-100 text-slate-700";
}

function UsersList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    is_active: "",
  });

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function buildCleanFilters(currentFilters: UserFilters) {
    const cleanFilters: UserFilters = {};

    if (currentFilters.search) cleanFilters.search = currentFilters.search;
    if (currentFilters.role) cleanFilters.role = currentFilters.role;
    if (currentFilters.is_active) {
      cleanFilters.is_active = currentFilters.is_active;
    }

    return cleanFilters;
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        const data = await getUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load users.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

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
      const data = await getUsers(cleanFilters);

      setUsers(data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleActive(id: number) {
    try {
      setActionLoadingId(id);

      const result = await toggleUserActive(id);

      setUsers((prev) =>
        prev.map((user) => (user.id === id ? result.user : user))
      );
    } catch {
      alert("Failed to update user status.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Users Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage students, teachers, admins, roles, and account status.
        </p>
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
              placeholder="Search by name, username, email, or phone..."
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <select
            value={filters.role}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                role: event.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
          >
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
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
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">
                        {user.full_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {user.email || "No email"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      @{user.username}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {user.phone || "No phone"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          user.is_active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                        >
                          <Eye size={15} />
                          View
                        </Link>

                        <button
                          type="button"
                          disabled={actionLoadingId === user.id}
                          onClick={() => handleToggleActive(user.id)}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-60 ${
                            user.is_active
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {actionLoadingId === user.id
                            ? "Updating..."
                            : user.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
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

export default UsersList;