// src/component/Project/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import "./ProjectDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  clearErrors,
  getProjectDetails,
  newReviewForProject,
} from "../../actions/projectAction";
import { addToBidItems } from "../../actions/bidAction";
import { NEW_REVIEW_RESET } from "../../constants/projectConstant";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard";

// Reusable Star Rating Component
const StarRating = ({ rating = 0, onRate, interactive = false, size = "text-2xl" }) => {
  return (
    <div className={`flex gap-1 ${interactive ? "cursor-pointer" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`fa-star ${
            star <= rating ? "fas text-yellow-400" : "far text-gray-300"
          } ${size} transition-all hover:scale-110`}
          onClick={() => interactive && onRate(star)}
          style={{ cursor: interactive ? "pointer" : "default" }}
        />
      ))}
    </div>
  );
};

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { project, loading, error } = useSelector((state) => state.projectDetails);
  const { success, error: reviewError } = useSelector((state) => state.newProjectReview);
  const { isAuthenticated } = useSelector((state) => state.user);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (error || reviewError) {
      toast.error(error || reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review submitted successfully!");
      dispatch({ type: NEW_REVIEW_RESET });
      setShowReviewModal(false);
      setRating(0);
      setComment("");
    }
    dispatch(getProjectDetails(id));
  }, [dispatch, id, error, reviewError, success]);

  const addToBidHandler = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      navigate("/login");
      return;
    }
    dispatch(addToBidItems(id));
    toast.success("Project added to your proposal!");
    navigate("/proposal");
  };

  const submitReview = () => {
    if (rating === 0 || !comment.trim()) {
      toast.error("Please select a rating and write a review");
      return;
    }
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("projectId", id);
    dispatch(newReviewForProject(formData));
  };

  if (loading) return <Loader />;
  if (!project) return <div className="not-found">Project not found</div>;

  return (
    <>
      <MetaData title={`${project.title} - FlexiWork`} />

      <div className="project-details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/projects">Projects</a> › {project.category}
        </div>

        <div className="project-grid">
          {/* Main Content */}
          <div className="main-content">
            {/* Title & Client */}
            <div className="project-header">
              <h1 className="project-title">{project.title}</h1>

              <div className="client-card">
                <img
                  src={project.postedBy?.avatar?.url || "/Profile.png"}
                  alt={project.postedBy?.name}
                  className="client-avatar"
                />
                <div className="client-info">
                  <h3>{project.postedBy?.name}</h3>
                  <p>{project.postedBy?.country || "Freelancer"}</p>
                </div>
                <div className="client-rating">
                  <StarRating rating={project.ratings || 0} />
                  <span className="review-count">({project.numOfReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Project Image */}
            {project.images?.[0] && (
              <div className="project-image-wrapper">
                <img src={project.images[0].url} alt={project.title} className="project-image" />
              </div>
            )}

            {/* Description */}
            <div className="section">
              <h2>Description</h2>
              <p className="project-description">{project.desc}</p>
            </div>

            {/* Reviews */}
            <div className="section">
              <div className="section-header">
                <h2>Reviews</h2>
                <button className="btn-primary" onClick={() => setShowReviewModal(true)}>
                  Write a Review
                </button>
              </div>

              {project.reviews?.length > 0 ? (
                <div className="reviews-list">
                  {project.reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="no-reviews">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <div className="price-card">
              <h3>Project Budget</h3>
              <div className="price">₹{project.price?.toLocaleString()}</div>
              <button className="bid-btn" onClick={addToBidHandler}>
                Place Your Bid
              </button>
            </div>

            <div className="info-card">
              <h3>Project Info</h3>
              <div className="info-item">
                <span>Category</span>
                <strong>{project.category}</strong>
              </div>
              <div className="info-item">
                <span>Posted By</span>
                <strong>{project.postedBy?.name}</strong>
              </div>
              <div className="info-item">
                <span>Rating</span>
                <StarRating rating={project.ratings || 0} size="text-lg" />
              </div>
            </div>

            <a href="mailto:flexiworkclient@gmail.com" className="contact-btn">
              Contact Client
            </a>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Write Your Review</h2>
            <div className="rating-input">
              <p>Rate this project:</p>
              <StarRating rating={rating} onRate={setRating} interactive size="text-5xl" />
            </div>
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={submitReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;