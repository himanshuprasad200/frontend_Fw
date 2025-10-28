import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

const ProjectCard = ({ project }) => {
  const options = {
    value: project.ratings,
    edit: false,
    isHalf: true,
    size: 24,
    activeColor: "#ffd700",
  };

  return (
    <Link className="projectCard" to={`/project/${project._id}`}>
      <img src={project.images[0].url} alt={project.name} />
      <div className="headings">
        <h4>{project.name}</h4>
        <h5>Category: {project.category}</h5>
      </div>
      <p>{project.title}</p>
      <div className="projectCardSpan">
        <ReactStars {...options} />{" "}
        <span>({project.numOfReviews} Reviews)</span>
      </div>
      <span className="money-span">From ₹{project.price}</span>
    </Link>
  );
};

export default ProjectCard;
