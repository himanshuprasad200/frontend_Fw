import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaBell, FaChevronDown, FaArrowRight } from "react-icons/fa";
import "./Header.css";
import Logo from "../Logo/Logo";
import { useSelector, useDispatch } from "react-redux";
import UserOptions from "./UserOptions";
import axios from "axios";
import SearchModal from "../SearchModal/SearchModal";
import { getCategories } from "../../../actions/userAction";

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.dynamicCategories);

  // Fetch dynamic categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsMobile(!isMobile);
  const handleCloseMenu = () => setIsMobile(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    const handleNewNotification = () => fetchNotifications();
    window.addEventListener("new_notification", handleNewNotification);
    return () => window.removeEventListener("new_notification", handleNewNotification);
  }, [isAuthenticated, location.pathname]);

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
      await axios.put('/api/v1/messages/read', { senderId });
      setNotifications(prev => prev.filter(n => n.senderId !== senderId));
      setShowDropdown(false);
      navigate(`/chat/${senderId}`);
    } catch (error) {
      console.log("Error marking as read");
    }
  };

  const totalUnread = notifications.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <>
      <nav className="navbar">
        {/* Logo - Always Left */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <Logo size="normal" className="header-logo" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          <li className="nav-item-dropdown mega-menu-trigger">
            <Link to="/freelancers" className="nav-link-with-icon">
              Hire freelancers <FaChevronDown className="nav-chevron" />
            </Link>
            <div className="nav-mega-menu">
              <div className="mega-menu-grid">
                {/* Dynamically grouped categories */}
                {Array.from({ length: 4 }).map((_, colIndex) => {
                  const itemsPerCol = Math.ceil((categories?.length || 0) / 4);
                  const colCategories = categories?.slice(colIndex * itemsPerCol, (colIndex + 1) * itemsPerCol);
                  
                  return (
                    <div key={colIndex} className="mega-menu-column">
                      <h4 className="mega-menu-header">
                        {colIndex === 0 ? "Featured" : colIndex === 1 ? "Technology" : colIndex === 2 ? "Creative" : "More"}
                      </h4>
                      <ul className="mega-menu-list">
                        {colCategories?.map((cat) => (
                          <li key={cat}>
                            <Link to={`/freelancers/${encodeURIComponent(cat)}`} className="mega-menu-item">
                              {cat}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                
                {/* Decorative / Action Column */}
                <div className="mega-menu-column actions-column">
                  <Link to="/freelancers" className="mega-action-link green">
                    Explore more <FaArrowRight />
                  </Link>
                  <Link to="/help-center" className="mega-action-link green">
                    Book consultation <FaArrowRight />
                  </Link>
                  <Link to="/admin/joinasclient" className="mega-action-link green">
                    Join Business Plus <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li><Link to="/projects">Find Projects</Link></li>
          <li><Link to="/admin/joinasclient">Join as Client</Link></li>
          {!isAuthenticated && <li><Link to="/success-stories">Success</Link></li>}
        </ul>

        {/* Right Section: Centralized Search + Notifications + Avatar + Mobile Toggle */}
        <div className="navbar-right-wrapper">
          
          <button 
            className="navbar-search-trigger" 
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="Open Search"
          >
            <FaSearch />
          </button>

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

          {/* User Avatar or Guest w/ Login/Signup buttons */}
          {isAuthenticated ? (
            <div className="user-opts-container">
                 <UserOptions user={user} />
            </div>
          ) : (
            <div className="navbar-auth-btns">
              <Link to="/login" className="navbar-login-btn">Log in</Link>
              <Link to="/login" className="navbar-signup-btn">Sign up</Link>
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
            <div 
              className="mobile-search-link" 
              onClick={() => {
                handleCloseMenu();
                setIsSearchModalOpen(true);
              }}
            >
              <FaSearch /> Search Projects
            </div>
          </li>
        </ul>
      </nav>

      {/* Global Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;