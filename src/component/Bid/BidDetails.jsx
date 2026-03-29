// src/components/Bid/BidDetails.jsx
import React, { Fragment, useEffect } from "react";
import "./BidDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getBidDetails } from "../../actions/bidAction";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import toast from "react-hot-toast";
import { FaComments, FaAward, FaCalendarAlt, FaCheckCircle, FaProjectDiagram, FaWallet, FaChevronRight } from "react-icons/fa";

const BidDetails = () => {
  const { bid, error, loading } = useSelector((state) => state.bidDetails);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

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

      <div className="bid-details-container">
        {/* Main Grid: Header + Body */}
        <div className="bid-content-grid">
          
          {/* Top Bar: Title & Primary Stats */}
          <div className="bid-top-bar">
            <div className="top-info">
              <h1>Bid <small>#{bid._id?.slice(-8).toUpperCase()}</small></h1>
              <p><FaAward /> Candidate: <strong>{bid.user?.name}</strong></p>
              <p><FaCalendarAlt /> Submitted on {new Date(bid.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            
            <div className="top-stats">
              <div className="stat-box">
                <span className="box-label">Bid Status</span>
                <span className={`status-badge-lg ${bid.response?.toLowerCase() || "pending"}`}>
                  <FaCheckCircle /> {bid.response || "Pending"}
                </span>
              </div>
              <div className="stat-box">
                <span className="box-label">Evaluation Balance</span>
                <span className="price-lg">₹{totalBudget.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="bid-main-flex">
            {/* Left: Proposal & Freelancer */}
            <div className="bid-left-col">
              
              <div className="info-section">
                <h3><FaAward /> Proposal Narrative</h3>
                <div className="proposal-content">
                  {bid.proposal}
                </div>
              </div>

              {/* Client Info (Dynamic from Project) */}
              {bid.bidsItems?.[0]?.postedBy && (
                <div className="user-profile-card client-info-box">
                   <div className="card-tag">PROJECT OWNER</div>
                  <div className="user-card-head">
                    <img 
                      src={bid.bidsItems[0].postedBy.avatar?.url || "/Profile.png"} 
                      alt="client" 
                    />
                    <div className="user-card-id">
                      <h4>{bid.bidsItems[0].postedBy.name}</h4>
                      <p>Client / Employer</p>
                    </div>
                  </div>
                  <div className="user-card-actions">
                     <button 
                       className="chat-action-btn client-btn"
                       onClick={() => navigate(`/chat/${bid.bidsItems[0].postedBy._id}`)}
                     >
                       <FaComments /> Chat with Client
                     </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Project Items */}
            <div className="bid-right-col">
              <div className="projects-list-header">
                <h3><FaProjectDiagram /> Scope of Work ({bid.bidsItems?.length || 0})</h3>
              </div>
              
              <div className="items-container">
                {bid.bidsItems && bid.bidsItems.map((project) => (
                  <div key={project._id} className="bid-item-card">
                    <img src={project.images?.[0]?.url || "/default-avatar.png"} alt="thumb" className="item-thumb" />
                    <div className="item-meta">
                      <div className="item-title-row">
                        <Link to={`/project/${project._id}`} className="item-link">
                          {project.title} <FaChevronRight />
                        </Link>
                        <span className="item-price">₹{project.price?.toLocaleString()}</span>
                      </div>
                      <div className="item-client-row">
                         <span>Client: <strong>{project.postedBy?.name}</strong></span>
                         {project.postedBy?._id && (
                           <button 
                             className="small-chat-link"
                             onClick={() => navigate(`/chat/${project.postedBy._id}`)}
                           >
                              Chat
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!bid.bidsItems || bid.bidsItems.length === 0) && (
                  <div className="empty-items">No projects in this bid.</div>
                )}
              </div>

              <div className="summary-footer">
                <div className="total-row">
                   <span>Grand Total</span>
                   <strong>₹{totalBudget.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BidDetails;