// src/components/Bid/BidDetails.jsx
import React, { Fragment, useEffect } from "react";
import "./BidDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getBidDetails } from "../../actions/bidAction";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import toast from "../../utils/CustomToast";
import { FaComments, FaAward, FaCalendarAlt, FaCheckCircle, FaPaperclip, FaFileAlt, FaImage, FaExternalLinkAlt } from "react-icons/fa";
import { FiMessageCircle, FiBriefcase, FiChevronRight } from "react-icons/fi";

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

  const totalBudget = (bid.bidsItems || []).reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <Fragment>
      <MetaData title={`Bid #${bid._id?.slice(-8).toUpperCase()} | FlexiWork`} />

      <div className="bid-details-container">
        <div className="bid-content-grid">
          
          {/* ── Top Bar: Identity & Status ── */}
          <div className="bid-top-bar">
            <div className="top-info">
              <h1>
                Bid Submission
                <small>REQ-{bid._id?.slice(-8).toUpperCase()}</small>
              </h1>
              <p>
                <FaAward /> Freelancer: <strong>{bid.user?.name}</strong>
              </p>
              <p>
                <FaCalendarAlt /> 
                {new Date(bid.createdAt).toLocaleDateString("en-IN", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric" 
                })}
              </p>
            </div>
            
            <div className="top-stats">
              <div className="stat-box">
                <span className="box-label">Evaluation Status</span>
                <span className={`status-badge-lg ${bid.response?.toLowerCase() || "pending"}`}>
                  <FaCheckCircle /> {bid.response || "Pending Review"}
                </span>
              </div>
              <div className="stat-box">
                <span className="box-label">Estimated Allocation</span>
                <span className="price-lg">₹{totalBudget.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="bid-main-flex">
            {/* ── Left Column: Proposal Detail ── */}
            <div className="bid-left-col">
              
              <div className="info-section">
                <h3>
                  <FiMessageCircle style={{color: '#7ec8c0'}} /> 
                  Professional Proposal
                </h3>
                <div className="proposal-content">
                  {bid.proposal}
                </div>

                {/* Attachments for User */}
                {bid.attachments && bid.attachments.length > 0 && (
                  <div className="attachments-wrapper">
                    <h4><FaPaperclip /> Attached documents ({bid.attachments.length})</h4>
                    <div className="attachments-list">
                      {bid.attachments.map((file, index) => (
                        <a 
                          key={index} 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="attachment-card"
                          title={file.name}
                        >
                          <span className="file-icon">
                            {file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? <FaImage /> : <FaFileAlt />}
                          </span>
                          <span className="file-name">{file.name}</span>
                          <FaExternalLinkAlt className="external-icon" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Client Profile Context */}
              {bid.bidsItems?.[0]?.project?.postedBy && (
                <div className="user-profile-card">
                   <div className="card-tag">Project Lead</div>
                  <div className="user-card-head">
                    <img 
                      src={bid.bidsItems[0].project.postedBy.avatar?.url || "/Profile.png"} 
                      alt="client" 
                    />
                    <div className="user-card-id">
                      <h4>{bid.bidsItems[0].project.postedBy.name}</h4>
                      <p>Hiring Manager</p>
                    </div>
                  </div>
                  <button 
                    className="chat-action-btn"
                    onClick={() => navigate(`/chat/${bid.bidsItems[0].project.postedBy._id}`)}
                  >
                    <FaComments /> Chat with Client
                  </button>
                </div>
              )}
            </div>

            {/* ── Right Column: Project Inventory ── */}
            <div className="bid-right-col">
              <div className="projects-list-header">
                <h3>
                  <FiBriefcase style={{color: '#7ec8c0', fontSize: '1.4rem'}} /> 
                  Scope Inventory ({bid.bidsItems?.length || 0})
                </h3>
              </div>
              
              <div className="items-container">
                {bid.bidsItems && bid.bidsItems.map((item) => {
                  const project = item.project || {};
                  return (
                    <div key={item._id} className="bid-item-card">
                      <img 
                        src={project.images?.[0]?.url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200"} 
                        alt="thumb" 
                        className="item-thumb" 
                      />
                      <div className="item-meta">
                        <div className="item-title-row">
                          <Link to={`/project/${project._id}`} className="item-link">
                            {project.title} <FiChevronRight />
                          </Link>
                          <span className="item-price">₹{item.price?.toLocaleString()}</span>
                        </div>
                        <div className="item-client-row">
                           <span>Owner: {project.postedBy?.name}</span>
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
                  );
                })}
                
                {(!bid.bidsItems || bid.bidsItems.length === 0) && (
                  <div className="no-items-placeholder">
                    No scoped projects attached to this bid.
                  </div>
                )}
              </div>

              <div className="summary-footer">
                <div className="total-row">
                   <span>Projected Total</span>
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