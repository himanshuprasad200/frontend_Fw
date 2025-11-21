// src/component/Project/Proposal.jsx
import React, { Fragment, useEffect, useState } from "react";
import "./Proposal.css";
import { useDispatch, useSelector } from "react-redux";
import { createBid, clearErrors } from "../../actions/bidAction";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../layout/Loader/Loader";
import { CREATE_BID_RESET } from "../../constants/bidConstant";

const Proposal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newBid);
  const { bidItems } = useSelector((state) => state.bidItems);
  const { isAuthenticated } = useSelector((state) => state.user); // ← AUTH GUARD

  const [proposal, setProposal] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a proposal");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!proposal.trim()) {
      toast.error("Proposal is required");
      return;
    }

    if (bidItems.length === 0) {
      toast.error("No project selected. Go back and add a project.");
      return;
    }

    const formData = new FormData();
    formData.append("proposal", proposal);
    if (file) formData.append("file", file);

    // Only send project IDs
    bidItems.forEach((item, i) => {
      formData.append(`projectIds[${i}]`, item.project);
    });

    dispatch(createBid(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Bid placed successfully!");
      navigate("/success");
      setProposal("");
      setFile(null);
      setFileName("No file chosen");
      localStorage.removeItem("bidItems"); // Clear after success
      dispatch({ type: CREATE_BID_RESET });
    }
  }, [error, success, dispatch, navigate]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <div className="proposalContainer">
        <div className="bid-items-summary">
          <h3>Selected Projects ({bidItems.length})</h3>
          {bidItems.map((item) => (
            <div key={item.project} className="bid-item">
              <img src={item.image} alt={item.title} />
              <div>
                <strong>{item.title}</strong>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <form className="proposalForm" onSubmit={handleSubmit}>
          <h2 className="formTitle">Submit Your Proposal</h2>

          <div className="formGroup">
            <label className="formLabel">
              Your Proposal <span className="required">*</span>
            </label>
            <textarea
              className="proposalTextarea"
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              placeholder="Explain your approach, timeline, and why you're the best fit..."
              rows={8}
              required
            />
          </div>

          <div className="formGroup">
            <label className="formLabel">
              Upload File (Image/Video) <span className="optional">(Optional)</span>
            </label>
            <div className="fileInputWrapper">
              <input
                type="file"
                className="fileInput"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setFile(f);
                    setFileName(f.name);
                  }
                }}
                accept="image/*,video/*"
              />
              <label className="fileInputLabel">Choose File</label>
              <span className="fileName">{fileName}</span>
            </div>
          </div>

          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Submitting..." : "Place Bid"}
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default Proposal;