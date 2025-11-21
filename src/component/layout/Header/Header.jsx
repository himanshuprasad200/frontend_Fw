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
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="FlexiWork" />
        </Link>
      </div>

      {/* Desktop Links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/admin/joinasclient">Join as Client</Link></li>
        {!isAuthenticated && (
          <li><Link to="/login">Join</Link></li>
        )}
      </ul>

      {/* Right Side: Search + User Avatar */}
      <div className="navbar-right">
        <Link to="/search" className="search-icon">
          <FaSearch />
        </Link>

        {/* User Avatar (with hover dropdown) */}
        {isAuthenticated ? (
          <UserOptions user={user} />
        ) : (
          <div className="profile-placeholder">
            <img src="/Profile.png" alt="Guest" className="profile-img" />
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-icon" onClick={handleToggle}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </div>

      {/* Mobile Menu */}
      <ul className={`navbar-links-mobile ${isMobile ? "open" : ""}`}>
        <li><Link to="/" onClick={handleCloseMenu}>Home</Link></li>
        <li><Link to="/projects" onClick={handleCloseMenu}>Projects</Link></li>
        <li><Link to="/admin/joinasclient" onClick={handleCloseMenu}>Join as Client</Link></li>
        {!isAuthenticated && (
          <li><Link to="/login" onClick={handleCloseMenu}>Join</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;