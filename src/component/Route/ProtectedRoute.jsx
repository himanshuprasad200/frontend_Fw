import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ isAdminRoute }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const storedAuthState = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated && storedAuthState) {
      // Simulate a successful authentication check
      setAuthChecked(true);
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated]);

  if (loading || !authChecked) {
    // Optionally, you can render a loading spinner or a placeholder
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && localStorage.getItem("isAuthenticated") !== "true") {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && user?.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;