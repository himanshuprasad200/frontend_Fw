import React, { Fragment, useEffect, useState } from "react";
import "./ProcessResponse.css";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { UPDATE_BID_RESET } from "../../constants/bidConstant";
import { getBidDetails, clearErrors, updateBid } from "../../actions/bidAction";
import { useNavigate, useParams } from "react-router-dom";

const ProcessResponse = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const { bid, error, loading } = useSelector((state) => state.bidDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.bid);

  const [responseStatus, setResponseStatus] = useState(""); // Clear name

  const updateBidSubmitHandler = (e) => {
    e.preventDefault();

    if (!responseStatus || responseStatus === "Pending") {
      toast.error("Please select Approve or Reject");
      return;
    }

    // CORRECT: Send "status" field (exactly what backend expects)
    const payload = { status: responseStatus };

    dispatch(updateBid(id, payload));
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
    if (isUpdated) {
      toast.success("Bid Response Updated Successfully!");
      dispatch({ type: UPDATE_BID_RESET });
      navigate("/admin/bids");
    }

    if (!bid || bid._id !== id) {
      dispatch(getBidDetails(id));
    } else {
      setResponseStatus(bid.response || "");
    }
  }, [dispatch, error, updateError, isUpdated, bid, id, navigate]);

  return (
    <Fragment>
      <MetaData title="Process Bid Response - Admin" />

      <div className="admin-master">
        <Sidebar />

        <div className="admin-content">
          <div className="processResponseContainer">
            <div className="processResponseCard">
              <h1 className="processHeading">Process Bid Response</h1>

              {/* Bid Info */}
              <div className="bidInfo">
                <p>
                  <strong>Bid ID:</strong> {id?.slice(-10).toUpperCase()}
                </p>
                <p>
                  <strong>Current Status:</strong>
                  <span className={`statusBadge ${bid?.response?.toLowerCase()}`}>
                    {bid?.response || "Loading..."}
                  </span>
                </p>
                <p>
                  <strong>Proposal:</strong>
                </p>
                <div className="proposalBox">
                  {bid?.proposal || "Loading bid details..."}
                </div>
              </div>

              {/* Form */}
              <form className="processForm" onSubmit={updateBidSubmitHandler}>
                <div className="formGroup">
                  <div className="icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>

                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                    disabled={loading || !bid || bid?.response !== "Pending"}
                  >
                    <option value="">Choose Response</option>
                    {bid?.response === "Pending" && (
                      <>
                        <option value="Approved">Approve Bid</option>
                        <option value="Rejected">Reject Bid</option>
                      </>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  className={`processBtn ${
                    responseStatus && bid?.response === "Pending" ? "active" : ""
                  }`}
                  disabled={loading || !responseStatus || bid?.response !== "Pending"}
                >
                  {loading ? "Processing..." : "Update Response"}
                </button>
              </form>

              {/* Already Processed Message */}
              {bid?.response !== "Pending" && (
                <div className="alreadyProcessed">
                  This bid has already been processed and cannot be changed.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessResponse;