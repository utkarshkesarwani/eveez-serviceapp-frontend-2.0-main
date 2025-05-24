import React from "react";
import { useAuth } from "../hooks/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userRole } = useAuth();
  if (!allowedRoles.includes(userRole)) {
    return (
      <div className="w-full flex justify-center items-center h-40">
        <span className="text-3xl">UnAuthorized User</span>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
