// src/App.jsx
import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { CustomToaster, toast } from "./utils/CustomToast";
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
import UpdatePassword from "./component/User/UpdatePassword";
import AccountAnalytics from "./component/User/AccountAnalytics";
import PublicEarning from "./component/User/PublicEarning";
import Chat from "./component/Chat/Chat";

// Admin Components
import JoinAsClient from "./component/Admin/JoinAsClient";
import BidList from "./component/Admin/BidList";
import ProcessResponse from "./component/Admin/ProcessResponse";
import UsersList from "./component/Admin/UsersList";
import Payment from "./component/Admin/Payment";

// Layout & Auth
import RestrictedAccess from "./component/layout/Restricted/RestrictedAccess";
import Contact from "./component/layout/Contact/Contact";
import HelpCenter from "./component/layout/HelpCentre/HelpCentre";

import ScrollToTop from "./utils/ScrollToTop";
import NewProject from "./component/Admin/NewProject";
import ProjectList from "./component/Admin/ProjectList";
import UpdateUser from "./component/Admin/UpdateUser";
import UpdateProject from "./component/Admin/UpdateProject";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Success from "./component/layout/Success/Success";

// Set Axios to send cookies
axios.defaults.withCredentials = true;

// removed toast import from hot-toast
import io from "socket.io-client";
import { FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

  // Admin route but not admin or superadmin → go to unauthorized page
  if (isAdmin && user?.role !== "admin" && user?.role !== "superadmin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // All good → render page
  return children;
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // Real-time notification socket
  useEffect(() => {
    if (isAuthenticated && user) {
      const socketUrl = window.location.hostname === "localhost"
        ? "https://backend-i86g.onrender.com"
        : axios.defaults.baseURL || window.location.origin;

      const socket = io(socketUrl, { withCredentials: true });

      socket.emit("add_user", user._id);

      socket.on("new_notification", (data) => {
        // Dispatch to update header bell icon
        window.dispatchEvent(new CustomEvent("new_notification", { detail: data }));

        // Prevent showing notification if already in the chat room
        if (window.location.pathname.includes(data.sender)) return;

        toast((t) => (
          <div
            onClick={() => {
              navigate(`/chat/${data.sender}`);
              toast.dismiss(t.id);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "5px"
            }}
          >
            <div style={{ backgroundColor: "#00a884", borderRadius: "50%", padding: "8px", color: "white", display: "flex" }}>
              <FaComments />
            </div>
            <div>
              <strong style={{ display: "block", color: "#f7bc0b" }}>{data.senderName}</strong>
              <span style={{ fontSize: "12px", color: "#ccc" }}>{data.text.slice(0, 30)}...</span>
            </div>
          </div>
        ), {
          duration: 6000,
          style: {
            background: "#2a2f32",
            color: "#fff",
            borderLeft: "5px solid #00a884"
          }
        });
      });

      return () => socket.disconnect();
    }
  }, [isAuthenticated, user, navigate]);

  // Load user on every mount (critical for refresh)
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      {/* Header */}
      <header className="app-header">
        <Navbar />
      </header>

      <CustomToaster />

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
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset" element={<ResetPassword />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:keyword" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/success-stories" element={<Success />} />

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
              path="/password/update"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
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
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <Chat />
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
            <Route path="/public/earning/:token" element={<PublicEarning />} />

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
              path="/admin/users/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateUser />
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
            <Route
              path="/admin/new-project"
              element={
                <ProtectedRoute isAdmin={true}>
                  <NewProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/project/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <UpdateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute isAdmin={true}>
                  <ProjectList />
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
