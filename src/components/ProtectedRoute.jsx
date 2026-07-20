import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const {
    user,
    isAdmin,
    loading,
  } = useUserRole();

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          fontFamily: "Arial",
        }}
      >
        Loading...
      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ADMIN-ONLY PAGE
  if (
    adminOnly &&
    !isAdmin
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;