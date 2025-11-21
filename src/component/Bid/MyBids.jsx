// src/components/Bid/MyBids.jsx
import React, { Fragment, useEffect } from "react";
import "./MyBids.css";
import { clearErrors, myBids } from "../../actions/bidAction";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";

const MyBids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, bids } = useSelector((state) => state.myBids);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch bids
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(myBids());
    }
  }, [dispatch, isAuthenticated, user]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  if (loading) return <Loader />;
  if (!isAuthenticated) return null;

  const bidList = bids || [];

  return (
    <Fragment>
      <MetaData title={`${user?.name || "User"}'s Bids`} />

      <div className="my-bids-container">
        <h1 className="my-bids-title">{user?.name}'s Bids</h1>

        {bidList.length === 0 ? (
          <div className="empty-bids">
            <p>No bids found. Start bidding on projects!</p>
            <Link to="/projects" className="browse-projects-btn">
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="bids-table-wrapper">
            <table className="bids-table">
              <thead>
                <tr>
                  <th>Bid ID</th>
                  <th>Proposal</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bidList.map((bid) => (
                  <tr key={bid._id} className="bid-row">
                    <td data-label="Bid ID" className="bid-id">
                      {bid._id}
                    </td>
                    <td data-label="Proposal" className="bid-proposal">
                      {bid.proposal?.length > 50
                        ? `${bid.proposal.substring(0, 50)}...`
                        : bid.proposal || "—"}
                    </td>
                    <td data-label="Status">
                      <span
                        className={`status-badge ${
                          bid.response === "Approved"
                            ? "approved"
                            : bid.response === "Pending"
                            ? "pending"
                            : "rejected"
                        }`}
                      >
                        {bid.response || "Pending"}
                      </span>
                    </td>
                    <td data-label="Created" className="bid-date">
                      {formatDate(bid.createdAt)}
                    </td>
                    <td data-label="Actions" className="bid-actions">
                      <Link to={`/bid/${bid._id}`} className="view-bid-link">
                        <FiExternalLink />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default MyBids;