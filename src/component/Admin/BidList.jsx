import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { deleteBid, getAllBids, clearErrors } from "../../actions/bidAction";
import { DELETE_BID_RESET } from "../../constants/bidConstant";
import "./BidList.css";

const BidList = () => {
  const dispatch = useDispatch();

  const { error, bids } = useSelector((state) => state.allBids);
  const { error: deleteError, isDeleted } = useSelector((state) => state.bid);

  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 8;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState("");
  const [selectedBidId, setSelectedBidId] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const deleteBidHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      dispatch(deleteBid(id));
    }
  };

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

  const sortedBids = bids
    ? [...bids].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const indexOfLastBid = currentPage * bidsPerPage;
  const indexOfFirstBid = indexOfLastBid - bidsPerPage;
  const currentBids = sortedBids.slice(indexOfFirstBid, indexOfLastBid);
  const totalPages = Math.ceil(sortedBids.length / bidsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <MetaData title="All Bids - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="bids-container">
            <h1 className="bids-title">All Bids</h1>
            <p className="bids-total">Total: {sortedBids.length} bids</p>

            {sortedBids.length === 0 ? (
              <div className="bids-empty">
                <p>No bids found.</p>
              </div>
            ) : (
              <div className="bids-card">
                <div className="bids-table">
                  {/* Header */}
                  <div className="bids-header">
                    <div className="bids-header-cell">Bid ID</div>
                    <div className="bids-header-cell">Proposal</div>
                    <div className="bids-header-cell">Status</div>
                    <div className="bids-header-cell">Date</div>
                    <div className="bids-header-cell">Actions</div>
                  </div>

                  {/* Rows */}
                  {currentBids.map((bid) => (
                    <div key={bid._id} className="bids-row">
                      <div className="bids-cell bids-id">
                        <span className="bids-mobile-label">ID:</span>
                        #{bid._id.slice(-8).toUpperCase()}
                      </div>

                      <div className="bids-cell bids-proposal">
                        <span className="bids-mobile-label">Proposal:</span>
                        <div className="proposal-content">
                          <p className="proposal-preview">
                            {bid.proposal.length > 140
                              ? bid.proposal.substring(0, 140) + "..."
                              : bid.proposal}
                          </p>
                          {bid.proposal.length > 140 && (
                            <button
                              className="view-full-btn"
                              onClick={() => openProposalModal(bid.proposal, bid._id)}
                            >
                              View Full →
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="bids-cell bids-status">
                        <span className="bids-mobile-label">Status:</span>
                        <span className={`bids-status-badge ${bid.response?.toLowerCase() || "pending"}`}>
                          {bid.response || "Pending"}
                        </span>
                      </div>

                      <div className="bids-cell bids-date">
                        <span className="bids-mobile-label">Date:</span>
                        {formatDate(bid.createdAt)}
                      </div>

                      <div className="bids-cell bids-actions">
                        <span className="bids-mobile-label">Actions:</span>
                        <div className="bids-action-group">
                          <Link to={`/admin/bid/${bid._id}`} className="bids-btn bids-edit" title="Process">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                          </Link>

                          <button onClick={() => deleteBidHandler(bid._id)} className="bids-btn bids-delete" title="Delete">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                          </button>

                          <Link to={`/bid/${bid._id}`} className="bids-btn bids-view" title="View Details">
                            <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bids-pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bids-page-btn bids-prev"
                    >
                      ← Previous
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
                      className="bids-page-btn bids-next"
                    >
                      Next →
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
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
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
    </Fragment>
  );
};

export default BidList;