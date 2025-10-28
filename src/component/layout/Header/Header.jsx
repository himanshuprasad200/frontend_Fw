import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import logo from "../../../images/logo.png";
import { useSelector } from "react-redux";
 

const Navbar = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const [isMobile, setIsMobile] = useState(false);

  const handleToggle = () => {
    setIsMobile(!isMobile); 
  };

  const handleCloseMenu = () => {  
    setIsMobile(false);
  };

  return (  
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <ul className={isMobile ? "navbar-links-mobile" : "navbar-links"}>
        <li>
          <Link to="/" onClick={handleCloseMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/projects" onClick={handleCloseMenu}>
            Projects
          </Link>
        </li>
        <li>
          <Link to="/admin/joinasclient" onClick={handleCloseMenu}>
            Join as Client
          </Link>
        </li>
        {!isAuthenticated && (
          <li>
            <Link to="/login" onClick={handleCloseMenu}>
              Join
            </Link>
          </li>
        )}
      </ul>
      
      <div className="mobile-menu-icon" onClick={handleToggle}>
        {isMobile ? <FaTimes /> : <FaBars />}
      </div>
      <div className="navbar-icons">
        <Link to="/search">
          <FaSearch className="navbar-icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;