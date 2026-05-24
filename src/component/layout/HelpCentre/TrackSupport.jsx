// src/component/layout/HelpCentre/TrackSupport.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../../../utils/CustomToast";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { FaHeadset, FaChevronDown, FaChevronUp, FaClock, FaCheckCircle, FaInbox, FaArrowLeft } from "react-icons/fa";
import "./TrackSupport.css";

const TrackSupport = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchMyQueries = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/support/me", {
        withCredentials: true,
      });
      if (data.success) {
        setSupportRequests(data.supportRequests);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch your support queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyQueries();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="track-support-page">
      <div className="track-container">
        {/* Header Section */}
        <div className="track-header">
          <Link to="/help-center" className="back-btn">
            <FaArrowLeft /> Back to Help Center
          </Link>
          <h1>Track Support Queries</h1>
          <p>Monitor the status and progress of all support tickets you have submitted to our team</p>
        </div>

        {loading ? (
          <div className="track-loader-container">
            <Loader />
          </div>
        ) : supportRequests.length > 0 ? (
          <div className="queries-list">
            {supportRequests.map((query) => {
              const isExpanded = expandedId === query._id;
              
              // Define step progress based on status
              let step = 1; // Submitted
              if (query.status === "in-progress") step = 2; // Under Review
              if (query.status === "resolved") step = 3; // Resolved

              return (
                <div key={query._id} className={`query-card ${query.status} ${isExpanded ? "expanded" : ""}`}>
                  {/* Summary Card Header */}
                  <div className="query-card-header" onClick={() => toggleExpand(query._id)}>
                    <div className="query-main-info">
                      <div className="query-subject-row">
                        <span className={`query-category-badge ${query.subject.toLowerCase().includes("payment") ? "payments" : "disputes"}`}>
                          {query.subject}
                        </span>
                        <span className={`query-status-badge ${query.status}`}>
                          {query.status}
                        </span>
                      </div>
                      <h3>{query.message.slice(0, 70)}{query.message.length > 70 ? "..." : ""}</h3>
                      <div className="query-meta">
                        <span><FaClock /> Submitted on: {new Date(query.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}</span>
                      </div>
                    </div>
                    <button className="expand-card-btn">
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div className="query-card-details">
                      {/* Original User Query */}
                      <div className="detail-section user-query">
                        <h4>Original Message</h4>
                        <div className="message-content">
                          <p>{query.message}</p>
                        </div>
                      </div>

                      {/* Real-time Tracking Timeline */}
                      <div className="detail-section timeline-section">
                        <h4>Ticket Progress</h4>
                        <div className="timeline-tracker">
                          {/* Step 1 */}
                          <div className={`timeline-step completed`}>
                            <div className="step-number"><FaCheckCircle /></div>
                            <div className="step-content">
                              <h5>Ticket Submitted</h5>
                              <p>We received your request successfully.</p>
                            </div>
                          </div>
                          {/* Step 2 */}
                          <div className={`timeline-step ${step >= 2 ? "completed" : "pending"}`}>
                            <div className="step-number">
                              {step >= 2 ? <FaCheckCircle /> : <div className="dot"></div>}
                            </div>
                            <div className="step-content">
                              <h5>Under Review</h5>
                              <p>Our Superadmin team is actively reviewing your query details.</p>
                            </div>
                          </div>
                          {/* Step 3 */}
                          <div className={`timeline-step ${step === 3 ? "completed" : "pending"}`}>
                            <div className="step-number">
                              {step === 3 ? <FaCheckCircle /> : <div className="dot"></div>}
                            </div>
                            <div className="step-content">
                              <h5>Resolved</h5>
                              <p>Your query has been fully resolved.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Superadmin Response Reply */}
                      {query.adminMessage ? (
                        <div className="detail-section admin-response">
                          <div className="admin-reply-box">
                            <div className="reply-header">
                              <div className="replier-avatar">
                                <FaHeadset />
                              </div>
                              <div>
                                <h5>Superadmin Official Response</h5>
                                <span className="reply-date">
                                  Replied on: {new Date(query.repliedAt).toLocaleString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="reply-message">
                              <p>{query.adminMessage}</p>
                            </div>
                            {query.resolvedBy && (
                              <div className="resolved-by-footer">
                                <small>Handled and resolved by: <strong>{query.resolvedBy.name}</strong></small>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        query.status !== "resolved" && (
                          <div className="detail-section waiting-response">
                            <p>We are currently working on your query. A Superadmin will post an official response here shortly.</p>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="track-empty-state">
            <FaInbox className="empty-icon" />
            <h3>No Support Queries Yet</h3>
            <p>You haven't submitted any support queries yet. If you have any payment, earnings, or dispute issues, you can submit a query from our Help Center.</p>
            <Link to="/help-center" className="empty-cta-btn">
              Go to Help Center
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackSupport;
