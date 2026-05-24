// src/component/Project/ProjectDetails.jsx
import React, { useEffect, useState } from "react";
import "./ProjectDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "../../utils/CustomToast";
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
import { FiClock, FiTag, FiHash, FiMapPin, FiMessageCircle, FiStar, FiChevronRight, FiBriefcase } from "react-icons/fi";
import { FaComments } from "react-icons/fa";

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { project, loading, error, hasApplied } = useSelector((state) => state.projectDetails);
  const { success, error: reviewError } = useSelector((state) => state.newProjectReview);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const canChat = isAuthenticated && (
    hasApplied || 
    user?.role === "admin" || 
    user?.role === "superadmin" ||
    project?.postedBy?._id === user?._id
  );

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
    toast.success("Project added to your proposals!");
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
      <MetaData title={`${project.title} | FlexiWork`} />

      <div className="pd-master-layout">
        {/* Project Hero / Banner */}
        <section className="pd-hero-section">
           <img 
             src={project.images?.[0]?.url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1600"} 
             className="pd-hero-bg" 
             alt="Project" 
           />
           <div className="pd-hero-overlay"></div>
           
           <div className="pd-hero-content">
             <div className="pd-breadcrumb">
               <Link to="/projects">Discovery</Link> <FiChevronRight /> <span>{project.category}</span>
             </div>
             <h1 className="pd-main-title">{project.title}</h1>
             <div className="pd-quick-meta">
               <span className="pd-badge"><FiTag /> {project.category}</span>
               <span className="pd-badge"><FiHash /> #{id.slice(-6).toUpperCase()}</span>
               {project.postedBy?.country && <span className="pd-badge"><FiMapPin /> {project.postedBy.country}</span>}
             </div>
           </div>
        </section>

        <div className="pd-content-grid">
          {/* MAIN COLUMN */}
          <main className="pd-main-panel">
            <div className="pd-section">
               <h2 className="pd-section-title">Project Overview</h2>
               <p className="pd-description-text">{project.desc}</p>
            </div>

            <div className="pd-section">
               <div className="pd-section-header">
                  <h2 className="pd-section-title">Client Feedback</h2>
                  <button className="pd-add-review-btn" onClick={() => setShowReviewModal(true)}>
                    + Share Your Review
                  </button>
               </div>
               
               {project.reviews?.length > 0 ? (
                 <div className="pd-reviews-list">
                    {project.reviews.map((rev) => (
                      <ReviewCard key={rev._id} review={rev} />
                    ))}
                 </div>
               ) : (
                 <div className="pd-empty-reviews">
                   <FiMessageCircle className="empty-icon" />
                   <p>Be the first to share your experience with this client.</p>
                 </div>
               )}
            </div>
          </main>

          {/* SIDEBAR COLUMN */}
          <aside className="pd-sidebar-panel">
             {/* Sticky Card 1: Pricing & Action */}
             <div className="pd-action-card">
                <div className="pd-price-wrap">
                   <span className="pd-price-label">Project Budget</span>
                   <strong className="pd-price-value">₹{project.price?.toLocaleString()}</strong>
                </div>
                
                <button 
                  className={`pd-primary-cta ${hasApplied ? "applied" : ""}`} 
                  onClick={addToBidHandler}
                  disabled={hasApplied}
                >
                  {hasApplied ? "PROPOSAL SUBMITTED" : "PLACE YOUR BID NOW"}
                </button>
                
                <p className="pd-cta-subtext">Verified Work | Escrow Protected Payment</p>
             </div>

             {/* Sticky Card 2: Client Profile */}
             <div className="pd-client-card">
                <h3 className="pd-sidebar-title">Client Details</h3>
                <div className="pd-client-main">
                   {project.postedBy?.avatar?.url ? (
                     <img src={project.postedBy.avatar.url} className="pd-client-avatar" alt="Client" />
                   ) : (
                     <div className="pd-client-initials">
                        {project.postedBy?.name?.charAt(0).toUpperCase()}
                     </div>
                   )}
                   <div className="pd-client-info">
                      <h4>{project.postedBy?.name || "Client Name"}</h4>
                      <div className="pd-client-rating">
                         <FiStar className="star-icon" /> <span>{project.ratings?.toFixed(1) || "0.0"}</span>
                         <small>({project.numOfReviews} reviews)</small>
                      </div>
                   </div>
                </div>

                <div className="pd-client-meta-list">
                   <div className="pd-meta-item">
                      <FiMapPin /> <span>{project.postedBy?.country || "International"}</span>
                   </div>
                   <div className="pd-meta-item">
                      <FiBriefcase /> <span>Project ID: #{id.slice(-6).toUpperCase()}</span>
                   </div>
                </div>

                {canChat ? (
                  <button className="pd-chat-btn" onClick={() => navigate(`/chat/${project.postedBy?._id}`)}>
                    <FaComments /> CHAT WITH CLIENT
                  </button>
                ) : (
                  <div className="pd-chat-locked">
                    <i className="fas fa-lock"></i> Apply to unlock chat
                  </div>
                )}
             </div>
          </aside>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="pd-modal-overlay" onClick={() => setShowReviewModal(false)}>
           <div className="pd-modal-content" onClick={e => e.stopPropagation()}>
              <h2>Leave a Review</h2>
              <div className="pd-star-input">
                {[1, 2, 3, 4, 5].map(s => (
                  <FiStar 
                    key={s} 
                    className={s <= rating ? "pd-star active" : "pd-star"} 
                    onClick={() => setRating(s)}
                  />
                ))}
              </div>
              <textarea 
                placeholder="How was your experience working with this client?" 
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <div className="pd-modal-btns">
                 <button className="pd-modal-cancel" onClick={() => setShowReviewModal(false)}>Cancel</button>
                 <button className="pd-modal-submit" onClick={submitReview}>Submit</button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default ProjectDetails;