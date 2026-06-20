type StatusBadgeProps = {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
};

const variants = {
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-slate-100 text-slate-700",
};

function StatusBadge({ label, variant = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;