// src/component/admin/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../../images/logo2.png";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Toggle Button - Only visible when collapsed on mobile/large screens */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        <i className={`fas ${isCollapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
      </button>

      <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/">
            <img src={logo} alt="FlexiWork" className="logo-img" />
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-menu">
          {/* Dashboard */}
          <Link
            to="/admin/joinasclient"
            className={`menu-item ${isActive("/admin/joinasclient") ? "active" : ""}`}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span className="menu-text">Dashboard</span>
          </Link>

          {/* Projects - Collapsible */}
          <div className="menu-item collapsible">
            <div
              className={`menu-link ${isProjectsOpen || location.pathname.includes("/project") ? "active" : ""}`}
              onClick={() => !isCollapsed && setIsProjectsOpen(!isProjectsOpen)}
            >
              <i className="fas fa-project-diagram"></i>
              <span className="menu-text">Projects</span>
              {!isCollapsed && (
                <i className={`fas fa-chevron-${isProjectsOpen ? "up" : "down"} arrow`}></i>
              )}
            </div>

            {/* Submenu */}
            <div className={`submenu ${isProjectsOpen ? "open" : ""}`}>
              <Link
                to="/admin/projects"
                className={`submenu-item ${isActive("/admin/projects") ? "active" : ""}`}
              >
                <i className="fas fa-list"></i>
                <span>All Projects</span>
              </Link>
              <Link
                to="/admin/project"
                className={`submenu-item ${isActive("/admin/project") ? "active" : ""}`}
              >
                <i className="fas fa-plus-circle"></i>
                <span>Create Project</span>
              </Link>
            </div>
          </div>

          {/* Bids */}
          <Link
            to="/admin/bids"
            className={`menu-item ${isActive("/admin/bids") ? "active" : ""}`}
          >
            <i className="fas fa-gavel"></i>
            <span className="menu-text">Bids</span>
          </Link>

          <Link
            to="/admin/users"
            className={`menu-item ${isActive("/admin/users") ? "active" : ""}`}
          >
            <i className="fas fa-users"></i>
            <span className="menu-text">Users</span>
          </Link>

          <Link
            to="/admin/reviews"
            className={`menu-item ${isActive("/admin/reviews") ? "active" : ""}`}
          >
            <i className="fas fa-star"></i>
            <span className="menu-text">Reviews</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p className="footer-text">FlexiWork Admin</p>
          <small>© 2025</small>
        </div>
      </div>
    </>
  );
};

export default Sidebar;