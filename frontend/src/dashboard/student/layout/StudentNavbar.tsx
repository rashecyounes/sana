import { Link } from "react-router-dom";

export default function StudentNavbar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-slate-500">Student Dashboard</p>
          <h2 className="text-lg font-semibold text-slate-900">
            Welcome back{user?.username ? `, ${user.username}` : ""}
          </h2>
        </div>

        <Link
          to="/"
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Home
        </Link>
      </div>
    </header>
  );
}