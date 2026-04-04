// src/components/Bid/MyBids.jsx
import React, { Fragment, useEffect, useState } from "react";
import "./MyBids.css";
import { clearErrors, myBids } from "../../actions/bidAction";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/CustomToast";
import { Link, useNavigate } from "react-router-dom";
import { FiExternalLink, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaComments, FaRocket } from "react-icons/fa";

const MyBids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, bids = [] } = useSelector((state) => state.myBids);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(myBids());
    }
  }, [dispatch, isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBids = bids.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bids.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <Fragment>
      <MetaData title={`${user?.name || "User"}'s Bids - FlexiWork`} />

      <div className="my-bids-page">
        {/* Header Section */}
        <header className="bids-header-new">
          <div className="header-meta-new">
             <h1 className="bids-title-new">My Project Proposals</h1>
             <p className="bids-subtitle-new">
               Tracking your <strong>{bids.length}</strong> active applications in the network.
             </p>
          </div>
          <Link to="/projects" className="browse-more-btn">
            Find New Projects
          </Link>
        </header>

        {bids.length === 0 ? (
          <div className="empty-bids-state">
            <div className="empty-icon-wrapper">
               <FaRocket />
            </div>
            <h3>No Active Bids Found</h3>
            <p>Your future successes wait in the projects list! Start applying to build your portfolio.</p>
            <Link to="/projects" className="action-link-new">Explore Opportunities</Link>
          </div>
        ) : (
          <div className="bids-table-wrapper">
            <table className="premium-bids-table">
              <thead>
                <tr>
                  <th>PROJECT DETAILS</th>
                  <th>OFFER</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentBids.map((bid) => {
                  const totalBudget = (bid.bidsItems || []).reduce((sum, item) => sum + Number(item.price || 0), 0);
                  const firstItem = bid.bidsItems?.[0] || {};
                  const firstProject = firstItem.project || {};
                  const status = bid.response || "Pending";
                  
                  return (
                    <tr key={bid._id} className="premium-bid-row">
                      <td className="p-cell-main">
                         <div className="p-cell-box">
                            <img src={firstProject.images?.[0]?.url || "/Profile.png"} alt="T" />
                            <div className="p-cell-info">
                               <strong>{firstProject.title || "Project Name"}</strong>
                               <span>ID: #{bid._id.slice(-6).toUpperCase()}</span>
                            </div>
                         </div>
                      </td>
                      <td className="p-cell-price">
                        <strong>₹{totalBudget.toLocaleString("en-IN")}</strong>
                      </td>
                      <td>
                         <span className={`p-status-pill tag-${status.toLowerCase()}`}>
                            {status}
                         </span>
                      </td>
                      <td className="p-cell-date">{formatDate(bid.createdAt)}</td>
                      <td className="p-cell-actions">
                         <div className="p-action-group">
                            <Link to={`/bid/${bid._id}`} className="p-action-btn" title="View Details">
                               <FiExternalLink />
                            </Link>
                            {(status === "Pending" || status === "Approved") && firstProject.postedBy?._id && (
                              <button 
                                className="p-action-btn chat" 
                                title="Chat with Client"
                                onClick={() => navigate(`/chat/${firstProject.postedBy._id}`)}
                              >
                                <FaComments />
                              </button>
                            )}
                         </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bids-pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pag-nav-btn"
                >
                  <FiChevronLeft /> Prev
                </button>
                
                <div className="pag-numbers">
                   {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => paginate(i + 1)}
                        className={`pag-num-btn ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        {i + 1}
                      </button>
                   ))}
                </div>

                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pag-nav-btn"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default MyBids;