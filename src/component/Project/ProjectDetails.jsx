import React, { Fragment, useEffect, useState } from "react";
import "./ProjectDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProjectDetails,
  newReviewForProject,
} from "../../actions/projectAction";
import { Link, useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/Loader/Loader.jsx";
import MetaData from "../layout/MetaData.jsx";
import { addToBidItems } from "../../actions/bidAction.jsx";
import { NEW_REVIEW_RESET } from "../../constants/projectConstant.jsx";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { project, loading, error } = useSelector(
    (state) => state.projectDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newProjectReview
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProjectDetails(id));
  }, [dispatch, id, error, success, reviewError]);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const addBidItemsHandler = () => {
    dispatch(addToBidItems(id));
  };

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const reviewSubmitHandler = () => {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please add a rating and comment before submitting.");
      return;
    }

    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("projectId", id);

    dispatch(newReviewForProject(myForm));
    setOpen(false);
  };

  const renderStars = (value = 0) => {
    const filled = Math.round(value);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < filled ? "#facc15" : "#d1d5db" }}>
        ★
      </span>
    ));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${project?.title} -- FlexiWork`} />
          <div className="projectDetails">
            <div className="boxContainer">
              <div className="left">
                <span className="breadcrumbs">
                  Category: {project?.category}
                </span>
                <h1>{project?.title}</h1>

                <div className="user">
                  <img
                    className="pp"
                    src={project?.postedBy?.avatar?.url || "/Profile.png"}
                    alt="Profile"
                  />
                  <span>{project?.postedBy?.name}</span>
                  <div className="stars">
                    {renderStars(project?.ratings)}
                    <span>({project?.numOfReviews} Reviews)</span>
                  </div>
                </div>

                <div className="projectImage">
                  {project?.images && project.images.length > 0 && (
                    <img src={project.images[0].url} alt={project.name} />
                  )}
                </div>

                <hr />
                <h2>Project Details</h2>
                <p>{project?.desc}</p>

                <div className="item">
                  <div className="secondUser">
                    <img
                      src={project?.postedBy?.avatar?.url || "/Profile.png"}
                      alt="Profile"
                    />
                    <div className="info">
                      <span>{project?.postedBy?.name}</span>
                      <div className="country">
                        <span>{project?.postedBy?.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="secondstars">
                    {renderStars(project?.ratings)}
                    <a href="mailto:flexiworkclient@gmail.com">
                      <button className="contactButton">Contact Me</button>
                    </a>
                    <button
                      onClick={submitReviewToggle}
                      className="submitReview"
                    >
                      Submit Review
                    </button>
                  </div>

                  <hr />
                  <h3 className="reviewsHeading">Reviews</h3>

                  {/* Simple Custom Modal instead of MUI Dialog */}
                  {open && (
                    <div className="customDialog">
                      <div className="customDialogContent">
                        <h2>Submit Review</h2>
                        <div className="starInput">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <span
                              key={val}
                              style={{
                                cursor: "pointer",
                                color: val <= rating ? "#facc15" : "#d1d5db",
                                fontSize: "1.5rem",
                              }}
                              onClick={() => setRating(val)}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <textarea
                          placeholder="Write your review..."
                          className="submitDialogTextArea"
                          cols="30"
                          rows="5"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        <div className="dialogActions">
                          <button
                            onClick={submitReviewToggle}
                            className="cancelBtn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={reviewSubmitHandler}
                            className="submitBtn"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {project?.reviews && project.reviews.length > 0 ? (
                    <div className="reviews">
                      {project.reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))}
                    </div>
                  ) : (
                    <p className="noReviews">No Reviews Yet</p>
                  )}
                </div>
              </div>

              <div className="right">
                <div className="price">
                  <h2>{project?.title}</h2>
                  <h3>{`₹${project?.price}`}</h3>
                </div>
                <span>Category: {project?.category}</span>
                <p>{project?.desc}</p>
                <Link to="/proposal">
                  <button onClick={addBidItemsHandler}>Continue</button>
                </Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProjectDetails;
