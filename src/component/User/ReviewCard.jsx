import React, { useEffect } from "react";
import toast from "react-hot-toast";
import profilePng from "../../images/Profile.png";

const ReviewCard = ({ review }) => {
  useEffect(() => {
    if (!review || typeof review.rating !== "number") {
      toast.error("Invalid review data"); 
    }
  }, [review]);

  if (!review) return null;

  const renderStars = (rating = 0) => {
    const filledStars = Math.round(rating);
    const totalStars = 5;

    return Array.from({ length: totalStars }, (_, i) => (
      <span key={i} style={{ color: i < filledStars ? "#facc15" : "#d1d5db" }}>
        ★
      </span>
    ));
  };

  return (
    <div className="userReviewCard">
      <img
        src={review.avatar || profilePng}
        alt="User"
        className="review-avatar"
      />
      <p className="review-name">{review.name || "Anonymous"}</p>
      <div className="review-rating">{renderStars(review.rating)}</div>
      <span className="userReviewCardComment">
        {review.comment || "No comment provided."}
      </span>
    </div>
  );
};

export default ReviewCard;
