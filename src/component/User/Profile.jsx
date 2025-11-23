// src/component/User/Profile.jsx
import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "../Project/ReviewCard";
import "./Profile.css";
import { myBids } from "../../actions/bidAction";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { bids = [], loading: bidsLoading } = useSelector((state) => state.myBids); // Get bids
  const navigate = useNavigate();
  const dispatch = useDispatch();

 useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    } else {
      dispatch(myBids()); // Dispatch here — same as MyBids page
    }
  }, [dispatch, isAuthenticated, navigate]);

  if (loading) return <Loader />;
  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Fragment>
      <MetaData title={`${user.name} - Profile | FlexiWork`} />

      <div className="profile-wrapper">
        {/* HERO */}
        <div className="profile-hero">
          <div className="hero-bg"></div>
          <div className="hero-content">
            <div className="avatar-box">
              <img
                src={user.avatar?.url || "/Profile.png"}
                alt={user.name}
                className="profile-avatar"
              />
              <div className="online-dot"></div>
            </div>

            <h1 className="profile-name">{user.name}</h1>
            <p className="tagline">{user.professionalHeadline || "Freelancer"}</p>

            <div className="location">
              <i className="fas fa-map-marker-alt"></i>
              {user.country || "Earth"}
            </div>

            <div className="stats-bar">
              <div className="stat">
                <strong>{user.numOfReviews || 0}</strong>
                <span>Reviews</span>
              </div>
              <div className="stat highlight">
                <strong>{user.ratings?.toFixed(1) || "0.0"}</strong>
                <span>Rating</span>
              </div>
              <div className="stat">
                <strong>{bids.length || 0}</strong>
                <span>Bids</span>
              </div>
            </div>

            <Link to="/me/update" className="edit-btn">
              <i className="fas fa-edit"></i> Edit Profile
            </Link>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="profile-content">
          <div className="content-grid">
            {/* LEFT: Info */}
            <div className="info-section">
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <strong>Email</strong>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-briefcase"></i>
                    <div>
                      <strong>Profession</strong>
                      <p>{user.professionalHeadline || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-calendar-alt"></i>
                    <div>
                      <strong>Member Since</strong>
                      <p>{joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card payment">
                <h3>Payment Details</h3>
                <div className="info-list">
                  <div className="info-item">
                    <i className="fas fa-university"></i>
                    <div>
                      <strong>Bank Account</strong>
                      <p className="mono">{user.accountNo || "Not added"}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-qrcode"></i>
                    <div>
                      <strong>UPI ID</strong>
                      <p className="mono">{user.upiId || "Not added"}</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fas fa-id-card"></i>
                    <div>
                      <strong>PAN Card</strong>
                      <p className="mono">{user.pancard || "Not added"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Actions + Reviews */}
            <div className="action-review-section">
              <div className="action-grid">
                <Link to="/bids" className="action-card primary">
                  <i className="fas fa-gavel"></i>
                  <div>
                    <h4>My Bids</h4>
                    <p>View all proposals</p>
                  </div>
                </Link>
                <Link to="/password/update" className="action-card secondary">
                  <i className="fas fa-lock"></i>
                  <div>
                    <h4>Change Password</h4>
                    <p>Secure your account</p>
                  </div>
                </Link>
              </div>

              <div className="reviews-card">
                <div className="reviews-header">
                  <h3>
                    <i className="fas fa-star"></i> Client Reviews
                  </h3>
                  <span className="review-count">
                    {user.reviews?.length || 0}
                  </span>
                </div>

                {user.reviews && user.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {user.reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <i className="far fa-comment-slash fa-3x"></i>
                    <p>No reviews yet</p>
                    <small>Deliver great work to earn 5-star reviews!</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;