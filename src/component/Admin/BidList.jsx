import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/CustomToast";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { deleteBid, getAllBids, clearErrors } from "../../actions/bidAction";
import { DELETE_BID_RESET } from "../../constants/bidConstant";
import "./BidList.css";
import { 
  FaEdit, FaTrash, FaEye, FaChevronLeft, FaChevronRight, FaTimes, 
  FaCreditCard, FaComments, FaCheckCircle, FaTimesCircle, FaClock,
  FaExclamationTriangle, FaSpinner
} from "react-icons/fa";

const BidList = () => {
  const dispatch = useDispatch();

   const { error, bids } = useSelector((state) => state.allBids);
   const { loading: isDeleting, error: deleteError, isDeleted } = useSelector((state) => state.bid);
 
   const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 8;
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
   const [showModal, setShowModal] = useState(false);
   const [selectedProposal, setSelectedProposal] = useState("");
   const [selectedBidId, setSelectedBidId] = useState("");
 
   // Delete Modal State
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [bidToDelete, setBidToDelete] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const deleteBidHandler = (id) => {
    setBidToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (bidToDelete) {
      dispatch(deleteBid(bidToDelete));
    }
  };

  useEffect(() => {
    if (isDeleted) {
       setShowDeleteModal(false);
       setBidToDelete(null);
    }
  }, [isDeleted]);

  const openProposalModal = (proposal, bidId) => {
    setSelectedProposal(proposal);
    setSelectedBidId(bidId);
    setShowModal(true);
  };

  useEffect(() => {
    if (error) {
       toast.error(error);
       dispatch(clearErrors());
    }
    if (deleteError) {
       toast.error(deleteError);
       dispatch(clearErrors());
    }
    if (isDeleted) {
       toast.success("Bid Deleted Successfully");
       setCurrentPage(1);
       dispatch({ type: DELETE_BID_RESET });
    }
    dispatch(getAllBids());
  }, [dispatch, error, deleteError, isDeleted]);

  const filteredBids = bids
    ? bids.filter((bid) => {
        const bidStatus = bid.response?.toLowerCase() || "pending";
        if (statusFilter === "All") return true;
        return bidStatus === statusFilter.toLowerCase();
      })
    : [];

  const sortedBids = [...filteredBids].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = sortedBids.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(sortedBids.length / bidsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <MetaData title="All Bids - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="bids-container">
            <div className="bids-header-row">
              <div>
                <h1 className="bids-title">All Bids</h1>
                <p className="bids-total">Total: {sortedBids.length} bids</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="status-filter-container">
                {["All", "Pending", "Approved", "Rejected"].map((status) => (
                  <button
                    key={status}
                    className={`filter-tab ${statusFilter === status ? "active" : ""} ${status.toLowerCase()}`}
                    onClick={() => {
                      setStatusFilter(status);
                      setCurrentPage(1);
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {sortedBids.length === 0 ? (
              <div className="bids-empty">
                <p>{statusFilter !== "All" ? `No ${statusFilter.toLowerCase()} bids found.` : "No bids found."}</p>
                {statusFilter !== "All" && (
                  <button className="reset-filter-btn" onClick={() => setStatusFilter("All")}>
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="bids-card">
                <div className="bids-table-scroll">
                  <table className="bids-table">
                    <thead>
                      <tr>
                        <th>Bid ID</th>
                        <th>Project</th>
                        <th>Applicant</th>
                        <th>Price</th>
                        <th>Proposal</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBids.map((bid) => (
                        <tr key={bid._id}>
                          <td className="bids-id">#{bid._id.slice(-8).toUpperCase()}</td>
                          <td style={{maxWidth: '180px', fontWeight: '600'}}>
                             {bid.bidsItems?.map(item => item.project?.title).join(', ') || "N/A"}
                          </td>
                          <td>
                            <div className="applicant-info">
                              <img
                                src={bid.user?.avatar?.url || "/default-avatar.png"}
                                alt={bid.user?.name}
                                className="applicant-avatar"
                              />
                              <div className="applicant-details">
                                <span className="applicant-name">{bid.user?.name || "Unknown"}</span>
                                <span className="applicant-role">{bid.user?.role || "User"}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{fontWeight: '700', color: '#1e293b'}}>
                             ₹{bid.bidsItems?.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString("en-IN")}
                          </td>
                          <td>
                            <div className="proposal-content">
                              <p className="proposal-preview">
                                {bid.proposal}
                              </p>
                              {bid.proposal.length > 80 && (
                                <button
                                  className="view-full-btn"
                                  onClick={() => openProposalModal(bid.proposal, bid._id)}
                                >
                                  View Full →
                                </button>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`bids-status-badge ${bid.response?.toLowerCase() || "pending"}`}>
                              {bid.response === "Approved" ? <FaCheckCircle /> : bid.response === "Rejected" ? <FaTimesCircle /> : <FaClock />}
                              {bid.response || "Pending"}
                            </span>
                          </td>
                          <td className="bids-date">{formatDate(bid.createdAt)}</td>
                          <td>
                            <div className="bids-action-group">
                              <Link to={`/admin/bid/${bid._id}`} className="bids-btn bids-edit" title="Process Response">
                                <FaEdit />
                              </Link>

                              <Link to={`/bid/${bid._id}`} className="bids-btn bids-view" title="View Details">
                                <FaEye />
                              </Link>

                              <button onClick={() => deleteBidHandler(bid._id)} className="bids-btn bids-delete" title="Delete">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bids-pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bids-page-btn"
                    >
                      <FaChevronLeft />
                    </button>

                    <div className="bids-page-numbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`bids-page-btn ${currentPage === i + 1 ? "bids-active" : ""}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bids-page-btn"
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Proposal Modal */}
      {showModal && (
        <div className="proposal-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="proposal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Full Proposal</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-bid-id">Bid ID: #{selectedBidId.slice(-8).toUpperCase()}</p>
              <p className="modal-proposal-text">{selectedProposal}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal animate-pop-in">
            <div className="delete-modal-icon">
              <FaExclamationTriangle />
            </div>
            <h2>Confirm Deletion</h2>
            <p>
              Are you sure you want to delete this bid? <br />
              <span>This action cannot be undone and will remove all associated data.</span>
            </p>
            
            <div className="delete-modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-delete-confirm" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="deleting-loader">
                    <FaSpinner className="spin" /> Deleting...
                  </span>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default BidList;