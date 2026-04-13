import React from "react";
import { Link } from "react-router-dom";
import "./FreelancerCard.css";
import { FiArrowRight, FiStar, FiUser } from "react-icons/fi";

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="freelancer-card-modern">
      {/* Profile Header */}
      <div className="fc-header">
        <div className="fc-avatar-wrap">
          <img 
            src={freelancer.avatar?.url || "/Profile.png"} 
            alt={freelancer.name} 
            className="fc-avatar"
          />
        </div>
        <div className="fc-badge">
          {freelancer.category && freelancer.category !== "Other" ? freelancer.category : "Top Rated"}
        </div>
      </div>

      {/* Content Body */}
      <div className="fc-body">
        <h3 className="fc-name">{freelancer.name}</h3>
        <p className="fc-headline">{freelancer.professionalHeadline}</p>
        
        <div className="fc-stats">
          <span className="fc-rating">
            <FiStar className="star-icon" /> {freelancer.ratings || "4.8"}
          </span>
          <span className="fc-reviews">
            ({freelancer.numOfReviews || 0} Reviews)
          </span>
        </div>

        <div className="fc-meta">
          <div className="fc-meta-item">
            <FiUser className="meta-icon" />
            <span>Top Rated</span>
          </div>
          <div className="fc-price">
            ₹1,500 <small>/hr</small>
          </div>
        </div>

        <Link to={`/user/chat/${freelancer._id}`} className="fc-cta">
          HIRE NOW <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
