import { NavLink } from "react-router-dom";
import { BookOpen, LayoutDashboard, User } from "lucide-react";

const links = [
  {
    name: "Overview",
    path: "/student",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    path: "/student/my-courses",
    icon: BookOpen,
  },
  {
    name: "Profile",
    path: "/student/profile",
    icon: User,
  },
];

export default function StudentSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <h1 className="text-xl font-bold text-sky-600">X Platform</h1>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/student"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}