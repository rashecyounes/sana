type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
}