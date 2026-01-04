// src/component/layout/Header/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import logo from "../../../images/logo.png";
import { useSelector } from "react-redux";
import UserOptions from "./UserOptions";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isMobile, setIsMobile] = useState(false);

  const handleToggle = () => setIsMobile(!isMobile);
  const handleCloseMenu = () => setIsMobile(false);

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

      {/* Right Section: Search + Avatar + Mobile Toggle */}
      <div className="navbar-right-wrapper">
        {/* Search Icon */}
        <Link to="/search" className="search-icon-desktop">
          <FaSearch />
        </Link>

        {/* User Avatar or Guest */}
        {isAuthenticated ? (
          <UserOptions user={user} />
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