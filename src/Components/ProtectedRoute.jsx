// ProtectedRoute.jsx
import { useAuth } from "../Context/UserContext.jsx";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [user] = useAuth();

  // If not logged in, redirect to home
  if (!user) return <Navigate to="/" />;

  // Normalize role to lowercase for comparison
  const userRole = user.role.toLowerCase();

  // If role is specified and user is not admin, check role
  if (role && userRole !== "admin" && userRole !== role.toLowerCase()) {
    return <Navigate to="/" />; // Redirect unauthorized users
  }

  // Admin can access any route
  return children;
};

export default ProtectedRoute;