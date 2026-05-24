import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css";
import { FiArrowRight, FiStar, FiMessageSquare, FiBookmark } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../actions/userAction";
import axios from "axios";
import toast from "../../utils/CustomToast";

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const isBookmarked = isAuthenticated && user?.savedProjects?.includes(project._id);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save projects");
      return;
    }

    try {
      const { data } = await axios.put(`/api/v1/project/bookmark/${project._id}`);
      if (data.success) {
        dispatch(loadUser());
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark project");
    }
  };

  return (
    <Link className="project-card-new" to={`/project/${project._id}`}>
      {/* Visual Header */}
      <div className="pc-visual">
        <img 
          src={project.images?.[0]?.url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"} 
          alt={project.title} 
        />
        {isAuthenticated && (
          <button 
            className={`pc-bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmark}
            title={isBookmarked ? "Remove from saved list" : "Save project for later"}
          >
            <FiBookmark style={{ fill: isBookmarked ? "currentColor" : "none" }} />
          </button>
        )}
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
