import { useEffect, useState } from "react";

import LoadingState from "../../../shared/components/LoadingState";
import StudentProfileForm from "../components/StudentProfileForm";
import {
  getStudentProfile,
  updateStudentProfile,
} from "../services/studentProfileApi";
import type { StudentProfile as StudentProfileType } from "../types/studentProfile.types";

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getStudentProfile();

        if (isMounted) {
          setProfile(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleUpdateProfile(data: FormData) {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatedProfile = await updateStudentProfile(data);
      setProfile(updatedProfile);
      setSuccessMessage("Profile updated successfully.");

      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            username: updatedProfile.username,
            email: updatedProfile.email,
            first_name: updatedProfile.first_name,
            last_name: updatedProfile.last_name,
            profile_image: updatedProfile.profile_image_url,
          })
        );
      }
    } catch {
      setError("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (error && !profile) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-700">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-700">
        Profile data not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <StudentProfileForm
        profile={profile}
        onSubmit={handleUpdateProfile}
        isSaving={isSaving}
      />
    </div>
  );
}