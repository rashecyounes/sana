import { Link } from "react-router-dom";

function TeacherNavbar() {
  const username = localStorage.getItem("username") || "Teacher";

  return (
    <header className="h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            Teacher Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Manage your courses, lessons, videos, and profile.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{username}</p>
            <p className="text-xs text-slate-500">Teacher</p>
          </div>

          <Link
            to="/"
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Home
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TeacherNavbar;