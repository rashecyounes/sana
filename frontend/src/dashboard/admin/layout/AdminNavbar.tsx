import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Admin";
  const role = localStorage.getItem("role") || "admin";

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Admin Dashboard
        </h2>
        <p className="text-xs text-slate-500">
          Manage platform content, users, security, and courses.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{username}</p>
          <p className="text-xs capitalize text-slate-500">{role}</p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;