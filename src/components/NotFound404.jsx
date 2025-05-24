import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound404 = () => {
  const navigate = useNavigate();

  useEffect(() => {

    navigate("/login");
  }, [navigate]);

  return null;
};

export default NotFound404;
