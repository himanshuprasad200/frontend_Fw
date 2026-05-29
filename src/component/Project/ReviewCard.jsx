import React from "react";
import { DEFAULT_AVATAR } from "../../constants/imageConstant";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const getReviewDate = (review) => {
    if (!review) return "Unknown date";
    
    let date;
    if (review._id && /^[0-9a-fA-F]{24}$/.test(review._id)) {
      // Extract timestamp from MongoDB ObjectId (immutable, 100% accurate original date)
      const timestamp = parseInt(review._id.substring(0, 8), 16) * 1000;
      date = new Date(timestamp);
    } else if (review.createdAt) {
      date = new Date(review.createdAt);
    }

    if (!date || isNaN(date.getTime())) {
      return "Some time ago";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 0) {
      return "just now";
    }

    if (diffInSeconds < 60) {
      return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rounded ? "#7ec8c0" : "#e2e8f0", fontSize: "14px" }}>
        ★
      </span>
    ));
  };

  return (
    <div className="modern-post-card">
      {/* Card Header - Like the reference image */}
      <div className="mp-card-header">
        <div className="mp-user-info">
          {review?.avatar && review.avatar !== "/Profile.png" ? (
             <img src={review.avatar} alt="User" className="mp-avatar" />
          ) : (
            <div className="mp-avatar mp-initials">
               {review?.name ? (
                review.name.split(" ").length > 1 
                  ? (review.name.split(" ")[0][0] + review.name.split(" ")[review.name.split(" ").length-1][0]).toUpperCase()
                  : review.name.slice(0, 2).toUpperCase()
              ) : "U"}
            </div>
          )}
          <div className="mp-meta">
            <h4 className="mp-name">{review?.name || "Anonymous User"}</h4>
            <span className="mp-time">{getReviewDate(review)}</span>
          </div>
        </div>
        <div className="mp-category-badge">
          {review?.rating >= 4 ? "Excellent" : "Verified"}
        </div>
        <button className="mp-more-btn"><i className="fas fa-ellipsis-v"></i></button>
      </div>

      {/* Card Body */}
      <div className="mp-card-body">
        <p className="mp-comment">
          {review?.comment || "No detailed review provided by the client."}
        </p>
      </div>

      {/* Card Footer */}
      <div className="mp-card-footer">
        <div className="mp-replies">
          {renderStars(review?.rating)}
          <span className="mp-rating-txt">{review?.rating}/5.0</span>
        </div>
        <div className="mp-actions">
          <button className="mp-action-icon"><i className="far fa-heart"></i></button>
          <button className="mp-action-icon"><i className="far fa-share-square"></i></button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
