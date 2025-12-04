// src/App.jsx
import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/layout/Header/Header";
import Home from "./component/Home/Home";
import LoginSignUp from "./component/User/LoginSignUp";
import Profile from "./component/User/Profile";
import ProjectDetails from "./component/Project/ProjectDetails";
import Projects from "./component/Project/Projects";
import BidDetails from "./component/Bid/BidDetails";
import Proposal from "./component/Project/Proposal";
import Footer from "./component/layout/Footer/Footer";
import BidSuccess from "./component/Project/BidSuccess";
import MyBids from "./component/Bid/MyBids";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./actions/userAction";
import axios from "axios";
import Loader from "./component/layout/Loader/Loader";
import UpdateProfile from "./component/User/UpdateProfile";
import AccountAnalytics from "./component/User/AccountAnalytics";

// Admin Components
import JoinAsClient from "./component/Admin/JoinAsClient";
import BidList from "./component/Admin/BidList";
import ProcessResponse from "./component/Admin/ProcessResponse";
import UsersList from "./component/Admin/UsersList";
import Payment from "./component/Admin/Payment";

// Layout & Auth
import RestrictedAccess from "./component/layout/Restricted/RestrictedAccess";
import Contact from "./component/layout/Contact/Contact";

// Set Axios to send cookies
axios.defaults.withCredentials = true;

// ──────────────────────────────────────────────────────────────
// SECURE PROTECTED ROUTE – Handles Auth + Admin Role
// ──────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="pageLoader">
        <Loader />
      </div>
    );
  }

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but not admin → go to unauthorized page
  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good → render page
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  // Load user on every mount (critical for refresh)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <Navbar />
      </header>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1d23",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: "12px",
          },
        }}
      />

      {/* Full-page loader during initial auth check */}
      {loading ? (
        <div className="initialLoader">
          <Loader />
        </div>
      ) : (
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginSignUp />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:keyword" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected User Routes */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/me/update"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proposal"
              element={
                <ProtectedRoute>
                  <Proposal />
                </ProtectedRoute>
              }
            />
            <Route path="/bid/:id" element={<BidDetails />} />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <BidSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bids"
              element={
                <ProtectedRoute>
                  <MyBids />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/earning"
              element={
                <ProtectedRoute>
                  <AccountAnalytics />
                </ProtectedRoute>
              }
            />

            {/* ADMIN ROUTES – Only for role: "admin" */}
            <Route
              path="/admin/joinasclient"
              element={
                <ProtectedRoute isAdmin={true}>
                  <JoinAsClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bids"
              element={
                <ProtectedRoute isAdmin={true}>
                  <BidList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bid/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <ProcessResponse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UsersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/user/payment/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <Payment />
                </ProtectedRoute>
              }
            />

            {/* Restricted Access Page */}
            <Route path="/unauthorized" element={<RestrictedAccess />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      )}

      <Footer />
    </>
  );
}

export default App;