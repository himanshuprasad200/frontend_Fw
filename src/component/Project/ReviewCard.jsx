import React from "react";
import { DEFAULT_AVATAR } from "../../constants/imageConstant";
import "./ProjectDetails.css";

const ReviewCard = ({ review }) => {
  const renderStars = (rating = 0) => {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rounded ? "#facc15" : "#d1d5db" }}>
        ★
      </span>
    ));
  };

  return (
    <div className="reviewCard">
      <img
        src={review?.avatar || DEFAULT_AVATAR}
        alt="User"
        className="review-avatar"
      />
      <p className="review-name">{review?.name || "Anonymous"}</p>
      <div className="review-stars">{renderStars(review?.rating)}</div>
      <span className="reviewCardComment">{review?.comment}</span>
    </div>
  );
};

export default ReviewCard;
