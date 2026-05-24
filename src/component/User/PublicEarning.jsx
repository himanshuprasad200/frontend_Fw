import React, { useEffect, useState } from "react";
import "./PublicEarning.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import { FaWallet, FaCheckCircle, FaLock, FaUserShield, FaArrowRight } from "react-icons/fa";
import MetaData from "../layout/MetaData";

const PublicEarning = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/public/earning/${token}`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or Expired Link");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [token]);

  if (loading) return <div className="public-loader-container"><Loader /></div>;

  if (error) {
    return (
      <div className="public-error-container">
        <FaLock className="lock-icon" />
        <h2>Access Restricted</h2>
        <p>{error}</p>
        <Link to="/login" className="login-btn-public">Login to Full Account</Link>
      </div>
    );
  }

  return (
    <div className="public-earning-page">
      <MetaData title="Earning Summary - FlexiWork" />
      
      <div className="public-card-container">
        <div className="security-banner">
          <FaUserShield /> 
          <span>Secure Read-Only Summary</span>
        </div>

        <div className="summary-header">
           <div className="user-welcome">
             <h1>Hi, {data.userName}</h1>
             <p>Here is your current earnings summary</p>
           </div>
           <div className="member-badge">Member since {data.memberSince}</div>
        </div>

        <div className="summary-grid">
           <div className="summary-item main">
              <div className="icon-box"><FaWallet /></div>
              <div className="content">
                 <p>Total Balance</p>
                 <h2>₹{data.totalAmount.toLocaleString()}</h2>
              </div>
           </div>

           <div className="summary-item">
              <div className="content">
                 <p>Credited To</p>
                 <h3 className="acc-no">{data.accountNo}</h3>
              </div>
           </div>
        </div>

        {/* New Earnings Section: Simple and Focused */}
        <div className="public-history-section">
           <h3>Recently Approved Summary</h3>
           <div className="history-list">
              {data.latestEarning ? (
                  <div className="history-item highlight">
                     <div className="h-left">
                        <FaCheckCircle className="check-icon-small" />
                        <div className="h-info">
                           <span className="h-amount">₹{data.latestEarning.amount.toLocaleString()}</span>
                           <span className="h-date">Approved on {new Date(data.latestEarning.recievedAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                           })}</span>
                        </div>
                     </div>
                     <span className="h-status">Credited</span>
                  </div>
              ) : (
                <p className="no-history">No summary available.</p>
              )}
           </div>
        </div>

        <div className="info-footer">
           <div className="status-indicator">
              <FaCheckCircle className="check-icon" />
              <span>All payments are secured and verified</span>
           </div>
           
           <div className="cta-section">
              <p>For detailed analytics and history, please log in.</p>
              <Link to="/login" className="btn-full-access">
                 Login to Dashboard <FaArrowRight />
              </Link>
           </div>
        </div>
      </div>

      <div className="safety-notice">
         <p>This is a temporary secure link. Your full account data is protected by industry-standard encryption.</p>
      </div>
    </div>
  );
};

export default PublicEarning;
