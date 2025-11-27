import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import Sidebar from "./Sidebar";
import { getBidDetails, updateBid, clearErrors } from "../../actions/bidAction";
import { UPDATE_BID_RESET } from "../../constants/bidConstant";
import "./ProcessResponse.css";

const ProcessResponse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { bid, error, loading } = useSelector((state) => state.bidDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.bid);

  const [status, setStatus] = useState("");

  const updateBidSubmitHandler = (e) => {
    e.preventDefault();
    if (!status || status === "Pending") {
      toast.error("Please select a valid response (Approved/Rejected)");
      return;
    }

    const formData = new FormData();
    formData.set("response", status); // Make sure backend expects "response"

    dispatch(updateBid(id, formData));
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
      setStatus(bid.response || "");
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
              <h1 className="processHeading">
                Process Bid Response
              </h1>

              <div className="bidInfo">
                <p><strong>Bid ID:</strong> {id?.slice(-10)}</p>
                <p><strong>Current Status:</strong>
                  <span className={`statusBadge ${bid?.response?.toLowerCase()}`}>
                    {bid?.response || "Loading..."}
                  </span>
                </p>
                <p><strong>Proposal:</strong></p>
                <div className="proposalBox">
                  {bid?.proposal || "Loading bid details..."}
                </div>
              </div>

              <form className="processForm" onSubmit={updateBidSubmitHandler}>
                <div className="formGroup">
                  <div className="icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M7 10l5 5 10-15" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading || !bid || bid.response !== "Pending"}
                  >
                    <option value="">Choose Response</option>
                    {bid?.response === "Pending" && (
                      <>
                        <option value="Approved">Approve Bid</option>
                        <option value="Rejected">Reject Bid</option>
                      </>
                    )}
                    {bid?.response !== "Pending" && (
                      <option disabled>Already Processed</option>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  className={`processBtn ${status && bid?.response === "Pending" ? "active" : ""}`}
                  disabled={loading || !status || bid?.response !== "Pending"}
                >
                  {loading ? "Processing..." : "Update Response"}
                </button>
              </form>

              {bid?.response !== "Pending" && (
                <div className="alreadyProcessed">
                  This bid has already been processed.
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