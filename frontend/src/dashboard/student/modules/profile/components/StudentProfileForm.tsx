import { useState } from "react";
import type { StudentProfile } from "../types/studentProfile.types";

type StudentProfileFormProps = {
  profile: StudentProfile;
  onSubmit: (data: FormData) => Promise<void>;
  isSaving: boolean;
};

export default function StudentProfileForm({
  profile,
  onSubmit,
  isSaving,
}: StudentProfileFormProps) {
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [username, setUsername] = useState(profile.username || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("bio", bio);

    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100 ring-4 ring-sky-100">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-sky-600">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setProfileImage(event.target.files?.[0] || null)
            }
            className="mt-2 block text-sm text-slate-600"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            First Name
          </label>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Last Name
          </label>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Username
          </label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">
            Phone
          </label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}