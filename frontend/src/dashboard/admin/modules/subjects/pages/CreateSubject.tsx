import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SubjectForm from "../components/SubjectForm";
import { createSubject } from "../services/subjectsApi";
import type { SubjectFormData } from "../types/subject.types";

function CreateSubject() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(data: SubjectFormData) {
    try {
      setLoading(true);
      setError("");

      await createSubject(data);

      navigate("/admin/subjects");
    } catch {
      setError("Failed to create subject.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <Link
          to="/admin/subjects"
          className="text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          ← Back to subjects
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Create Subject
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a new educational subject to the platform.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <SubjectForm
        submitText="Create Subject"
        loading={loading}
        onSubmit={handleCreate}
      />
    </section>
  );
}

export default CreateSubject;