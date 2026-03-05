import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Spinner from "../../components/ui/Spinner";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner fullscreen />;

  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;