import React from "react";
import { DEFAULT_AVATAR } from "../../constants/imageConstant";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
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
            <span className="mp-time">5 hours ago</span>
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
