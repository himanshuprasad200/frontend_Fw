// src/component/Admin/SupportList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../../utils/CustomToast";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import "./SupportList.css";

const SupportList = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // State to handle superadmin replies and expands
  const [expandedId, setExpandedId] = useState(null);
  const [replies, setReplies] = useState({});

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/admin/support", {
        withCredentials: true,
      });
      if (data.success) {
        setSupportRequests(data.supportRequests);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch support queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const handleSuperadminAction = async (id, nextStatus, adminMessageText) => {
    try {
      const { data } = await axios.put(
        `/api/v1/admin/support/${id}`,
        { status: nextStatus, adminMessage: adminMessageText || "" },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        
        // Update local query state
        setSupportRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? {
                  ...req,
                  status: nextStatus,
                  adminMessage: adminMessageText || req.adminMessage,
                  repliedAt: new Date().toISOString(),
                }
              : req
          )
        );
        
        // Collapse row
        setExpandedId(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update support query");
    }
  };

  // Filter support requests
  const filteredRequests = supportRequests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : req.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all"
        ? true
        : categoryFilter === "payments"
        ? req.subject.toLowerCase().includes("payment")
        : categoryFilter === "disputes"
        ? req.subject.toLowerCase().includes("dispute")
        : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="admin-support-layout">
      <Sidebar />
      <div className="admin-support-content">
        <div className="support-header">
          <h1>Superadmin Control Panel</h1>
          <p>Review user support tickets, post replies, trigger status updates, and notify users via system notifications & emails.</p>
        </div>

        {/* Dashboard Filters & Controls */}
        <div className="support-controls">
          <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search by name, email, query text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <div className="select-wrapper">
              <label>Topic</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Topics</option>
                <option value="payments">Payments & Earnings</option>
                <option value="disputes">Disputes & Late Responses</option>
              </select>
            </div>

            <div className="select-wrapper">
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In-Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="support-loader-container">
            <Loader />
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="support-table-container">
            <table className="support-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Topic / Subject</th>
                  <th>Message / Query</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => {
                  const isExpanded = expandedId === req._id;
                  return (
                    <React.Fragment key={req._id}>
                      <tr className={`status-row-${req.status} ${isExpanded ? "row-expanded" : ""}`}>
                        <td className="user-info-cell" onClick={() => setExpandedId(isExpanded ? null : req._id)}>
                          <strong className="user-name">{req.name}</strong>
                          <span className="user-email">{req.email}</span>
                          {req.user && <span className="user-role-badge">{req.user.role}</span>}
                        </td>
                        <td className="subject-cell" onClick={() => setExpandedId(isExpanded ? null : req._id)}>
                          <span className={`subject-badge ${req.subject.toLowerCase().includes("payment") ? "payments" : "disputes"}`}>
                            {req.subject}
                          </span>
                        </td>
                        <td className="message-cell" onClick={() => setExpandedId(isExpanded ? null : req._id)}>
                          <p className="message-text truncate">{req.message}</p>
                        </td>
                        <td className="date-cell" onClick={() => setExpandedId(isExpanded ? null : req._id)}>
                          {new Date(req.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="status-cell" onClick={() => setExpandedId(isExpanded ? null : req._id)}>
                          <span className={`status-badge ${req.status}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="action-cell">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : req._id)}
                            className="manage-btn"
                          >
                            <i className={`fas ${isExpanded ? "fa-times" : "fa-reply"}`}></i> {isExpanded ? "Close" : "Reply"}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expandable Composer Row */}
                      {isExpanded && (
                        <tr className="expanded-details-row">
                          <td colSpan="6">
                            <div className="expanded-details-container">
                              <div className="query-full-message">
                                <h5>Original Support Message:</h5>
                                <p>{req.message}</p>
                              </div>
                              
                              {req.adminMessage && (
                                <div className="current-admin-reply">
                                  <h5>Previous Superadmin Reply:</h5>
                                  <p>{req.adminMessage}</p>
                                  {req.resolvedBy && (
                                    <small className="reply-meta">
                                      Replied by: <strong>{req.resolvedBy.name}</strong> on {new Date(req.repliedAt).toLocaleString()}
                                    </small>
                                  )}
                                </div>
                              )}

                              <div className="superadmin-reply-composer">
                                <h5>Compose Superadmin Reply / Action Message:</h5>
                                <textarea
                                  placeholder="Type your official reply to the user... (This message will be emailed to their inbox and shown on their real-time tracking page)"
                                  value={replies[req._id] !== undefined ? replies[req._id] : req.adminMessage || ""}
                                  onChange={(e) => setReplies({ ...replies, [req._id]: e.target.value })}
                                  rows="4"
                                />
                                <div className="compose-actions">
                                  <button
                                    onClick={() => handleSuperadminAction(req._id, "in-progress", replies[req._id])}
                                    className="action-submit-btn in-progress"
                                  >
                                    <i className="fas fa-spinner"></i> Set In-Progress & Notify
                                  </button>
                                  <button
                                    onClick={() => handleSuperadminAction(req._id, "resolved", replies[req._id])}
                                    className="action-submit-btn resolved"
                                  >
                                    <i className="fas fa-check-circle"></i> Resolve Ticket & Notify
                                  </button>
                                  <button
                                    onClick={() => handleSuperadminAction(req._id, "open", replies[req._id])}
                                    className="action-submit-btn open"
                                  >
                                    <i className="fas fa-undo"></i> Reopen Ticket & Notify
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="support-empty-state">
            <i className="fas fa-folder-open empty-icon"></i>
            <h3>No Support Queries Found</h3>
            <p>We couldn't find any user support queries matching your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportList;
