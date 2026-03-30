// src/component/layout/RestrictedAccess.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./RestrictedAccess.css";

const RestrictedAccess = () => {
  const navigate = useNavigate();

  const handleContactSupport = async () => {
    try {
      const { data } = await axios.get("/api/v1/support/id");
      if (data.supportId) {
        navigate(`/chat/${data.supportId}`);
      }
    } catch (error) {
      toast.error("Could not reach support. Please try again later.");
    }
  };

  return (
    <div className="restricted-container">
      <div className="restricted-card">
        <div className="lock-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h1>Restricted Access</h1>
        <p>
          This section is available only to <strong>administrators</strong>.
        </p>
        <p className="subtext">
          If you believe you should have access, please contact the platform administrator.
        </p>

        <div className="action-buttons">
          <Link to="/" className="btn-primary">
            Go to Homepage
          </Link>
          <button onClick={handleContactSupport} className="btn-secondary">
            Contact Support
          </button>
        </div>

        <div className="footer-note">
          <small>Only users with the role <code>admin</code> can access this page.</small>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;