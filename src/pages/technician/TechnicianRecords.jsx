import React from "react";
import AllTechnicianList from "../../components/technician/AllTechnicianList";
import { useAuth } from "../../hooks/AuthProvider";
import TechnicianStats from "../../components/technician/TechnicianStats";

const TechnicianRecords = () => {
  const { userRole } = useAuth();
  if (userRole === "Technician") {
    return <TechnicianStats />;
  }
  return <AllTechnicianList />;
};

export default TechnicianRecords;
