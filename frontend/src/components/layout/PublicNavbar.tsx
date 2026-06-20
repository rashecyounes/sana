import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, UserRound, LogOut } from "lucide-react";

import api from "../../api/axios";

type User = {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  role: string;
  profile_image?: string | null;
};

function getSavedUser(): User | null {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as User;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    return null;
  }
}

function clearUserStorage() {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}

function getDashboardPath(user: User | null) {
  if (!user) return "/login";

  if (user.role === "admin") return "/admin";
  if (user.role === "teacher") return "/teacher";
  if (user.role === "student") return "/student";

  return "/";
}

function PublicNavbar() {
  const navigate = useNavigate();

  const user = getSavedUser();
  const isLoggedIn = Boolean(user);
  const dashboardPath = getDashboardPath(user);

  const displayName = user?.first_name || user?.username || "حسابي";
  const profileImage = user?.profile_image || null;

  async function handleLogout() {
    try {
      await api.post("/security/logout/");
    } catch {
      // حتى لو فشل طلب الخروج، ننظف بيانات الواجهة
    } finally {
      clearUserStorage();
      navigate("/login");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight">X Platform</h1>
            <p className="text-xs text-slate-500">
              منصة تعليمية لطلاب التوجيهي
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/subjects" className="hover:text-sky-600 transition">
            المواد
          </Link>

          <a href="/#features" className="hover:text-sky-600 transition">
            المميزات
          </a>

          <a href="/#security" className="hover:text-sky-600 transition">
            الحماية
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                to={dashboardPath}
                className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl px-3 py-2 transition"
              >
                <div className="w-9 h-9 overflow-hidden rounded-full bg-sky-500 text-white flex items-center justify-center">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={20} />
                  )}
                </div>

                <span className="hidden sm:block text-sm font-bold text-slate-700">
                  {displayName}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={17} />
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:block px-4 py-2 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                تسجيل الدخول
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-2xl text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md transition"
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default PublicNavbar;