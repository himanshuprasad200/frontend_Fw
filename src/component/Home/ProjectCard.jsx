// src/component/Home/ProjectCard.jsx
import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

const ProjectCard = ({ project }) => {
  const options = {
    value: project.ratings || 4.5,
    edit: false,
    isHalf: true,
    size: 20,
    activeColor: "#ffd700",
  };

  return (
    <Link className="modern-project-card" to={`/project/${project._id}`}>
      <div className="card-image">
        <img src={project.images[0]?.url || "/placeholder.jpg"} alt={project.name} />
        <div className="card-overlay"></div>
    
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3>{project.name}</h3>
          <span className="badge">{project.category}</span>
        </div>

        <p className="card-description">{project.title}</p>

        <div className="card-rating">
          <ReactStars {...options} />
          <span>({project.numOfReviews || 0})</span>
        </div>

        <div className="card-footer">
          <span className="price">From ₹{project.price}</span>
          <span className="heart">♡</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;