import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminid"); // Check if adminid exists in localStorage

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
