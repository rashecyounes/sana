import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import SubjectForm from "../components/SubjectForm";
import { getSubject, updateSubject } from "../services/subjectsApi";
import type { Subject, SubjectFormData } from "../types/subject.types";

function EditSubject() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubject() {
      if (!slug) return;

      try {
        setLoading(true);
        setError("");

        const data = await getSubject(slug);
        setSubject(data);
      } catch {
        setError("Failed to load subject.");
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
  }, [slug]);

  async function handleUpdate(data: SubjectFormData) {
    if (!slug) return;

    try {
      setSaveLoading(true);
      setError("");

      await updateSubject(slug, data);

      navigate("/admin/subjects");
    } catch {
      setError("Failed to update subject.");
    } finally {
      setSaveLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading subject...
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Subject not found.
      </div>
    );
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
          Edit Subject
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update subject name and image.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <SubjectForm
        initialValues={{
          name: subject.name,
          image: subject.image,
        }}
        submitText="Update Subject"
        loading={saveLoading}
        onSubmit={handleUpdate}
      />
    </section>
  );
}

export default EditSubject;