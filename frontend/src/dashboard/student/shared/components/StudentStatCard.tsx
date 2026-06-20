type StudentStatCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

export default function StudentStatCard({
  title,
  value,
  description,
}: StudentStatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>

      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}