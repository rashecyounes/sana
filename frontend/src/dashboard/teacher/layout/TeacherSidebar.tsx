import { NavLink } from "react-router-dom";

const links = [
  { label: "Overview", path: "/teacher" },
  { label: "My Courses", path: "/teacher/courses" },
  { label: "Lessons", path: "/teacher/lessons" },
  { label: "Videos", path: "/teacher/videos" },
  { label: "Profile", path: "/teacher/profile" },
];

function TeacherSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-xl font-bold text-sky-600">X Platform</h1>
      </div>

      <nav className="space-y-3 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/teacher"}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-sky-100 text-sky-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default TeacherSidebar;