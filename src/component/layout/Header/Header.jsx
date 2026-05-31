import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaBell, FaChevronDown, FaArrowRight } from "react-icons/fa";
import { FiBookmark, FiCheckCircle, FiXCircle, FiDollarSign, FiStar } from "react-icons/fi";
import "./Header.css";
import Logo from "../Logo/Logo";
import { useSelector, useDispatch } from "react-redux";
import UserOptions from "./UserOptions";
import axios from "axios";
import SearchModal from "../SearchModal/SearchModal";
import { getCategories } from "../../../actions/userAction";
import Avatar from "../Avatar/Avatar";

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
  const [systemNotifications, setSystemNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "alerts"
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

  // Fetch unread chat notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.get("/api/v1/notifications");
      setNotifications(data.notifications || []);
    } catch (error) {
      console.log("Failed to fetch notifications");
    }
  };

  // Fetch system notifications
  const fetchSystemNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await axios.get("/api/v1/system/notifications");
      setSystemNotifications(data.notifications || []);
    } catch (error) {
      console.log("Failed to fetch system notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchSystemNotifications();
  }, [isAuthenticated, location.pathname]);

  // Listen to live system notifications
  useEffect(() => {
    const handleNewSystemNotification = (e) => {
      setSystemNotifications((prev) => [e.detail, ...prev]);
    };
    window.addEventListener("new_system_notification", handleNewSystemNotification);

    const handleNewNotification = () => fetchNotifications();
    window.addEventListener("new_notification", handleNewNotification);

    return () => {
      window.removeEventListener("new_system_notification", handleNewSystemNotification);
      window.removeEventListener("new_notification", handleNewNotification);
    };
  }, []);

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

  const handleSystemNotificationClick = async (notif) => {
    try {
      // Mark as read inside local state
      setSystemNotifications(prev => 
        prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n)
      );
      setShowDropdown(false);

      // Route based on type
      if (notif.type === "payment_received") {
        navigate("/user/earning");
      } else if (notif.type === "bid_applied") {
        navigate(user?.role === "admin" || user?.role === "superadmin" ? "/admin/bids" : "/bids");
      } else if (notif.type === "support_received") {
        navigate("/admin/support");
      } else if (notif.type === "support_updated") {
        navigate("/support/me");
      } else if (notif.type === "review_received") {
        navigate(`/user/${user?._id}`);
      } else {
        navigate("/bids");
      }
    } catch (error) {
      console.log("Error processing system notification click");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put("/api/v1/system/notifications/read");
      setSystemNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.log("Failed to mark system notifications as read");
    }
  };

  const totalUnread = notifications.reduce((acc, curr) => acc + curr.count, 0);
  const unreadAlerts = systemNotifications.filter(n => !n.isRead).length;
  const totalUnreadBadge = totalUnread + unreadAlerts;

  // Automatically mark system notifications as read when the alerts tab is opened/viewed
  useEffect(() => {
    if (showDropdown && activeTab === "alerts" && unreadAlerts > 0) {
      handleMarkAllRead();
    }
  }, [showDropdown, activeTab, unreadAlerts]);

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
                {totalUnreadBadge > 0 && <span className="notification-badge">{totalUnreadBadge}</span>}
              </div>

              {/* Notification Dropdown */}
              {showDropdown && (
                <div className="notification-dropdown">
                  {/* Tabs Selector */}
                  <div className="notif-tabs">
                    <button 
                      className={`notif-tab ${activeTab === "chats" ? "active" : ""}`}
                      onClick={() => setActiveTab("chats")}
                    >
                      Chats {totalUnread > 0 && <span className="notif-tab-badge">{totalUnread}</span>}
                    </button>
                    <button 
                      className={`notif-tab ${activeTab === "alerts" ? "active" : ""}`}
                      onClick={() => setActiveTab("alerts")}
                    >
                      Alerts {unreadAlerts > 0 && <span className="notif-tab-badge">{unreadAlerts}</span>}
                    </button>
                  </div>

                  {activeTab === "chats" ? (
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
                            <Avatar
                              src={notif.senderAvatar}
                              name={notif.senderName}
                              size="sm"
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
                  ) : (
                    <div className="notification-list">
                      <div className="notification-header" style={{ padding: "10px 15px" }}>
                        <div className="notification-header-content">
                          <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>System Alerts</h4>
                          {unreadAlerts > 0 && (
                            <button className="sp-mark-read-btn" onClick={handleMarkAllRead}>
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      {systemNotifications.length === 0 ? (
                        <div className="no-notifications">No new system alerts</div>
                      ) : (
                        systemNotifications.map((notif) => {
                          let typeIcon = <FaBell />;
                          if (notif.type === "bid_applied") typeIcon = <FiBookmark />;
                          else if (notif.type === "bid_approved") typeIcon = <FiCheckCircle />;
                          else if (notif.type === "bid_rejected") typeIcon = <FiXCircle />;
                          else if (notif.type === "payment_received") typeIcon = <FiDollarSign />;
                          else if (notif.type === "review_received") typeIcon = <FiStar />;

                          return (
                            <div 
                              key={notif._id} 
                              className={`notification-item system-notif ${!notif.isRead ? "unread" : ""}`}
                              onClick={() => handleSystemNotificationClick(notif)}
                            >
                              <div className={`notif-type-icon ${notif.type}`}>
                                {typeIcon}
                              </div>
                              <div className="notif-content">
                                <p style={{ fontSize: "0.85rem", color: "#fff", margin: "0 0 3px", fontWeight: !notif.isRead ? "bold" : "normal" }}>
                                  {notif.message}
                                </p>
                                <span className="notif-time">
                                  {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
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