// src/component/route/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();

  // Show loader while checking auth (loadUser is running)
  if (loading) {
    return (
      <div className="pageLoader">
        <Loader />
      </div>
    );
  }

  // Not logged in → go to login (preserve intended path)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin route but not admin → go to restricted page
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good → render the page
  return children;
};

export default ProtectedRoute;