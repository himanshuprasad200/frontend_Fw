// src/component/layout/Avatar/Avatar.jsx
import React, { useState } from "react";
import "./Avatar.css";

/**
 * Reusable Avatar component.
 * - Shows the profile image if `src` is a valid, non-placeholder URL.
 * - Falls back to styled initials when no image is available or image fails to load.
 *
 * Props:
 *  src      - avatar URL from backend (e.g. user.avatar?.url)
 *  name     - user's name (used to generate initials)
 *  size     - "sm" | "md" | "lg" | "xl"  (default: "md")
 *  className - extra CSS class to forward
 *  style     - extra inline styles
 */

// These values indicate "no real upload was made"
const PLACEHOLDER_URLS = ["/Profile.png", "default_avatar", "/default-avatar.png", ""];

const COLORS = [
  "#6366f1", "#8b5cf6", "#0ea5e9", "#14b8a6",
  "#f59e0b", "#ef4444", "#ec4899", "#22c55e",
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function getColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return COLORS[hash % COLORS.length];
}

function isValidSrc(src) {
  if (!src) return false;
  if (PLACEHOLDER_URLS.includes(src)) return false;
  // Must look like a real URL (http/https/cloudinary/etc.)
  if (!src.startsWith("http") && !src.startsWith("//") && !src.startsWith("blob")) return false;
  return true;
}

const Avatar = ({ src, name = "", size = "md", className = "", style = {} }) => {
  const [imgError, setImgError] = useState(false);

  const showImage = isValidSrc(src) && !imgError;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name || "User"}
        className={`avatar avatar-${size} ${className}`}
        style={style}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`avatar avatar-initials avatar-${size} ${className}`}
      style={{ backgroundColor: getColor(name), ...style }}
      aria-label={name || "User"}
      title={name || "User"}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
