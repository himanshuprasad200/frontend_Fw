// src/component/layout/Header/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaBell } from "react-icons/fa";
import "./Header.css";
import logo from "../../../images/logo.png";
import { useSelector } from "react-redux";
import UserOptions from "./UserOptions";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsMobile(!isMobile);
  const handleCloseMenu = () => setIsMobile(false);

  // Fetch unread notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.get("/api/v1/notifications");
      setNotifications(data.notifications || []);
    } catch (error) {
      console.log("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen to global socket event from App.jsx
    const handleNewNotification = () => fetchNotifications();
    window.addEventListener("new_notification", handleNewNotification);

    return () => window.removeEventListener("new_notification", handleNewNotification);
  }, [isAuthenticated, location.pathname]); // Refresh on route change to clear read messages automatically

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (senderId) => {
    try {
      // Mark as read in backend
      await axios.put('/api/v1/messages/read', { senderId });
      // Remove from local state immediately for snappy UI
      setNotifications(prev => prev.filter(n => n.senderId !== senderId));
      setShowDropdown(false);
      navigate(`/chat/${senderId}`);
    } catch (error) {
      console.log("Error marking as read");
    }
  };

  // Calculate total badge count
  const totalUnread = notifications.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <nav className="navbar">
      {/* Logo - Always Left */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="FlexiWork" />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/admin/joinasclient">Join as Client</Link></li>
        {!isAuthenticated && <li><Link to="/login">Join</Link></li>}
      </ul>

      {/* Right Section: Search + Notifications + Avatar + Mobile Toggle */}
      <div className="navbar-right-wrapper">
        <Link to="/search" className="search-icon-desktop">
          <FaSearch />
        </Link>

        {/* Notification Bell */}
        {isAuthenticated && (
          <div className="notification-bell-container" ref={dropdownRef}>
            <div 
              className="notification-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaBell />
              {totalUnread > 0 && <span className="notification-badge">{totalUnread}</span>}
            </div>

            {/* Notification Dropdown */}
            {showDropdown && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No new messages</div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.senderId} 
                        className="notification-item"
                        onClick={() => handleNotificationClick(notif.senderId)}
                      >
                        <img 
                          src={notif.senderAvatar || "/default-avatar.png"} 
                          alt="avatar" 
                          className="notif-avatar" 
                        />
                        <div className="notif-content">
                          <p className="notif-name">{notif.senderName}</p>
                          <p className="notif-text">{notif.text.slice(0, 30)}...</p>
                        </div>
                        <div className="notif-count">
                          {notif.count}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Avatar or Guest */}
        {isAuthenticated ? (
          <div className="user-opts-container">
               <UserOptions user={user} />
          </div>
        ) : (
          <div className="profile-placeholder">
            <img src="/Profile.png" alt="Guest" className="profile-img" />
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-icon" onClick={handleToggle}>
          {isMobile ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <ul className={`navbar-links-mobile ${isMobile ? "open" : ""}`}>
        <li><Link to="/" onClick={handleCloseMenu}>Home</Link></li>
        <li><Link to="/projects" onClick={handleCloseMenu}>Projects</Link></li>
        <li><Link to="/admin/joinasclient" onClick={handleCloseMenu}>Join as Client</Link></li>
        {!isAuthenticated && (
          <li><Link to="/login" onClick={handleCloseMenu}>Join</Link></li>
        )}
        <li>
          <Link to="/search" onClick={handleCloseMenu} className="mobile-search-link">
            <FaSearch /> Search Projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;