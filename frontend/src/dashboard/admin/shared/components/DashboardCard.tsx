type DashboardCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h3 className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </h3>

      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}

export default DashboardCard;