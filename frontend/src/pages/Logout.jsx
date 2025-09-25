import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login"); // Redirect to login page immediately
  }, [navigate]);

  return null; // No need to render anything
};

export default Logout;
