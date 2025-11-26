import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { deleteBid, getAllBids, clearErrors } from "../../actions/bidAction";
import { DELETE_BID_RESET } from "../../constants/bidConstant";
import "./BidList.css";

const BidList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, bids } = useSelector((state) => state.allBids);
  const { error: deleteError, isDeleted } = useSelector((state) => state.bid);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bidsPerPage = 8;

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
      setCurrentPage(1); // Reset to first page after delete
      dispatch({ type: DELETE_BID_RESET });
    }
    dispatch(getAllBids());
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  // Sort bids by latest first
  const sortedBids = bids
    ? [...bids].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  // Pagination logic
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
          <h1 className="bidListHeading">All Bids</h1>
          <p className="bidsCount">Total: {sortedBids.length} bids</p>

          <div className="bidListTableWrapper">
            {sortedBids.length === 0 ? (
              <div className="emptyState">
                <p>No bids found.</p>
              </div>
            ) : (
              <>
                <div className="bidListTable">
                  {/* Desktop Header */}
                  <div className="tableHeader">
                    <div className="headerCell">Bid ID</div>
                    <div className="headerCell">Proposal</div>
                    <div className="headerCell">Status</div>
                    <div className="headerCell">Date</div>
                    <div className="headerCell">Actions</div>
                  </div>

                  {/* Table Rows */}
                  {currentBids.map((bid) => (
                    <div key={bid._id} className="tableRow">
                      <div className="tableCell id">
                        <span className="mobileLabel">ID:</span>
                        {bid._id.slice(-10)}
                      </div>
                      <div className="tableCell proposal">
                        <span className="mobileLabel">Proposal:</span>
                        <p className="proposalText">
                          {bid.proposal.length > 120
                            ? bid.proposal.substring(0, 120) + "..."
                            : bid.proposal}
                        </p>
                      </div>
                      <div className="tableCell status">
                        <span className="mobileLabel">Status:</span>
                        <span
                          className={`statusBadge ${
                            bid.response === "Approved"
                              ? "approved"
                              : bid.response === "Pending"
                              ? "pending"
                              : "rejected"
                          }`}
                        >
                          {bid.response}
                        </span>
                      </div>
                      <div className="tableCell date">
                        <span className="mobileLabel">Date:</span>
                        {formatDate(bid.createdAt)}
                      </div>
                      <div className="tableCell actions">
                        <span className="mobileLabel">Actions:</span>
                        <div className="actionButtons">
                          <Link to={`/admin/bid/${bid._id}`} className="actionBtn editBtn" title="Edit">
                            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                          </Link>
                          <button onClick={() => deleteBidHandler(bid._id)} className="actionBtn deleteBtn" title="Delete">
                            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                          </button>
                          <Link to={`/bid/${bid._id}`} className="actionBtn viewBtn" title="View">
                            <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pageBtn prevBtn"
                    >
                      ← Previous
                    </button>

                    <div className="pageNumbers">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`pageBtn ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pageBtn nextBtn"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BidList;