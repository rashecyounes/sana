import EmptyState from "./EmptyState";

type DataTableColumn<T> = {
  header: string;
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyTitle?: string;
  emptyDescription?: string;
};

function DataTable<T>({
  columns,
  data,
  emptyTitle = "No data found",
  emptyDescription = "There are no records to display right now.",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-3 font-semibold">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <tr key={index} className="transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.header} className="px-4 py-4 text-slate-700">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;