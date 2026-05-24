// src/component/layout/RestrictedAccess.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "../../../utils/CustomToast";
import Logo from "../Logo/Logo";
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
      <div className="restricted-glow-orb-1"></div>
      <div className="restricted-glow-orb-2"></div>
      
      <div className="restricted-card">
        <div className="restricted-logo-wrapper">
          <Logo size="normal" />
        </div>

        <div className="lock-icon-container">
          <div className="lock-pulse-ring ring-1"></div>
          <div className="lock-pulse-ring ring-2"></div>
          <div className="lock-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        <h1 className="restricted-title">Access Denied</h1>
        
        <p className="restricted-message">
          This area is restricted to authorized platform administrators only.
        </p>
        <p className="restricted-subtext">
          If you believe you should have access, please get in touch with our support desk or return to the safety of the homepage.
        </p>

        <div className="restricted-action-buttons">
          <Link to="/" className="btn-restricted-primary">
            Go to Homepage
          </Link>
          <button onClick={handleContactSupport} className="btn-restricted-secondary">
            Contact Support
          </button>
        </div>

        <div className="restricted-footer-note">
          <small>
            Security Level: <code>Restricted_Admin</code>
          </small>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;