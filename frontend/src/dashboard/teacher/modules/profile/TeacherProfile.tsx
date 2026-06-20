import { useEffect, useState } from "react";

import api from "../../../../api/axios";

type TeacherProfileData = {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  profile_image: string | null;
  profile_image_url: string | null;
  bio: string | null;
  city: string | null;
  school_name: string | null;
};

function TeacherProfile() {
  const [profile, setProfile] = useState<TeacherProfileData | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  function updateLocalUser(data: TeacherProfileData) {
    const currentRaw = localStorage.getItem("user");

    let currentUser: Record<string, unknown>;

    try {
      currentUser = currentRaw ? JSON.parse(currentRaw) : {};
    } catch {
      currentUser = {};
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...currentUser,
        id: data.id,
        username: data.username,
        email: data.email,
        phone: data.phone,
        first_name: data.first_name,
        last_name: data.last_name,
        role: "teacher",
        profile_image: data.profile_image_url,
      })
    );

    localStorage.setItem("username", data.username);
    localStorage.setItem("role", "teacher");
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<TeacherProfileData>(
          "/teacher-dashboard/profile/"
        );

        if (isMounted) {
          const data = response.data;

          setProfile(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setBio(data.bio || "");
          setCity(data.city || "");
          setSchoolName(data.school_name || "");

          updateLocalUser(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load profile.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaveLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("bio", bio);
      formData.append("city", city);
      formData.append("school_name", schoolName);

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await api.patch<TeacherProfileData>(
        "/teacher-dashboard/profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(response.data);
      updateLocalUser(response.data);
      setProfileImage(null);
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setPasswordLoading(true);
      setPasswordError("");
      setPasswordSuccess("");

      await api.post("/teacher-dashboard/profile/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password changed successfully.");
    } catch {
      setPasswordError("Failed to change password. Check your old password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Profile not found.
      </div>
    );
  }

  const imageUrl = profile.profile_image_url;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your teacher account information and password.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={profile.username}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-sky-100 text-3xl font-black text-sky-600">
                  {profile.first_name?.[0] || profile.username[0]}
                </div>
              )}

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {profile.first_name} {profile.last_name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                @{profile.username}
              </p>

              <span className="mt-4 rounded-full bg-sky-100 px-4 py-2 text-xs font-bold text-sky-700">
                Teacher Account
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          <form
            onSubmit={handleProfileSubmit}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your visible teacher information.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  City
                </label>
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  School Name
                </label>
                <input
                  value={schoolName}
                  onChange={(event) => setSchoolName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setProfileImage(event.target.files?.[0] || null)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
              {saveLoading ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your account password securely.
              </p>
            </div>

            {passwordError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Old Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(event) => setOldPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default TeacherProfile;