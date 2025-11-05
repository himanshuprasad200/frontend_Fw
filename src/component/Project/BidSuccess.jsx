import React from "react";
import "./BidSuccess.css";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const BidSuccess = () => {
  return (
    <div className="bidSuccessContainer">
      <div className="bidSuccessCard">
        <FaCheckCircle className="successIcon" />
        <h1 className="successTitle">Bid Placed Successfully!</h1>
        <p className="successMessage">
          Your proposal has been submitted. We'll notify you when the client responds.
        </p>
        <Link to="/bids" className="viewBidsBtn">
          View All Bids
        </Link>
      </div>
    </div>
  );
};

export default BidSuccess;