// src/component/layout/Header/UserOptions.jsx
import React, { useState, useRef } from "react";
import "./Header.css";
import { SiGoogleanalytics } from "react-icons/si";
import {
  MdDashboard,
  MdPerson,
  MdExitToApp,
  MdListAlt,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../actions/userAction";
import toast from "react-hot-toast";

const UserOptions = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // This is the trick – one single container for avatar + dropdown
  const containerRef = useRef(null);

  const options = [
    { icon: <MdPerson />, name: "Profile", func: () => navigate("/account") },
    {
      icon: <SiGoogleanalytics />,
      name: "Account Analytics",
      func: () => navigate("/user/earning"),
    },
    { icon: <MdListAlt />, name: "My Bids", func: () => navigate("/bids") },
    {
      icon: <MdExitToApp />,
      name: "Logout",
      func: () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
      },
    },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <MdDashboard />,
      name: "Post a Project",
      func: () => navigate("/admin/joinasclient"),
    });
  }

  return (
    <div
      className="user-options-container"
      ref={containerRef}
      // Mouse over the ENTIRE area (avatar + dropdown) → open
      onMouseEnter={() => setIsOpen(true)}
      // Mouse leaves the ENTIRE area → close
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Avatar */}
      <div className="avatar-trigger">
        <img
          src={user.avatar?.url || "/Profile.png"}
          alt={user.name}
          className="avatar-img"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="user-dropdown">
          {options.map((item) => (
            <button
              key={item.name}
              className="dropdown-item"
              onClick={() => {
                item.func();
                setIsOpen(false); // optional: close after click
              }}
            >
              <span className="dropdown-icon">{item.icon}</span>
              <span className="dropdown-text">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOptions;