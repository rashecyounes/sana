import { Link } from "react-router-dom";
import DataTable from "../../../shared/components/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge";
import type { Subject } from "../types/subject.types";

type SubjectsTableProps = {
  subjects: Subject[];
  onDelete: (subject: Subject) => void;
};

function SubjectsTable({ subjects, onDelete }: SubjectsTableProps) {
  return (
    <DataTable
      data={subjects}
      emptyTitle="No subjects found"
      emptyDescription="Create your first subject to start organizing courses."
      columns={[
        {
          header: "Image",
          render: (subject) =>
            subject.image ? (
              <img
                src={subject.image}
                alt={subject.name}
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-500">
                No image
              </div>
            ),
        },
        {
          header: "Name",
          render: (subject) => (
            <div>
              <p className="font-semibold text-slate-900">{subject.name}</p>
              <p className="text-xs text-slate-500">{subject.slug}</p>
            </div>
          ),
        },
        {
          header: "Status",
          render: () => <StatusBadge label="Active" variant="success" />,
        },
        {
          header: "Created At",
          render: (subject) =>
            new Date(subject.created_at).toLocaleDateString(),
        },
        {
          header: "Actions",
          render: (subject) => (
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/subjects/${subject.slug}/edit`}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={() => onDelete(subject)}
                className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}

export default SubjectsTable;