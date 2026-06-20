import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { getUserDetails, updateUser } from "../services/usersApi";
import type { AdminUser, UserRole } from "../types/user.types";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [bio, setBio] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setRole(data.role);
          setBio(data.bio || "");
          setIsActive(data.is_active);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load user.");
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setError("User ID is missing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await updateUser(Number(id), {
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || null,
        role,
        bio: bio || null,
        is_active: isActive,
      });

      navigate(`/admin/users/${id}`);
    } catch {
      setError("Failed to update user.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
        Loading user...
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm font-bold text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Edit User
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update user information, role, and account status.
          </p>
        </div>

        <Link
          to={id ? `/admin/users/${id}` : "/admin/users"}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Phone
            </label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Role
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Account Status
            </label>
            <select
              value={isActive ? "true" : "false"}
              onChange={(event) => setIsActive(event.target.value === "true")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60"
        >
          <Save size={18} />
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditUser;