import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

function RoleRoute({ children, allowedRoles }) {
  const { profile } = useAuth();

  if (!profile) return null;

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/sales" replace />;
  }

  return children;
}

export default RoleRoute;