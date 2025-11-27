// src/components/Bid/BidDetails.jsx
import React, { Fragment, useEffect } from "react";
import "./BidDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getBidDetails } from "../../actions/bidAction";
import { Link, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import toast from "react-hot-toast";

const BidDetails = () => {
  const { bid, error, loading } = useSelector((state) => state.bidDetails);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getBidDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  if (loading) return <Loader />;
  if (!bid) return <div className="not-found">Bid not found</div>;

  const totalBudget = (bid.bidsItems || []).reduce((sum, p) => sum + Number(p.price || 0), 0);

  return (
    <Fragment>
      <MetaData title={`Bid #${bid._id?.slice(-8).toUpperCase()} - Details`} />

      <div className="bid-details-page">

          {/* Header */}
        <div className="bid-header">
          <h1>Bid Details</h1>
          <p className="submit-date">
            Submitted on{" "}
            {new Date(bid.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Freelancer Who Applied */}
        {bid.user && (
          <div className="freelancer-applied-card">
            <div className="freelancer-avatar">
              <img
                src={bid.user.avatar?.url || "/default-avatar.png"}
                alt={bid.user.name}
              />
            </div>
            <div className="freelancer-details">
              <h3>{bid.user.name}</h3>
              <p className="freelancer-email">{bid.user.email}</p>
              <span className="applied-label">Applied on this bid</span>
            </div>
          </div>
        )}

        {/* Proposal Section */}
        <div className="proposal-section">
          <h2>Your Proposal</h2>
          <div className="proposal-box">
            <p>"{bid.proposal}"</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Status</p>
            <span className={`status-badge ${bid.response?.toLowerCase() || "pending"}`}>
              {bid.response || "Pending"}
            </span>
          </div>

          <div className="stat-card">
            <p className="stat-label">Total Projects</p>
            <p className="stat-value">{bid.bidsItems?.length || 0}</p>
          </div>

          <div className="stat-card">
            <p className="stat-label">Total Budget</p>
            <p className="stat-price">₹{totalBudget.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-section">
          <h2>Projects Included ({bid.bidsItems?.length || 0})</h2>

          {bid.bidsItems && bid.bidsItems.length > 0 ? (
            <div className="projects-grid">
              {bid.bidsItems.map((project) => (
                <div key={project._id} className="project-card">
                  <div className="project-image">
                    {project.images?.[0]?.url ? (
                      <img src={project.images[0].url} alt={project.title} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="project-info">
                    <p className="client-name">
                      Client: <strong>{project.postedBy?.name || "Unknown"}</strong>
                    </p>

                    <Link to={`/project/${project._id}`} className="project-title">
                      {project.title || "Untitled Project"}
                    </Link>

                    <p className="project-category">
                      {project.category || "General"}
                    </p>

                    <div className="project-footer">
                      <span className="project-price">
                        ₹{Number(project.price || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="project-id">
                        ID: {project._id?.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No projects found in this bid.</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default BidDetails;