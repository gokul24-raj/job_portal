import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";

interface Props {
  roles?: Role[];
  children: React.ReactNode;
}

export function RoleGuard({ roles, children }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    const fallback =
      user.role === "student" ? "/jobs" : user.role === "employer" ? "/employer" : "/admin";
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
