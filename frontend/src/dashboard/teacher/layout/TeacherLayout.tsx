import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";

function TeacherLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <TeacherSidebar />

      <div className="min-h-screen lg:pl-64">
        <TeacherNavbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default TeacherLayout;