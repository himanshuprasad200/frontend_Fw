import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "../Project/ReviewCard";
import "./Profile.css";
import { myBids } from "../../actions/bidAction";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const { bids = [] } = useSelector((state) => state.myBids);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("reviews");

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    } else {
      dispatch(myBids());
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

      <div className="profile-container-new">
        {/* Banner Section - Dynamic */}
        <div className="profile-banner">
          <img 
            src={user.banner?.url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1600"} 
            alt="Banner" 
            className="banner-img" 
          />
          <div className="banner-overlay"></div>
          <Link to="/me/update" className="edit-banner-btn">
            <i className="fas fa-camera"></i>
          </Link>
          
          <div className="banner-actions-group">
             <Link to="/admin/new-project" className="banner-action-btn">
              + POST A PROJECT
            </Link>
            <Link to="/password/update" className="banner-action-btn alt">
              <i className="fas fa-lock"></i> PASSWORD
            </Link>
          </div>
        </div>

        <div className="profile-main-layout-new">
          {/* Left Sidebar Section */}
          <aside className="profile-sidebar-new">
            <div className="sidebar-top-overlap">
              <div className="avatar-wrapper-new">
                {user.avatar?.url && user.avatar.url !== "/Profile.png" &&  user.avatar.url !== "default_avatar" ? (
                   <img src={user.avatar.url} alt={user.name} />
                ) : (
                   <div className="avatar-placeholder-large">
                     {user.name ? (
                        user.name.split(" ").length > 1 
                          ? (user.name.split(" ")[0][0] + user.name.split(" ")[user.name.split(" ").length-1][0]).toUpperCase()
                          : user.name.slice(0, 2).toUpperCase()
                     ) : "U"}
                   </div>
                )}
                <Link to="/me/update" className="avatar-edit-icon">
                  <i className="fas fa-camera"></i>
                </Link>
              </div>
            </div>

            <div className="sidebar-info-new">
              <h2 className="user-name-new">{user.name}</h2>
              <p className="user-loc-new">
                <i className="fas fa-map-marker-alt"></i> {user.country || "Earth"}
              </p>

              <div className="score-section-new">
                <span className="score-label">RATINGS</span>
                <div className="score-value-wrap">
                  <span className="score-num">{user.ratings?.toFixed(1) || "0.0"}</span>
                  <span className="score-plus">★</span>
                </div>
                <span className="score-subtext">Community Standing</span>
              </div>

              <div className="badges-section-new">
                <span className="badges-label">BADGES</span>
                <div className="badges-grid-new">
                  <div className="badge-item-new">
                    <div className="badge-circle"><i className="fas fa-award"></i></div>
                    <span>Pro</span>
                  </div>
                  <div className="badge-item-new">
                    <div className="badge-circle"><i className="fas fa-certificate"></i></div>
                    <span>Expert</span>
                  </div>
                  <div className="badge-item-new">
                    <div className="badge-circle"><i className="fas fa-shield-alt"></i></div>
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              <Link to="/me/update" className="sidebar-footer-btn">
                EDIT PROFILE DETAILS &gt;
              </Link>
            </div>
          </aside>

          {/* Right Content Section */}
          <main className="profile-content-new">
            <nav className="content-tabs-new">
              <button 
                className={activeTab === "reviews" ? "active" : ""} 
                onClick={() => setActiveTab("reviews")}
              >
                Client Reviews
              </button>
              <button 
                className={activeTab === "info" ? "active" : ""} 
                onClick={() => setActiveTab("info")}
              >
                Personal Info
              </button>
              <button 
                className={activeTab === "bids" ? "active" : ""} 
                onClick={() => setActiveTab("bids")}
              >
                Recent Bids
              </button>
            </nav>

            <div className="tab-content-area">
              {activeTab === "reviews" && (
                <div className="reviews-masonry">
                  {user.reviews && user.reviews.length > 0 ? (
                    user.reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))
                  ) : (
                    <div className="empty-tab-state">
                      <i className="far fa-comment-dots"></i>
                      <p>No reviews yet. Complete projects to earn client feedback.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "info" && (
                <div className="info-tab-new">
                  <div className="info-grid-new">
                    <div className="info-box-new">
                      <label>Email Address</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="info-box-new">
                      <label>Profession</label>
                      <p>{user.professionalHeadline || "Freelancer"}</p>
                    </div>
                    <div className="info-box-new">
                      <label>Member Since</label>
                      <p>{joinDate}</p>
                    </div>
                    <div className="info-box-new">
                      <label>Total Bids</label>
                      <p>{bids.length} Active Proposals</p>
                    </div>
                  </div>
                  <div className="profile-tools-new">
                    <Link to="/me/update" className="tool-btn">
                       <i className="fas fa-user-edit"></i> Edit Bio & Skills
                    </Link>
                    <Link to="/password/update" className="tool-btn alt">
                       <i className="fas fa-key"></i> Update Password
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "bids" && (
                <div className="bids-tab-new">
                   <p className="bids-coming-soon">You have {bids.length} active management routes available.</p>
                   <Link to="/bids" className="manage-bids-btn">Manage All Bids</Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;