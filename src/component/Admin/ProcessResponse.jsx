import React, { Fragment, useEffect, useState } from "react";
import "./ProcessResponse.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "../../utils/CustomToast";
import { UPDATE_BID_RESET } from "../../constants/bidConstant";
import { getBidDetails, clearErrors, updateBid } from "../../actions/bidAction";
import { createEarning, clearErrors as clearEarningErrors } from "../../actions/earningAction";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaCommentDots, 
  FaCreditCard,
  FaChevronRight,
  FaIdBadge,
  FaFileAlt,
  FaExternalLinkAlt,
  FaImage,
  FaPaperclip
} from "react-icons/fa";
import Loader from "../layout/Loader/Loader";
import { CREATE_EARNING_RESET } from "../../constants/earningConstant";

const ProcessResponse = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { bid, error, loading } = useSelector((state) => state.bidDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.bid);
  const { loading: paymentLoading, error: paymentError, success: paymentSuccess } = useSelector((state) => state.makeEarning);

  const [responseStatus, setResponseStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const updateBidSubmitHandler = (e) => {
    e.preventDefault();

    if (!responseStatus || responseStatus === "Pending") {
      toast.error("Please select Approve or Reject");
      return;
    }

    // If approved, check if payment is needed
    if (responseStatus === "Approved" && (!paymentAmount || paymentAmount <= 0)) {
        toast.error("Please enter a valid payment amount for approval");
        return;
    }

    const payload = { 
        status: responseStatus,
        amount: responseStatus === "Approved" ? paymentAmount : undefined 
    };
    dispatch(updateBid(id, payload));

    // If approved, also process payment
    if (responseStatus === "Approved" && paymentAmount > 0) {
        dispatch(createEarning(paymentAmount, bid.user._id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }
    if (paymentError) {
        toast.error(paymentError);
        dispatch(clearEarningErrors());
    }
    // Success Handling - Combined for efficiency
    if (isUpdated && responseStatus !== "Approved") {
      toast.success("Bid Rejected Successfully!", { id: "response-update" });
      dispatch({ type: UPDATE_BID_RESET });
      navigate("/admin/bids");
    }

    if (paymentSuccess) {
        toast.success("Project Approved & Payment Sent!", { id: "response-update" });
        dispatch({ type: UPDATE_BID_RESET });
        dispatch({ type: CREATE_EARNING_RESET });
        navigate("/admin/bids");
    }

    if (!bid || bid._id !== id) {
      dispatch(getBidDetails(id));
    } else if (responseStatus === "") {
      // Only set initial status ONCE when bid is loaded and local state is truly empty
      setResponseStatus(bid.response || "");
    }
  }, [dispatch, error, updateError, paymentError, isUpdated, paymentSuccess, bid, id, navigate]);

  return (
    <Fragment>
      <MetaData title="Process Bid Response - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="processResponseContainer">
            <div className="process-header">
               <div className="header-left">
                  <h1>Process Response</h1>
                  <p>Review the application and make a decision</p>
               </div>
               <div className="header-badges">
                  <span className={`status-pill ${bid?.response?.toLowerCase()}`}>
                    {bid?.response === "Pending" ? <FaClock /> : bid?.response === "Approved" ? <FaCheckCircle /> : <FaTimesCircle />}
                    {bid?.response || "Loading..."}
                  </span>
               </div>
            </div>

            {loading ? (
              <div className="process-loader">
                <Loader />
              </div>
            ) : (
              <div className="process-grid">
                {/* Left Column: Applicant & Proposal */}
                <div className="column-left">
                  <div className="applicant-card-premium">
                    <div className="card-header-gradient"></div>
                    <div className="applicant-profile-main">
                      <div className="avatar-wrapper">
                        <img 
                          src={bid?.user?.avatar?.url || "/default-avatar.png"} 
                          alt={bid?.user?.name} 
                        />
                      </div>
                      <div className="profile-info">
                        <h3>{bid?.user?.name || "Applicant Name"}</h3>
                        <p className="user-role">{bid?.user?.role || "Freelancer"}</p>
                        <div className="user-meta-tags">
                           <span><FaIdBadge /> #{bid?.user?._id?.slice(-6).toUpperCase()}</span>
                           <span><FaEnvelope /> {bid?.user?.email?.split('@')[0]}...</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-actions-row">
                      <button 
                        className="btn-chat-premium"
                        onClick={() => navigate(`/chat/${bid?.user?._id}`)}
                      >
                        <FaCommentDots /> Chat with Applicant
                      </button>
                    </div>
                  </div>

                  <div className="proposal-card-premium">
                    <div className="card-title-row">
                      <FaFileAlt /> 
                      <h4>Proposal Details</h4>
                    </div>
                    <div className="proposal-text-container">
                      <p>{bid?.proposal || "No proposal content provided."}</p>
                    </div>

                    {/* Attachments UI */}
                    {bid?.attachments && bid.attachments.length > 0 && (
                      <div className="attachments-section">
                        <h5 className="attachments-title">
                          <FaPaperclip /> Attachments ({bid.attachments.length})
                        </h5>
                        <div className="attachments-grid">
                          {bid.attachments.map((file, index) => (
                            <a 
                              key={index} 
                              href={file.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="attachment-item"
                              title={file.name}
                            >
                              <div className="file-icon">
                                 {file.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? <FaImage /> : <FaFileAlt />}
                              </div>
                              <span className="file-name-span">{file.name}</span>
                              <FaExternalLinkAlt className="external-icon" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bid-footer-meta">
                       <span>Project: {bid?.bidsItems?.map(i => i.title).join(', ') || "N/A"}</span>
                       <span>Price: ₹{bid?.bidsItems?.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString("en-IN")}</span>
                       <span>Applied on: {new Date(bid?.createdAt).toLocaleDateString()}</span>
                       <span>Bid ID: #{id?.slice(-8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Decision & Action */}
                <div className="column-right">
                  <div className="action-card-premium">
                    <div className="card-title-row">
                      <FaPaperPlane /> 
                      <h4>Take Action</h4>
                    </div>

                    <form className="process-form-premium" onSubmit={updateBidSubmitHandler}>
                      <div className="premium-field">
                        <label>Select Response Status</label>
                        <div className={`select-wrapper ${responseStatus?.toLowerCase()}`}>
                          <select
                            value={responseStatus}
                            onChange={(e) => {
                                setResponseStatus(e.target.value);
                                if (e.target.value === "Approved") {
                                    setShowPaymentForm(true);
                                } else {
                                    setShowPaymentForm(false);
                                }
                            }}
                            disabled={loading || bid?.response !== "Pending"}
                          >
                            <option value="">Choose Response</option>
                            {bid?.response === "Pending" ? (
                              <>
                                <option value="Approved">Approve & Pay</option>
                                <option value="Rejected">Reject Bid</option>
                              </>
                            ) : (
                                <option value={bid?.response} disabled>{bid?.response}</option>
                            )}
                          </select>
                        </div>
                      </div>

                      {/* Payment Section (Shown if Approved is selected or already approved) */}
                      {(responseStatus === "Approved" || bid?.response === "Approved") && (
                        <div className="payment-section-premium animate-fade-in">
                          <div className="payment-title">
                             <FaCreditCard />
                             <h5>Payment Details</h5>
                          </div>
                          
                          {bid?.response === "Approved" ? (
                              <div className="payment-completed-badge">
                                 <FaCheckCircle /> Payment has been scheduled/processed
                              </div>
                          ) : (
                            <div className="premium-field">
                              <label>Initial Payment / Milestone (₹)</label>
                              <div className="input-with-icon">
                                 <span className="currency-prefix">₹</span>
                                 <input
                                   type="number"
                                   placeholder="Enter amount (e.g. 5000)"
                                   value={paymentAmount}
                                   onChange={(e) => setPaymentAmount(e.target.value)}
                                   required
                                   min="1"
                                 />
                              </div>
                              <p className={`field-hint ${responseStatus === "Approved" && !paymentAmount ? "error-text" : ""}`}>
                                {responseStatus === "Approved" && !paymentAmount 
                                  ? "Payment amount is required for approval." 
                                  : "This amount will be transferred to user's wallet."}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="submit-btn-row">
                        <button
                          type="submit"
                          className={`btn-submit-premium ${
                            responseStatus && bid?.response === "Pending" ? "active" : ""
                          }`}
                          disabled={
                            loading || 
                            paymentLoading ||
                            !responseStatus || 
                            bid?.response !== "Pending" ||
                            (responseStatus === "Approved" && !paymentAmount)
                          }
                        >
                          {loading || paymentLoading ? (
                            <span className="btn-loader-text">
                               <div className="mini-spinner"></div> Processing...
                            </span>
                          ) : (
                            <>
                               Update Response <FaChevronRight />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {bid?.response !== "Pending" && (
                      <div className="status-indicator-footer">
                        <div className={`bottom-badge ${bid?.response?.toLowerCase()}`}>
                          {bid?.response === "Approved" ? "Bidding Process Secured" : "Application Closed"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessResponse;