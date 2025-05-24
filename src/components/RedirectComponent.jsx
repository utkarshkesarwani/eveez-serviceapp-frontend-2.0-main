import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const RedirectComponent = () => {
  const { userRole, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (["Manager", "Admin"].includes(userRole)) {
          navigate("/home/overview", { replace: true });
        } else {
          navigate("/service/requests", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default RedirectComponent;
