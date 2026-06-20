import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../../../shared/components/SearchBar";
import ConfirmModal from "../../../shared/components/ConfirmModal";
import SubjectsTable from "../components/SubjectsTable";
import { deleteSubject, getSubjects } from "../services/subjectsApi";
import type { Subject } from "../types/subject.types";

function SubjectsList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function loadSubjects(searchValue = "") {
    try {
      setLoading(true);
      setError("");

      const data = await getSubjects(searchValue);
      setSubjects(data);
    } catch {
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedSubject) return;

    try {
      setDeleteLoading(true);
      await deleteSubject(selectedSubject.slug);
      setSelectedSubject(null);
      await loadSubjects(search);
    } catch {
      setError("Failed to delete subject.");
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadSubjects(search);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Subjects Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, update, search, and manage platform subjects.
          </p>
        </div>

        <Link
          to="/admin/subjects/create"
          className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Create Subject
        </Link>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search subjects..."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Loading subjects...
        </div>
      ) : (
        <SubjectsTable subjects={subjects} onDelete={setSelectedSubject} />
      )}

      <ConfirmModal
        open={selectedSubject !== null}
        title="Delete subject"
        description={`Are you sure you want to delete "${selectedSubject?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteLoading}
        onCancel={() => setSelectedSubject(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}

export default SubjectsList;