import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type UserRole = "student" | "teacher" | "admin";

type SavedUser = {
  role?: UserRole;
};

type Props = {
  children: ReactNode;
  requiredRole?: UserRole;
};

function ProtectedRoute({ children, requiredRole }: Props) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  let parsedUser: SavedUser;

  try {
    parsedUser = JSON.parse(savedUser) as SavedUser;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    return <Navigate to="/login" replace />;
  }

  const role =
    parsedUser.role ||
    (localStorage.getItem("role") as UserRole | null);

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;