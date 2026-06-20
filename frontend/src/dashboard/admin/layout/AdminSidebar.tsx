import { NavLink } from "react-router-dom";

type SidebarLink = {
  label: string;
  path: string;
};

const links: SidebarLink[] = [
  { label: "Overview", path: "/admin" },
  { label: "Users", path: "/admin/users" },
  { label: "Subjects", path: "/admin/subjects" },
  { label: "Courses", path: "/admin/courses" },
  { label: "Lessons", path: "/admin/lessons" },
  { label: "Videos", path: "/admin/videos" },
  { label: "Access Codes", path: "/admin/access-codes" },
  { label: "Purchases", path: "/admin/purchases" },
  { label: "Enrollments", path: "/admin/enrollments" },
  { label: "Security", path: "/admin/security" },
];

function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-xl font-bold text-sky-600">X Platform</h1>
      </div>

      <nav className="space-y-1 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              [
                "block rounded-xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-sky-100 text-sky-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default AdminSidebar;