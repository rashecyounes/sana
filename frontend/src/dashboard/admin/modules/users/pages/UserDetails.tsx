import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit, UserRound } from "lucide-react";

import { getUserDetails } from "../services/usersApi";
import type { AdminUser } from "../types/user.types";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function UserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      if (!id) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getUserDetails(Number(id));

        if (isMounted) {
          setUser(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load user details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
        Loading user details...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-600">
        {error || "User not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            User Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View account information, role, and current status.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/users"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            <ArrowLeft size={18} />
            Back
          </Link>

          <Link
            to={`/admin/users/${user.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600"
          >
            <Edit size={18} />
            Edit User
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-600">
            <UserRound size={32} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              {user.full_name}
            </h2>
            <p className="text-sm text-slate-500">@{user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoItem label="User ID" value={`#${user.id}`} />
          <InfoItem label="Full Name" value={user.full_name} />
          <InfoItem label="First Name" value={user.first_name || "Not set"} />
          <InfoItem label="Last Name" value={user.last_name || "Not set"} />
          <InfoItem label="Username" value={user.username} />
          <InfoItem label="Email" value={user.email || "No email"} />
          <InfoItem label="Phone" value={user.phone || "No phone"} />
          <InfoItem label="Role" value={user.role} />
          <InfoItem
            label="Status"
            value={user.is_active ? "Active" : "Inactive"}
          />
          <InfoItem
            label="Staff"
            value={user.is_staff ? "Yes" : "No"}
          />
          <InfoItem
            label="Superuser"
            value={user.is_superuser ? "Yes" : "No"}
          />
          <InfoItem label="Created At" value={formatDate(user.created_at)} />
          <InfoItem label="Updated At" value={formatDate(user.updated_at)} />
          <InfoItem label="Bio" value={user.bio || "No bio"} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

export default UserDetails;