import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar />

      <div className="min-h-screen lg:ml-64">
        <AdminNavbar />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;