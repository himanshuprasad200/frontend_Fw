// src/component/admin/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../layout/Logo/Logo";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Logo Section */}
        <div className="sidebar-logo">
          <Link to="/">
            <Logo size="small" className="sidebar-logo-comp light-text" hideText={isCollapsed} />
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-menu">
          {/* Dashboard */}
          <Link
            to="/admin/joinasclient"
            className={`menu-item ${isActive("/admin/joinasclient") ? "active" : ""}`}
          >
            <div className="icon-box">
              <i className="fas fa-home"></i>
            </div>
            <span className="menu-text">Dashboard</span>
          </Link>

          {/* Projects - Collapsible */}
          <div className={`menu-group ${isProjectsOpen || location.pathname.includes("/project") ? "group-open" : ""}`}>
            <div
              className={`menu-item collapsible ${location.pathname.includes("/project") ? "active" : ""}`}
              onClick={() => !isCollapsed && setIsProjectsOpen(!isProjectsOpen)}
            >
              <div className="icon-box">
                <i className="fas fa-briefcase"></i>
              </div>
              <span className="menu-text">Projects</span>
              {!isCollapsed && (
                <i className={`fas fa-chevron-right arrow ${isProjectsOpen ? "rotated" : ""}`}></i>
              )}
            </div>

            {/* Submenu */}
            <div className={`submenu ${isProjectsOpen ? "open" : ""}`}>
              <Link
                to="/admin/projects"
                className={`submenu-item ${isActive("/admin/projects") ? "sub-active" : ""}`}
              >
                <span className="dot"></span>
                <span>All Projects</span>
              </Link>
              <Link
                to="/admin/new-project"
                className={`submenu-item ${isActive("/admin/new-project") ? "sub-active" : ""}`}
              >
                <span className="dot"></span>
                <span>Create Project</span>
              </Link>
            </div>
          </div>

          {/* Bids */}
          <Link
            to="/admin/bids"
            className={`menu-item ${isActive("/admin/bids") ? "active" : ""}`}
          >
            <div className="icon-box">
              <i className="fas fa-gavel"></i>
            </div>
            <span className="menu-text">Bids</span>
          </Link>

          {/* Users */}
          <Link
            to="/admin/users"
            className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
          >
            <div className="icon-box">
              <i className="fas fa-users"></i>
            </div>
            <span className="menu-text">Users</span>
          </Link>

          {/* Reviews */}
          <Link
            to="/admin/reviews"
            className={`menu-item ${isActive("/admin/reviews") ? "active" : ""}`}
          >
            <div className="icon-box">
              <i className="fas fa-star"></i>
            </div>
            <span className="menu-text">Reviews</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="admin-profile-mini">
            <div className="profile-dot"></div>
            <span className="footer-text">Admin Panel</span>
          </div>
          <small className="version-text">v2.1.0</small>
        </div>
      </div>

      {/* Toggle Button - Now AFTER the sidebar for CSS sibling selector to work */}
      <button
        className={`sidebar-toggle-btn ${isCollapsed ? "btn-collapsed" : ""}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        <i className={`fas ${isCollapsed ? "fa-angle-right" : "fa-angle-left"}`}></i>
      </button>
    </>
  );
};

export default Sidebar;