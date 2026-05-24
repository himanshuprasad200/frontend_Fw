import React from "react";
import "./Logo.css";

const Logo = ({ className = "", size = "normal", hideText = false }) => {
  return (
    <div className={`logo-container ${size} ${className} ${hideText ? "hide-text" : ""}`}>
      <span className="logo-badge">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {!hideText && (
        <div className="logo-wordmark">
          <span className="logo-p1">FLEXI</span><span className="logo-p2">WORK</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
