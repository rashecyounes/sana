import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <StudentSidebar />

      <div className="lg:pl-64">
        <StudentNavbar />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}