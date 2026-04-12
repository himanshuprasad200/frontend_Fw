import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";
import { FiArrowRight, FiStar, FiMessageSquare } from "react-icons/fi";

const ProjectCard = ({ project }) => {
  return (
    <Link className="project-card-new" to={`/project/${project._id}`}>
      {/* Visual Header */}
      <div className="pc-visual">
        <img 
          src={project.images?.[0]?.url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"} 
          alt={project.title} 
        />
        <div className="pc-category-tag">{project.category}</div>
      </div>

      {/* Content Body */}
      <div className="pc-body">
        <div className="pc-meta-top">
          <span className="pc-rating">
            <FiStar className="star-icon" /> {project.ratings || "0.0"}
          </span>
          <span className="pc-reviews">
            <FiMessageSquare className="msg-icon" /> {project.numOfReviews || 0} Reviews
          </span>
        </div>

        <span className="pc-client-name">Posted by {project.name}</span>
        <h3 className="pc-title">{project.title}</h3>
        
        <div className="pc-footer">
          <div className="pc-price-box">
             <span className="pc-price-label">Starting from</span>
             <span className="pc-price-value">₹{project.price?.toLocaleString()}</span>
          </div>
          <div className="pc-explore-btn">
            EXPLORE <FiArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
