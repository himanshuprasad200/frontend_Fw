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
import Loader from "./component/layout/Loader/Loader"; // Optional: create a small spinner
import UpdateProfile from "./component/User/UpdateProfile";
import AccountAnalytics from "./component/User/AccountAnalytics";
import JoinAsClient from "./component/Admin/JoinAsClient";
import BidList from "./component/Admin/BidList";
import ProcessResponse from "./component/Admin/ProcessResponse";
import UsersList from "./component/Admin/UsersList";
import Payment from "./component/Admin/Payment";

// Set Axios to send cookies with every request (Critical for session auth)
axios.defaults.withCredentials = true;

// Protected Route with proper loading handling
const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  // While checking authentication on app load
  if (loading) {
    return (
      <div className="pageLoader">
        <Loader />
      </div>
    );
  }

  // If not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  // Load user on every app mount (including page refresh)
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
          },
        }}
      />

      {/* Optional: Full-page loader while initial auth check */}
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

            {/* Protected Routes */}
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

            {/* Protected and Admin routes */}
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

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      )}

      <Footer />
    </>
  );
}

export default App;
